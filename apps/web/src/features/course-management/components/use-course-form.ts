import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import {
  createCourseRequestSchema,
  updateCourseRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import {
  useCreateCourse,
  useUpdateCourse,
} from "@/features/course-management/api/use-course-mutations";

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
  price: number;
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
    price: course?.price ?? 0,
  };

  const form = useForm({
    defaultValues: initialValues,
    validators:
      mode === "create"
        ? {
            onSubmit: createCourseRequestSchema,
          }
        : undefined,
    onSubmit: async ({ value }) => {
      setValidationError(null);
      if (mode === "create") {
        await createMutation.mutateAsync(value);
        return;
      }
      if (!course) return;
      const baseline: Record<string, unknown> = { ...initialValues };
      const diff = Object.fromEntries(
        Object.entries(value).filter(([key, fieldValue]) => baseline[key] !== fieldValue),
      );

      const parsed = updateCourseRequestSchema.safeParse(diff);
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
    },
  });

  return {
    form,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage:
      validationError ??
      createMutation.error?.message ??
      updateMutation.error?.message,
  };
}
