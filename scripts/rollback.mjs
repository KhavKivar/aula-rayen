#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
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
  pnpm rollback --list             Lista los últimos releases exitosos
  pnpm rollback <commit> [--yes]   Revierte web y API al release de ese commit
  pnpm rollback --help             Muestra esta ayuda

Ejemplos:
  pnpm rollback 81bb10b
  pnpm rollback sha-7d4c8badcbdb --yes

Variables opcionales:
  API_HEALTH_URL   URL de /health (por defecto https://api.psicologarayen.cl/health)
  GITHUB_REPO      owner/repo (por defecto se detecta desde git remote)
`);
}

function listReleases() {
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
  console.log(`\nReleases recientes (workflow Deploy · ${REPO}):\n`);
  for (const entry of runs) {
    console.log(
      `  ${entry.headSha.slice(0, 12)}  ${new Date(entry.createdAt).toLocaleString("es-CL")}  ${entry.displayTitle}`,
    );
  }
  console.log(`\nRollback: pnpm rollback <commit> [--yes]\n`);
}

function resolveTag(ref) {
  const short = run("git", ["rev-parse", "--short=12", ref]);
  return `sha-${short}`;
}

function rollbackWeb(tag) {
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
  if (!target) {
    throw new Error(
      `No encontré una versión del Worker con tag ${tag} entre las últimas ${versions.length}.\n` +
        `Revisa con: pnpm --dir apps/web exec wrangler versions list`,
    );
  }
  console.log(`\nWeb: revirtiendo a ${tag} (worker version ${target.id})...`);
  run(
    "pnpm",
    [
      "--dir",
      "apps/web",
      "exec",
      "wrangler",
      "rollback",
      target.id,
      "--yes",
      "--message",
      `rollback ${tag}`,
    ],
    { inherit: true },
  );
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
      return;
    }
    console.log(
      `API: esperando ${tag} (intento ${attempt}/${HEALTH_ATTEMPTS}, versión actual: ${version || "sin respuesta"})`,
    );
    await new Promise((resolve) => setTimeout(resolve, HEALTH_INTERVAL_MS));
  }

  throw new Error(
    `La API no reportó ${tag} dentro del tiempo límite.\n` +
      `Revisa el run con: gh run list --repo ${REPO} --workflow=Deploy`,
  );
}

async function confirm(tag) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `\nVas a revertir producción a ${tag} (primero web, después API). Escribe "si" para continuar: `,
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
    listReleases();
    return;
  }

  const tag = resolveTag(positional[0]);
  run("gh", ["auth", "status"]);

  console.log(`\nObjetivo: ${positional[0]} → ${tag}`);
  if (!flags.has("--yes") && !(await confirm(tag))) {
    console.log("Cancelado.");
    return;
  }

  rollbackWeb(tag);
  await rollbackApi(tag);
  console.log(`\nRollback completo: web y API en ${tag}`);
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exitCode = 1;
});
