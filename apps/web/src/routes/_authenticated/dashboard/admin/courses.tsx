import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PurchasersDialog } from "@/features/admin-dashboard/components/purchasers-dialog";
import { getCourse } from "@/features/course-dashboard/api/get-course";
import { CourseManagementPanel } from "@/features/course-management/components/course-management-panel";

export const Route = createFileRoute("/_authenticated/dashboard/admin/courses")(
  { component: AdminCoursesPage },
);

function AdminCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section aria-labelledby="admin-courses-title">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Catálogo y audiencia</p>
          <h1
            id="admin-courses-title"
            className="mt-2 font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            Cursos
          </h1>
          <p className="mt-2 max-w-2xl leading-7 text-[#65746f]">
            Administra el catálogo y revisa sus compradores.
          </p>
        </div>
      </div>
      <CourseManagementPanel
        fetchCourseDetail={getCourse}
        onViewPurchasers={(course) => {
          setSelectedCourse({ id: course.id, title: course.title });
          setOpen(true);
        }}
      />
      <PurchasersDialog
        course={selectedCourse}
        isOpen={open}
        onOpenChange={setOpen}
      />
    </section>
  );
}
