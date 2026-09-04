import { Injectable } from '@nestjs/common';
import { WebPayRepository } from './webpay.repository';
import { CreateWebpayDto } from './dto/create-webpay.dto';
import { nanoid } from 'nanoid';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';

import { badRequestError, notFoundError } from '@/common/errors/http-error';

import { webpayTransaction } from './infrastructure/transbank.client';
import type { Course, NewWebPaySession } from '@/db/types';
import { z } from 'zod';

import { CourseService } from '../course/course.service';
import { env } from '@/config/env';

type CreateResponse = {
  token: string;
  url: string;
};

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

function isCreateResponse(value: unknown): value is CreateResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'token' in value &&
    'url' in value
  );
}

@Injectable()
export class WebPayService {
  constructor(
    private readonly repository: WebPayRepository,
    private readonly courseService: CourseService,
  ) {}

  getAll() {
    return this.repository.findAll();
  }

  async create(
    createWebpayDto: CreateWebpayDto,
    userId: string,
  ): Promise<CreateResponse | null> {
    const buyOrder = nanoid(26);
    const sessionId = nanoid(61);
    const returnUrl = `${env.BASE_URL}/webpay/commit?buyOrder=${buyOrder}`;

    const course: Course = await this.courseService.getById(
      createWebpayDto.course_id,
    );

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

  async checkCommit(buyOrderId: string, tokenNormal: string | undefined) {
    // Flujo normal:
    // Llega solo `token_ws`, tanto si la transacción fue aprobada como rechazada.
    if (tokenNormal === undefined) {
      return { payment: false };
    }

    const webpaySession = await this.repository.findById(buyOrderId);
    if (!webpaySession) {
      throw notFoundError(
        API_ERROR_CODES.WEBPAY_SESSION_NOT_FOUND,
        'Sesión de Webpay no encontrada',
      );
    }

    const parsedCommit = CommitResponseSchema.safeParse(
      await webpayTransaction.commit(tokenNormal),
    );
    if (!parsedCommit.success) {
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
      return { payment: false };
    }

    const completedSession = await this.repository.completeAuthorizedPayment(
      buyOrderId,
      webpaySession.userId,
      webpaySession.courseId,
      commitDetails,
    );
    if (!completedSession) {
      throw notFoundError(
        API_ERROR_CODES.WEBPAY_SESSION_NOT_FOUND,
        'Sesión de Webpay no encontrada',
      );
    }

    return { payment: true };
  }
}
