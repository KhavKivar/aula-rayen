import { Link } from "@tanstack/react-router";

import { siteContent } from "@/config/static-content";

type NavbarProps = {
  isLoggedIn: boolean;
  isPending: boolean;
};

const desktopLinks = [
  { href: "#cursos", label: "Cursos" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#elena", label: "Elena" },
  { href: "#preguntas", label: "Preguntas" },
];

const mobileLinks = [
  { href: "#cursos", label: "Cursos" },
  { href: "#metodologia", label: "Método" },
  { href: "#elena", label: "Elena" },
  { href: "#preguntas", label: "FAQ" },
];

export function Navbar({ isLoggedIn, isPending }: NavbarProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/15 text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <a
          href="#inicio"
          className="font-heading text-xl font-semibold tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {siteContent.brandName}
        </a>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-white/80">
            {desktopLinks.map(({ href, label }) => (
              <li key={href}>
                <a className="transition hover:text-white" href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-h-10 items-center gap-2 sm:gap-3">
          {isPending ? (
            <span className="text-sm text-white/75" role="status">
              Cargando sesión…
            </span>
          ) : isLoggedIn ? (
            <Link
              to="/dashboard"
              className="inline-flex min-h-10 items-center rounded-full bg-[#f0c972] px-4 py-2 text-sm font-semibold text-[#263c38] transition hover:bg-[#f7d990] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ir a mi panel
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-10 items-center rounded-full bg-[#f0c972] px-4 py-2 text-sm font-semibold text-[#263c38] transition hover:bg-[#f7d990] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
      <nav
        aria-label="Navegación móvil"
        className="border-t border-white/10 px-5 py-2 md:hidden"
      >
        <ul className="mx-auto flex max-w-md justify-between text-xs font-medium text-white/75">
          {mobileLinks.map(({ href, label }) => (
            <li key={href}>
              <a className="block py-1" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
