import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCourseDto } from './dto/create-course.dto';
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

  create(dto: CreateCourseDto) {
    return this.repository.create(dto);
  }
}
