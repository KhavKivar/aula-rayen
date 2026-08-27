import { Inject, Injectable } from '@nestjs/common';
import type { UpdateCourseRequest } from '@aula-rayen/contracts/course';
import { and, eq } from 'drizzle-orm';

import { DRIZZLE } from '@/db';
import { course_purchases, courses } from '@/db/schema';
import type { Course, CoursePurchase, Database, NewCourse } from '@/db/types';

export type CourseCatalogItem = Pick<
  Course,
  'id' | 'title' | 'description' | 'createdAt' | 'duration' | 'price'
> & {
  hasAccess: boolean;
};

export type CoursePurchaser = Pick<CoursePurchase, 'userId'>;

@Injectable()
export class CourseRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(): Promise<Course[]> {
    return this.db.select().from(courses);
  }

  findPurchasersByCourseId(courseId: number): Promise<CoursePurchaser[]> {
    return this.db
      .select({ userId: course_purchases.userId })
      .from(course_purchases)
      .where(eq(course_purchases.courseId, courseId));
  }

  async hasPurchases(courseId: number): Promise<boolean> {
    const [purchase] = await this.db
      .select({
        id: course_purchases.id,
      })
      .from(course_purchases)
      .where(eq(course_purchases.courseId, courseId))
      .limit(1);

    return purchase != null;
  }

  async findCatalogByUser(userId: string): Promise<CourseCatalogItem[]> {
    const [courseCatalog, purchases] = await Promise.all([
      this.db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          createdAt: courses.createdAt,
          duration: courses.duration,
          price: courses.price,
        })
        .from(courses),
      this.db
        .select({ courseId: course_purchases.courseId })
        .from(course_purchases)
        .where(eq(course_purchases.userId, userId)),
    ]);
    const purchasedCourseIds = new Set(
      purchases.map(({ courseId }) => courseId),
    );

    return courseCatalog.map((course) => ({
      ...course,
      hasAccess: purchasedCourseIds.has(course.id),
    }));
  }

  async findById(id: number): Promise<Course | null> {
    const [course] = await this.db
      .select()
      .from(courses)
      .where(eq(courses.id, id));

    return course ?? null;
  }

  async findPurchasedById(id: number, userId: string): Promise<Course | null> {
    const [result] = await this.db
      .select({ course: courses })
      .from(course_purchases)
      .innerJoin(courses, eq(course_purchases.courseId, courses.id))
      .where(
        and(
          eq(course_purchases.courseId, id),
          eq(course_purchases.userId, userId),
        ),
      );

    return result?.course ?? null;
  }
  async create(course: NewCourse): Promise<Course> {
    const [createdCourse] = await this.db
      .insert(courses)
      .values(course)
      .returning();

    return createdCourse;
  }

  async update(
    id: number,
    course: UpdateCourseRequest,
  ): Promise<Course | null> {
    const [updateCourse] = await this.db
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();
    return updateCourse;
  }

  async remove(id: number): Promise<Course | null> {
    const [deletedCourse] = await this.db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning();

    return deletedCourse;
  }
}
