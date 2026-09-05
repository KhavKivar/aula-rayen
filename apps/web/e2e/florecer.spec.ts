import { expect, test } from "./fixtures/auth";

test("original flower loops and can be paused and resumed", async ({
  authPage: page,
}) => {
  await page.goto("/");
  const flower = page.getByLabel("Flor de arcilla en movimiento suave");
  await expect
    .poll(() => flower.evaluate((video: HTMLVideoElement) => !video.paused))
    .toBe(true);
  await expect(flower).toHaveAttribute("loop", "");
  await expect(flower).toHaveAttribute("poster", "/images/florecer.png");
  await page.getByRole("button", { name: "Pausar animación" }).click();
  await expect
    .poll(() => flower.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true);
  await page.getByRole("button", { name: "Reproducir animación" }).click();
  await expect
    .poll(() => flower.evaluate((video: HTMLVideoElement) => !video.paused))
    .toBe(true);
});

test("reduced motion keeps the flower still until explicitly played", async ({
  authPage: page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const flower = page.getByLabel("Flor de arcilla en movimiento suave");
  await expect(
    page.getByRole("button", { name: "Reproducir animación" }),
  ).toBeVisible();
  expect(await flower.evaluate((video: HTMLVideoElement) => video.paused)).toBe(
    true,
  );
  await expect(flower).not.toHaveAttribute("src");
  await page.getByRole("button", { name: "Reproducir animación" }).click();
  await expect
    .poll(() => flower.evaluate((video: HTMLVideoElement) => !video.paused))
    .toBe(true);
});

test("mobile navigation reaches appointment contact without a fictitious booking", async ({
  authPage: page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menú" });
  await menu.click();
  await page
    .getByRole("navigation", { name: "Navegación móvil" })
    .getByRole("link", { name: "Agendar hora" })
    .click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#agenda$/);
  await expect(
    page.getByRole("link", { name: /Consultar disponibilidad/ }),
  ).toHaveAttribute("href", /^https:\/\/www.instagram.com\//);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
