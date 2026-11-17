import { siteContent } from "@/config/static-content";
import { BookingLink, WhatsAppLink } from "@/features/landing/home/booking-link";
import { StudioScene } from "@/features/landing/home/illustrations";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__grid home-container">
        <div className="home-hero__text">
          <p className="home-kicker">Psicóloga clínica y arteterapeuta · Iquique y online</p>
          <h1 id="home-hero-title">
            Lo que sientes también se puede{" "}
            <span className="home-scribble">
              dibujar
              <svg viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true">
                <path
                  pathLength={1}
                  d="M4 16 Q 30 4 56 14 T 108 14 T 160 13 T 216 10"
                />
              </svg>
            </span>
            .
          </h1>
          <p className="home-hero__lead">
            Te acompaño con psicoterapia y arte. No necesitas saber dibujar: lo
            importante es lo que sientes.
          </p>
          <p className="home-actions home-hero__actions">
            <BookingLink className="home-button home-button--large" />
            <WhatsAppLink className="home-button home-button--outline home-button--large" />
          </p>
        </div>

        <StudioScene className="home-hero__drawing" mode="mount" />

        <div className="home-summary">
          <img
            className="home-summary__photo"
            src={siteContent.assets.profileImageUrl}
            alt={siteContent.assets.profileImageAlt}
            width={64}
            height={64}
          />
          <div>
            <p className="home-summary__name">{siteContent.professional.name}</p>
            <p className="home-summary__role">Psicóloga clínica y comunitaria</p>
          </div>
          <ul className="home-summary__details">
            <li>
              <span aria-hidden="true">📍</span> Presencial en Iquique u online
            </li>
            <li>
              <span aria-hidden="true">🧒</span> Niñas, niños, juventudes, personas adultas y familias
            </li>
            <li>
              <span aria-hidden="true">🕒</span> Horarios en hora de Chile
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
