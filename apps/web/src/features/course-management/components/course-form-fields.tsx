import { TextareaField, TextField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import type { useCourseForm } from "@/features/course-management/components/use-course-form";

export function CourseFormFields({
  form,
}: {
  form: ReturnType<typeof useCourseForm>["form"];
}) {
  return (
    <>
      <form.AppField name="title">
        {() => (
          <TextField label="Título" placeholder="Ej: Arteterapia para infancias" />
        )}
      </form.AppField>

      <form.AppField name="description">
        {() => (
          <TextareaField label="Descripción" placeholder="Descripción del curso" />
        )}
      </form.AppField>

      <form.AppField name="videoLink">
        {() => (
          <TextField
            label="Link del video"
            type="url"
            placeholder="https://example.com/video"
          />
        )}
      </form.AppField>

      <form.AppField name="fileLink">
        {() => (
          <TextField
            label="Link del material"
            type="url"
            placeholder="https://example.com/file"
          />
        )}
      </form.AppField>

      <form.AppField name="duration">
        {() => <TextField label="Duración" placeholder="Ej: 2 horas" />}
      </form.AppField>

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
                  error ? `${field.name}-error` : undefined
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
