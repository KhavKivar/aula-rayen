import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import {
  createCourseRequestSchema,
  updateCourseRequestSchema,
} from '@aula-rayen/contracts/course';
import type {
  CourseCatalogItem,
  CourseDetail,
  CreateCourseRequest as CreateCourseDto,
  UpdateCourseRequest as UpdateCourseDto,
  CourseBuyerResponse,
} from '@aula-rayen/contracts/course';

import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { toCourseCatalogItem, toCourseDetail } from './course.mapper';
import { CourseService } from './course.service';

@Roles(['admin'])
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @Roles(['user', 'admin'])
  async findAll(@Session() session: UserSession): Promise<CourseCatalogItem[]> {
    const courses = await this.courseService.getCatalogForUser(session.user.id);

    return courses.map(toCourseCatalogItem);
  }

  @Get(':id')
  @Roles(['user', 'admin'])
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<CourseDetail> {
    const course = await this.courseService.getPurchasedById(
      id,
      session.user.id,
    );
    return toCourseDetail(course);
  }

  @Get('buyers/:id')
  @Roles(['admin'])
  async findBuyers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourseBuyerResponse[]> {
    return this.courseService.getBuyers(id);
  }

  @Post()
  async create(
    @Session() _session: UserSession,
    @Body(new ZodValidationPipe(createCourseRequestSchema))
    dto: CreateCourseDto,
  ): Promise<CourseDetail> {
    const course = await this.courseService.create(dto);

    return toCourseDetail(course);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Session() _session: UserSession,
    @Body(new ZodValidationPipe(updateCourseRequestSchema))
    dto: UpdateCourseDto,
  ): Promise<CourseDetail> {
    const course = await this.courseService.update(id, dto);

    return toCourseDetail(course);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<CourseDetail> {
    const course = await this.courseService.remove(id);

    return toCourseDetail(course);
  }
}
