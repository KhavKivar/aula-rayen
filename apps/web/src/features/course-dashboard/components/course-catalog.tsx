import { BookOpen } from "lucide-react";
import { useRef } from "react";

import { CourseCard } from "@/features/course-dashboard/components/course-card";
import type { Course } from "@/features/course-dashboard/types/course";
import { useMutation } from "@tanstack/react-query";
import { createWebPay, CreateWebPayDto } from "../api/create-webpay";

export function CourseCatalog({ courses }: { courses: readonly Course[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const mutation = useMutation({
    mutationFn: createWebPay,

    onSuccess: (data) => {
      const form = formRef.current;
      if (!form) {
        console.error("Webpay form not found");
        return;
      }
      form.action = data.url;

      const input = form.elements.namedItem("token_ws") as HTMLInputElement;

      if (!(input instanceof HTMLInputElement)) {
        console.error("token_ws input not found");
        return;
      }
      input.value = data.token;
      console.log(form);
      form.submit();
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
            onClickWebPay={onSubmit}
          />
        ))}
      </section>

      <form style={{ display: "none" }} ref={formRef} action="/" method="POST">
        <input type="hidden" name="token_ws" />
      </form>
    </>
  );
}
