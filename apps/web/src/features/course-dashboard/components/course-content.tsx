import {
  AlertCircle,
  ArrowLeft,
  Download,
  LoaderCircle,
  Play,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { courseDashboardQueries } from "@/features/course-dashboard/api/queries";

export function CourseContent({ courseId }: { courseId: number }) {
  const courseQuery = useQuery(courseDashboardQueries.courseDetail(courseId));

  if (courseQuery.isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-background px-5 text-foreground">
        <div className="flex items-center gap-3" role="status">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Cargando tu curso…
        </div>
      </main>
    );
  }

  if (courseQuery.isError) {
    return (
      <main className="grid min-h-svh place-items-center bg-background px-5 text-[#934d3b]">
        <div className="max-w-md text-center" role="alert">
          <AlertCircle className="mx-auto" aria-hidden="true" size={36} />
          <h1 className="mt-4 font-heading text-2xl font-semibold">
            No fue posible abrir este curso
          </h1>
          <p className="mt-2 leading-7">
            Verifica que tengas acceso e inténtalo nuevamente desde tu panel.
          </p>
          <Link
            to="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "mt-6",
            })}
          >
            <ArrowLeft aria-hidden="true" /> Volver al panel
          </Link>
        </div>
      </main>
    );
  }

  const course = courseQuery.data;

  return (
    <main className="min-h-svh bg-background px-5 py-8 text-foreground sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          aria-label="Psicóloga Rayen, inicio"
          className="mb-8 block w-fit"
        >
          <Brand classroom />
        </Link>
        <Link
          to="/dashboard"
          className={buttonVariants({ variant: "ghost", className: "mb-8" })}
        >
          <ArrowLeft aria-hidden="true" /> Volver al panel
        </Link>

        <header className="rounded-[2rem] bg-secondary px-6 py-10 text-foreground sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            Curso online
          </p>
          <h1 className="mt-3 font-heading text-4xl font-normal tracking-[-0.035em] sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            {course.description}
          </p>
        </header>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-[0_16px_45px_rgba(46,68,62,.08)] sm:p-7">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-normal">
            <Play aria-hidden="true" size={20} /> Video del curso
          </h2>
          <video
            className="mt-5 w-full rounded-2xl bg-black"
            controls
            src={course.videoLink}
            aria-label="Video del curso"
          >
            Tu navegador no puede reproducir este video.
          </video>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 sm:p-7">
          <h2 className="font-heading text-2xl font-normal">
            Material del curso
          </h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Descarga los recursos para acompañar tu estudio y práctica.
          </p>
          <a
            href={course.fileLink}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ className: "mt-5" })}
          >
            <Download aria-hidden="true" /> Abrir material
          </a>
        </section>
      </div>
    </main>
  );
}
