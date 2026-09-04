import { methodSteps } from "@/config/static-content";

export function LandingMethod() {
  return (
    <section
      id="metodologia"
      className="scroll-mt-8 bg-[#294944] py-24 text-white sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div>
            <p className="section-kicker text-[#f0c972]">
              De la formación a la sala
            </p>
            <h2 className="section-title mt-4 text-white">
              Una ruta para facilitar con intención.
            </h2>
            <p className="mt-6 leading-7 text-white/65">
              No se trata de repetir una actividad. Se trata de comprenderla,
              adaptarla y sostenerla con presencia profesional.
            </p>
          </div>
          <ol className="divide-y divide-white/15 border-y border-white/15">
            {methodSteps.map((step, index) => (
              <li
                key={step.label}
                className="grid gap-4 py-8 sm:grid-cols-[70px_1fr_1fr] sm:items-start"
              >
                <span className="font-serif text-3xl italic text-[#f0c972]">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f0c972]">
                    {step.label}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-white/62">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
