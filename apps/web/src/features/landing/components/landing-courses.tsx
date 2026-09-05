import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FlowerMark } from "@/components/brand";
import { courses } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";
export function LandingCourses() {
  return (
    <section id="cursos" className="border-y border-border bg-card/60">
      <div className="page-container section-space grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="section-kicker">Aula Rayen · Formación</p>
          <h2 className="section-title mt-4">
            Aprender también es una forma de cuidar.
          </h2>
          <p className="mt-6 max-w-md leading-8 text-muted-foreground">
            Cursos y recursos para profesionales que quieren acompañar con
            creatividad, herramientas prácticas y una mirada sensible.
          </p>
          <Link to="/dashboard" className="text-link mt-8">
            Explorar el aula <ArrowUpRight size={18} />
          </Link>
        </div>
        <div>
          {courses.map((course) => (
            <article
              key={course.id}
              className="overflow-hidden rounded-[1.75rem] border border-border bg-card"
            >
              <div className="flex min-h-44 items-center justify-between gap-8 bg-clay px-8 py-6">
                <div>
                  <p className="text-xs uppercase tracking-[.14em]">
                    {course.category}
                  </p>
                  <p className="mt-4 max-w-xs font-heading text-3xl">
                    Crear. Sentir. Expresar.
                  </p>
                </div>
                <FlowerMark className="size-24 shrink-0 text-terracotta sm:size-32" />
              </div>
              <div className="p-7 sm:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="rounded-full bg-secondary px-3 py-1.5">
                    Próximamente
                  </span>
                  <span className="text-muted-foreground">
                    {course.priceLabel}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-3xl tracking-tight">
                  {course.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {course.summary}
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-5">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-terracotta"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 border-t border-border pt-5">
                  <ExternalInstagramLink className="text-link">
                    Seguir novedades <ArrowUpRight size={16} />
                  </ExternalInstagramLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
