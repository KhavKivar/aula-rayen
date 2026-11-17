import { BookingLink } from "@/features/landing/home/booking-link";

export function HomeHeader() {
  return (
    <header className="home-header">
      <a className="home-header__logo" href="#inicio">
        <img src="/images/rayen/arcoiris.webp" alt="" width={300} height={213} />
        <span className="home-header__brand">
          <span className="home-header__name">Rayén Psicóloga</span>
          <span className="home-header__tagline">Infanto juvenil y adultos</span>
        </span>
      </a>
      <nav className="home-header__nav" aria-label="Secciones">
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#como-trabajo">Cómo trabajo</a>
        <a href="#sobre-rayen">Sobre mí</a>
        <a href="#preguntas">Preguntas</a>
      </nav>
      <BookingLink className="home-button home-button--small" />
    </header>
  );
}
