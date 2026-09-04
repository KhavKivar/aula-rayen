import { describe, expect, it, vi } from "vitest";

const { adminPlugin, createAuthClientMock } = vi.hoisted(() => ({
  adminPlugin: { id: "admin" },
  createAuthClientMock: vi.fn((opts: unknown) => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    useSession: vi.fn(),
    getSession: vi.fn(),
    ...(typeof opts === "object" && opts !== null ? opts : {}),
  })),
}));

vi.mock("better-auth/react", () => ({
  createAuthClient: createAuthClientMock,
}));

vi.mock("better-auth/client/plugins", () => ({
  adminClient: vi.fn(() => adminPlugin),
}));

vi.mock("@/config/env", () => ({
  env: {
    VITE_PUBLIC_API_URL: "https://aula-rayen.vasvani.shop/api",
    VITE_PUBLIC_AUTH_URL: "https://aula-rayen.vasvani.shop/api/auth",
    VITE_PUBLIC_SITE_URL: "https://aula-rayen.vasvani.shop",
  },
}));

// Import after mocks to capture createAuthClient call
import "@/lib/auth-client";

describe("auth-client direct transport", () => {
  it("configures Better Auth to use the public auth proxy path", () => {
    expect(createAuthClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://aula-rayen.vasvani.shop/api/auth",
        plugins: [adminPlugin],
      }),
    );
    const opts = createAuthClientMock.mock.calls[0]?.[0] as Record<string, unknown>;
    // No longer uses window.location.origin or SITE_URL
    expect(opts.baseURL).not.toBe("https://aula-rayen.vasvani.shop/api");
    expect(opts).not.toHaveProperty("baseURL", "https://app.example");
  });
});
