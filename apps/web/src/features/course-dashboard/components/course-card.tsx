import { ArrowRight, BookOpen, Clock3, CreditCard } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { FlowerMark } from "@/components/brand";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseCatalogItem } from "@aula-rayen/contracts/course";

const priceFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const accentClasses = ["bg-clay", "bg-sage", "bg-secondary"] as const;

function getAccentClass(id: number) {
  return accentClasses[id % accentClasses.length];
}

type CourseCardProps = {
  course: CourseCatalogItem;
  onClickWebPay?: (courseId: number) => void;
};

export function CourseCard({ course, onClickWebPay }: CourseCardProps) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_16px_45px_rgba(46,68,62,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(46,68,62,.14)]">
      <div
        className={cn(
          "relative isolate min-h-44 overflow-hidden p-6 text-foreground",
          getAccentClass(course.id),
        )}
      >
        <FlowerMark className="absolute -right-5 bottom-0 -z-10 size-40 rotate-12 text-foreground/10 transition-transform duration-500 group-hover:rotate-0" />
        <span className="inline-flex rounded-full border border-foreground/15 bg-card/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
          Curso online
        </span>
        <div className="mt-14 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 size={16} aria-hidden="true" />
          {course.duration}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-heading text-2xl font-normal leading-tight tracking-[-0.025em] text-foreground">
          {course.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Valor del curso
          </p>
          <p className="mt-1 font-heading text-3xl font-normal text-foreground">
            {priceFormatter.format(course.price)}
          </p>
          {course.hasAccess ? (
            <Link
              to="/courses/$courseId"
              params={{ courseId: String(course.id) }}
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-5 min-h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90",
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
              className="mt-5 min-h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
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
