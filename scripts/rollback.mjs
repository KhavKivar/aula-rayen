#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const API_IMAGE = process.env.API_IMAGE ?? "ghcr.io/khavkivar/aula-rayen-api";
const API_HEALTH_URL =
  process.env.API_HEALTH_URL ?? "https://api.psicologarayen.cl/health";
const HEALTH_ATTEMPTS = 48;
const HEALTH_INTERVAL_MS = 10_000;

function run(cmd, args, { inherit = false, allowFailure = false } = {}) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });
  if (result.error) {
    throw new Error(`No se pudo ejecutar ${cmd}: ${result.error.message}`);
  }
  if (result.status !== 0 && !allowFailure) {
    const detail = `${result.stderr ?? ""}${result.stdout ?? ""}`.trim();
    throw new Error(
      `${cmd} ${args.join(" ")} falló${detail ? `\n${detail}` : ""}`,
    );
  }
  return `${result.stdout ?? ""}`.trim();
}

function detectRepo() {
  if (process.env.GITHUB_REPO) return process.env.GITHUB_REPO;
  const url = run("git", ["remote", "get-url", "origin"]);
  const match = url.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
  if (!match) {
    throw new Error("No pude detectar el repositorio desde `git remote`");
  }
  return match[1];
}

const REPO = detectRepo();

function usage() {
  console.log(`
Rollback de producción (web primero, API después)

Uso:
  pnpm rollback --list             Lista releases y qué artefactos tiene cada uno
  pnpm rollback <commit> [--yes]   Revierte web y API a ese release
  pnpm rollback --help             Muestra esta ayuda

Ejemplos:
  pnpm rollback 81bb10b
  pnpm rollback sha-7d4c8badcbdb --yes

Variables opcionales:
  API_IMAGE        Imagen de la API (por defecto ghcr.io/khavkivar/aula-rayen-api)
  API_HEALTH_URL   URL de /health (por defecto https://api.psicologarayen.cl/health)
  GITHUB_REPO      owner/repo (por defecto se detecta desde git remote)
`);
}

function tagFor(sha) {
  return `sha-${sha.slice(0, 12)}`;
}

async function getApiTags() {
  try {
    const path = API_IMAGE.replace(/^ghcr\.io\//, "");
    const tokenResponse = await fetch(
      `https://ghcr.io/token?scope=repository:${path}:pull&service=ghcr.io`,
    );
    if (!tokenResponse.ok) {
      throw new Error(`token ${tokenResponse.status}`);
    }
    const { token } = await tokenResponse.json();
    const tagsResponse = await fetch(`https://ghcr.io/v2/${path}/tags/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!tagsResponse.ok) {
      throw new Error(`tags ${tagsResponse.status}`);
    }
    const data = await tagsResponse.json();
    return new Set(data.tags ?? []);
  } catch (error) {
    console.warn(
      `Aviso: no pude consultar GHCR (${error.message}); no verificaré las imágenes de la API.`,
    );
    return null;
  }
}

function getWebTags() {
  try {
    const raw = run("pnpm", [
      "--dir",
      "apps/web",
      "exec",
      "wrangler",
      "versions",
      "list",
      "--json",
    ]);
    const versions = JSON.parse(raw);
    return new Map(
      versions
        .filter((version) => version.annotations?.["workers/tag"])
        .map((version) => [
          version.annotations["workers/tag"],
          version.id,
        ]),
    );
  } catch (error) {
    console.warn(
      `Aviso: no pude consultar las versiones del Worker (${error.message.split("\n")[0]}).`,
    );
    return null;
  }
}

async function listReleases() {
  const raw = run("gh", [
    "run",
    "list",
    "--repo",
    REPO,
    "--workflow=Deploy",
    "--limit",
    "15",
    "--json",
    "conclusion,headSha,createdAt,displayTitle",
  ]);
  const runs = JSON.parse(raw).filter((entry) => entry.conclusion === "success");
  const [apiTags, webTags] = await Promise.all([getApiTags(), getWebTags()]);

  console.log(`\nReleases recientes (workflow Deploy · ${REPO}):\n`);
  for (const entry of runs) {
    const tag = tagFor(entry.headSha);
    const api = apiTags ? (apiTags.has(tag) ? "API" : " - ") : " ? ";
    const web = webTags ? (webTags.has(tag) ? "WEB" : " - ") : " ? ";
    console.log(
      `  ${entry.headSha.slice(0, 12)}  [${api} ${web}]  ${new Date(entry.createdAt).toLocaleString("es-CL")}  ${entry.displayTitle}`,
    );
  }
  console.log(`\n  API = imagen publicada en GHCR · WEB = versión publicada del Worker`);
  console.log(`  Rollback: pnpm rollback <commit> [--yes]\n`);
}

function resolveTag(ref) {
  const result = spawnSync("git", ["rev-parse", "--short=12", ref], {
    cwd: ROOT,
    encoding: "utf8",
  });
  const short = `${result.stdout ?? ""}`.trim();
  if (result.status !== 0 || short.length === 0) {
    throw new Error(
      `No encontré el commit "${ref}". Usa al menos 4 caracteres del sha (mira pnpm rollback --list).`,
    );
  }
  return `sha-${short}`;
}

function rollbackWeb(tag, versionId) {
  let targetId = versionId;
  if (!targetId) {
    const raw = run("pnpm", [
      "--dir",
      "apps/web",
      "exec",
      "wrangler",
      "versions",
      "list",
      "--json",
    ]);
    const versions = JSON.parse(raw);
    const target = versions.find(
      (version) => version.annotations?.["workers/tag"] === tag,
    );
    targetId = target?.id;
  }
  if (!targetId) {
    console.warn(`\nWeb: no hay una versión con tag ${tag}; se omite.`);
    return false;
  }
  console.log(`\nWeb: revirtiendo a ${tag} (worker version ${targetId})...`);
  run(
    "pnpm",
    [
      "--dir",
      "apps/web",
      "exec",
      "wrangler",
      "rollback",
      targetId,
      "--yes",
      "--message",
      `rollback ${tag}`,
    ],
    { inherit: true },
  );
  return true;
}

async function rollbackApi(tag) {
  console.log(`\nAPI: disparando Deploy con image_tag=${tag}...`);
  run(
    "gh",
    ["workflow", "run", "Deploy", "--repo", REPO, "-f", `image_tag=${tag}`],
    { inherit: true },
  );

  for (let attempt = 1; attempt <= HEALTH_ATTEMPTS; attempt += 1) {
    let version = "";
    try {
      const response = await fetch(API_HEALTH_URL, { cache: "no-store" });
      if (response.ok) {
        version = (await response.json()).version ?? "";
      }
    } catch {
      version = "";
    }
    if (version === tag) {
      console.log(`API: /health reporta ${tag}`);
      return true;
    }
    console.log(
      `API: esperando ${tag} (intento ${attempt}/${HEALTH_ATTEMPTS}, versión actual: ${version || "sin respuesta"})`,
    );
    await new Promise((resolve) => setTimeout(resolve, HEALTH_INTERVAL_MS));
  }

  console.warn(
    `Aviso: la API no reportó ${tag} dentro del tiempo límite.\n` +
      `Revisa el run con: gh run list --repo ${REPO} --workflow=Deploy`,
  );
  return false;
}

async function confirm(tag, apiAvailable, webAvailable) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `\nVas a revertir producción a ${tag} ` +
      `(${[
        webAvailable ? "web" : null,
        apiAvailable ? "API" : null,
      ]
        .filter(Boolean)
        .join(" y ")}; orden web → API). Escribe "si" para continuar: `,
  );
  rl.close();
  return answer.trim().toLowerCase() === "si";
}

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  const positional = args.filter((arg) => !arg.startsWith("--"));

  if (flags.has("--help") || flags.has("-h")) {
    usage();
    return;
  }
  if (flags.has("--list") || positional.length === 0) {
    await listReleases();
    return;
  }

  const ref = positional[0];
  const tag = resolveTag(ref);
  run("gh", ["auth", "status"]);

  const [apiTags, webTags] = await Promise.all([getApiTags(), getWebTags()]);
  const apiAvailable = apiTags ? apiTags.has(tag) : true;
  const webAvailable = webTags ? webTags.has(tag) : true;

  if (apiTags && webTags && !apiAvailable && !webAvailable) {
    throw new Error(
      `El commit ${ref} (${tag}) no tiene imagen de API ni versión web publicadas: fue un release sin cambios de aplicación.\n` +
        `Elige otro con: pnpm rollback --list`,
    );
  }

  console.log(`\nObjetivo: ${ref} → ${tag}`);
  console.log(
    `  API: ${apiTags ? (apiAvailable ? "imagen disponible" : "sin imagen (se omite)") : "sin verificar"}`,
  );
  console.log(
    `  Web: ${webTags ? (webAvailable ? "versión disponible" : "sin versión (se omite)") : "sin verificar"}`,
  );

  if (
    !flags.has("--yes") &&
    !(await confirm(tag, apiAvailable, webAvailable))
  ) {
    console.log("Cancelado.");
    return;
  }

  const webRolledBack = webAvailable
    ? rollbackWeb(tag, webTags?.get(tag))
    : false;
  const apiRolledBack = apiAvailable ? await rollbackApi(tag) : false;

  const parts = [
    webRolledBack ? "web" : null,
    apiRolledBack ? "API" : null,
  ].filter(Boolean);
  console.log(
    parts.length > 0
      ? `\nRollback completo: ${parts.join(" y ")} en ${tag}`
      : `\nNo se revirtió nada.`,
  );
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exitCode = 1;
});
