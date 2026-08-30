import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: { getSession: getSessionMock },
}));

import { Route } from "@/app/_protected";

describe("protected route layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("checks authentication only on the client", () => {
    expect(Route.options.ssr).toBe(false);
  });

  it("redirects anonymous visitors back through login", async () => {
    getSessionMock.mockResolvedValueOnce({ data: null });

    await expect(
      Route.options.beforeLoad?.({
        location: { href: "/courses/7" },
      } as never),
    ).rejects.toMatchObject({
      options: {
        to: "/login",
        search: { redirect: "/courses/7" },
        replace: true,
      },
    });
  });

  it("exposes the active session to protected children", async () => {
    const session = {
      session: { id: "session-1" },
      user: { id: "user-1" },
    };
    getSessionMock.mockResolvedValueOnce({ data: session });

    await expect(
      Route.options.beforeLoad?.({
        location: { href: "/dashboard" },
      } as never),
    ).resolves.toEqual(session);
  });
});
