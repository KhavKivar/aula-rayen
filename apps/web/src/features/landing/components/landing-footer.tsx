import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { siteContent } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";

export function LandingFooter() {
  return (
    <footer className="bg-[#1e3733] px-5 py-10 text-white/65 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-4">
        <div>
          <p className="font-heading text-lg font-semibold text-white">
            {siteContent.brandName}
          </p>
          <p className="mt-1 text-xs">
            Formación creada por {siteContent.professional.name}
            {siteContent.isDemo ? " · Contenido de demostración" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link className="hover:text-white" to="/login" preload="intent">
            Ingresar
          </Link>
          <ExternalInstagramLink className="inline-flex items-center gap-1 hover:text-white">
            Instagram <ArrowUpRight aria-hidden="true" size={14} />
          </ExternalInstagramLink>
        </div>
      </div>
    </footer>
  );
}
