import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCourseDto } from './dto/create-course.dto';
import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    const course = await this.repository.findById(id);

    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }

  create(dto: CreateCourseDto) {
    return this.repository.create(dto);
  }
}
