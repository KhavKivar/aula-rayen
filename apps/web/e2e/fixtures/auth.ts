import { expect, test as base, type Page } from "@playwright/test";

const user = {
  id: "user-1",
  email: "persona@example.com",
  name: "Persona de prueba",
  emailVerified: true,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

const session = {
  id: "session-1",
  userId: user.id,
  token: "test-token",
  expiresAt: new Date("2099-01-01T00:00:00.000Z").toISOString(),
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

type AuthFixtures = {
  authPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authPage: async ({ page }, provide) => {
    let authenticated = false;

    await page.route("http://127.0.0.1:3999/**", async (route) => {
      const request = route.request();
      const pathname = new URL(request.url()).pathname;

      if (pathname === "/auth/get-session") {
        await route.fulfill({
          contentType: "application/json",
          json: authenticated ? { session, user } : null,
        });
        return;
      }

      if (pathname === "/auth/sign-in/email") {
        const credentials = request.postDataJSON() as {
          email?: string;
          password?: string;
        };
        if (
          credentials.email === "persona@example.com" &&
          credentials.password === "secreto-seguro"
        ) {
          authenticated = true;
          await route.fulfill({
            contentType: "application/json",
            json: { redirect: false, token: session.token, user },
          });
          return;
        }

        await route.fulfill({
          contentType: "application/json",
          json: {
            code: "INVALID_EMAIL_OR_PASSWORD",
            message: "Invalid email or password",
          },
          status: 401,
        });
        return;
      }

      if (pathname === "/courses") {
        await route.fulfill({ contentType: "application/json", json: [] });
        return;
      }

      await route.abort("blockedbyclient");
    });

    await provide(page);
  },
});

export { expect };
