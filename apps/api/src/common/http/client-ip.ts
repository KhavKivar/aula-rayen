/**
 * Identidad de rate limiting por cliente. Cloudflare expone la IP real en
 * `cf-connecting-ip`; el resto de despliegues usan `req.ip` con `trust proxy`.
 */
export function getClientIp(request: Record<string, unknown>): string {
  const headers = request.headers as Record<string, unknown> | undefined;
  const cloudflareIp = headers?.['cf-connecting-ip'];
  const candidates: unknown[] = Array.isArray(cloudflareIp)
    ? cloudflareIp
    : [cloudflareIp];
  const tracker = candidates[0];

  if (typeof tracker === 'string' && tracker.length > 0) {
    return tracker;
  }

  const requestIp = request.ip;

  return typeof requestIp === 'string' && requestIp.length > 0
    ? requestIp
    : 'unknown';
}
