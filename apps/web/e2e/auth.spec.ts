import { expect, test } from "./fixtures/auth";

test("returns to requested protected content after login", async ({
  authPage: page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
  await page.getByLabel("Correo electrónico").fill("persona@example.com");
  await page.getByLabel("Contraseña").fill("secreto-seguro");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Cursos disponibles", exact: true }),
  ).toBeVisible();
});

test("keeps rejected credentials outside protected content", async ({
  authPage: page,
}) => {
  await page.goto("/dashboard");

  await page.getByLabel("Correo electrónico").fill("persona@example.com");
  await page.getByLabel("Contraseña").fill("credencial-incorrecta");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "Correo o contraseña incorrectos.",
  );
  await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard$/);
  await expect(
    page.getByRole("heading", { name: "Cursos disponibles", exact: true }),
  ).not.toBeVisible();
});
