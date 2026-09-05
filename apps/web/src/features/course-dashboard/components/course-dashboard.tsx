import {
  AlertCircle,
  BookOpenCheck,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Brand, FlowerMark } from "@/components/brand";
import { CourseCatalog } from "@/features/course-dashboard/components/course-catalog";
import { courseDashboardQueries } from "@/features/course-dashboard/api/queries";

function CatalogContent() {
  const { data: courses } = useSuspenseQuery(courseDashboardQueries.courses);

  return <CourseCatalog courses={courses} />;
}

export function CourseDashboard({
  accountMenu,
  isAdmin = false,
}: {
  accountMenu: ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <main className="min-h-svh overflow-x-clip bg-background text-foreground">
      <header className="border-b border-border bg-card/95">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="font-heading text-xl font-semibold tracking-[-0.03em]"
          >
            <Brand classroom />
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Link
                to="/dashboard/admin"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-3 text-xs font-medium text-foreground transition hover:bg-secondary"
              >
                <ShieldCheck size={16} aria-hidden="true" /> Administrar
              </Link>
            ) : null}
            <span className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary sm:inline-flex">
              <BookOpenCheck size={15} aria-hidden="true" /> Mi espacio
            </span>
            {accountMenu}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <section className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-secondary px-7 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_220px] lg:px-14">
          <div>
            <p className="section-kicker flex items-center gap-2">
              <Sparkles size={15} aria-hidden="true" /> Formación para tu
              práctica
            </p>
            <h1 className="mt-5 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
              Cursos disponibles
            </h1>
            <p className="mt-5 max-w-xl leading-8 text-muted-foreground">
              Nuevas ideas para seguir creciendo. Elige una experiencia y
              descubre herramientas para tus sesiones y talleres.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="hidden aspect-square items-center justify-center rounded-t-full rounded-b-3xl bg-sage lg:flex"
          >
            <FlowerMark className="size-32 text-terracotta" />
          </div>
        </section>

        <div className="mt-10 sm:mt-12">
          <ErrorBoundary
            fallback={
              <div
                role="alert"
                className="flex items-center justify-center gap-3 rounded-[2rem] border border-[#e4c5b9] bg-[#fff8f4] px-6 py-16 text-[#934d3b]"
              >
                <AlertCircle aria-hidden="true" />
                No fue posible cargar los cursos. Inténtalo nuevamente.
              </div>
            }
          >
            <Suspense
              fallback={
                <div
                  role="status"
                  className="flex items-center justify-center gap-3 rounded-[2rem] border border-border bg-card px-6 py-16 text-muted-foreground"
                >
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                  Cargando cursos…
                </div>
              }
            >
              <CatalogContent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
