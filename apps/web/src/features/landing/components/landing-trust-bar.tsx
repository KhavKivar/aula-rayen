import { Asterisk } from "lucide-react";
export function LandingTrustBar() {
  return (
    <div className="border-y border-border">
      <div className="page-container flex flex-wrap justify-center gap-x-12 gap-y-4 py-6 text-sm text-muted-foreground">
        {[
          "Escucha sin juicios",
          "Cada proceso es único",
          "Un paso a la vez",
        ].map((label) => (
          <span key={label} className="flex items-center gap-3">
            <Asterisk
              className="text-terracotta"
              size={18}
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
