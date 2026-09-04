import { benefits } from "@/config/static-content";

export function LandingBenefits() {
  return (
    <section className="bg-[#fffdf8] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="section-kicker">Creado para tu práctica</p>
            <h2 className="section-title mt-4">
              Tu experiencia clínica ya es valiosa. No tienes que crear cada
              taller desde cero.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#dfe6df] bg-[#dfe6df] sm:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.number}
                className="bg-[#fffdf8] p-7 sm:min-h-64"
              >
                <span className="font-serif text-3xl italic text-[#c66f51]">
                  {benefit.number}
                </span>
                <h3 className="mt-12 font-heading text-lg font-semibold leading-snug text-[#294944]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#62716d]">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
