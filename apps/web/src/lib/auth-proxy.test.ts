import { describe, expect, it, vi } from "vitest";

import { proxyAuthRequest } from "@/lib/auth-proxy";

describe("proxyAuthRequest", () => {
  it("forwards path, query, headers and body to the backend", async () => {
    const backendResponse = new Response("ok", {
      headers: { "set-cookie": "session=abc; HttpOnly" },
    });
    const fetchMock = vi.fn().mockResolvedValue(backendResponse);
    const request = new Request(
      "https://aula.example/api/auth/sign-in/email?redirect=/dashboard",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          host: "aula.example",
          "content-length": "18",
          cookie: "session=old",
        },
        body: JSON.stringify({ email: "a@b.cl" }),
      },
    );

    const response = await proxyAuthRequest({
      request,
      path: "sign-in/email",
      backendOrigin: "https://api.example",
      fetch: fetchMock,
    });

    expect(response).toBe(backendResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [target, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(target.toString()).toBe(
      "https://api.example/api/auth/sign-in/email?redirect=/dashboard",
    );
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("cookie")).toBe("session=old");
    expect(new Headers(init.headers).has("host")).toBe(false);
    expect(new Headers(init.headers).has("content-length")).toBe(false);
    expect(await new Response(init.body).json()).toEqual({ email: "a@b.cl" });
    expect(init.redirect).toBe("manual");
  });

  it("does not attach a body to GET requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response());

    await proxyAuthRequest({
      request: new Request("https://aula.example/api/auth/session"),
      path: "session",
      backendOrigin: "https://api.example/",
      fetch: fetchMock,
    });

    const [, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(init.body).toBeUndefined();
  });
});
