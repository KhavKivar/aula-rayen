import { ArrowUpRight, Brush, Check } from "lucide-react";

import { courses } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";

export function LandingCourses() {
  return (
    <section id="cursos" className="scroll-mt-8 bg-[#f1eadc] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Primer lanzamiento</p>
            <h2 className="section-title mt-4 max-w-2xl">
              Una metodología completa, no solo una carpeta de recursos.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#62716d]">
            Cada curso conecta el porqué, el cómo y los materiales para que
            puedas facilitar con seguridad y criterio profesional.
          </p>
        </div>

        <div className="mt-12">
          {courses.map((course) => (
            <article
              key={course.id}
              className="overflow-hidden rounded-[2rem] bg-[#fffdf8] shadow-[0_24px_80px_rgba(61,76,71,.1)]"
            >
              <div className="grid lg:grid-cols-[.82fr_1.18fr]">
                <div className="relative isolate flex min-h-[340px] items-end overflow-hidden bg-[#d98968] p-8 text-white sm:p-10">
                  <div aria-hidden="true" className="absolute inset-0 -z-10">
                    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#f0c972]/65" />
                    <div className="absolute left-12 top-14 h-36 w-36 rotate-12 rounded-[45%_55%_42%_58%] bg-[#294944]/85" />
                    <div className="absolute bottom-12 right-12 h-40 w-28 -rotate-12 rounded-[50%_45%_60%_40%] bg-[#f4dfb3]/80" />
                    <svg
                      className="absolute inset-0 h-full w-full opacity-30"
                      viewBox="0 0 500 400"
                      role="presentation"
                    >
                      <path
                        d="M-20 330C100 190 160 380 290 210S470 100 540 180"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path
                        d="M-10 365C110 225 190 400 320 240S480 135 530 220"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
                      {course.category}
                    </span>
                    <Brush
                      aria-hidden="true"
                      className="mt-8"
                      size={38}
                      strokeWidth={1.5}
                    />
                    <p className="mt-3 text-sm text-white/75">
                      Expresión · juego · regulación emocional
                    </p>
                  </div>
                </div>

                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f4dfb3] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#704d28]">
                      Próximamente
                    </span>
                    <span className="text-sm font-medium text-[#62716d]">
                      {course.priceLabel}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.035em] text-[#294944] sm:text-4xl">
                    {course.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold text-[#c66f51]">
                    {course.audience}
                  </p>
                  <p className="mt-5 max-w-2xl leading-7 text-[#62716d]">
                    {course.summary}
                  </p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {course.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-[#394d48]"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#dce9e3] text-[#294944]">
                          <Check
                            aria-hidden="true"
                            size={13}
                            strokeWidth={3}
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#dfe6df] pt-7">
                    <span
                      aria-disabled="true"
                      className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full bg-[#dfe6df] px-5 text-sm font-semibold text-[#65716e]"
                    >
                      Inscripciones próximamente
                    </span>
                    <ExternalInstagramLink className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#294944] underline decoration-[#d98968] decoration-2 underline-offset-4 hover:text-[#c66f51]">
                      Seguir novedades{" "}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </ExternalInstagramLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
