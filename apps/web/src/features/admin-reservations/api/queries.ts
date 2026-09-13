import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { getAvailabilitySlots } from "@/features/admin-reservations/api/get-availability-slots";

export const availabilityQueries = {
  slots: queryOptions({
    queryKey: queryKeys.availabilitySlots,
    queryFn: getAvailabilitySlots,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  }),
};
