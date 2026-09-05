import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PurchasersDialog } from "@/features/admin-dashboard/components/purchasers-dialog";
import { getCourse } from "@/features/course-dashboard/api/get-course";
import { courseDashboardQueries } from "@/features/course-dashboard/api/queries";
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
    <section aria-label="Administración de cursos">
      <CourseManagementPanel
        coursesQueryOptions={courseDashboardQueries.courses}
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
