import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Crear curso" : "Editar curso"}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] bg-[#fffdf8] p-6 shadow-xl sm:p-8">
        <h2 className="font-heading text-2xl font-semibold text-[#294944]">
          {mode === "create" ? "Crear curso" : "Editar curso"}
        </h2>
        <p className="mt-1 text-sm text-[#62716d]">
          {mode === "create"
            ? "Completa los datos del nuevo curso."
            : `Editando "${course?.title}"`}
        </p>

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
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
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
      </div>
    </div>
  );
}
