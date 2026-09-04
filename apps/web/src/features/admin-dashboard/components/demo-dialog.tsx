import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DemoDialog({
  children,
  description,
  open,
  onOpenChange,
  title,
  triggerId,
  wide = false,
}: {
  children: ReactNode;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  triggerId?: string;
  wide?: boolean;
}) {

  
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      triggerId={triggerId}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#132b27]/55 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
          <Dialog.Popup
            className={cn(
              "max-h-[92svh] w-full overflow-y-auto rounded-t-[1.75rem] bg-[#fffdf8] p-5 text-[#294944] shadow-2xl outline-none transition data-[ending-style]:translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0 sm:rounded-[1.75rem] sm:p-7",
              wide ? "sm:max-w-3xl" : "sm:max-w-xl",
            )}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <Dialog.Title className="font-heading text-2xl font-semibold tracking-[-0.03em]">
                  {title}
                </Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-2 text-sm leading-6 text-[#65746f]">
                    {description}
                  </Dialog.Description>
                ) : null}
              </div>
              <Dialog.Close
                className="grid size-9 shrink-0 place-items-center rounded-full border border-[#d9dfd8] text-[#536963] transition hover:bg-[#edf3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294944]"
                aria-label="Cerrar diálogo"
              >
                <X aria-hidden="true" className="size-4" />
              </Dialog.Close>
            </div>
            <div className="mt-6">{children}</div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
