import { useState } from "react";

import { useAppForm } from "@/components/ui/form";
import {
  courseCreateRequestSchema,
  courseUpdateRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import {
  useCreateCourse,
  useUpdateCourse,
} from "@/features/course-management/api/use-course-mutations";
import { toApiErrorMessage } from "@/lib/api-error";

export type EditableCourse = Pick<
  CourseCatalogItem,
  "id" | "title" | "description" | "duration" | "price"
> & {
  videoLink?: string;
  fileLink?: string;
};

export type CourseFormValues = {
  title: string;
  description: string;
  videoLink: string;
  fileLink: string;
  duration: string;
  price: number | "";
};

type UseCourseFormArgs = {
  mode: "create" | "edit";
  course?: EditableCourse;
  onClose: () => void;
  onSuccess?: () => void;
};

/**
 * Estado del formulario de curso. El diálogo se monta de forma
 * condicional con `key` por curso, así los valores iniciales siempre
 * son frescos y no hace falta resetear con efectos.
 */
export function useCourseForm({
  mode,
  course,
  onClose,
  onSuccess,
}: UseCourseFormArgs) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const createMutation = useCreateCourse({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const updateMutation = useUpdateCourse({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const initialValues: CourseFormValues = {
    title: course?.title ?? "",
    description: course?.description ?? "",
    videoLink: course?.videoLink ?? "",
    fileLink: course?.fileLink ?? "",
    duration: course?.duration ?? "",
    price: course?.price ?? "",
  };

  const form = useAppForm({
    defaultValues: initialValues,
    validators:
      mode === "create"
        ? {
            onSubmit: courseCreateRequestSchema,
          }
        : undefined,
    onSubmit: async ({ value }) => {
      setValidationError(null);

      try {
        if (mode === "create") {
          const parsed = courseCreateRequestSchema.safeParse(value);
          if (!parsed.success) {
            setValidationError(
              parsed.error.issues[0]?.message ??
                "Revisa los datos del curso antes de guardar",
            );
            return;
          }

          await createMutation.mutateAsync(parsed.data);
          return;
        }

        if (!course) return;

        const baseline: Record<string, unknown> = { ...initialValues };
        const diff = Object.fromEntries(
          Object.entries(value).filter(
            ([key, fieldValue]) => baseline[key] !== fieldValue,
          ),
        );

        const parsed = courseUpdateRequestSchema.safeParse(diff);
        if (!parsed.success) {
          setValidationError(
            parsed.error.issues[0]?.message ??
              "Debes enviar al menos un campo para actualizar",
          );
          return;
        }

        await updateMutation.mutateAsync({
          id: course.id,
          data: parsed.data,
        });
      } catch {
        // El error de la mutación se muestra vía `isError`; el catch evita
        // un unhandled rejection cuando la API rechaza la petición.
      }
    },
  });

  return {
    form,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage:
      validationError ??
      (createMutation.isError
        ? toApiErrorMessage(createMutation.error, "No se pudo crear el curso")
        : undefined) ??
      (updateMutation.isError
        ? toApiErrorMessage(
            updateMutation.error,
            "No se pudo actualizar el curso",
          )
        : undefined),
  };
}
