import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001")
      : window.location.origin,
});

export const { signIn, signUp, signOut, useSession } = authClient;
