import { Link } from "@tanstack/react-router";

import { INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/config/seo";
import { siteContent } from "@/config/static-content";

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-container home-footer__grid">
        <div>
          <p className="home-footer__brand">{siteContent.professional.name}</p>
          <p>Psicóloga clínica y arteterapeuta · Iquique, Chile</p>
          <p className="home-footer__links">
            <Link to="/psicologa-iquique">Psicóloga en Iquique</Link>
            <Link to="/sobre-pamela-rayen">Sobre mí</Link>
          </p>
        </div>
        <div>
          <p className="home-footer__links">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              WhatsApp {WHATSAPP_DISPLAY}
              <span className="sr-only"> (se abre en un sitio externo)</span>
            </a>
            {INSTAGRAM_URL ? (
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                Instagram {siteContent.social.instagramHandle}
                <span className="sr-only"> (se abre en un sitio externo)</span>
              </a>
            ) : null}
          </p>
        </div>
      </div>
      <p className="home-container home-footer__legal">
        © {new Date().getFullYear()} · {siteContent.professional.name}
      </p>
    </footer>
  );
}
