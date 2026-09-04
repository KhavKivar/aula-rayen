import type { ReactNode } from "react";

import { siteContent } from "@/config/static-content";

export function ExternalInstagramLink({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  if (!siteContent.social.instagramUrl) {
    return null;
  }

  return (
    <a
      className={className}
      href={siteContent.social.instagramUrl}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span className="sr-only"> (se abre en un sitio externo)</span>
    </a>
  );
}
