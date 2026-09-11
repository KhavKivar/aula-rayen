import { expect, test } from "@playwright/test";

test("changing accounts without a reload discards the previous course access", async ({
  page,
}) => {
  let account: string | null = null;
  const catalogRequests: string[] = [];
  const course = {
    id: 1,
    title: "Curso de prueba",
    description: "Curso para verificar el cambio de cuenta.",
    duration: "2 horas",
    price: 25000,
    createdAt: "2026-08-17T00:00:00.000Z",
  };
  const sessionData = (id: string) => ({
    user: {
      id,
      name: id,
      email: `${id}@example.com`,
      emailVerified: true,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    },
    session: {
      id: `session-${id}`,
      userId: id,
      token: `token-${id}`,
      expiresAt: "2099-01-01T00:00:00.000Z",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    },
  });

  await page.route("http://127.0.0.1:3999/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/auth/sign-in/email") {
      const credentials = route.request().postDataJSON() as { email: string };
      account = credentials.email === "a@example.com" ? "a" : "b";
      const data = sessionData(account);
      await route.fulfill({
        json: { redirect: false, token: data.session.token, user: data.user },
      });
    } else if (path === "/auth/get-session") {
      await route.fulfill({ json: account ? sessionData(account) : null });
    } else if (path === "/auth/sign-out") {
      account = null;
      await route.fulfill({ json: { success: true } });
    } else if (path === "/courses" && account) {
      catalogRequests.push(account);
      await route.fulfill({
        json: [{ ...course, hasAccess: account === "a" }],
      });
    } else {
      await route.abort("blockedbyclient");
    }
  });

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
  const documentId = await page.evaluate(() => {
    const id = crypto.randomUUID();
    Object.assign(window, { sessionCacheTestDocument: id });
    return id;
  });

  await page.getByLabel("Correo electrónico").fill("a@example.com");
  await page.getByLabel("Contraseña").fill("secreto-seguro");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Ver Curso de prueba", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Abrir menú de cuenta" }).click();
  await page.getByRole("menuitem", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page
    .getByRole("navigation", { name: "Enlaces del pie de página" })
    .getByRole("link", { name: "Ingresar", exact: true })
    .click();
  await page.getByLabel("Correo electrónico").fill("b@example.com");
  await page.getByLabel("Contraseña").fill("secreto-seguro");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();

  await expect(
    page.getByRole("button", { name: "Pagar Curso de prueba con Webpay" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ver Curso de prueba", exact: true }),
  ).toHaveCount(0);
  expect(catalogRequests).toContain("b");
  expect(
    await page.evaluate(() => Reflect.get(window, "sessionCacheTestDocument")),
  ).toBe(documentId);
});
