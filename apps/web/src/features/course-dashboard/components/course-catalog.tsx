import { useMutation } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useRef, useState } from "react";

import { CourseCard } from "@/features/course-dashboard/components/course-card";
import type { Course } from "@/features/course-dashboard/types/course";
import {
  createWebPay,
  type CreateWebPayDto,
} from "@/features/course-dashboard/api/create-webpay";

export function CourseCatalog({ courses }: { courses: readonly Course[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createWebPay,

    onSuccess: (data) => {
      const form = formRef.current;
      if (!form) {
        setCheckoutError(
          "No fue posible iniciar el pago. Inténtalo nuevamente.",
        );
        return;
      }
      form.action = data.url;

      const input = form.elements.namedItem("token_ws") as HTMLInputElement;

      if (!(input instanceof HTMLInputElement)) {
        setCheckoutError(
          "No fue posible iniciar el pago. Inténtalo nuevamente.",
        );
        return;
      }
      input.value = data.token;
      setCheckoutError(null);
      form.submit();
    },

    onError: () => {
      setCheckoutError("No fue posible iniciar el pago. Inténtalo nuevamente.");
    },
  });
  const onSubmit = (courseId: number) => {
    setCheckoutError(null);
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
      {checkoutError ? (
        <p role="alert" className="mb-6 text-sm text-destructive">
          {checkoutError}
        </p>
      ) : null}
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
