import type { ReactNode } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const viewportByVariant = {
  centered: "",
  sheet: "items-end p-0 sm:items-center sm:p-5",
} as const;

const popupByVariant = {
  centered: "",
  sheet: "rounded-b-none rounded-t-[1.75rem] sm:rounded-[1.75rem] sm:p-7",
} as const;

const popupBySize = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
} as const;

/**
 * Diálogo con scaffolding para formularios. El contenido —incluido el
 * elemento `<form>` con su footer de botones— va como `children`; el
 * slot `footer` es solo para contenido no-form debajo del cuerpo.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "centered",
  size = "sm",
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: keyof typeof viewportByVariant;
  size?: keyof typeof popupBySize;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport className={cn(viewportByVariant[variant])}>
          <DialogPopup
            className={cn(popupBySize[size], popupByVariant[variant])}
          >
            <DialogHeader>
              <div>
                <DialogTitle>{title}</DialogTitle>
                {description ? (
                  <DialogDescription>{description}</DialogDescription>
                ) : null}
              </div>
              <DialogClose />
            </DialogHeader>

            {children}

            {footer ? <div className="mt-6">{footer}</div> : null}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
