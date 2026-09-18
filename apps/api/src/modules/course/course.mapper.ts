import type {
  CourseCatalogItem as CourseCatalogContract,
  CourseDetailResponse,
} from '@aula-rayen/contracts/course';

import type { Course } from '@/db/types';
import type { CourseCatalogItem } from './course.repository';

export function toCourseCatalogItem(
  course: CourseCatalogItem,
): CourseCatalogContract {
  return {
    ...course,
    createdAt: course.createdAt.toISOString(),
  };
}

export function toCourseDetail(course: Course): CourseDetailResponse {
  return {
    ...course,
    createdAt: course.createdAt.toISOString(),
  };
}
