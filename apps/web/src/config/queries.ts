import { getCourses } from "@/features/course-dashboard/api/get-courses";
import { getSession } from "@/lib/auth-client";
import { queryOptions } from "@tanstack/react-query";

export const queries = {
  session: queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const session = await getSession();

      return {
        user: session.data?.user,
        session: session.data?.session,
      };
    },
  }),
  courses: queryOptions({
    queryKey: ["courses"],
    queryFn: getCourses,
  }),
};
