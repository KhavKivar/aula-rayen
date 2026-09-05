import { ArrowUpRight, Check } from "lucide-react";
import { siteContent } from "@/config/static-content";
export function LandingProfessional() {
  return (
    <section
      id="profesional"
      className="page-container scroll-mt-8 pb-16 lg:pb-24"
    >
      <div className="grid gap-10 rounded-[2rem] bg-secondary p-6 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16 lg:p-14">
        <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[10rem_10rem_1.5rem_1.5rem] bg-clay">
          <img
            src={siteContent.assets.profileImageUrl}
            alt={siteContent.assets.profileImageAlt}
            width={430}
            height={538}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <div>
          <p className="section-kicker">
            Hola, soy {siteContent.professional.shortName}
          </p>
          <h2 className="section-title mt-4">
            La conexión humana es el punto de partida.
          </h2>
          {siteContent.professional.biography.map((paragraph) => (
            <p key={paragraph} className="mt-5 leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {siteContent.professional.credentials.map((credential) => (
              <li
                key={credential}
                className="flex items-start gap-2 text-xs leading-5"
              >
                <Check
                  size={15}
                  className="mt-0.5 shrink-0 text-terracotta"
                  aria-hidden="true"
                />
                {credential}
              </li>
            ))}
          </ul>
          <a href="#agenda" className="text-link mt-8">
            Conversemos <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
