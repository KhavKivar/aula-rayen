import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { WebPayService } from './webpay.service';

import { CreateWebpayDto } from './dto/create-webpay.dto';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import type { PaymentsResponse } from '@aula-rayen/contracts/payment';
import { env } from '@/config/env';

@Controller('webpay')
export class WebPayController {
  constructor(private readonly webpayService: WebPayService) {}

  // Seguimiento: este listado crudo no exige rol; el panel usa
  // GET /webpay/payments. No cambiar aquí sin revisar consumidores.
  @Get()
  findAll() {
    return this.webpayService.getAll();
  }

  @Get('payments')
  @Roles(['admin'])
  async findPayments(): Promise<PaymentsResponse> {
    return this.webpayService.getPayments();
  }

  @Post()
  create(
    @Body() createWebpayDto: CreateWebpayDto,
    @Session() session: UserSession,
  ) {
    console.log('createWebpayDto', createWebpayDto);
    return this.webpayService.create(createWebpayDto, session.user.id);
  }

  @Get('commit')
  @Redirect()
  async commit(
    @Query('token_ws') tokenNormal: string | undefined,
    @Query('TBK_TOKEN') tokenReject: string | undefined,
    @Query('buyOrder') buyOrderId: string,
  ) {
    const result = await this.webpayService.checkCommit(
      buyOrderId,
      tokenNormal,
    );
    const status = result.payment
      ? 'success'
      : tokenNormal || tokenReject
        ? 'rejected'
        : 'timeout';
    const url = new URL('/payment-result', env.FRONTEND_URL);
    url.searchParams.set('status', status);

    return { url: url.toString() };
  }
}
