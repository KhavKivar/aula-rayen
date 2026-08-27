import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigateMock, useSessionMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useSessionMock: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/lib/auth-client", () => ({
  useSession: useSessionMock,
}));

import { DashboardGate } from "@/features/course-dashboard/components/dashboard-gate";
import { render } from "@/testing/test-utils";

describe("DashboardGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not expose authenticated controls without a session", async () => {
    useSessionMock.mockReturnValue({ data: null, isPending: false });
    render(
      <DashboardGate>
        <button type="button">Conectar Google</button>
      </DashboardGate>,
    );

    expect(
      screen.queryByRole("button", { name: "Conectar Google" }),
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/login",
        replace: true,
      }),
    );
  });

  it("renders authenticated controls for an active session", () => {
    useSessionMock.mockReturnValue({ data: { user: { id: "user-1" } }, isPending: false });
    render(
      <DashboardGate>
        <button type="button">Conectar Google</button>
      </DashboardGate>,
    );

    expect(
      screen.getByRole("button", { name: "Conectar Google" }),
    ).toBeVisible();
  });
});
