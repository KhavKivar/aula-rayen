import {
  AlertCircle,
  BookOpenCheck,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { AccountMenu } from "@/features/auth/components/account-menu";
import { getCourses } from "@/features/course-dashboard/api/get-courses";
import { CourseCatalog } from "@/features/course-dashboard/components/course-catalog";
import { CourseManagementPanel } from "@/features/course-management/components/course-management-panel";

type Tab = "catalog" | "manage";

export function CourseDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  return (
    <main className="min-h-svh overflow-x-clip bg-[#f7f4ec] text-[#294944]">
      <header className="border-b border-[#d9dfd8] bg-[#fffdf8]/95">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="font-heading text-xl font-semibold tracking-[-0.03em]"
          >
            Aula Rayen
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-[#e7efe9] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#3d655d] sm:inline-flex">
              <BookOpenCheck size={15} aria-hidden="true" /> Mi espacio
            </span>
            <AccountMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#294944] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 right-[18%] h-48 w-48 rounded-full bg-[#d98968]/20 blur-2xl" />
          </div>
          <div className="relative max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f0c972]">
              <Sparkles size={15} aria-hidden="true" /> Formación para tu práctica
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Cursos disponibles
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Elige una experiencia y descubre herramientas listas para llevar a
              tus sesiones y talleres.
            </p>
          </div>
        </section>

        <div className="mt-10 sm:mt-12">
          <div
            role="tablist"
            aria-label="Secciones del dashboard"
            className="inline-flex rounded-full border border-[#d9dfd8] bg-[#fffdf8] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "catalog"}
              aria-controls="panel-catalog"
              id="tab-catalog"
              onClick={() => setActiveTab("catalog")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294944] focus-visible:ring-offset-2 ${
                activeTab === "catalog"
                  ? "bg-[#294944] text-white shadow"
                  : "text-[#294944] hover:bg-[#f7f4ec]"
              }`}
            >
              Ver cursos
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "manage"}
              aria-controls="panel-manage"
              id="tab-manage"
              onClick={() => setActiveTab("manage")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294944] focus-visible:ring-offset-2 ${
                activeTab === "manage"
                  ? "bg-[#294944] text-white shadow"
                  : "text-[#294944] hover:bg-[#f7f4ec]"
              }`}
            >
              Gestionar cursos
            </button>
          </div>

          <div className="mt-8">
            {activeTab === "catalog" ? (
              <div
                id="panel-catalog"
                role="tabpanel"
                aria-labelledby="tab-catalog"
              >
                {coursesQuery.isPending ? (
                  <div
                    role="status"
                    className="flex items-center justify-center gap-3 rounded-[2rem] border border-[#d9dfd8] bg-[#fffdf8] px-6 py-16 text-[#62716d]"
                  >
                    <LoaderCircle
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Cargando cursos…
                  </div>
                ) : coursesQuery.isError ? (
                  <div
                    role="alert"
                    className="flex items-center justify-center gap-3 rounded-[2rem] border border-[#e4c5b9] bg-[#fff8f4] px-6 py-16 text-[#934d3b]"
                  >
                    <AlertCircle aria-hidden="true" />
                    No fue posible cargar los cursos. Inténtalo nuevamente.
                  </div>
                ) : (
                  <CourseCatalog courses={coursesQuery.data} />
                )}
              </div>
            ) : (
              <div
                id="panel-manage"
                role="tabpanel"
                aria-labelledby="tab-manage"
              >
                <CourseManagementPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
