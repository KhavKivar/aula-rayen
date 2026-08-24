import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CreateCourseDto } from './dto/create-course.dto';
import { CourseService } from './course.service';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll(@Session() session: UserSession) {
    return this.courseService.getCatalogForUser(session.user.id);
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ) {
    return this.courseService.getPurchasedById(id, session.user.id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }
}
