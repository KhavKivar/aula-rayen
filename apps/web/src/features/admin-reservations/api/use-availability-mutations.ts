import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { createAvailabilitySlots } from "@/features/admin-reservations/api/create-availability-slot";
import { deleteAvailabilitySlot } from "@/features/admin-reservations/api/delete-availability-slot";

type MutationCallbacks = {
  onSuccess?: () => void;
};

async function invalidateSlots(queryClient: QueryClient) {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.availabilitySlots,
  });
}

export function useCreateAvailabilitySlots({
  onSuccess,
}: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAvailabilitySlots,
    onSuccess: async () => {
      await invalidateSlots(queryClient);
      onSuccess?.();
    },
  });
}

export function useDeleteAvailabilitySlot({
  onSuccess,
}: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvailabilitySlot,
    onSuccess: async () => {
      await invalidateSlots(queryClient);
      onSuccess?.();
    },
  });
}
