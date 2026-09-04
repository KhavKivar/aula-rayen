import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import { deleteCourse } from "@/features/course-management/api/delete-course";
import { AxiosError } from "axios";

type Props = {
  open: boolean;
  course?: CourseCatalogItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};


type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};

export function DeleteCourseDialog({
  open,
  course,
  onOpenChange,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const mutation = useMutation<unknown,AxiosError<ApiError>,{id:number}>({
    mutationFn: deleteCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
      onSuccess?.();
    }
  });

  if (!open || !course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar eliminación"
    >
      <div className="w-full max-w-md rounded-[1.5rem] bg-[#fffdf8] p-6 shadow-xl">
        <h2 className="font-heading text-xl font-semibold text-[#294944]">
          ¿Eliminar curso?
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#62716d]">
          Vas a eliminar <span className="font-semibold">{course.title}</span>.
          Esta acción es irreversible.
        </p>

        {mutation.isError ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {mutation.error .response?.data.message ??
              "No se pudo eliminar el curso"}
          </p>
        ) : null}


        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => mutation.mutate({ id: course.id })}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
