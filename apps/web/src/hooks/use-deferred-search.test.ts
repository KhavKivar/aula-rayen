import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  normalizeSearch,
  useDeferredSearch,
} from "@/hooks/use-deferred-search";

describe("normalizeSearch", () => {
  it("trims and lowercases with es-CL locale", () => {
    expect(normalizeSearch("  Camila ROJAS ")).toBe("camila rojas");
  });
});

describe("useDeferredSearch", () => {
  it("returns the normalized query", async () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useDeferredSearch(query),
      { initialProps: { query: "  Vale " } },
    );

    expect(result.current).toBe("vale");

    rerender({ query: "Camila" });

    await waitFor(() => expect(result.current).toBe("camila"));
  });
});
