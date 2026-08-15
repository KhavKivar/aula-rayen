import { createAuthClient } from "better-auth/react";
import { env } from "@/config/env";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? env.NEXT_PUBLIC_SITE_URL
      : window.location.origin,
});

export const { signIn, signUp, signOut, useSession } = authClient;
