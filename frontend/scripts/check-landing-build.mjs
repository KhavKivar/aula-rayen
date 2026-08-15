import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const htmlPath = resolve(process.cwd(), ".next/server/app/index.html");
const html = await readFile(htmlPath, "utf8");

const requiredContent = [
  ['lang="es"', "idioma español"],
  ["Aula Rayen", "marca comercial"],
  ["Arteterapia para niños y niñas", "curso inicial"],
  ["Inscripciones próximamente", "estado del curso"],
  ['href="/login"', "enlace de inicio de sesión"],
  ['href="/register"', "enlace de registro"],
  ['href="https://example.com/professional-profile"', "CTA de Instagram"],
  ['target="_blank"', "señal de destino externo"],
  ['id="cursos"', "sección de cursos"],
  ['id="metodologia"', "sección de metodología"],
  ['id="elena"', "sección sobre Elena"],
  ['id="preguntas"', "sección de preguntas"],
  ['property="og:image"', "imagen social"],
  ['name="description"', "descripción SEO"],
];

const missing = requiredContent.filter(([needle]) => !html.includes(needle));

if (missing.length > 0) {
  const labels = missing.map(([, label]) => label).join(", ");
  throw new Error(`La landing construida no contiene: ${labels}`);
}

const forbiddenCourseLinks = [
  '/courses/arteterapia-infancias',
  '/checkout/arteterapia-infancias',
];

for (const href of forbiddenCourseLinks) {
  if (html.includes(href)) {
    throw new Error(`El curso próximo no debe enlazar a ${href}`);
  }
}

console.log(
  `Landing verificada: ${requiredContent.length} comprobaciones aprobadas.`,
);
