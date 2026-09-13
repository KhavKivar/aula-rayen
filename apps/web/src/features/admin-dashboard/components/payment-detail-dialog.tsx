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
import { formatCurrency } from "@/features/admin-dashboard/components/payment-format";
import { PaymentStatusBadge } from "@/features/admin-dashboard/components/payment-status-badge";
import type { Payment } from "@aula-rayen/contracts/payment";

export function PaymentDetailDialog({
  payment,
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  payment: Payment | null;
  onOpenChange: (open: boolean) => void;
}) {
  const rows = payment
    ? [
        ["Comprador", payment.buyerName],
        ["Correo", payment.buyerEmail],
        ["Curso", payment.courseTitle],
        ["Monto", formatCurrency(payment.amount)],
        ["Fecha", new Date(payment.date).toLocaleString("es-CL")],
        ["Medio de pago", payment.maskedCard],
        [
          "Código de autorización",
          payment.authorizationCode ?? "No disponible",
        ],
      ]
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport className="items-end p-0 sm:items-center sm:p-5">
          <DialogPopup className="rounded-b-none rounded-t-[1.75rem] sm:max-w-xl sm:rounded-[1.75rem] sm:p-7">
            <DialogHeader>
              <div>
                <DialogTitle>Detalle de transacción</DialogTitle>
                <DialogDescription>
                  Información registrada del pago.
                </DialogDescription>
              </div>
              <DialogClose />
            </DialogHeader>
            <div className="mt-6">
              {payment ? (
                <>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary p-4">
                    <span className="text-sm font-semibold">
                      {payment.buyerName}
                    </span>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                  <dl className="mt-5 divide-y divide-border">
                    {rows.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid gap-1 py-3 sm:grid-cols-[170px_1fr]"
                      >
                        <dt className="text-sm font-semibold text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="break-words text-sm font-medium">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : null}
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
