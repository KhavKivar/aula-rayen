import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f4f4f4] px-4 py-10">
      <Outlet />
    </main>
  );
}
