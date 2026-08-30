function requiredEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Falta definir la variable de entorno ${name}`);
  }

  return value;
}

export const env = Object.freeze({
  /** Origen directo de la API: https://aula-rayen.vasvani.shop/api en prod, http://localhost:3000 en dev (sin proxy). */
  NEXT_PUBLIC_API_URL: requiredEnv(
    import.meta.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
  ),
  /** Origen del site para redirects/OG: https://aula-rayen.vasvani.shop en prod, http://localhost:3001 en dev. */
  NEXT_PUBLIC_SITE_URL: requiredEnv(
    import.meta.env.NEXT_PUBLIC_SITE_URL,
    "NEXT_PUBLIC_SITE_URL",
  ),
});
