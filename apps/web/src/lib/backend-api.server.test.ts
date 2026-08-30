import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  BackendApiError,
  requestBackendJson,
} from "@/lib/backend-api.server";

const { getRequestHeaderMock, setResponseHeaderMock } = vi.hoisted(() => ({
  getRequestHeaderMock: vi.fn(),
  setResponseHeaderMock: vi.fn(),
}));

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeader: getRequestHeaderMock,
  setResponseHeader: setResponseHeaderMock,
}));

vi.mock("@/config/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "https://api.example.com" },
}));

describe("requestBackendJson", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getRequestHeaderMock.mockReset();
    setResponseHeaderMock.mockReset();
  });

  it("forwards the session cookie and disables caching", async () => {
    getRequestHeaderMock.mockReturnValue("better-auth.session_token=secret");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify([{ id: 1 }])));

    await expect(requestBackendJson("/courses")).resolves.toEqual([{ id: 1 }]);

    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://api.example.com/courses"),
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      }),
    );
    const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
    expect(headers.get("cookie")).toBe("better-auth.session_token=secret");
    expect(headers.get("accept")).toBe("application/json");
    expect(setResponseHeaderMock).toHaveBeenCalledWith(
      "Cache-Control",
      "no-store",
    );
  });

  it("serializes a POST body without inventing a cookie", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ token: "token", url: "https://pay.example" })),
      );

    await requestBackendJson("/webpay", {
      method: "POST",
      body: { course_id: 4 },
    });

    const init = fetchMock.mock.calls[0]?.[1];
    const headers = new Headers(init?.headers);
    expect(headers.has("cookie")).toBe(false);
    expect(headers.get("content-type")).toBe("application/json");
    expect(init?.body).toBe(JSON.stringify({ course_id: 4 }));
  });

  it("preserves backend status and array error messages", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: ["Sesión", "expirada"] }), {
        status: 401,
      }),
    );

    const request = requestBackendJson("/courses");

    await expect(request).rejects.toEqual(
      expect.objectContaining<Partial<BackendApiError>>({
        message: "Sesión expirada",
        status: 401,
      }),
    );
  });
});
