import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/brand";
import { siteContent } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";
export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="page-container flex flex-col justify-between gap-8 py-10 sm:flex-row sm:items-center">
        <div>
          <Link to="/" aria-label="Psicóloga Rayen, inicio">
            <Brand />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Psicología, arteterapia y formación ·{" "}
            {siteContent.professional.name}
          </p>
        </div>
        <nav
          aria-label="Enlaces del pie de página"
          className="flex flex-wrap gap-6 text-sm"
        >
          <Link
            to="/psicologa-iquique"
            className="hover:text-terracotta"
          >
            Psicóloga en Iquique
          </Link>
          <Link
            to="/sobre-pamela-rayen"
            className="hover:text-terracotta"
          >
            Sobre Pamela
          </Link>
          <Link to="/dashboard" className="hover:text-terracotta">
            Aula Rayen
          </Link>
          <Link to="/login" className="hover:text-terracotta">
            Ingresar
          </Link>
          <ExternalInstagramLink className="flex items-center gap-1 hover:text-terracotta">
            Instagram <ArrowUpRight size={14} />
          </ExternalInstagramLink>
        </nav>
      </div>
    </footer>
  );
}
