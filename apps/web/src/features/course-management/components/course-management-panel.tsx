import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { AlertCircle, Eye, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
        className="flex items-center justify-center gap-3 rounded-[2rem] border border-[#d9dfd8] bg-[#fffdf8] px-6 py-16 text-[#62716d]"
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
        <h2 className="font-heading text-2xl font-semibold text-[#294944]">
          Gestionar cursos
        </h2>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-[#294944] text-[#fffdf8] hover:bg-[#3d655d]"
        >
          Crear curso
        </Button>
      </div>

      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl bg-[#e7efe9] px-4 py-3 text-sm text-[#294944]"
        >
          {feedback}
        </p>
      ) : null}

      {courses.length === 0 ? (
        <section
          className="rounded-[2rem] border border-dashed border-[#bfcac3] bg-[#fffdf8] px-6 py-16 text-center"
          aria-labelledby="empty-manage-title"
        >
          <h3
            id="empty-manage-title"
            className="font-heading text-xl font-semibold text-[#294944]"
          >
            No hay cursos aún
          </h3>
          <p className="mx-auto mt-2 max-w-md leading-7 text-[#62716d]">
            Crea tu primer curso para comenzar a gestionar el catálogo.
          </p>
          <Button
            onClick={() => setCreateOpen(true)}
            className="mt-6 bg-[#294944] text-[#fffdf8] hover:bg-[#3d655d]"
          >
            Crear tu primer curso
          </Button>
        </section>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-[#d9dfd8] bg-[#fffdf8]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#f7f4ec] text-xs uppercase tracking-[0.12em] text-[#7c8985]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Título</th>
                  <th className="px-6 py-4 font-semibold">Descripción</th>
                  <th className="px-6 py-4 font-semibold">Duración</th>
                  <th className="px-6 py-4 font-semibold">Precio</th>
                  <th className="px-6 py-4 font-semibold">Creado</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e8e2]">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[#f7f4ec]/50">
                    <td className="px-6 py-4 font-medium text-[#294944]">
                      {course.title}
                    </td>
                    <td className="max-w-[280px] truncate px-6 py-4 text-sm text-[#62716d]">
                      {course.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#294944]">
                      {course.duration}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#294944]">
                      {new Intl.NumberFormat("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 0,
                      }).format(course.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#62716d]">
                      {new Date(course.createdAt).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
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
