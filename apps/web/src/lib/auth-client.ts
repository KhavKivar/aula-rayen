import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { env } from "@/config/env";

export const authClient = createAuthClient({
  baseURL: env.VITE_PUBLIC_AUTH_URL,
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
