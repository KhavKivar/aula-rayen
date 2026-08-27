import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
} from '@aula-rayen/contracts/course';

import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  getAll() {
    return this.repository.findAll();
  }

  getCatalogForUser(userId: string) {
    return this.repository.findCatalogByUser(userId);
  }

  async getById(id: number) {
    const course = await this.repository.findById(id);

    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }

  async getPurchasedById(id: number, userId: string) {
    const course = await this.repository.findPurchasedById(id, userId);

    if (!course) {
      throw new ForbiddenException('No tienes acceso a este curso');
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
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return updatedCourse;
  }

  async remove(id: number) {
    if (await this.hasPurchases(id)) {
      throw new ConflictException(
        'No se puede eliminar un curso que ya tiene compras',
      );
    }

    const deletedCourse = await this.repository.remove(id);

    if (!deletedCourse) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    return deletedCourse;
  }
}
