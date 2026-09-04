import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { getCourseBuyers } from "@/features/admin-dashboard/api/get-course-buyers";

export const adminDashboardQueries = {
  courseBuyers: (courseId: number | null) =>
    queryOptions({
      queryKey: queryKeys.courseBuyers(courseId),
      queryFn: () => getCourseBuyers(courseId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),
};
