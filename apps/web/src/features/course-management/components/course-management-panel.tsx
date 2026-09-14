import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "@/components/ui/query-state";
import { queryKeys } from "@/config/query-keys";
import { CourseCatalogTable } from "@/features/course-management/components/course-catalog-table";
import { CourseFormDialog } from "@/features/course-management/components/course-form-dialog";
import { DeleteCourseDialog } from "@/features/course-management/components/delete-course-dialog";
import type {
  CourseCatalogItem,
  CourseDetail,
} from "@aula-rayen/contracts/course";

export function CourseManagementPanel({
  coursesQueryOptions,
  fetchCourseDetail,
  onViewPurchasers,
}: {
  coursesQueryOptions: UseQueryOptions<
    CourseCatalogItem[],
    Error,
    CourseCatalogItem[],
    readonly ["courses"]
  >;
  fetchCourseDetail: (courseId: number) => Promise<CourseDetail>;
  onViewPurchasers?: (course: CourseCatalogItem) => void;
}) {
  const queryClient = useQueryClient();
  const coursesQuery = useQuery(coursesQueryOptions);

  const [createOpen, setCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseDetail | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<CourseCatalogItem | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleEdit = async (course: CourseCatalogItem) => {
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: queryKeys.course(course.id),
        queryFn: () => fetchCourseDetail(course.id),
      });
      setEditCourse(detail);
    } catch {
      // Fallback to catalog data with empty links if detail fails (e.g., no access)
      setEditCourse({
        ...course,
        videoLink: "",
        fileLink: "",
      });
    }
  };

  const courses = coursesQuery.data ?? [];

  return (
    <QueryState
      query={coursesQuery}
      loading="Cargando cursos…"
      error="No fue posible cargar los cursos. Inténtalo nuevamente."
      onRetry={() => coursesQuery.refetch()}
    >
      <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Contenido y aprendizaje</p>
            <h1 className="mt-3 font-heading text-4xl tracking-tight text-foreground">
              Gestionar cursos
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Prepara nuevas experiencias y mantén tu catálogo al día.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Crear curso
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/60 px-6 py-5">
          <p className="text-sm font-medium">Tu catálogo de formación</p>
          <p className="text-sm text-muted-foreground">
            <span className="mr-2 font-heading text-3xl text-foreground">
              {courses.length}
            </span>
            {courses.length === 1 ? "curso" : "cursos"}
          </p>
        </div>

        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl bg-secondary px-4 py-3 text-sm text-foreground"
          >
            {feedback}
          </p>
        ) : null}

        {courses.length === 0 ? (
          <EmptyState
            title="No hay cursos aún"
            titleId="empty-manage-title"
            titleClassName="text-xl"
            description="Crea tu primer curso para comenzar a gestionar el catálogo."
            action={
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Crear tu primer curso
              </Button>
            }
          />
        ) : (
          <CourseCatalogTable
            courses={courses}
            onEdit={handleEdit}
            onDelete={setDeleteCourse}
            onViewPurchasers={onViewPurchasers}
          />
        )}

        {createOpen ? (
          <CourseFormDialog
            open
            mode="create"
            onOpenChange={setCreateOpen}
            onSuccess={() => setFeedback("Curso creado correctamente")}
          />
        ) : null}

        {editCourse ? (
          <CourseFormDialog
            key={editCourse.id}
            open
            mode="edit"
            course={editCourse}
            onOpenChange={(open) => {
              if (!open) setEditCourse(null);
            }}
            onSuccess={() => {
              setEditCourse(null);
              setFeedback("Curso actualizado correctamente");
            }}
          />
        ) : null}

        <DeleteCourseDialog
          open={Boolean(deleteCourse)}
          course={deleteCourse}
          onOpenChange={(open) => {
            if (!open) setDeleteCourse(null);
          }}
          onSuccess={() => {
            setDeleteCourse(null);
            setFeedback("Curso eliminado correctamente");
          }}
        />
      </div>
    </QueryState>
  );
}
