import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";

export function Navbar({
  isLoggedIn,
  isPending,
}: {
  isLoggedIn: boolean;
  isPending: boolean;
}) {
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#atencion", label: "Atención psicológica" },
    { href: "#profesional", label: "Sobre mí" },
    { href: "#cursos", label: "Aula Rayen" },
  ];
  return (
    <header className="relative z-20 border-b border-border/70 bg-background">
      <div className="page-container flex min-h-24 items-center justify-between gap-6">
        <Link to="/" aria-label="Psicóloga Rayen, inicio">
          <Brand />
        </Link>
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 text-sm lg:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-terracotta"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="text-sm font-medium"
            aria-busy={isPending}
          >
            {isLoggedIn ? "Mi espacio" : "Ingresar"}
          </Link>
          <a href="#agenda" className={buttonVariants({ size: "default" })}>
            Agendar hora <ArrowUpRight size={16} />
          </a>
        </div>
        <button
          type="button"
          disabled={!hydrated}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="grid size-11 place-items-center rounded-full border border-border lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="page-container flex flex-col gap-1 border-t border-border py-4 lg:hidden"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 hover:bg-secondary"
            >
              {link.label}
            </a>
          ))}
          <Link to={isLoggedIn ? "/dashboard" : "/login"} className="px-3 py-3">
            {isLoggedIn ? "Mi espacio" : "Ingresar"}
          </Link>
          <a
            href="#agenda"
            onClick={() => setOpen(false)}
            className={buttonVariants()}
          >
            Agendar hora <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}
