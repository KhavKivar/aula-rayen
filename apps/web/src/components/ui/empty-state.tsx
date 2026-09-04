import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  titleId: string
  titleClassName?: string
  description?: string
  action?: ReactNode
  className?: string
}

function EmptyState({
  icon,
  title,
  titleId,
  titleClassName,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "rounded-[2rem] border border-dashed border-[#bfcac3] bg-[#fffdf8] px-6 py-16 text-center",
        className
      )}
    >
      {icon}
      <h2
        id={titleId}
        className={cn(
          "font-heading text-2xl font-semibold text-[#294944]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md leading-7 text-[#62716d]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  )
}

export { EmptyState }
