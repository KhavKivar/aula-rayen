function requiredEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Falta definir la variable de entorno ${name}`);
  }

  return value;
}

export const env = Object.freeze({
  NEXT_PUBLIC_API_URL: requiredEnv(
    import.meta.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
  ),
  NEXT_PUBLIC_SITE_URL: requiredEnv(
    import.meta.env.NEXT_PUBLIC_SITE_URL,
    "NEXT_PUBLIC_SITE_URL",
  ),
});
