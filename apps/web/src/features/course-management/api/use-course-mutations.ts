import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { createCourse } from "@/features/course-management/api/create-course";
import { deleteCourse } from "@/features/course-management/api/delete-course";
import { updateCourse } from "@/features/course-management/api/update-course";

type MutationCallbacks = {
  onSuccess?: () => void;
};

async function invalidateCatalog(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.courses });
}

export function useCreateCourse({ onSuccess }: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: async () => {
      await invalidateCatalog(queryClient);
      onSuccess?.();
    },
  });
}

export function useUpdateCourse({ onSuccess }: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,
    onSuccess: async (_course, { id }) => {
      const queryKey = queryKeys.course(id);
      await queryClient.cancelQueries({ queryKey, exact: true });
      await queryClient.invalidateQueries({ queryKey, exact: true });
      await invalidateCatalog(queryClient);
      onSuccess?.();
    },
  });
}

export function useDeleteCourse({ onSuccess }: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: async (_course, { id }) => {
      const queryKey = queryKeys.course(id);
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.removeQueries({ queryKey, exact: true });
      await invalidateCatalog(queryClient);
      onSuccess?.();
    },
  });
}
