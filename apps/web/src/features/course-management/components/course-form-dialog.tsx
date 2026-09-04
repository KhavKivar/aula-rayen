import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCourseRequestSchema,
  updateCourseRequestSchema,
} from "@aula-rayen/contracts/course";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import { createCourse } from "@/features/course-management/api/create-course";
import { updateCourse } from "@/features/course-management/api/update-course";
import { queryKeys } from "@/config/query-keys";

type CourseFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  course?: CourseCatalogItem & { videoLink?: string; fileLink?: string };
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
  const queryClient = useQueryClient();
  const [validationError, setValidationError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: Record<string, unknown> }) =>
      updateCourse(data as never),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const errorMessage =
    validationError ??
    (createMutation.error as Error | undefined)?.message ??
    (updateMutation.error as Error | undefined)?.message;

  // For edit, we need full details including video/file links.
  // Catalog item doesn't have them, so we fetch details if needed.
  // For simplicity, we expect course to contain videoLink/fileLink if edit,
  // otherwise we fallback to empty. The parent panel should provide full detail.
  const defaultValues = {
    title: course?.title ?? "",
    description: course?.description ?? "",
    videoLink: (course as unknown as { videoLink?: string })?.videoLink ?? "",
    fileLink: (course as unknown as { fileLink?: string })?.fileLink ?? "",
    duration: course?.duration ?? "",
    price: course?.price ?? 0,
  };

  const form = useForm({
    defaultValues,
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
      const diff = Object.fromEntries(
        Object.entries(value).filter(
          ([k, v]) => (defaultValues as Record<string, unknown>)[k] !== v,
        ),
      ) as Record<string, unknown>;

      const parsed = updateCourseRequestSchema.safeParse(diff);
      if (!parsed.success) {
        const msg =
          parsed.error.issues[0]?.message ??
          "Debes enviar al menos un campo para actualizar";
        setValidationError(msg);
        return;
      }
      await updateMutation.mutateAsync({
        id: course.id,
        data: parsed.data,
      });
    },
  });

  // Reset form when course changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset(defaultValues as never);
      createMutation.reset();
      updateMutation.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValidationError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, course?.id]);

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
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          noValidate
        >
          <form.Field name="title">
            {(field) => {
              const err = field.state.meta.errors[0]?.message as
                | string
                | undefined;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Título</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(err)}
                    placeholder="Ej: Arteterapia para infancias"
                  />
                  {err ? (
                    <p className="text-xs text-destructive">{err}</p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const err = field.state.meta.errors[0]?.message as
                | string
                | undefined;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Descripción</Label>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(err)}
                    placeholder="Descripción del curso"
                    className="min-h-24 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                  {err ? (
                    <p className="text-xs text-destructive">{err}</p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="videoLink">
            {(field) => {
              const err = field.state.meta.errors[0]?.message as
                | string
                | undefined;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Link del video</Label>
                  <Input
                    id={field.name}
                    type="url"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(err)}
                    placeholder="https://example.com/video"
                  />
                  {err ? (
                    <p className="text-xs text-destructive">{err}</p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="fileLink">
            {(field) => {
              const err = field.state.meta.errors[0]?.message as
                | string
                | undefined;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Link del material</Label>
                  <Input
                    id={field.name}
                    type="url"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(err)}
                    placeholder="https://example.com/file"
                  />
                  {err ? (
                    <p className="text-xs text-destructive">{err}</p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="duration">
            {(field) => {
              const err = field.state.meta.errors[0]?.message as
                | string
                | undefined;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Duración</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(err)}
                    placeholder="Ej: 2 horas"
                  />
                  {err ? (
                    <p className="text-xs text-destructive">{err}</p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="price">
            {(field) => {
              const err = field.state.meta.errors[0]?.message as
                | string
                | undefined;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Precio (CLP)</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    step={1000}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value))
                    }
                    aria-invalid={Boolean(err)}
                    placeholder="25000"
                  />
                  {err ? (
                    <p className="text-xs text-destructive">{err}</p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>

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
