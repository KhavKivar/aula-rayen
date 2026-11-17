import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BookingLink, WhatsAppLink } from "@/features/landing/home/booking-link";

describe("BookingLink", () => {
  it("lleva al calendario de Calendly en una pestaña nueva", () => {
    render(<BookingLink calendlyUrl="https://calendly.com/rayen" />);

    const link = screen.getByRole("link", { name: /Agendar hora/ });
    expect(link).toHaveAttribute("href", "https://calendly.com/rayen");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("sin Calendly configurado ofrece agendar por WhatsApp", () => {
    render(<BookingLink calendlyUrl={null} />);

    expect(screen.getByRole("link", { name: /Agendar hora/ })).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\/56979363667\?text=/),
    );
  });

  it("el botón de WhatsApp abre el chat con un mensaje listo", () => {
    render(<WhatsAppLink />);

    const link = screen.getByRole("link", { name: /Escribir por WhatsApp/ });
    expect(link).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\/56979363667\?text=Hola/),
    );
    expect(link).toHaveAttribute("target", "_blank");
  });
});
