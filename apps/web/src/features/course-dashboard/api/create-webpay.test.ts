import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createWebPay,
  CreateWebPayError,
} from "@/features/course-dashboard/api/create-webpay";
import {
  BackendApiError,
  requestBackendJson,
} from "@/lib/backend-api.server";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validate = (data: unknown) => data;
    const builder = {
      validator: (schema: { parse: (data: unknown) => unknown }) => {
        validate = (data) => schema.parse(data);
        return builder;
      },
      handler:
        (handler: (context: { data: unknown }) => unknown) =>
        ({ data }: { data?: unknown } = {}) =>
          handler({ data: validate(data) }),
    };

    return builder;
  },
}));

vi.mock("@/lib/backend-api.server", () => {
  class MockBackendApiError extends Error {
    constructor(
      message: string,
      readonly status: number,
    ) {
      super(message);
    }
  }

  return {
    BackendApiError: MockBackendApiError,
    requestBackendJson: vi.fn(),
  };
});

describe("createWebPay", () => {
  beforeEach(() => {
    vi.mocked(requestBackendJson).mockReset();
  });

  it("returns a validated payment response", async () => {
    const response = { token: "payment-token", url: "https://pay.example.com" };
    vi.mocked(requestBackendJson).mockResolvedValue(response);

    await expect(createWebPay({ course_id: 4 })).resolves.toEqual(response);
    expect(requestBackendJson).toHaveBeenCalledWith("/webpay", {
      method: "POST",
      body: { course_id: 4 },
    });
  });

  it("preserves expected backend errors for the UI", async () => {
    vi.mocked(requestBackendJson).mockRejectedValue(
      new BackendApiError("El curso ya fue comprado.", 409),
    );

    const request = createWebPay({ course_id: 4 });

    await expect(request).rejects.toEqual(
      expect.objectContaining<Partial<CreateWebPayError>>({
        message: "El curso ya fue comprado.",
        status: 409,
      }),
    );
  });

  it("rejects invalid input before calling the backend", async () => {
    await expect(createWebPay({ course_id: 0 })).rejects.toThrow();
    expect(requestBackendJson).not.toHaveBeenCalled();
  });
});
