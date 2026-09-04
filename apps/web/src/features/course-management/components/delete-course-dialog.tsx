import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "@/components/ui/dialog";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import { useDeleteCourse } from "@/features/course-management/api/use-course-mutations";
import { toApiErrorMessage } from "@/lib/api-error";

type Props = {
  open: boolean;
  course?: CourseCatalogItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteCourseDialog({
  open,
  course,
  onOpenChange,
  onSuccess,
}: Props) {
  const mutation = useDeleteCourse({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  if (!open || !course) return null;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-md">
            <DialogHeader>
              <div>
                <DialogTitle>¿Eliminar curso?</DialogTitle>
                <DialogDescription>
                  {`Vas a eliminar "${course.title}". Esta acción es irreversible.`}
                </DialogDescription>
              </div>
              <DialogClose />
            </DialogHeader>

            {mutation.isError ? (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {toApiErrorMessage(
                  mutation.error,
                  "No se pudo eliminar el curso",
                )}
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
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
