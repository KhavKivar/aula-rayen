import { cn } from "@/lib/utils";

export function FlowerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("size-9 shrink-0", className)}
    >
      <path
        d="M20 7C7-4 1 11 12 18C-4 22 7 36 17 27C19 43 35 35 27 23C43 21 34 5 24 14C29 1 16-2 20 7Z"
        fill="currentColor"
      />
      <circle cx="20" cy="20" r="4" className="fill-background" />
    </svg>
  );
}

export function Brand({
  classroom = false,
  className,
}: {
  classroom?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground",
        className,
      )}
    >
      <FlowerMark />
      <span className="font-heading text-[2.2rem] leading-none tracking-[-0.065em]">
        rayen
        <span className="mt-1.5 block font-sans text-[0.6rem] font-medium uppercase tracking-[0.22em]">
          {classroom ? "Aula Rayen" : "Psicóloga"}
        </span>
      </span>
    </span>
  );
}
