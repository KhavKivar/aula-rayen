/* Standalone design artifact. All interactions are in-memory examples. */
const designs = {
  florecer: {
    number: "01",
    name: "Florecer",
    label: "PSICOLOGÍA CON CALIDEZ",
    title: "Un espacio para<br><em>florecer a tu ritmo.</em>",
    intro:
      "No hay una sola forma de sentir, crecer o estar bien. Te acompaño a encontrar la tuya.",
    caption: "Cada proceso tiene su tiempo.",
    section: "¿Cómo puedo acompañarte?",
    font: "Fraunces + DM Sans",
    colors: ["#F7F5ED", "#243D32", "#DCE5CB", "#BE6746"],
  },
  ritmo: {
    number: "02",
    name: "A tu ritmo",
    label: "UN ESPACIO PARA SER TÚ",
    title: "No tienes que<br>poder <em>con todo.</em>",
    intro:
      "Lo que sientes merece un espacio. Conversemos, exploremos y encontremos nuevas formas de avanzar.",
    caption: "Sentir también es parte del camino.",
    section: "Tu momento. Tu camino.",
    font: "Manrope + DM Sans",
    colors: ["#F8F7FF", "#3036C8", "#DDF399", "#EF8E77"],
  },
  espacio: {
    number: "03",
    name: "Espacio",
    label: "PAMELA RAYEN CALDERÓN · PSICÓLOGA",
    title: "Hacer espacio<br>también es <em>cuidarte.</em>",
    intro:
      "Un encuentro contigo, con lo que sientes y con nuevas posibilidades. Psicología desde una mirada humana y creativa.",
    caption: "Un lugar para volver a ti.",
    section: "Diferentes formas de encontrarnos.",
    font: "Fraunces + DM Sans",
    colors: ["#F2EDE4", "#30352D", "#A45338", "#D9D0BE"],
  },
};
const params = new URLSearchParams(location.search);
const theme = Object.hasOwn(designs, params.get("theme"))
  ? params.get("theme")
  : "florecer";
const d = designs[theme];
// Keep the first flower exploration available with ?theme=florecer&asset=flower.
const heroAsset =
  theme === "florecer" && params.get("asset") !== "flower"
    ? "seed-universe"
    : theme;
document.body.className = theme + (params.has("capture") ? " capture" : "");
document.title = d.name + " · Psicóloga Rayen";
const arrow = '<span aria-hidden="true">↗</span>';
const flower =
  '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 7C7-4 1 11 12 18C-4 22 7 36 17 27C19 43 35 35 27 23C43 21 34 5 24 14C29 1 16-2 20 7Z" fill="currentColor"/><circle cx="20" cy="20" r="4" fill="var(--bg)"/></svg>';
const cards = [
  [
    "01",
    "Atención infantojuvenil",
    "Un espacio de escucha y expresión para acompañar cada etapa del desarrollo.",
    "Descubrir atención",
    "sun",
  ],
  [
    "02",
    "Acompañamiento familiar",
    "Nuevas miradas para comprenderse, conectar y construir vínculos.",
    "Conocer el espacio",
    "links",
  ],
  [
    "03",
    "Arteterapia y talleres",
    "Explorar emociones a través del juego, el arte y la creatividad.",
    "Explorar talleres",
    "spark",
  ],
];
const icons = {
  sun: '<circle cx="24" cy="24" r="9"/><path d="M24 2v7m0 30v7M2 24h7m30 0h7M8 8l5 5m22 22 5 5M8 40l5-5m22-22 5-5"/>',
  links:
    '<path d="M25 13c-5-8-19-5-19 6 0 6 6 11 18 19 12-8 18-13 18-19 0-11-14-14-19-6"/>',
  spark:
    '<path d="M24 3c0 14-7 21-21 21 14 0 21 7 21 21 0-14 7-21 21-21-14 0-21-7-21-21Z"/>',
};
document.getElementById("app").innerHTML = `
<aside class="studio-bar"><a href="index.html">← Las tres propuestas</a><span>EXPLORACIÓN ${d.number} / ${d.name}</span><a href="#system">Ver sistema visual ↓</a></aside>
<div class="site-shell">
<header class="site-header"><a class="brand" href="#home" aria-label="Psicóloga Rayen, inicio">${flower}<span>rayen<small>PSICÓLOGA</small></span></a><nav aria-label="Navegación principal"><a href="#services">Atención psicológica</a><a href="#about">Sobre mí</a><a href="#courses">Aula Rayen ${arrow}</a></nav><button class="button primary header-cta" data-book>Agendar hora ${arrow}</button><button class="mobile-menu" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú">☰</button></header>
<nav id="mobile-nav" hidden aria-label="Navegación móvil"><a href="#services">Atención psicológica</a><a href="#about">Sobre mí</a><a href="#courses">Aula Rayen</a></nav>
<main id="home">
<section class="hero">
  <div class="hero-copy"><p class="eyebrow"><span class="little-dot"></span>${d.label}</p><h1>${d.title}</h1><p class="intro">${d.intro}</p><div class="hero-actions"><button class="button primary" data-book>Agendar mi primera hora ${arrow}</button><a class="text-link" href="#services">Conocer los servicios <span aria-hidden="true">↓</span></a></div><div class="professional-mini"><img src="assets/pamela.jpg" alt="Pamela Rayen Calderón"><span><b>Hola, soy Pamela Rayen.</b><small>Psicóloga · Magíster en Salud y Arteterapia</small></span></div></div>
  <div class="hero-visual"><div class="art-window"><video muted loop playsinline preload="none" poster="assets/${heroAsset}.png" aria-label="Estudio de movimiento 3D, ${heroAsset === "seed-universe" ? "Una semilla con un universo dentro" : d.name}"><source data-src="assets/${heroAsset}.mp4" type="video/mp4"></video></div><span class="art-label">${d.caption}</span><button class="motion-control" aria-label="Reproducir animación de portada">▶ <span>Ver movimiento</span></button><span class="art-index" aria-hidden="true">${theme === "ritmo" ? "a tu<br>ritmo." : theme === "espacio" ? "EST. / RAYEN" : "crecer<br>sin prisa"}</span></div>
</section>
<div class="values-strip"><span>Escucha sin juicios</span><i>✳</i><span>Un enfoque creativo</span><i>✳</i><span>Tu proceso, a tu ritmo</span><i>✳</i><a href="#about">Conoce mi mirada ${arrow}</a></div>
<section class="services section" id="services"><div class="section-heading"><div><p class="eyebrow">ACOMPAÑAMIENTO PSICOLÓGICO</p><h2>${d.section}</h2></div><p>Cada historia es distinta.<br>Podemos encontrar un punto de partida.</p></div><div class="service-grid">${cards.map(([num, title, desc, cta, icon]) => `<article class="service-card"><div class="card-top"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${icons[icon]}</svg><span>${num}</span></div><h3>${title}</h3><p>${desc}</p><button class="text-link" data-service="${title}">${cta} ${arrow}</button></article>`).join("")}</div></section>
<section class="about section" id="about"><div class="portrait-wrap"><img src="assets/pamela.jpg" alt="Retrato de Pamela Rayen Calderón" loading="lazy"><span class="portrait-caption">PAMELA RAYEN CALDERÓN</span></div><div class="about-copy"><p class="eyebrow">LA PERSONA QUE TE ACOMPAÑA</p><h2>La conexión humana<br>es el <em>punto de partida.</em></h2><p>Soy Pamela, psicóloga y Magíster en Salud y Arteterapia. Mi trabajo integra psicoterapia, psicoeducación y recursos creativos, desde una mirada inclusiva y respetuosa.</p><p>Creo en acompañar cada proceso con escucha, presencia y atención a cada etapa del desarrollo.</p><button class="button secondary" data-book>Conversemos ${arrow}</button></div></section>
<section class="courses section" id="courses"><div class="course-intro"><p class="eyebrow">AULA RAYEN / FORMACIÓN PROFESIONAL</p><h2>Aprender también<br>es una forma de <em>cuidar.</em></h2><p>Formación y recursos creativos para profesionales de la psicología que acompañan a otras personas.</p><button class="text-link" data-course>Explorar la formación ${arrow}</button></div><article class="course-card"><div class="course-art">${flower}<span>arte,<br>juego<br><em>y emoción.</em></span><small>CURSO + KIT DE TALLER</small></div><div class="course-info"><span class="tag">PRÓXIMAMENTE</span><h3>Arteterapia para niños y niñas</h3><p>Una ruta práctica para llevar la creatividad al espacio terapéutico.</p><button class="text-link" data-course>Conocer el curso ${arrow}</button></div></article></section>
<section class="booking-section section" id="booking"><div><p class="eyebrow">EL PRIMER PASO PUEDE SER PEQUEÑO</p><h2>Hagamos espacio<br>para <em>conversar.</em></h2><p>Elige el tipo de atención y encuentra un momento para ti.</p><span class="demo-note">Vista de diseño · opciones y horarios de ejemplo</span></div><div class="booking-card"><div class="booking-card-top"><span>Tu próximo espacio</span><span aria-hidden="true">↗</span></div><label for="service-preview">Tipo de atención</label><select id="service-preview">${cards.map(([, title]) => `<option>${title}</option>`).join("")}</select><div class="booking-meta"><span>Modalidad<br><b>Online</b></span><span>Zona horaria<br><b>Santiago, Chile</b></span></div><button class="button primary" data-book>Elegir día y hora ${arrow}</button></div></section>
</main>
<footer><a class="brand" href="#home">${flower}<span>rayen<small>PSICÓLOGA</small></span></a><span>Psicología, creatividad y conexión humana.</span><a href="#courses">Aula Rayen ${arrow}</a><small>© Rayen 2026</small></footer>
</div>
<section class="design-system" id="system"><div><p class="eyebrow">SISTEMA VISUAL / ${d.number}</p><h2>${d.name}</h2><p>${d.font}</p></div><div class="swatches">${d.colors.map((c) => `<div><span style="background:${c}"></span><code>${c}</code></div>`).join("")}</div><div class="system-controls"><button class="button primary" data-book>Acción principal ${arrow}</button><button class="button secondary" data-book>Acción secundaria</button><p>Ritmo de espaciado: 8 / 16 / 24 / 48 / 80</p></div></section>
<dialog id="booking-dialog" aria-labelledby="booking-title"><button class="close-dialog" aria-label="Cerrar agenda">×</button><div class="dialog-content"><p class="eyebrow">AGENDA TU ESPACIO</p><h2 id="booking-title">Un momento para ti.</h2><p class="demo-note">Maqueta de diseño. Horarios de ejemplo; no se realizan reservas.</p><div class="steps"><span class="active">01 Atención</span><span class="active">02 Día y hora</span><span>03 Resumen</span></div><label for="booking-service">¿Qué espacio estás buscando?</label><select id="booking-service">${cards.map(([, title]) => `<option>${title}</option>`).join("")}</select><div class="calendar-heading"><b>Septiembre 2026</b><span>Santiago, Chile</span></div><div class="days" role="group" aria-label="Días de ejemplo">${[
  ["Mar", 15],
  ["Mié", 16],
  ["Jue", 17],
  ["Vie", 18],
]
  .map(
    ([day, n], i) =>
      `<button aria-pressed="${i === 0}" data-day="${n}"><span>${day}</span><b>${n}</b></button>`,
  )
  .join(
    "",
  )}</div><p class="field-title">Horarios de ejemplo · modalidad online</p><div class="times" role="group" aria-label="Horas de ejemplo">${["10:00", "11:30", "16:00"].map((t, i) => `<button data-time="${t}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div><button class="button primary preview-summary">Ver resumen ${arrow}</button><div class="booking-summary" hidden aria-live="polite"></div></div></dialog>
<dialog id="info-dialog" aria-labelledby="info-title"><button class="close-dialog" aria-label="Cerrar detalle">×</button><div class="dialog-content"><p class="eyebrow">PSICÓLOGA RAYEN</p><h2 id="info-title"></h2><p id="info-text"></p><p class="demo-note">Contenido de ejemplo para evaluar esta propuesta visual.</p><button class="button primary" data-book>Ver agenda de ejemplo ${arrow}</button></div></dialog>`;

const book = document.getElementById("booking-dialog");
const info = document.getElementById("info-dialog");
let selectedDay = "15";
let selectedTime = "10:00";
document.querySelectorAll("[data-book]").forEach((button) =>
  button.addEventListener("click", () => {
    if (info.open) info.close();
    document.getElementById("booking-service").value =
      document.getElementById("service-preview").value;
    resetSummary();
    book.showModal();
  }),
);
document
  .querySelectorAll(".close-dialog")
  .forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()),
  );
document.querySelectorAll("[data-service]").forEach((button) =>
  button.addEventListener("click", () => {
    const card = cards.find((c) => c[1] === button.dataset.service);
    document.getElementById("info-title").textContent = card[1];
    document.getElementById("info-text").textContent = card[2];
    info.querySelector("[data-book]").hidden = false;
    document.getElementById("service-preview").value = card[1];
    info.showModal();
  }),
);
document.querySelectorAll("[data-course]").forEach((button) =>
  button.addEventListener("click", () => {
    document.getElementById("info-title").textContent =
      "Arteterapia para niños y niñas";
    document.getElementById("info-text").textContent =
      "Formación para quien facilita, guion paso a paso y materiales editables. Inscripciones próximamente. Precio por anunciar.";
    info.querySelector("[data-book]").hidden = true;
    info.showModal();
  }),
);
function resetSummary() {
  document.querySelector(".booking-summary").hidden = true;
  document.querySelector(".preview-summary").hidden = false;
  document.querySelector(".steps span:last-child").classList.remove("active");
}
document.querySelectorAll("[data-day]").forEach((button) =>
  button.addEventListener("click", () => {
    selectedDay = button.dataset.day;
    document
      .querySelectorAll("[data-day]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    resetSummary();
  }),
);
document.querySelectorAll("[data-time]").forEach((button) =>
  button.addEventListener("click", () => {
    selectedTime = button.dataset.time;
    document
      .querySelectorAll("[data-time]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    resetSummary();
  }),
);
document
  .getElementById("booking-service")
  .addEventListener("change", resetSummary);
document.querySelector(".preview-summary").addEventListener("click", () => {
  const summary = document.querySelector(".booking-summary");
  summary.replaceChildren();
  const title = document.createElement("b");
  title.textContent = "Así se verá tu selección";
  const detail = document.createElement("p");
  detail.textContent =
    document.getElementById("booking-service").value +
    " · " +
    selectedDay +
    " de septiembre de 2026 · " +
    selectedTime +
    " · Online";
  const note = document.createElement("p");
  note.textContent = "Esta es una vista previa. No se ha reservado una hora.";
  summary.append(title, detail, note);
  summary.hidden = false;
  document.querySelector(".steps span:last-child").classList.add("active");
  summary.scrollIntoView({ block: "nearest", behavior: "smooth" });
});
const menu = document.querySelector(".mobile-menu");
menu.addEventListener("click", () => {
  const nav = document.getElementById("mobile-nav");
  nav.hidden = !nav.hidden;
  menu.setAttribute("aria-expanded", String(!nav.hidden));
});
document.querySelectorAll("#mobile-nav a").forEach((a) =>
  a.addEventListener("click", () => {
    document.getElementById("mobile-nav").hidden = true;
    menu.setAttribute("aria-expanded", "false");
  }),
);
const video = document.querySelector("video");
const motion = document.querySelector(".motion-control");
motion.addEventListener("click", async () => {
  if (video.paused) {
    if (!video.querySelector("source").src) {
      video.querySelector("source").src =
        video.querySelector("source").dataset.src;
      video.load();
    }
    try {
      await video.play();
      motion.innerHTML = "Ⅱ <span>Pausar movimiento</span>";
      motion.setAttribute("aria-label", "Pausar animación de portada");
    } catch {
      motion.innerHTML = "▶ <span>Reintentar movimiento</span>";
    }
  } else {
    video.pause();
    motion.innerHTML = "▶ <span>Ver movimiento</span>";
    motion.setAttribute("aria-label", "Reproducir animación de portada");
  }
});
if (
  !params.has("capture") &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
)
  motion.click();
if (params.get("view") === "booking") book.showModal();
