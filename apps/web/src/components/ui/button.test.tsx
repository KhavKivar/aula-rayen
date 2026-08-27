import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { render } from "@/testing/test-utils";

describe("Button", () => {
  it("renders content through the shared application providers", () => {
    render(<Button>Continuar</Button>);

    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });
});
