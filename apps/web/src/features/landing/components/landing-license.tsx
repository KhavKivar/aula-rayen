import { Check, LockKeyhole } from "lucide-react";

export function LandingLicense() {
  return (
    <section className="bg-[#fffdf8] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f1eadc] text-[#c66f51]">
              <LockKeyhole aria-hidden="true" size={22} />
            </span>
            <p className="section-kicker mt-6">Licencia profesional</p>
            <h2 className="section-title mt-4">
              Úsalo, adáptalo y hazlo parte de tu práctica.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <article className="rounded-3xl border border-[#cfe0d7] bg-[#f1f7f3] p-7">
              <h3 className="font-heading text-lg font-semibold text-[#294944]">
                Sí puedes
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#52655f]">
                <li className="flex gap-3">
                  <Check className="mt-1 shrink-0 text-[#397160]" size={16} />
                  Usar el taller repetidamente en tu práctica.
                </li>
                <li className="flex gap-3">
                  <Check className="mt-1 shrink-0 text-[#397160]" size={16} />
                  Editar los materiales y sumar tu identidad visual.
                </li>
                <li className="flex gap-3">
                  <Check className="mt-1 shrink-0 text-[#397160]" size={16} />
                  Imprimir y entregar recursos a participantes.
                </li>
              </ul>
            </article>
            <article className="rounded-3xl border border-[#ead5ca] bg-[#fcf3ed] p-7">
              <h3 className="font-heading text-lg font-semibold text-[#704737]">
                No puedes
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6f5a52]">
                <li>Revender el curso o sus archivos originales.</li>
                <li>Compartir los editables con otros profesionales.</li>
                <li>
                  Publicar los recursos como si fueran de libre descarga.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
