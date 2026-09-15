import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/admin-dashboard/components/payment-format";
import { PaymentStatusBadge } from "@/features/admin-dashboard/components/payment-status-badge";
import type { PaymentResponse } from "@aula-rayen/contracts/payment";

export function PaymentsTable({
  payments,
  onSelectPayment,
}: {
  payments: readonly PaymentResponse[];
  onSelectPayment: (payment: PaymentResponse) => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-[0.11em] text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Comprador</th>
              <th className="px-5 py-4">Curso</th>
              <th className="px-5 py-4">Monto</th>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment.orderId} className="hover:bg-background">
                <td className="px-5 py-4">
                  <p className="font-semibold">{payment.buyerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.buyerEmail}
                  </p>
                </td>
                <td className="max-w-56 truncate px-5 py-4">
                  {payment.courseTitle}
                </td>
                <td className="px-5 py-4 font-semibold">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {new Date(payment.date).toLocaleDateString("es-CL")}
                </td>
                <td className="px-5 py-4">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    id={`payment-trigger-${payment.orderId}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectPayment(payment)}
                  >
                    Ver detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-border md:hidden">
        {payments.map((payment) => (
          <li key={payment.orderId} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{payment.buyerName}</p>
              </div>
              <PaymentStatusBadge status={payment.status} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {payment.courseTitle}
            </p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="font-heading text-xl font-normal">
                {formatCurrency(payment.amount)}
              </p>
              <Button
                id={`payment-trigger-${payment.orderId}`}
                variant="outline"
                size="sm"
                onClick={() => onSelectPayment(payment)}
              >
                <CreditCard aria-hidden="true" /> Detalle
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
