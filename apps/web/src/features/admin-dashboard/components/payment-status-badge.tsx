import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@aula-rayen/contracts/payment";

const paymentStatusLabel: Record<PaymentStatus, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
};

const paymentStatusVariant: Record<
  PaymentStatus,
  "success" | "warning" | "destructive"
> = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={paymentStatusVariant[status]}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {paymentStatusLabel[status]}
    </Badge>
  );
}
