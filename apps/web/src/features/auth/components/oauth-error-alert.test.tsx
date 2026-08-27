import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OAuthErrorAlert } from "@/features/auth/components/oauth-error-alert";
import { render } from "@/testing/test-utils";

describe("OAuthErrorAlert", () => {
  it("shows existing-account guidance accessibly", () => {
    render(<OAuthErrorAlert error="account_not_linked" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ya existe una cuenta con este correo. Ingresa con tu correo y contraseña.",
    );
  });

  it("shows a generic message without raw callback details", () => {
    render(<OAuthErrorAlert error="unknown" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "No fue posible iniciar sesión con Google. Inténtalo nuevamente.",
    );
    expect(alert).not.toHaveTextContent("provider_secret_error");
  });

  it("renders no alert without an error", () => {
    render(<OAuthErrorAlert />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
