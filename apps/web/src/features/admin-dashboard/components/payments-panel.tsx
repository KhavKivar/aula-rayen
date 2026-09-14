import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "@/components/ui/query-state";
import { adminDashboardQueries } from "@/features/admin-dashboard/api/queries";
import {
  filterPayments,
  getPaymentMetrics,
  type PaymentFilters,
} from "@/features/admin-dashboard/api/payment-selectors";
import { PaymentDetailDialog } from "@/features/admin-dashboard/components/payment-detail-dialog";
import { PaymentFiltersBar } from "@/features/admin-dashboard/components/payment-filters";
import { formatCurrency } from "@/features/admin-dashboard/components/payment-format";
import { PaymentsTable } from "@/features/admin-dashboard/components/payments-table";
import type { Payment } from "@aula-rayen/contracts/payment";
import { cn } from "@/lib/utils";
import { useDeferredSearch } from "@/hooks/use-deferred-search";

const initialFilters: PaymentFilters = {
  query: "",
  status: "all",
  period: "all",
};

function MetricCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "highlight";
}) {
  const highlighted = variant === "highlight";

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        highlighted ? "border-highlight-border bg-primary text-white" : "border-border bg-card",
      )}
    >
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-[0.12em]",
          highlighted ? "text-primary-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p className="mt-3 font-heading text-3xl font-normal tracking-[-0.03em]">
        {value}
      </p>
    </article>
  );
}

export function PaymentsPanel() {
  const [filters, setFilters] = useState<PaymentFilters>(initialFilters);
  const deferredQuery = useDeferredSearch(filters.query);
  const paymentsQuery = useQuery(adminDashboardQueries.payments);

  const payments = paymentsQuery.data ?? [];

  const [details, setDetails] = useState<{
    open: boolean;
    selectPayment: Payment | null;
  }>({
    open: false,
    selectPayment: null,
  });

  const visiblePayments = filterPayments(payments, {
    ...filters,
    query: deferredQuery,
  });
  const metrics = getPaymentMetrics(visiblePayments);
  const metricCards = [
    { label: "Monto aprobado", value: formatCurrency(metrics.approvedAmount), variant: "highlight" as const },
    { label: "Transacciones", value: String(metrics.total), variant: "default" as const },
    { label: "Aprobadas", value: String(metrics.approved), variant: "default" as const },
    {
      label: "Pendientes / rechazadas",
      value: `${metrics.pending} / ${metrics.rejected}`,
      variant: "default" as const,
    },
  ];

  return (
    <section aria-labelledby="payments-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Actividad comercial</p>
          <h1
            id="payments-title"
            className="mt-2 font-heading text-4xl font-normal tracking-[-0.04em] sm:text-4xl"
          >
            Pagos
          </h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
            Transacciones registradas por la pasarela de pago.
          </p>
        </div>
      </div>

      <QueryState
        query={paymentsQuery}
        loading="Cargando pagos…"
        error="No fue posible cargar los pagos. Inténtalo nuevamente."
        onRetry={() => paymentsQuery.refetch()}
        loadingClassName="mt-7 rounded-2xl"
        errorClassName="mt-7 rounded-2xl"
      >
        <>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map(({ label, value, variant }) => (
              <MetricCard key={label} label={label} value={value} variant={variant} />
            ))}
          </div>

          <PaymentFiltersBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />

          {visiblePayments.length === 0 ? (
            <EmptyState
              className="mt-6 rounded-3xl border-border px-5 py-14"
              icon={
                <ReceiptText
                  aria-hidden="true"
                  className="mx-auto size-9 text-muted-foreground"
                />
              }
              title="Sin resultados de pago"
              titleId="payments-empty-title"
              titleClassName="mt-3 text-xl"
              description="No hay transacciones que coincidan con los filtros."
              action={
                <Button
                  variant="outline"
                  onClick={() => setFilters(initialFilters)}
                >
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <PaymentsTable
              payments={visiblePayments}
              onSelectPayment={(payment) =>
                setDetails({ open: true, selectPayment: payment })
              }
            />
          )}
        </>
      </QueryState>

      <PaymentDetailDialog
        isOpen={details.open}
        payment={details.selectPayment}
        onOpenChange={(open) => {
          setDetails({ ...details, open });
        }}
      />
    </section>
  );
}
