import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpenCheck,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { Brand, FlowerMark } from "@/components/brand";
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
    <nav aria-label="Administración">
      <ul
        className={cn("gap-2", mobile ? "grid grid-cols-2" : "flex flex-col")}
      >
        {navigation.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-muted-foreground transition hover:bg-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                mobile && "justify-center",
              )}
              activeProps={{
                className:
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                "aria-current": "page",
              }}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
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
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto grid max-w-[1680px] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh flex-col border-r border-border bg-sidebar px-6 py-8 lg:flex">
          <Link to="/" aria-label="Psicóloga Rayen, inicio" className="px-2">
            <Brand classroom />
          </Link>
          <p className="mb-5 mt-14 px-4 text-[0.65rem] font-semibold uppercase tracking-[.2em] text-muted-foreground">
            Administración
          </p>
          <AdminNavigation />
          <div className="mt-auto rounded-2xl bg-sage/70 p-5">
            <FlowerMark className="mb-4 size-10 text-terracotta" />
            <p className="font-heading text-xl">Hacer crecer el aula.</p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Un espacio para compartir lo que sabes y acompañar nuevos
              aprendizajes.
            </p>
            <Link to="/dashboard" className="text-link mt-5 text-xs">
              Ver el aula <ArrowUpRight size={15} />
            </Link>
          </div>
          <Link
            to="/"
            className="mt-5 flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={15} /> Volver al sitio
          </Link>
        </aside>
        <div className="min-w-0">
          <header className="flex min-h-24 items-center justify-between gap-4 border-b border-border px-5 sm:px-8 lg:px-10">
            <div className="lg:hidden">
              <Link to="/" aria-label="Psicóloga Rayen, inicio">
                <Brand classroom />
              </Link>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs text-muted-foreground">
                Aula Rayen / Administración
              </p>
              <p className="mt-1 text-sm font-medium">Tu espacio de gestión</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-medium hover:bg-secondary sm:flex"
              >
                <ArrowLeft size={14} /> Mi espacio
              </Link>
              {accountMenu}
            </div>
          </header>
          <div className="border-b border-border bg-secondary/50 p-4 lg:hidden">
            <AdminNavigation mobile />
            <Link
              to="/dashboard"
              className="mt-3 flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground sm:hidden"
            >
              <ArrowLeft size={14} /> Mi espacio
            </Link>
          </div>
          <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-12 xl:px-14">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
