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
import { CourseFormFields } from "@/features/course-management/components/course-form-fields";
import {
  useCourseForm,
  type EditableCourse,
} from "@/features/course-management/components/use-course-form";

type CourseFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  course?: EditableCourse;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CourseFormDialog({
  open,
  mode,
  course,
  onOpenChange,
  onSuccess,
}: CourseFormDialogProps) {
  const { form, isPending, errorMessage } = useCourseForm({
    mode,
    course,
    onClose: () => onOpenChange(false),
    onSuccess,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup className="max-w-2xl">
            <DialogHeader>
              <div>
                <DialogTitle>
                  {mode === "create" ? "Crear curso" : "Editar curso"}
                </DialogTitle>
                <DialogDescription>
                  {mode === "create"
                    ? "Completa los datos del nuevo curso."
                    : `Editando "${course?.title}"`}
                </DialogDescription>
              </div>
              <DialogClose />
            </DialogHeader>

            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
              noValidate
            >
              <CourseFormFields form={form} />

              {errorMessage ? (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <LoaderCircle
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Guardando...
                    </>
                  ) : mode === "create" ? (
                    "Crear"
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </div>
            </form>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
