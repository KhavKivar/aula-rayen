import { ArrowUpRight, Heart, Sparkles, Sun } from "lucide-react";
const services = [
  {
    icon: Sun,
    title: "Psicología infantojuvenil",
    description:
      "Un espacio de escucha y expresión para acompañar las emociones y los desafíos de niños, niñas y adolescentes.",
    color: "bg-sage",
  },
  {
    icon: Heart,
    title: "Acompañamiento familiar",
    description:
      "Comprender lo que sucede en familia y construir herramientas para relacionarse desde el cuidado.",
    color: "bg-card",
  },
  {
    icon: Sparkles,
    title: "Arteterapia y talleres",
    description:
      "Explorar el mundo emocional a través del arte, el juego y la creatividad, respetando cada proceso.",
    color: "bg-clay",
  },
];
export function LandingServices() {
  return (
    <section id="atencion" className="page-container section-space scroll-mt-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Distintas formas de acompañarte</p>
          <h2 className="section-title mt-4 max-w-xl">
            No tienes que tener todas las respuestas.
          </h2>
        </div>
        <p className="max-w-sm leading-7 text-muted-foreground">
          Podemos encontrar un punto de partida, con escucha, cercanía y espacio
          para ser tú.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {services.map(({ icon: Icon, title, description, color }, index) => (
          <article
            key={title}
            className={`flex flex-col rounded-[1.75rem] border border-border/60 p-7 lg:p-9 ${color}`}
          >
            <div className="mb-12 flex items-center justify-between">
              <Icon size={30} strokeWidth={1.3} aria-hidden="true" />
              <span className="text-xs text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <h3 className="font-heading text-3xl leading-tight tracking-tight">
              {title}
            </h3>
            <p className="mb-8 mt-4 text-sm leading-7 text-muted-foreground">
              {description}
            </p>
            <a
              href="#agenda"
              className="text-link mt-auto justify-between border-t border-foreground/15 pt-5"
            >
              Conversemos <ArrowUpRight size={18} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
