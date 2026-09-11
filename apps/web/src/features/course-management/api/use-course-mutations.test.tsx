import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { queryKeys } from "@/config/query-keys";
import { createTestQueryClient } from "@/testing/test-utils";
import {
  useDeleteCourse,
  useUpdateCourse,
} from "@/features/course-management/api/use-course-mutations";

const { updateCourse, deleteCourse } = vi.hoisted(() => ({
  updateCourse: vi.fn(),
  deleteCourse: vi.fn(),
}));

vi.mock("@/features/course-management/api/create-course", () => ({
  createCourse: vi.fn(),
}));
vi.mock("@/features/course-management/api/update-course", () => ({
  updateCourse,
}));
vi.mock("@/features/course-management/api/delete-course", () => ({
  deleteCourse,
}));

const original = {
  id: 1,
  title: "Curso original",
  description: "Descripción",
  duration: "2 horas",
  price: 25000,
  createdAt: "2026-08-17T00:00:00.000Z",
  hasAccess: true,
  videoLink: "https://example.com/old-video",
  fileLink: "https://example.com/file",
};

function setup() {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(queryKeys.courses, [original]);
  queryClient.setQueryData(queryKeys.course(1), original);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

describe("course mutation cache", () => {
  beforeEach(() => vi.clearAllMocks());

  it("reopens an updated course with fresh detail even when an older request finishes later", async () => {
    const { queryClient, wrapper } = setup();
    const pending = Promise.withResolvers<typeof original>();
    const oldRequest = queryClient
      .fetchQuery({
        queryKey: queryKeys.course(1),
        queryFn: () => pending.promise,
      })
      .catch(() => undefined);
    const updated = {
      ...original,
      title: "Curso actualizado",
      videoLink: "https://example.com/new-video",
    };
    updateCourse.mockResolvedValueOnce(updated);
    const { result } = renderHook(() => useUpdateCourse(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: 1,
        data: { title: updated.title },
      });
    });
    pending.resolve(original);
    await oldRequest;

    const detail = await queryClient.fetchQuery({
      queryKey: queryKeys.course(1),
      queryFn: async () => updated,
      staleTime: 300_000,
    });
    expect(detail).toEqual(updated);
    expect(queryClient.getQueryState(queryKeys.courses)?.isInvalidated).toBe(
      true,
    );
  });

  it("removes deleted detail so reopening requests the server instead of returning cached content", async () => {
    const { queryClient, wrapper } = setup();
    deleteCourse.mockResolvedValueOnce(original);
    const { result } = renderHook(() => useDeleteCourse(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ id: 1 });
    });

    const fetchDeleted = vi.fn().mockRejectedValue(new Error("Not found"));
    await expect(
      queryClient.fetchQuery({
        queryKey: queryKeys.course(1),
        queryFn: fetchDeleted,
        staleTime: 300_000,
      }),
    ).rejects.toThrow("Not found");
    expect(fetchDeleted).toHaveBeenCalledOnce();
    expect(queryClient.getQueryState(queryKeys.courses)?.isInvalidated).toBe(
      true,
    );
  });
});
