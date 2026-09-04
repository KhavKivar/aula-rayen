import { FlaskConical } from "lucide-react";

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6c985] bg-[#fff7df] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#75571a]">
      <FlaskConical aria-hidden="true" className="size-3.5" />
      Datos de demostración
    </span>
  );
}
