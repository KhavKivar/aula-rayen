import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PurchasersDialog } from "@/features/admin-dashboard/components/purchasers-dialog";
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
 console.log(open)
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
        onViewPurchasers={(course) =>{
          setSelectedCourse({ id: course.id, title: course.title });
          setOpen(!open);
        }
        }
      />
      <PurchasersDialog
        course={selectedCourse ?? {id:0,title:"error"}}
        isOpen={open}
        onOpenChange={(open) => {

          console.log(open);
          setOpen(open)
        
        
         
        }}
        
        // onOpenChange={(open)=>{
        //   if(selectedCourse)return true
        //   return false
        // }}
      />
    </section>
  );
}
