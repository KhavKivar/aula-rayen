import { defineConfig, devices } from "@playwright/test";

const port = 3101;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm exec vite dev --host 127.0.0.1 --port ${port}`,
    env: {
      VITE_PUBLIC_API_URL: "http://127.0.0.1:3999",
      VITE_PUBLIC_AUTH_URL: "http://127.0.0.1:3999/auth",
      VITE_PUBLIC_SITE_URL: baseURL,
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
});
