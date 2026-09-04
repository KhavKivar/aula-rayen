"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogBackdrop({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DialogViewport({
  className,
  ...props
}: DialogPrimitive.Viewport.Props) {
  return (
    <DialogPrimitive.Viewport
      data-slot="dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        className
      )}
      {...props}
    />
  )
}

function DialogPopup({
  className,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        "max-h-[92svh] w-full overflow-y-auto rounded-[1.5rem] bg-[#fffdf8] p-6 text-[#294944] shadow-xl outline-none transition data-[ending-style]:translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0 sm:p-8",
        className
      )}
      {...props}
    />
  )
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex items-start justify-between gap-5", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-2xl font-semibold tracking-[-0.03em]",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("mt-2 text-sm leading-6 text-[#65746f]", className)}
      {...props}
    />
  )
}

function DialogClose({
  className,
  children,
  ...props
}: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full border border-[#d9dfd8] text-[#536963] transition hover:bg-[#edf3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294944]",
        className
      )}
      aria-label="Cerrar diálogo"
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" className="size-4" />}
    </DialogPrimitive.Close>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
