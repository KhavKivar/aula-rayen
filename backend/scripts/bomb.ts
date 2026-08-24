import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { z } from 'zod';

const optionsSchema = z.object({
  url: z.url(),
  requests: z.coerce.number().int().positive(),
  concurrency: z.coerce.number().int().positive(),
});

const sessionSchema = z.object({
  cookie: z.string().min(1),
});

async function main() {
  const options = optionsSchema.parse({
    url: process.env.BOMB_URL ?? 'http://localhost:3000/courses',
    requests: process.env.BOMB_REQUESTS ?? 110,
    concurrency: process.env.BOMB_CONCURRENCY ?? 10,
  });
  const session = sessionSchema.parse(
    JSON.parse(await readFile(resolve('.auth/session.json'), 'utf8')),
  );
  const statuses = new Map<number, number>();
  let nextRequest = 0;

  async function worker() {
    while (nextRequest < options.requests) {
      nextRequest += 1;
      const response = await fetch(options.url, {
        headers: { cookie: session.cookie },
      });
      statuses.set(response.status, (statuses.get(response.status) ?? 0) + 1);
      await response.body?.cancel();
    }
  }

  const startedAt = performance.now();
  await Promise.all(
    Array.from(
      { length: Math.min(options.concurrency, options.requests) },
      worker,
    ),
  );
  const durationSeconds = (performance.now() - startedAt) / 1000;

  console.log(`URL: ${options.url}`);
  console.log(
    `Requests: ${options.requests} | Concurrency: ${options.concurrency}`,
  );
  console.log(`Duration: ${durationSeconds.toFixed(2)}s`);
  console.log(
    `Throughput: ${(options.requests / durationSeconds).toFixed(2)} req/s`,
  );
  for (const [status, count] of [...statuses].sort(([a], [b]) => a - b)) {
    console.log(`${status}: ${count}`);
  }
}

void main();
