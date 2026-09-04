import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { CourseCard } from "@/features/course-dashboard/components/course-card";
import type { Course } from "@/features/course-dashboard/types/course";
import { useWebpayCheckout } from "@/features/course-dashboard/api/use-webpay-checkout";

export function CourseCatalog({ courses }: { courses: readonly Course[] }) {
  const { checkoutFormRef, checkoutError, startCheckout } =
    useWebpayCheckout();

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={
          <BookOpen
            className="mx-auto text-[#c66f51]"
            size={36}
            aria-hidden="true"
          />
        }
        title="No hay cursos disponibles por ahora"
        titleId="empty-catalog-title"
        titleClassName="mt-5"
        description="Estamos preparando nuevas experiencias. Vuelve pronto para conocerlas."
      />
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
            onClickWebPay={startCheckout}
          />
        ))}
      </section>

      <form
        style={{ display: "none" }}
        ref={checkoutFormRef}
        action="/"
        method="POST"
      >
        <input type="hidden" name="token_ws" />
      </form>
    </>
  );
}
