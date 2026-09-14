import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
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
 * Diálogo de confirmación: compone Portal/Backdrop/Viewport/Popup/Header
 * y el footer Cancelar/Confirmar con estado pending. El contenido propio
 * (por ejemplo, una alerta de error) va como `children`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel,
  cancelLabel = "Cancelar",
  destructive = false,
  isPending = false,
  variant = "centered",
  size = "sm",
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isPending?: boolean;
  variant?: keyof typeof viewportByVariant;
  size?: keyof typeof popupBySize;
  onConfirm: () => void;
  children?: ReactNode;
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

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant={destructive ? "destructive" : "default"}
                onClick={onConfirm}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    {pendingLabel ?? confirmLabel}
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
