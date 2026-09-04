import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpenCheck,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    to: "/dashboard/admin/courses" as const,
    label: "Cursos",
    icon: BookOpenCheck,
  },
  {
    to: "/dashboard/admin/payments" as const,
    label: "Pagos",
    icon: CreditCard,
  },
];

function AdminNavigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav aria-label="Administración" className={mobile ? "w-full" : undefined}>
      <ul
        className={cn(
          "gap-2",
          mobile
            ? "grid grid-cols-2 rounded-2xl border border-[#dce4de] bg-white/85 p-1.5 shadow-sm"
            : "flex flex-col",
        )}
      >
        {navigation.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              className={cn(
                "flex items-center gap-3 rounded-xl text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c972]",
                mobile
                  ? "min-h-11 justify-center px-2 py-2 text-xs text-[#536963] hover:bg-[#edf3ee] sm:text-sm"
                  : "px-4 py-3 text-white/72 hover:bg-white/10 hover:text-white",
              )}
              activeProps={{
                className:
                  "bg-[#f0c972] text-[#213c37] shadow-sm hover:bg-[#f0c972] hover:text-[#213c37]",
                "aria-current": "page",
              }}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AdminShell({
  accountMenu,
  children,
}: {
  accountMenu: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh overflow-x-clip bg-[#f3f0e8] text-[#294944]">
      <header className="sticky top-0 z-30 border-b border-[#d9dfd8] bg-[#fffdf8]/95 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#294944] text-[#f0c972]">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-semibold tracking-[-0.02em] sm:text-lg">
                Aula Rayen
              </p>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#c66f51]">
                Administración
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              className="hidden min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#50655f] transition hover:bg-[#e7efe9] sm:inline-flex"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Mi espacio
            </Link>
            {accountMenu}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100svh-4.5rem)] bg-[#294944] p-5 lg:flex lg:flex-col">
          <div className="mb-7 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-[#f0c972]">
              <LayoutDashboard aria-hidden="true" className="size-4" />
              <span className="text-xs font-bold uppercase tracking-[0.14em]">
                Panel operativo
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Cursos reales y módulos de demostración para validar la operación.
            </p>
          </div>
          <AdminNavigation />
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver al dashboard
          </Link>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-[#d9dfd8] bg-[#fffdf8] px-4 py-3 lg:hidden">
            <AdminNavigation mobile />
          </div>
          <main className="min-w-0 px-4 py-7 sm:px-7 sm:py-10 lg:px-10 xl:px-14">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
