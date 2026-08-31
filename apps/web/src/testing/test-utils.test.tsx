import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render, renderWithRouter } from "@/testing/test-utils";

function QueryState({ value }: { value?: string }) {
  const queryClient = useQueryClient();
  if (value) {
    queryClient.setQueryData(["example"], value);
  }
  const query = useQuery({
    queryKey: ["example"],
    queryFn: () => Promise.resolve("remote"),
    enabled: false,
  });

  return <p>{query.data ?? "sin datos"}</p>;
}

function CurrentLocation() {
  const location = useLocation();
  return <p>{location.href}</p>;
}

describe("test utilities", () => {
  it("creates isolated query state for every render", () => {
    const first = render(<QueryState value="primera prueba" />);
    expect(screen.getByText("primera prueba")).toBeVisible();
    first.unmount();

    render(<QueryState />);
    expect(screen.getByText("sin datos")).toBeVisible();
  });

  it("creates isolated memory history with an explicit initial location", async () => {
    const first = await renderWithRouter(<CurrentLocation />, {
      initialEntries: ["/?source=first"],
    });
    expect(screen.getByText("/?source=first")).toBeVisible();
    first.unmount();

    await renderWithRouter(<CurrentLocation />);
    expect(screen.getByText("/")).toBeVisible();
  });
});
