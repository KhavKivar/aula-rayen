import { ArrowRight, BookOpen, Clock3, CreditCard } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";

const priceFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const accentClasses = [
  "from-[#d98968] to-[#b85f48]",
  "from-[#3d655d] to-[#294944]",
  "from-[#d6a64e] to-[#b57b32]",
] as const;

function getAccentClass(id: number) {
  return accentClasses[id % accentClasses.length];
}

type CourseCardProps = {
  course: CourseCatalogItem;
  onClickWebPay?: (courseId: number) => void;
};

export function CourseCard({ course, onClickWebPay }: CourseCardProps) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-[#d9dfd8] bg-[#fffdf8] shadow-[0_16px_45px_rgba(46,68,62,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(46,68,62,.14)]">
      <div
        className={cn(
          "relative isolate min-h-44 overflow-hidden bg-gradient-to-br p-6 text-white",
          getAccentClass(course.id),
        )}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full border border-white/25" />
          <div className="absolute -bottom-14 right-8 h-32 w-32 rotate-12 rounded-[45%_55%_42%_58%] bg-white/12" />
          <div className="absolute bottom-5 left-6 h-px w-24 bg-white/35" />
        </div>
        <span className="inline-flex rounded-full border border-white/30 bg-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
          Curso online
        </span>
        <div className="mt-14 flex items-center gap-2 text-sm text-white/80">
          <Clock3 size={16} aria-hidden="true" />
          {course.duration}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-heading text-xl font-semibold leading-tight tracking-[-0.025em] text-[#294944]">
          {course.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#62716d]">
          {course.description}
        </p>

        <div className="mt-6 border-t border-[#e5e8e2] pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7c8985]">
            Valor del curso
          </p>
          <p className="mt-1 font-heading text-2xl font-semibold text-[#294944]">
            {priceFormatter.format(course.price)}
          </p>
          {course.hasAccess ? (
            <Link
              to="/courses/$courseId"
              params={{ courseId: String(course.id) }}
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-5 min-h-11 w-full bg-[#294944] text-[#fffdf8] hover:bg-[#3d655d]",
              })}
              aria-label={`Ver ${course.title}`}
            >
              <BookOpen data-icon="inline-start" aria-hidden="true" />
              Ver curso
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          ) : (
            <Button
              type="button"
              size="lg"
              className="mt-5 min-h-11 w-full bg-[#294944] text-[#fffdf8] hover:bg-[#3d655d] cursor-pointer"
              onClick={() => onClickWebPay?.(course.id)}
              aria-label={`Pagar ${course.title} con Webpay`}
            >
              <CreditCard data-icon="inline-start" aria-hidden="true" />
              Pagar con Webpay
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
