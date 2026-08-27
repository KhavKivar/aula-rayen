import { useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { useSession } from "@/lib/auth-client";

export function DashboardGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      void navigate({ to: "/login", replace: true });
    }
  }, [isPending, navigate, session]);

  if (isPending || !session) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#f7f4ec] px-5 text-[#294944]">
        <div className="flex items-center gap-3" role="status">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          <span>Preparando tu espacio…</span>
        </div>
      </main>
    );
  }

  return children;
}
