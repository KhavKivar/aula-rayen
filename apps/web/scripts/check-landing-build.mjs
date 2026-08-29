import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";

const siteContent = JSON.parse(
  await readFile(
    new URL("../src/config/site-content.json", import.meta.url),
    "utf8",
  ),
);

const port = await new Promise((resolve, reject) => {
  const server = createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    server.close(() => resolve(address.port));
  });
});
const previewUrl = `http://127.0.0.1:${port}/`;
const previewStateDirectory = await mkdtemp(
  join(tmpdir(), "aula-rayen-preview-"),
);
const preview = spawn(
  "pnpm",
  ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", String(port)],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MINIFLARE_REGISTRY_PATH: join(previewStateDirectory, "registry"),
      WRANGLER_LOG_PATH: join(previewStateDirectory, "wrangler.log"),
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let previewOutput = "";
preview.stdout.on("data", (chunk) => {
  previewOutput += chunk.toString();
});
preview.stderr.on("data", (chunk) => {
  previewOutput += chunk.toString();
});

async function readLanding() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) {
        return response.text();
      }
    } catch {
      // The preview server may still be starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`El preview no respondió.\n${previewOutput}`);
}

try {
  const html = await readLanding();
  const requiredContent = [
    ['lang="es"', "idioma español"],
    ["Aula Rayen", "marca comercial"],
    ["Arteterapia para niños y niñas", "curso inicial"],
    ["Inscripciones próximamente", "estado del curso"],
    ['href="/login"', "enlace de inicio de sesión"],
    [siteContent.professional.name, "identidad profesional"],
    ['id="cursos"', "sección de cursos"],
    ['id="metodologia"', "sección de metodología"],
    ['id="profesional"', "sección profesional"],
    ['id="preguntas"', "sección de preguntas"],
    ['property="og:image"', "imagen social"],
    ['name="description"', "descripción SEO"],
  ];

  if (siteContent.social.instagramUrl) {
    requiredContent.push(
      [`href="${siteContent.social.instagramUrl}"`, "CTA de Instagram"],
      ['target="_blank"', "señal de destino externo"],
    );
  } else {
    requiredContent.push([
      "Contenido de demostración",
      "aviso de contenido ficticio",
    ]);
  }

  const missing = requiredContent.filter(([needle]) => !html.includes(needle));
  if (missing.length > 0) {
    const labels = missing.map(([, label]) => label).join(", ");
    throw new Error(`La landing construida no contiene: ${labels}`);
  }

  for (const href of [
    "/courses/arteterapia-infancias",
    "/checkout/arteterapia-infancias",
  ]) {
    if (html.includes(href)) {
      throw new Error(`El curso próximo no debe enlazar a ${href}`);
    }
  }

  console.log(
    `Landing verificada: ${requiredContent.length} comprobaciones aprobadas.`,
  );
} finally {
  preview.kill("SIGTERM");
  if (preview.exitCode === null) {
    await new Promise((resolve) => preview.once("exit", resolve));
  }
  await rm(previewStateDirectory, { recursive: true });
}
