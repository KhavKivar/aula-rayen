import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createWebPay,
  CreateWebPayError,
} from "@/features/course-dashboard/api/create-webpay";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() {
      super("Sesión expirada");
      this.name = "SessionExpiredError";
    }
  },
}));

import { apiClient } from "@/lib/api-client";

function axiosError(message: string | string[] | undefined, status?: number) {
  const error = new Error(message as string) as unknown as ReturnType<
    typeof axios.isAxiosError
  >;
  // minimal AxiosError shape consumed by createWebPay
  return Object.assign(error, {
    isAxiosError: true,
    response: status
      ? {
          status,
          data: { message },
        }
      : undefined,
    config: {},
  });
}

// Ensure axios.isAxiosError recognizes our mocked errors
vi.spyOn(axios, "isAxiosError").mockImplementation((payload: unknown) => {
  const maybe = payload as { isAxiosError?: boolean };
  return Boolean(maybe?.isAxiosError);
});

describe("createWebPay", () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it("returns a validated payment response via apiClient", async () => {
    const response = { token: "payment-token", url: "https://pay.example.com" };
    vi.mocked(apiClient.post).mockResolvedValue({ data: response });

    await expect(createWebPay({ course_id: 4 })).resolves.toEqual(response);
    expect(apiClient.post).toHaveBeenCalledWith("/webpay", { course_id: 4 });
  });

  it("preserves expected backend errors for the UI", async () => {
    const err = axiosError("El curso ya fue comprado.", 409);
    vi.mocked(apiClient.post).mockRejectedValue(err);

    const request = createWebPay({ course_id: 4 });

    await expect(request).rejects.toEqual(
      expect.objectContaining<Partial<CreateWebPayError>>({
        message: "El curso ya fue comprado.",
        status: 409,
      }),
    );
  });

  it("joins array error messages", async () => {
    const err = axiosError(["Sesión", "expirada"], 400);
    vi.mocked(apiClient.post).mockRejectedValue(err);

    await expect(createWebPay({ course_id: 4 })).rejects.toEqual(
      expect.objectContaining<Partial<CreateWebPayError>>({
        message: "Sesión expirada",
        status: 400,
      }),
    );
  });

  it("rejects invalid input before calling the backend", async () => {
    await expect(createWebPay({ course_id: 0 })).rejects.toThrow();
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
