import { Injectable } from '@nestjs/common';
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseBuyerResponse,
} from '@aula-rayen/contracts/course';
import { API_ERROR_CODES } from '@aula-rayen/contracts/api-error';

import { CourseRepository } from './course.repository';
import {
  conflictError,
  forbiddenError,
  notFoundError,
} from '@/common/errors/http-error';

@Injectable()
export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  getAll() {
    return this.repository.findAll();
  }

  getBuyers(courseId: number): Promise<CourseBuyerResponse[]> {
    return this.repository.findBuyers(courseId);
  }

  getCatalogForUser(userId: string) {
    return this.repository.findCatalogByUser(userId);
  }

  async getById(id: number) {
    const course = await this.repository.findById(id);

    if (!course) {
      throw notFoundError(
        API_ERROR_CODES.COURSE_NOT_FOUND,
        `Curso con ID ${id} no encontrado`,
      );
    }
    return course;
  }

  async getPurchasedById(id: number, userId: string) {
    const course = await this.repository.findPurchasedById(id, userId);

    if (!course) {
      throw forbiddenError(
        API_ERROR_CODES.COURSE_NO_ACCESS,
        'No tienes acceso a este curso',
      );
    }

    return course;
  }

  async hasPurchases(courseId: number): Promise<boolean> {
    return await this.repository.hasPurchases(courseId);
  }

  create(dto: CreateCourseRequest) {
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateCourseRequest) {
    const updatedCourse = await this.repository.update(id, dto);
    if (!updatedCourse) {
      throw notFoundError(
        API_ERROR_CODES.COURSE_NOT_FOUND,
        `Curso con ID ${id} no encontrado`,
      );
    }
    return updatedCourse;
  }

  async remove(id: number) {
    if (await this.hasPurchases(id)) {
      throw conflictError(
        API_ERROR_CODES.COURSE_HAS_PURCHASES,
        'No se puede eliminar un curso que ya tiene compras',
      );
    }

    const deletedCourse = await this.repository.remove(id);

    if (!deletedCourse) {
      throw notFoundError(
        API_ERROR_CODES.COURSE_NOT_FOUND,
        `Curso con ID ${id} no encontrado`,
      );
    }

    return deletedCourse;
  }
}
