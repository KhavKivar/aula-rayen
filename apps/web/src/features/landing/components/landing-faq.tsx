import { faqs } from "@/config/static-content";

export function LandingFaq() {
  return (
    <section
      id="preguntas"
      className="scroll-mt-8 bg-[#f7f4ec] py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-20 lg:px-12">
        <div>
          <p className="section-kicker">Antes de comenzar</p>
          <h2 className="section-title mt-4">Preguntas frecuentes</h2>
        </div>
        <div className="divide-y divide-[#ccd8d2] border-y border-[#ccd8d2]">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group py-6"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-lg font-semibold text-[#294944] marker:content-none">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-2xl font-light transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-7 text-[#62716d]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
