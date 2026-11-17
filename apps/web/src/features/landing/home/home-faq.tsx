import type { FaqEntry } from "@/config/seo";
import { siteContent } from "@/config/static-content";
import { Marked } from "@/features/landing/home/home-sections";

const hasCalendar = Boolean(siteContent.booking.calendlyUrl);

/** Preguntas visibles en la home; también alimentan el JSON-LD de la ruta. */
export const homeFaqs: readonly FaqEntry[] = [
  {
    question: "¿Cómo agendo una hora?",
    answer: hasCalendar
      ? "Toca «Agendar hora», elige día y hora en el calendario y deja tus datos. Si prefieres, escríbeme por WhatsApp."
      : "Escríbeme por WhatsApp y coordinamos el día, la hora y la modalidad, presencial en Iquique u online.",
  },
  {
    question: "¿Necesito saber qué me pasa?",
    answer:
      "No. Lo conversamos juntas o juntos y vemos qué acompañamiento necesitas.",
  },
  {
    question: "¿Tengo que saber dibujar?",
    answer:
      "No. No importa que quede bonito, importa lo que expresa. Y el arte se usa solo si te hace sentido.",
  },
  {
    question: "¿Puedo cambiar o cancelar mi hora?",
    answer: hasCalendar
      ? "Sí, desde el enlace del correo de confirmación."
      : "Sí. Avísame por WhatsApp lo antes posible y buscamos otro horario.",
  },
  {
    question: "¿La sesión online funciona igual?",
    answer: "Sí. Solo necesitas un lugar tranquilo y buena conexión.",
  },
];

export function HomeFaq() {
  return (
    <section
      className="home-sheet home-sheet--paper"
      id="preguntas"
      aria-labelledby="home-faq-title"
    >
      <div className="home-container home-narrow">
        <h2 className="home-title" id="home-faq-title">
          Antes de <Marked color="mustard">agendar</Marked>
        </h2>
        {homeFaqs.map((faq) => (
          <details key={faq.question} className="home-faq">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
