import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { INSTAGRAM_URL } from "@/config/seo";
import { siteContent } from "@/config/static-content";
import { BookingLink, WhatsAppLink } from "@/features/landing/home/booking-link";
import {
  CalendarIcon,
  EnvelopeIcon,
  FormIcon,
  SeaScene,
} from "@/features/landing/home/illustrations";

type Marker = "mint" | "mustard" | "red";

/** Palabra resaltada con plumón; la mancha se pinta al aparecer en pantalla. */
export function Marked({ color, children }: { color: Marker; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.add("is-painted");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`home-marker home-marker--${color}`}>
      {children}
    </span>
  );
}

const steps = [
  {
    title: "Elige día y hora",
    text: "Abre el calendario y elige la hora que te acomode.",
    icon: <CalendarIcon />,
  },
  {
    title: "Deja tus datos",
    text: "Solo lo necesario para coordinar la sesión.",
    icon: <FormIcon />,
  },
  {
    title: "Te llega la confirmación",
    text: "Un correo con el día, la hora y el lugar o el enlace.",
    icon: <EnvelopeIcon />,
  },
];

export function BookingSteps() {
  return (
    <section
      className="home-sheet home-sheet--paper home-sheet--first"
      id="como-funciona"
      aria-labelledby="home-steps-title"
    >
      <div className="home-container">
        <h2 className="home-title" id="home-steps-title">
          Tres pasos y <Marked color="mint">listo</Marked>
        </h2>
        <ol className="home-steps">
          {steps.map((step, index) => (
            <li key={step.title} className="home-step">
              <span className="home-step__tab">Paso {index + 1}</span>
              {step.icon}
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="home-center">
          <BookingLink />
        </p>
      </div>
    </section>
  );
}

const audiences = [
  {
    title: "Niñas y niños",
    text: "Jugamos, dibujamos y creamos para expresar lo que sienten.",
    color: "red",
  },
  {
    title: "Adolescentes y juventudes",
    text: "Un espacio seguro para hablar de lo que pasa y crear lazos seguros.",
    color: "mustard",
  },
  {
    title: "Personas adultas",
    text: "Ansiedad, tristeza, estrés o el cansancio de vivir a la carrera. Lo conversamos a tu ritmo.",
    color: "mint",
  },
  {
    title: "Familias",
    text: "Terapia familiar y arteterapia en familia, para entenderse y cuidarse entre todos.",
    color: "lilac",
  },
] as const;

export function AudienceCards() {
  return (
    <section className="home-sheet home-sheet--cream" aria-labelledby="home-audience-title">
      <div className="home-container">
        <h2 className="home-title" id="home-audience-title">
          ¿Para quién es la <Marked color="mustard">hora</Marked>?
        </h2>
        <ul className="home-cards">
          {audiences.map((audience) => (
            <li key={audience.title} className={`home-card home-card--${audience.color}`}>
              <span className="home-tape" aria-hidden="true" />
              <h3>{audience.title}</h3>
              <p>{audience.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ApproachSection() {
  return (
    <section
      className="home-sheet home-sheet--paper"
      id="como-trabajo"
      aria-labelledby="home-approach-title"
    >
      <div className="home-container home-columns home-columns--note">
        <div>
          <h2 className="home-title" id="home-approach-title">
            Conversar, jugar y <Marked color="red">crear</Marked>
          </h2>
          <p className="home-lead">
            En las sesiones conversamos. Y cuando las palabras no alcanzan, usamos
            el arte, el cuerpo y el juego para expresar lo que sentimos.
          </p>
          <ul className="home-points">
            <li>
              <strong>Psicoterapia humanista.</strong> Cada persona tiene su historia
              y su ritmo.
            </li>
            <li>
              <strong>Arteterapia.</strong> No importa que quede bonito, importa lo
              que expresa.
            </li>
            <li>
              <strong>Psicodrama y cuerpo.</strong> En el cuerpo también vive nuestra
              historia.
            </li>
          </ul>
        </div>
        <figure className="home-handnote">
          <span className="home-tape" aria-hidden="true" />
          <blockquote>
            <p>La tristeza no es una enfermedad: es parte de todas las personas.</p>
          </blockquote>
          <figcaption>— Rayen</figcaption>
        </figure>
      </div>
    </section>
  );
}

const artworks = [
  {
    src: "/images/rayen/arte-hazlo-con-miedo.webp",
    alt: "Dibujo de una ballena con el texto «Hazlo con miedo, pero hazlo»",
    caption: "Hazlo con miedo\npero hazlo.",
    kind: "Dibujo",
  },
  {
    src: "/images/rayen/cine-de-papel-estreno.webp",
    alt: "Afiche del estreno de la película dibujada y animada por niñas, niños y juventudes",
    caption: "Estreno de Cine de papel",
    kind: "Proyecto",
  },
  {
    src: "/images/rayen/arte-gatos.webp",
    alt: "Cómic de dos gatos conversando: «No entiendo nada y lo estoy sintiendo todo»",
    caption: "Lo estoy sintiendo todo",
    kind: "Dibujo",
  },
  {
    src: "/images/rayen/arte-ola.webp",
    alt: "Dibujo de una persona surfeando una ola de pensamientos: «Todos tenemos un ritmo único»",
    caption: "Cada quien a su ritmo",
    kind: "Dibujo",
  },
  {
    src: "/images/rayen/arte-caos-interno.webp",
    alt: "Dibujo de colores con el texto «Que tu caos interno guíe tu camino amorosamente»",
    caption: "Tu caos interno",
    kind: "Dibujo",
  },
  {
    src: "/images/rayen/fanzine-emotivo.webp",
    alt: "Portada del fanzine emotivo: cómo ocuparlo y cómo hacerlo",
    caption: "Fanzine emotivo",
    kind: "Actividad",
  },
];

export function CreativeGallery() {
  return (
    <section className="home-sheet home-sheet--cream" aria-labelledby="home-gallery-title">
      <div className="home-container">
        <h2 className="home-title" id="home-gallery-title">
          Lo que <Marked color="mustard">creamos</Marked>
        </h2>
        <p className="home-lead">
          Dibujos, actividades y proyectos donde el arte nos ayuda a expresar lo
          que sentimos.
        </p>
        <ul className="home-gallery">
          {artworks.map((art) => (
            <li key={art.src}>
              <figure className="home-polaroid">
                <img src={art.src} alt={art.alt} width={640} height={640} loading="lazy" />
                <figcaption>
                  <span className="home-polaroid__kind">{art.kind}</span>
                  {art.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutSection() {
  const { professional, assets } = siteContent;
  return (
    <section
      className="home-sheet home-sheet--paper"
      id="sobre-rayen"
      aria-labelledby="home-about-title"
    >
      <div className="home-container home-columns home-columns--photo">
        <figure className="home-portrait">
          <img
            src={assets.profileImageUrl}
            alt={assets.profileImageAlt}
            width={480}
            height={480}
            loading="lazy"
          />
        </figure>
        <div>
          <h2 className="home-title" id="home-about-title">
            Hola, soy <Marked color="mint">{professional.shortName}</Marked>
          </h2>
          <p className="home-lead">
            Soy psicóloga clínica y comunitaria en Iquique. Integro el arte en mi
            trabajo porque he visto, y vivido, que crear nos ayuda a entendernos y a
            transformar lo que duele.
          </p>
          <p>
            También facilito talleres para niñas, niños, juventudes, personas mayores
            y equipos de trabajo.
          </p>
          <ul className="home-credentials">
            {professional.credentials.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
          {INSTAGRAM_URL ? (
            <p>
              <a
                className="home-link"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                Ver mis talleres en Instagram →
                <span className="sr-only"> (se abre en un sitio externo)</span>
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function LocationSection() {
  return (
    <section className="home-sheet home-sheet--cream" aria-labelledby="home-location-title">
      <div className="home-container">
        <h2 className="home-title" id="home-location-title">
          Presencial <Marked color="red">u online</Marked>
        </h2>
        <SeaScene />
        <div className="home-places">
          <article className="home-place">
            <h3>Presencial en Iquique</h3>
            <p>La dirección llega con la confirmación de tu hora.</p>
          </article>
          <article className="home-place">
            <h3>Online</h3>
            <p>
              Por videollamada, desde donde estés. Solo necesitas un lugar tranquilo y
              buena conexión.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ClosingSection() {
  return (
    <section className="home-sheet home-sheet--notebook home-closing" aria-labelledby="home-closing-title">
      <div className="home-container home-narrow home-center">
        <img
          className="home-closing__rainbow"
          src="/images/rayen/arcoiris.webp"
          alt=""
          width={300}
          height={213}
          loading="lazy"
        />
        <h2 className="home-title" id="home-closing-title">
          Hazlo con miedo, pero <Marked color="red">hazlo</Marked>
        </h2>
        <p className="home-lead">
          Dar el primer paso cuesta. Hazlo a tu ritmo: aquí estaré.
        </p>
        <p className="home-actions home-actions--center">
          <BookingLink />
          <WhatsAppLink />
        </p>
      </div>
    </section>
  );
}
