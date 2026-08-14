import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebPayService } from './webpay.service';

import { CreateWebpayDto } from './dto/create-webpay.dto';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('webpay')
export class WebPayController {
  constructor(private readonly webpayService: WebPayService) {}

  @Get()
  findAll() {
    return this.webpayService.getAll();
  }

  @Post()
  create(
    @Body() createWebpayDto: CreateWebpayDto,
    @Session() session: UserSession,
  ) {
    return this.webpayService.create(createWebpayDto, session.user.id);
  }
}
