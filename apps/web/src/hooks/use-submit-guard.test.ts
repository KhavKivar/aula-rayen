import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSubmitGuard } from "@/hooks/use-submit-guard";

describe("useSubmitGuard", () => {
  it("runs the first task and blocks concurrent ones until release", () => {
    const { result } = renderHook(() => useSubmitGuard());
    const first = vi.fn();
    const second = vi.fn();

    let releaseFirst!: () => void;
    result.current((release) => {
      releaseFirst = release;
      first();
    });
    result.current(() => {
      second();
    });

    expect(first).toHaveBeenCalledOnce();
    expect(second).not.toHaveBeenCalled();

    releaseFirst();
    result.current(() => {
      second();
    });

    expect(second).toHaveBeenCalledOnce();
  });
});
