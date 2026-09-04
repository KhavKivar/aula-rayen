import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { getCourse } from "@/features/course-dashboard/api/get-course";
import { getCourses } from "@/features/course-dashboard/api/get-courses";

export const courseDashboardQueries = {
  courses: queryOptions({
    queryKey: queryKeys.courses,
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  }),
  courseDetail: (courseId: number) =>
    queryOptions({
      queryKey: queryKeys.course(courseId),
      queryFn: () => getCourse(courseId),
    }),
};
