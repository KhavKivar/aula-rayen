import { Injectable } from '@nestjs/common';
import { WebPayRepository } from './webpay.repository';
import { CreateWebpayDto } from './dto/create-webpay.dto';
import { nanoid } from 'nanoid';

import { webpayTransaction } from '@/lib/transbank';
import type { Course, NewWebPaySession } from '@/db/schema';

import { CourseService } from '../course/course.service';

type CreateResponse = {
  token: string;
  url: string;
};

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
    const returnUrl = `${process.env.BASE_URL}/api/webpay/commit?buyOrder=${buyOrder}`;

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
      amount: course.price,
    };
    await this.repository.create(webpaySession);

    return response;
  }
}
