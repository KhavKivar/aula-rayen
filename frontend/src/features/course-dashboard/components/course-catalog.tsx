import { BookOpen, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { CourseCard } from "@/features/course-dashboard/components/course-card";
import type { Course } from "@/features/course-dashboard/types/course";
import { useMutation } from "@tanstack/react-query";
import { createWebPay, CreateWebPayDto } from "../api/create-webpay";

export function CourseCatalog({ courses }: { courses: readonly Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const mutation = useMutation({
    mutationFn: createWebPay,

    onSuccess: (data) => {
      console.log("creado", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
  const onSubmit = (courseId: number) => {
    mutation.mutate({ course_id: courseId } as CreateWebPayDto);
  };
  if (courses.length === 0) {
    return (
      <section
        className="rounded-[2rem] border border-dashed border-[#bfcac3] bg-[#fffdf8] px-6 py-16 text-center"
        aria-labelledby="empty-catalog-title"
      >
        <BookOpen
          className="mx-auto text-[#c66f51]"
          size={36}
          aria-hidden="true"
        />
        <h2
          id="empty-catalog-title"
          className="mt-5 font-heading text-2xl font-semibold text-[#294944]"
        >
          No hay cursos disponibles por ahora
        </h2>
        <p className="mx-auto mt-2 max-w-md leading-7 text-[#62716d]">
          Estamos preparando nuevas experiencias. Vuelve pronto para conocerlas.
        </p>
      </section>
    );
  }

  return (
    <>
      <section
        aria-label="Cursos disponibles"
        className="grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onSelect={setSelectedCourse}
            onClickWebPay={onSubmit}
          />
        ))}
      </section>

      {selectedCourse ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-[#b9d0c6] bg-[#f3faf6] p-4 text-[#294944] shadow-xl sm:bottom-6"
        >
          <CheckCircle2
            className="mt-0.5 shrink-0 text-[#3d7a64]"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">Demostración de Webpay</p>
            <p className="mt-1 text-sm leading-5 text-[#516963]">
              Seleccionaste “{selectedCourse.title}”. Este mockup no inicia una
              compra ni te redirige fuera de Aula Rayen.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
