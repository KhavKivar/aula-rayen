import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCourseBuyers } from "@/features/admin-dashboard/api/get-course-buyers";

vi.mock("@/lib/api-client", () => ({
  apiClient: { get: vi.fn() },
}));

import { apiClient } from "@/lib/api-client";

const buyers = [
  {
    id: "4qsKHnu0mNLyqPVn78v2LSKQrmx880eM",
    name: "Camila Rojas",
    email: "camila@example.com",
    purchasedAt: "2026-09-03T13:20:00.000Z",
  },
];

describe("getCourseBuyers", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it("fetches and validates buyers for a course", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: buyers });

    await expect(getCourseBuyers(41)).resolves.toEqual(buyers);
    expect(apiClient.get).toHaveBeenCalledWith("/courses/buyers/41");
  });

  it("rejects an invalid course id before requesting", async () => {
    await expect(getCourseBuyers(0)).rejects.toThrow();
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
