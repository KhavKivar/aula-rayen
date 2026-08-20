import { Module } from '@nestjs/common';
import { WebPayController } from './webpay.controller';
import { WebPayRepository } from './webpay.repository';
import { WebPayService } from './webpay.service';

import { CourseModule } from '../course/course.module';

@Module({
  imports: [CourseModule],
  controllers: [WebPayController],
  providers: [WebPayService, WebPayRepository],
})
export class WebPayModule {}
