import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CourseCatalogTable({
  courses,
  onEdit,
  onDelete,
  onViewPurchasers,
}: {
  courses: CourseCatalogItem[];
  onEdit: (course: CourseCatalogItem) => void;
  onDelete: (course: CourseCatalogItem) => void;
  onViewPurchasers?: (course: CourseCatalogItem) => void;
}) {
  return (
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
              <th className="px-4 py-4 font-semibold text-right">Acciones</th>
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
                  {formatPrice(course.price)}
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
                      onClick={() => onEdit(course)}
                      aria-label={`Editar ${course.title}`}
                    >
                      <Pencil size={14} aria-hidden="true" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(course)}
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
  );
}
