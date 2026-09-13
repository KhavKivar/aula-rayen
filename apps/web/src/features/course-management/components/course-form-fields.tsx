import { FormField, formFieldErrorId } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { useCourseForm } from "@/features/course-management/components/use-course-form";

export function CourseFormFields({
  form,
}: {
  form: ReturnType<typeof useCourseForm>["form"];
}) {
  return (
    <>
      <form.Field name="title">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField inputId={field.name} label="Título" error={error}>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? formFieldErrorId(field.name) : undefined
                }
                placeholder="Ej: Arteterapia para infancias"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField inputId={field.name} label="Descripción" error={error}>
              <textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? formFieldErrorId(field.name) : undefined
                }
                placeholder="Descripción del curso"
                className="min-h-24 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="videoLink">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField inputId={field.name} label="Link del video" error={error}>
              <Input
                id={field.name}
                type="url"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? formFieldErrorId(field.name) : undefined
                }
                placeholder="https://example.com/video"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="fileLink">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField
              inputId={field.name}
              label="Link del material"
              error={error}
            >
              <Input
                id={field.name}
                type="url"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? formFieldErrorId(field.name) : undefined
                }
                placeholder="https://example.com/file"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="duration">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField inputId={field.name} label="Duración" error={error}>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? formFieldErrorId(field.name) : undefined
                }
                placeholder="Ej: 2 horas"
              />
            </FormField>
          );
        }}
      </form.Field>

      <form.Field name="price">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;

          return (
            <FormField inputId={field.name} label="Precio (CLP)" error={error}>
              <Input
                id={field.name}
                type="number"
                min={0}
                step={1000}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  const next = event.target.value;
                  field.handleChange(next === "" ? "" : Number(next));
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? formFieldErrorId(field.name) : undefined
                }
                placeholder="25000"
              />
            </FormField>
          );
        }}
      </form.Field>
    </>
  );
}
