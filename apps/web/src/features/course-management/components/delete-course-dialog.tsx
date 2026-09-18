import type { CourseCatalogItem } from "@aula-rayen/contracts/course";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      title="¿Eliminar curso?"
      description={`Vas a eliminar "${course.title}". Esta acción es irreversible.`}
      confirmLabel="Eliminar"
      pendingLabel="Eliminando..."
      destructive
      isPending={mutation.isPending}
      onConfirm={() => mutation.mutate({ id: course.id })}
    >
      {mutation.isError ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {toApiErrorMessage(
            mutation.error,
            "No se pudo eliminar el curso",
          )}
        </p>
      ) : null}
    </ConfirmDialog>
  );
}
