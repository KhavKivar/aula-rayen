import {
  ArrowDown,
  ArrowUpRight,
  Brush,
  Camera,
  Check,
  Layers3,
  LockKeyhole,
  PencilRuler,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  benefits,
  courses,
  credentials,
  faqs,
  methodSteps,
  siteContent,
} from "@/config/static-content";

const profilePhoto =
  "/profile-placeholder.svg";

function ExternalInstagramLink({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={siteContent.instagramUrl}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span className="sr-only"> (se abre en un sitio externo)</span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-white/15 text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <a
            href="#inicio"
            className="font-heading text-xl font-semibold tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {siteContent.brandName}
          </a>

          <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="flex items-center gap-7 text-sm text-white/80">
              <li>
                <a className="transition hover:text-white" href="#cursos">
                  Cursos
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#metodologia">
                  Metodología
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#elena">
                  Elena
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#preguntas">
                  Preguntas
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-10 items-center rounded-full bg-[#f0c972] px-4 py-2 text-sm font-semibold text-[#263c38] transition hover:bg-[#f7d990] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
        <nav
          aria-label="Navegación móvil"
          className="border-t border-white/10 px-5 py-2 md:hidden"
        >
          <ul className="mx-auto flex max-w-md justify-between text-xs font-medium text-white/75">
            <li><a className="block py-1" href="#cursos">Cursos</a></li>
            <li><a className="block py-1" href="#metodologia">Método</a></li>
            <li><a className="block py-1" href="#elena">Elena</a></li>
            <li><a className="block py-1" href="#preguntas">FAQ</a></li>
          </ul>
        </nav>
      </header>

      <section
        id="inicio"
        className="relative isolate min-h-[760px] overflow-hidden bg-[#294944] pb-20 pt-40 text-white sm:pt-44 lg:min-h-[820px] lg:pb-28"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-52 h-[620px] w-[620px] rounded-full border border-white/10" />
          <div className="absolute -right-24 -top-36 h-[430px] w-[430px] rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(18,50,45,.5),transparent)]" />
          <div className="absolute bottom-20 right-[10%] h-24 w-24 rotate-12 rounded-[2.5rem_1rem_2.5rem_1rem] bg-[#d88968]/30 blur-sm" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:px-12">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c972] sm:text-sm">
              <span className="h-px w-8 bg-[#f0c972]" />
              {siteContent.eyebrow}
            </p>
            <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              Talleres con propósito,
              <span className="mt-2 block font-serif font-normal italic text-[#f2dca8]">
                listos para llevar a la práctica.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              {siteContent.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#cursos"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f0c972] px-6 py-3 text-sm font-semibold text-[#263c38] transition hover:-translate-y-0.5 hover:bg-[#f7d990] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Explorar cursos <ArrowDown aria-hidden="true" size={17} />
              </a>
              <ExternalInstagramLink className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <Camera aria-hidden="true" size={17} /> Ver trabajo de Elena
              </ExternalInstagramLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative mx-auto aspect-[4/5] max-w-[430px] overflow-hidden rounded-[9rem_9rem_2rem_2rem] border border-white/15 bg-[#e8d9bb] shadow-2xl shadow-black/20">
              <Image
                src={profilePhoto}
                alt="Elena Montes, psicóloga y creadora de Aula Rayen"
                fill
                priority
                sizes="(max-width: 1024px) 430px, 36vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d3935]/95 via-[#1d3935]/60 to-transparent px-7 pb-7 pt-24">
                <p className="text-sm font-semibold text-[#f0c972]">Ps. Elena Montes</p>
                <p className="mt-1 text-sm text-white/75">Psicología · Arteterapia · Talleres</p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-0 rounded-2xl border border-white/15 bg-[#345953] px-5 py-4 shadow-xl sm:-left-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0c972] text-[#294944]">
                  <Sparkles aria-hidden="true" size={19} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55">Enfoque</p>
                  <p className="mt-0.5 text-sm font-semibold">Humano, creativo y aplicable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dfe6df] bg-[#f7f4ec] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {["Formación con fundamento", "Dinámicas paso a paso", "Material editable"].map((item) => (
            <div key={item} className="flex items-center justify-center gap-3 text-center text-sm font-semibold text-[#35544e]">
              <Check aria-hidden="true" className="text-[#c66f51]" size={18} />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fffdf8] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="section-kicker">Creado para tu práctica</p>
              <h2 className="section-title mt-4">Tu experiencia clínica ya es valiosa. No tienes que crear cada taller desde cero.</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-[#dfe6df] bg-[#dfe6df] sm:grid-cols-3">
              {benefits.map((benefit) => (
                <article key={benefit.number} className="bg-[#fffdf8] p-7 sm:min-h-64">
                  <span className="font-serif text-3xl italic text-[#c66f51]">{benefit.number}</span>
                  <h3 className="mt-12 font-heading text-lg font-semibold leading-snug text-[#294944]">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#62716d]">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cursos" className="scroll-mt-8 bg-[#f1eadc] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker">Primer lanzamiento</p>
              <h2 className="section-title mt-4 max-w-2xl">Una metodología completa, no solo una carpeta de recursos.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#62716d]">
              Cada curso conecta el porqué, el cómo y los materiales para que puedas facilitar con seguridad y criterio profesional.
            </p>
          </div>

          <div className="mt-12">
            {courses.map((course) => (
              <article key={course.id} className="overflow-hidden rounded-[2rem] bg-[#fffdf8] shadow-[0_24px_80px_rgba(61,76,71,.1)]">
                <div className="grid lg:grid-cols-[.82fr_1.18fr]">
                  <div className="relative isolate flex min-h-[340px] items-end overflow-hidden bg-[#d98968] p-8 text-white sm:p-10">
                    <div aria-hidden="true" className="absolute inset-0 -z-10">
                      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#f0c972]/65" />
                      <div className="absolute left-12 top-14 h-36 w-36 rotate-12 rounded-[45%_55%_42%_58%] bg-[#294944]/85" />
                      <div className="absolute bottom-12 right-12 h-40 w-28 -rotate-12 rounded-[50%_45%_60%_40%] bg-[#f4dfb3]/80" />
                      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 500 400" role="presentation">
                        <path d="M-20 330C100 190 160 380 290 210S470 100 540 180" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M-10 365C110 225 190 400 320 240S480 135 530 220" fill="none" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <span className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
                        {course.category}
                      </span>
                      <Brush aria-hidden="true" className="mt-8" size={38} strokeWidth={1.5} />
                      <p className="mt-3 text-sm text-white/75">Expresión · juego · regulación emocional</p>
                    </div>
                  </div>

                  <div className="p-8 sm:p-10 lg:p-12">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-[#f4dfb3] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#704d28]">
                        Próximamente
                      </span>
                      <span className="text-sm font-medium text-[#62716d]">{course.priceLabel}</span>
                    </div>
                    <h3 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.035em] text-[#294944] sm:text-4xl">{course.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-[#c66f51]">{course.audience}</p>
                    <p className="mt-5 max-w-2xl leading-7 text-[#62716d]">{course.summary}</p>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {course.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#394d48]">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#dce9e3] text-[#294944]">
                            <Check aria-hidden="true" size={13} strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#dfe6df] pt-7">
                      <span aria-disabled="true" className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full bg-[#dfe6df] px-5 text-sm font-semibold text-[#65716e]">
                        Inscripciones próximamente
                      </span>
                      <ExternalInstagramLink className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#294944] underline decoration-[#d98968] decoration-2 underline-offset-4 hover:text-[#c66f51]">
                        Seguir novedades <ArrowUpRight aria-hidden="true" size={16} />
                      </ExternalInstagramLink>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodologia" className="scroll-mt-8 bg-[#294944] py-24 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="section-kicker text-[#f0c972]">De la formación a la sala</p>
              <h2 className="section-title mt-4 text-white">Una ruta para facilitar con intención.</h2>
              <p className="mt-6 leading-7 text-white/65">
                No se trata de repetir una actividad. Se trata de comprenderla, adaptarla y sostenerla con presencia profesional.
              </p>
            </div>
            <ol className="divide-y divide-white/15 border-y border-white/15">
              {methodSteps.map((step, index) => (
                <li key={step.label} className="grid gap-4 py-8 sm:grid-cols-[70px_1fr_1fr] sm:items-start">
                  <span className="font-serif text-3xl italic text-[#f0c972]">0{index + 1}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f0c972]">{step.label}</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-white/62">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 rounded-[2rem] border border-[#dfe6df] bg-[#f7f4ec] p-8 sm:p-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <p className="section-kicker">Experiencia en acción</p>
              <h2 className="section-title mt-4">Conoce el trabajo de Elena como tallerista.</h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#62716d]">
                Mientras seleccionamos una galería editorial de talleres autorizados, puedes revisar en Instagram sus procesos creativos, actividades y recursos profesionales.
              </p>
              <ExternalInstagramLink className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#294944] px-5 text-sm font-semibold text-white transition hover:bg-[#355b54] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#294944]">
                <Camera aria-hidden="true" size={17} /> Ir a @professional_demo <ArrowUpRight aria-hidden="true" size={16} />
              </ExternalInstagramLink>
            </div>
            <div aria-hidden="true" className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-[2rem_1rem_2rem_1rem] bg-[#d98968] p-6 text-white"><Brush size={34} /></div>
              <div className="aspect-square translate-y-7 rounded-[1rem_2rem_1rem_2rem] bg-[#f0c972] p-6 text-[#294944]"><Layers3 size={34} /></div>
              <div className="aspect-square -translate-y-2 rounded-[1rem_2rem_1rem_2rem] bg-[#dce9e3] p-6 text-[#294944]"><PencilRuler size={34} /></div>
              <div className="aspect-square translate-y-5 rounded-[2rem_1rem_2rem_1rem] bg-[#294944] p-6 text-[#f0c972]"><Sparkles size={34} /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="elena" className="scroll-mt-8 bg-[#e6eee9] py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-12">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem_7rem_2rem_2rem] bg-[#d9c9aa]">
            <Image
              src={profilePhoto}
              alt="Retrato profesional de la psicóloga Elena Montes"
              fill
              sizes="(max-width: 1024px) 430px, 34vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="section-kicker">Quien está detrás</p>
            <h2 className="section-title mt-4">Ps. Elena Montes</h2>
            <p className="mt-6 text-lg leading-8 text-[#425852]">
              Psicóloga y Formación de posgrado de demostración, con experiencia profesional de demostración. Su trabajo integra psicoterapia, psicoeducación y recursos creativos desde un enfoque inclusivo, respetuoso y atento a cada etapa del desarrollo.
            </p>
            <p className="mt-4 leading-7 text-[#62716d]">
              En Aula Rayen transforma su experiencia diseñando y facilitando talleres en rutas prácticas para que otros profesionales puedan crear espacios grupales cuidados, claros y significativos.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {credentials.map((credential) => (
                <li key={credential} className="flex items-start gap-3 text-sm font-medium text-[#394d48]">
                  <Check aria-hidden="true" className="mt-0.5 shrink-0 text-[#c66f51]" size={17} />
                  {credential}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f1eadc] text-[#c66f51]">
                <LockKeyhole aria-hidden="true" size={22} />
              </span>
              <p className="section-kicker mt-6">Licencia profesional</p>
              <h2 className="section-title mt-4">Úsalo, adáptalo y hazlo parte de tu práctica.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-3xl border border-[#cfe0d7] bg-[#f1f7f3] p-7">
                <h3 className="font-heading text-lg font-semibold text-[#294944]">Sí puedes</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-[#52655f]">
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-[#397160]" size={16} />Usar el taller repetidamente en tu práctica.</li>
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-[#397160]" size={16} />Editar los materiales y sumar tu identidad visual.</li>
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-[#397160]" size={16} />Imprimir y entregar recursos a participantes.</li>
                </ul>
              </article>
              <article className="rounded-3xl border border-[#ead5ca] bg-[#fcf3ed] p-7">
                <h3 className="font-heading text-lg font-semibold text-[#704737]">No puedes</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6f5a52]">
                  <li>Revender el curso o sus archivos originales.</li>
                  <li>Compartir los editables con otros profesionales.</li>
                  <li>Publicar los recursos como si fueran de libre descarga.</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="preguntas" className="scroll-mt-8 bg-[#f7f4ec] py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-20 lg:px-12">
          <div>
            <p className="section-kicker">Antes de comenzar</p>
            <h2 className="section-title mt-4">Preguntas frecuentes</h2>
          </div>
          <div className="divide-y divide-[#ccd8d2] border-y border-[#ccd8d2]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-lg font-semibold text-[#294944] marker:content-none">
                  {faq.question}
                  <span aria-hidden="true" className="text-2xl font-light transition group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-7 text-[#62716d]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#d98968] px-5 py-20 text-center text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Estamos preparando el primer curso</p>
          <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Que tu próximo taller empiece con una ruta clara.</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/78">Sigue a Elena en Instagram para conocer el proceso y enterarte cuando se abran las inscripciones.</p>
          <ExternalInstagramLink className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#294944] px-6 text-sm font-semibold text-white transition hover:bg-[#203d38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <Camera aria-hidden="true" size={18} /> Seguir en Instagram <ArrowUpRight aria-hidden="true" size={16} />
          </ExternalInstagramLink>
        </div>
      </section>

      <footer className="bg-[#1e3733] px-5 py-10 text-white/65 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-4">
          <div>
            <p className="font-heading text-lg font-semibold text-white">{siteContent.brandName}</p>
            <p className="mt-1 text-xs">Formación creada por Ps. Elena Montes</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link className="hover:text-white" href="/login">Ingresar</Link>
            <Link className="hover:text-white" href="/register">Crear cuenta</Link>
            <ExternalInstagramLink className="inline-flex items-center gap-1 hover:text-white">
              Instagram <ArrowUpRight aria-hidden="true" size={14} />
            </ExternalInstagramLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
