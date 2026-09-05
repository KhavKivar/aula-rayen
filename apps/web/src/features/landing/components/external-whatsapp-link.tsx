import type { ReactNode } from "react";

import { WHATSAPP_URL } from "@/config/seo";

export function ExternalWhatsAppLink({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span className="sr-only"> (se abre en un sitio externo)</span>
    </a>
  );
}
