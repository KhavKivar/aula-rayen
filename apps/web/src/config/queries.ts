import { getCourseBuyers } from "@/features/admin-dashboard/api/get-course-buyers";
import { getCourses } from "@/features/course-dashboard/api/get-courses";
import { authClient } from "@/lib/auth-client";
import { queryOptions } from "@tanstack/react-query";

export const queries = {
  session: queryOptions({
    queryKey: ["session"],
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
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  }),
  courseBuyers: (courseId: number | null) =>
    queryOptions({
      queryKey: ["course-buyers", courseId],
      queryFn: () => getCourseBuyers(courseId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),
};


// {
//   queryKey: ["course-buyers", course?.id],
//   queryFn: () => (course ? getCourseBuyers(course.id) : Promise.resolve([])),
//   enabled: course !== null,
// }