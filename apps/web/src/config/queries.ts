import { getCourseBuyers } from "@/features/admin-dashboard/api/get-course-buyers";
import { getCourses } from "@/features/course-dashboard/api/get-courses";
import { authClient } from "@/lib/auth-client";
import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";

export const queries = {
  session: queryOptions({
    queryKey: queryKeys.session,
    queryFn: async () => {
      const session = await authClient.getSession();
      if (!session.data?.session || !session.data?.user) {
        return null;
      }

      return {
        user: session.data.user,
        session: session.data.session,
      };
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 30,
  }),
  courses: queryOptions({
    queryKey: queryKeys.courses,
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  }),
  courseBuyers: (courseId: number | null) =>
    queryOptions({
      queryKey: queryKeys.courseBuyers(courseId),
      queryFn: () => getCourseBuyers(courseId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),
};