import { faqs } from "@/config/static-content";

export const visibleFaqs = [
  {
    question: "¿Cómo puedo agendar una primera hora?",
    answer:
      "Puedes escribirme por WhatsApp o Instagram para consultar disponibilidad y acordar la fecha y modalidad de atención, online o presencial en Iquique.",
  },
  {
    question: "¿Necesito saber qué me pasa antes de consultar?",
    answer:
      "No necesitas tener todas las respuestas. Podemos conversar sobre lo que te preocupa y explorar juntos qué tipo de acompañamiento necesitas.",
  },
  ...faqs,
];

const questions = visibleFaqs;

export function LandingFaq() {
  return (
    <section
      id="preguntas"
      className="page-container section-space scroll-mt-8"
    >
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="section-kicker">Antes de comenzar</p>
          <h2 className="section-title mt-4">Preguntas frecuentes</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {questions.map((faq, index) => (
            <details
              key={faq.question}
              className="group py-6"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-xl font-normal text-foreground marker:content-none">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-2xl font-light transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
