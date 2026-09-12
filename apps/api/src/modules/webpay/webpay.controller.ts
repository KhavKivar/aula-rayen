import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { WebPayService } from './webpay.service';

import { CreateWebpayDto } from './dto/create-webpay.dto';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import type { PaymentsResponse } from '@aula-rayen/contracts/payment';
import type {
  CommitRedirect,
  CommitResult,
  CreateWebpayResponse,
  PaymentResultStatus,
  WebpaySessionsResponse,
} from '@aula-rayen/contracts/webpay';
import { env } from '@/config/env';

export function mapCommitToRedirectStatus(
  result: CommitResult,
  tokens: { tokenNormal: string | undefined; tokenReject: string | undefined },
): PaymentResultStatus {
  if (result.paymentStatus === 'ok') {
    return 'success';
  }
  if (result.paymentStatus === 'pending') {
    return 'timeout';
  }
  return tokens.tokenNormal || tokens.tokenReject ? 'rejected' : 'timeout';
}

@Controller('webpay')
export class WebPayController {
  constructor(private readonly webpayService: WebPayService) {}

  // Seguimiento: este listado crudo no exige rol; el panel usa
  // GET /webpay/payments. No cambiar aquí sin revisar consumidores.
  @Get()
  findAll(): Promise<WebpaySessionsResponse> {
    return this.webpayService.getAll();
  }

  // Return only the succesful payment
  @Get('payments')
  @Roles(['admin'])
  async findPayments(): Promise<PaymentsResponse> {
    return this.webpayService.getPayments();
  }

  @Post()
  create(
    @Body() createWebpayDto: CreateWebpayDto,
    @Session() session: UserSession,
  ): Promise<CreateWebpayResponse> {
    return this.webpayService.create(createWebpayDto, session.user.id);
  }

  @Get('commit')
  @Redirect()
  async commit(
    @Query('token_ws') tokenNormal: string | undefined,
    @Query('TBK_TOKEN') tokenReject: string | undefined,
    @Query('buyOrder') buyOrderId: string,
  ): Promise<CommitRedirect> {
    const result: CommitResult = await this.webpayService.checkCommit(
      buyOrderId,
      tokenNormal,
    );
    const status = mapCommitToRedirectStatus(result, {
      tokenNormal,
      tokenReject,
    });

    const url = new URL('/payment-result', env.FRONTEND_URL);
    url.searchParams.set('status', status);

    return { url: url.toString() };
  }
}
