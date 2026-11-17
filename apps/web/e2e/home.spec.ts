import { expect, test } from "./fixtures/auth";

test("original flower loops and can be paused and resumed", async ({
  authPage: page,
}) => {
  await page.goto("/psicologa-iquique");
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
  await page.goto("/psicologa-iquique");
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

test("every «Agendar hora» button opens Calendly in a new tab", async ({
  authPage: page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const buttons = page.getByRole("link", { name: /Agendar hora/ });
  expect(await buttons.count()).toBeGreaterThanOrEqual(3);
  for (const button of await buttons.all()) {
    await expect(button).toHaveAttribute(
      "href",
      /^https:\/\/calendly\.com\/scalderondiz/,
    );
    await expect(button).toHaveAttribute("target", "_blank");
  }
  await expect(page.getByRole("link", { name: "Ingresar" })).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("Coco barks when tapped", async ({ authPage: page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Toca a Coco para que ladre" }).click();
  await expect(page.getByText(/Guau|Wau/)).toBeVisible();
});
