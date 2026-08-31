import { getCourses } from "@/features/course-dashboard/api/get-courses";
import { getSession } from "@/lib/auth-client";
import { queryOptions } from "@tanstack/react-query";

export const queries = {
  session: queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const session = await getSession();

      if (!session.data?.session || !session.data?.user) {
        return null;
      }

      return {
        user: session.data.user,
        session: session.data.session,
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  }),
  courses: queryOptions({
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  }),
};
