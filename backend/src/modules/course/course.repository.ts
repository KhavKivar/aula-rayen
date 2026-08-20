import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DRIZZLE } from '../../db/drizzle';
import type { Database } from '../../db/drizzle';
import { Course, courses, NewCourse } from '../../db/schema';

@Injectable()
export class CourseRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(): Promise<Course[]> {
    return this.db.select().from(courses);
  }

  async findById(id: number): Promise<Course | null> {
    const [course] = await this.db
      .select()
      .from(courses)
      .where(eq(courses.id, id));

    return course ?? null;
  }
  async create(course: NewCourse): Promise<Course> {
    const [createdCourse] = await this.db
      .insert(courses)
      .values(course)
      .returning();

    return createdCourse;
  }
}
