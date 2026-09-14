import { Injectable } from '@nestjs/common';
import { WebPayRepository } from './webpay.repository';
import { CreateWebpayDto } from './dto/create-webpay.dto';
import { nanoid } from 'nanoid';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';
import {
  paymentsResponseSchema,
  type PaymentsResponse,
} from '@aula-rayen/contracts/payment';
import {
  createWebpayResponseSchema,
  webpayAdminSessionsResponseSchema,
  type CommitResult,
  type CreateWebpayResponse,
  type WebpayAdminSessionsResponse,
} from '@aula-rayen/contracts/webpay';

import {
  badRequestError,
  conflictError,
  notFoundError,
} from '@/common/errors/http-error';

import { webpayTransaction } from './infrastructure/transbank.client';
import type { Course, NewWebPaySession } from '@/db/types';
import { z } from 'zod';

import { CourseService } from '../course/course.service';
import { env } from '@/config/env';

function isCreateResponse(value: unknown): value is CreateWebpayResponse {
  return createWebpayResponseSchema.safeParse(value).success;
}

const CommitResponseSchema = z
  .object({
    buy_order: z.string(),
    vci: z.string().nullish(),
    amount: z.number(),
    status: z.string(),
    card_detail: z
      .object({
        card_number: z.string().nullish(),
      })
      .nullish(),
    accounting_date: z.string().nullish(),
    transaction_date: z
      .string()
      .nullish()
      .transform((value, ctx) => {
        if (value == null) {
          return null;
        }

        const transactionDate = new Date(value);
        if (Number.isNaN(transactionDate.getTime())) {
          ctx.addIssue({
            code: 'custom',
            message: 'Fecha de transacción inválida',
          });
          return z.NEVER;
        }

        return transactionDate;
      }),
    authorization_code: z.string().nullish(),
    payment_type_code: z.string().nullish(),
    response_code: z.number(),
    installments_amount: z.number().nullish(),
    installments_number: z.number().nullish(),
  })
  .transform((result) => ({
    buyOrderId: result.buy_order,
    vci: result.vci ?? null,
    tbAmount: result.amount,
    tbStatus: result.status,
    cardNumber: result.card_detail?.card_number ?? null,
    accountingDate: result.accounting_date ?? null,
    transactionDate: result.transaction_date,
    authorizationCode: result.authorization_code ?? null,
    paymentTypeCode: result.payment_type_code ?? null,
    responseCode: result.response_code,
    installmentsAmount: result.installments_amount ?? null,
    installmentsNumber: result.installments_number ?? null,
  }));

@Injectable()
export class WebPayService {
  constructor(
    private readonly repository: WebPayRepository,
    private readonly courseService: CourseService,
  ) {}

  // Admin-only raw session listing. Explicit allowlist: tokenWs and
  // cardNumber are never included, and future sensitive columns stay out.
  async getAll(): Promise<WebpayAdminSessionsResponse> {
    const rows = await this.repository.findAll();

    return webpayAdminSessionsResponseSchema.parse(
      rows.map((row) => ({
        buyOrderId: row.buyOrderId,
        userId: row.userId,
        courseId: row.courseId,
        amount: row.amount,
        vci: row.vci,
        tbAmount: row.tbAmount,
        tbStatus: row.tbStatus,
        accountingDate: row.accountingDate,
        transactionDate: row.transactionDate,
        authorizationCode: row.authorizationCode,
        paymentTypeCode: row.paymentTypeCode,
        responseCode: row.responseCode,
        installmentsAmount: row.installmentsAmount,
        installmentsNumber: row.installmentsNumber,
        createdAt: row.createdAt,
        committedAt: row.committedAt,
        takenAt: row.takenAt,
      })),
    );
  }

  // Expected few payments rows, so we should return all payment at once
  async getPayments(): Promise<PaymentsResponse> {
    const rows = await this.repository.findPayments();

    return paymentsResponseSchema.parse(
      rows.map((row) => {
        const approved =
          row.committedAt !== null &&
          row.responseCode === 0 &&
          row.tbStatus === 'AUTHORIZED';
        const attempted = row.responseCode !== null || row.tbStatus !== null;

        return {
          orderId: row.buyOrderId,
          userId: row.userId,
          buyerName: row.buyerName ?? 'Sin nombre',
          buyerEmail: row.buyerEmail,
          courseId: row.courseId,
          courseTitle: row.courseTitle,
          amount: row.amount,
          date: (row.committedAt ?? row.createdAt ?? new Date()).toISOString(),
          status: approved ? 'approved' : attempted ? 'rejected' : 'pending',
          maskedCard: row.cardNumber
            ? `•••• ${row.cardNumber.slice(-4)}`
            : 'No registrada',
          ...(row.authorizationCode
            ? { authorizationCode: row.authorizationCode }
            : {}),
        } as const;
      }),
    );
  }

  async create(
    createWebpayDto: CreateWebpayDto,
    userId: string,
  ): Promise<CreateWebpayResponse> {
    const course: Course = await this.courseService.getById(
      createWebpayDto.course_id,
    );

    if (await this.courseService.userHasAccess(userId, course.id)) {
      throw conflictError(
        API_ERROR_CODES.COURSE_ALREADY_PURCHASED,
        'Ya tienes acceso a este curso',
      );
    }

    // This value can be random
    const buyOrder = nanoid(26);

    const returnUrl = `${env.BASE_URL}/webpay/commit?buyOrder=${buyOrder}`;
    // Session Id, use as metadata
    const sessionId = `${userId}:${course.id}`;

    const response: unknown = await webpayTransaction.create(
      buyOrder,
      sessionId,
      course.price,
      returnUrl,
    );
    if (!isCreateResponse(response)) {
      throw new Error('Respuesta inesperada de Transbank');
    }

    const webpaySession: NewWebPaySession = {
      buyOrderId: buyOrder,
      userId,
      courseId: course.id,
      amount: course.price,
      tokenWs: response.token,
    };
    await this.repository.create(webpaySession);

    return response;
  }

  async checkCommit(
    buyOrderId: string,
    tokenNormal: string | undefined,
  ): Promise<CommitResult> {
    // Flujo normal:
    // Llega solo `token_ws` (tokenNormal), tanto si la transacción fue aprobada como rechazada(por el banco).
    // Sin embargo en caso de timeout o rechazo TBK_TOKEN es recibido
    if (tokenNormal === undefined) {
      return { paymentStatus: 'canceled' };
    }

    const webpaySession = await this.repository.findById(buyOrderId);
    // Weird scenario
    if (!webpaySession) {
      throw notFoundError(
        API_ERROR_CODES.WEBPAY_SESSION_NOT_FOUND,
        'Sesión de Webpay no encontrada',
      );
    }

    // Un callback repetido sobre una sesión ya completada responde ok sin
    // volver a llamar a Transbank.
    if (webpaySession.committedAt !== null) {
      return { paymentStatus: 'ok' };
    }

    // Only one callback may consume the Transbank commit token.
    const claimed = await this.repository.takeSession(buyOrderId);
    if (!claimed) {
      return { paymentStatus: 'pending' };
    }

    const parsedCommit = CommitResponseSchema.safeParse(
      await webpayTransaction.commit(tokenNormal),
    );
    if (!parsedCommit.success) {
      // La respuesta de Transbank no corresponde al formato esperado:
      // la sesión queda claimed sin commit y requiere reconciliación.
      throw badRequestError(
        API_ERROR_CODES.WEBPAY_INVALID_RESPONSE,
        'Respuesta inválida de Transbank',
      );
    }

    const { buyOrderId: committedBuyOrderId, ...commitDetails } =
      parsedCommit.data;
    const isAuthorized =
      commitDetails.responseCode === 0 &&
      commitDetails.tbStatus === 'AUTHORIZED';

    if (
      !isAuthorized ||
      committedBuyOrderId !== webpaySession.buyOrderId ||
      commitDetails.tbAmount !== webpaySession.amount
    ) {
      await this.repository.recordAttempt(buyOrderId, commitDetails);
      return { paymentStatus: 'canceled' };
    }

    const completedSession = await this.repository.completeAuthorizedPayment(
      buyOrderId,
      webpaySession.userId,
      webpaySession.courseId,
      commitDetails,
    );
    if (!completedSession) {
      // La sesión desapareció entre el claim y el commit: posible carrera
      // con la reconciliación. No se otorga acceso sin registro válido.
      throw notFoundError(
        API_ERROR_CODES.WEBPAY_SESSION_NOT_FOUND,
        'Sesión de Webpay no encontrada',
      );
    }

    return { paymentStatus: 'ok' };
  }
}
