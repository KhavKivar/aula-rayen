import 'dotenv/config';
import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

async function main() {
  const email = process.env.HERMANA_EMAIL;
  const password = process.env.HERMANA_PASSWORD;
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
  const origin = process.env.FRONTEND_URL ?? 'http://localhost:3001';
  const sessionPath = resolve('.auth/session.json');

  if (!email || !password) {
    throw new Error(
      'Define HERMANA_EMAIL y HERMANA_PASSWORD para ejecutar loginplataforma',
    );
  }

  const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login falló: ${response.status} ${await response.text()}`);
  }

  const headers = response.headers as Headers & { getSetCookie(): string[] };
  const cookie = headers
    .getSetCookie()
    .map((value) => value.split(';', 1)[0])
    .join('; ');

  if (!cookie) {
    throw new Error('Better Auth no devolvió una cookie de sesión');
  }

  await mkdir(dirname(sessionPath), { recursive: true });
  await writeFile(
    sessionPath,
    `${JSON.stringify({ baseUrl, cookie, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    { mode: 0o600 },
  );
  await chmod(sessionPath, 0o600);

  console.log(`Sesión actualizada en ${sessionPath}`);
}

void main();
