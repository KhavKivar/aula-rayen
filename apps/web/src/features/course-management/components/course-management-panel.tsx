import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { AlertCircle, Eye, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { queryKeys } from "@/config/query-keys";
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

  if (coursesQuery.isPending) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-3 rounded-[2rem] border border-border bg-card px-6 py-16 text-muted-foreground"
      >
        <LoaderCircle className="animate-spin" aria-hidden="true" />
        Cargando cursos…
      </div>
    );
  }

  if (coursesQuery.isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-[#e4c5b9] bg-[#fff8f4] px-6 py-16 text-[#934d3b]"
      >
        <div className="flex items-center gap-2">
          <AlertCircle aria-hidden="true" />
          No fue posible cargar los cursos. Inténtalo nuevamente.
        </div>
        <Button
          variant="outline"
          onClick={() => coursesQuery.refetch()}
          className="mt-2"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  const courses = coursesQuery.data ?? [];

  return (
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
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
          <div
            className="overflow-x-auto focus-visible:outline-ring"
            tabIndex={0}
            role="region"
            aria-label="Catálogo de cursos"
            data-scroll="horizontal"
          >
            <table className="course-management-table w-full text-left md:min-w-[700px]">
              <thead className="bg-secondary/60 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-4 font-semibold">Título</th>
                  <th className="px-4 py-4 font-semibold">Duración</th>
                  <th className="px-4 py-4 font-semibold">Precio</th>
                  <th className="px-4 py-4 font-semibold">Creado</th>
                  <th className="px-4 py-4 font-semibold text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-background/50">
                    <td className="px-4 py-4 font-medium text-foreground">
                      <p>{course.title}</p>
                      <p className="mt-2 max-w-xs text-sm font-normal leading-6 text-muted-foreground">
                        {course.description}
                      </p>
                    </td>
                    <td
                      data-label="Duración"
                      className="whitespace-nowrap px-4 py-4 text-sm text-foreground"
                    >
                      {course.duration}
                    </td>
                    <td
                      data-label="Precio"
                      className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-foreground"
                    >
                      {new Intl.NumberFormat("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 0,
                      }).format(course.price)}
                    </td>
                    <td
                      data-label="Creado"
                      className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground"
                    >
                      {new Date(course.createdAt).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {onViewPurchasers ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewPurchasers(course)}
                            aria-label={`Ver compradores de ${course.title}`}
                            id={`purchasers-trigger-${course.id}`}
                          >
                            <Eye size={14} aria-hidden="true" />
                            Compradores
                          </Button>
                        ) : null}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                          aria-label={`Editar ${course.title}`}
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteCourse(course)}
                          aria-label={`Eliminar ${course.title}`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
  );
}
