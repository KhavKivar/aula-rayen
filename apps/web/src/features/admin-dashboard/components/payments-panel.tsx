import {
  CreditCard,
  FilterX,
  LoaderCircle,
  ReceiptText,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
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
import { Input } from "@/components/ui/input";
import { demoTransactions } from "@/features/admin-dashboard/api/demo-transactions";
import { adminDashboardQueries } from "@/features/admin-dashboard/api/queries";
import {
  filterPayments,
  getPaymentMetrics,
  type PaymentFilters,
} from "@/features/admin-dashboard/api/payment-selectors";
import type { Payment, PaymentStatus } from "@aula-rayen/contracts/payment";
import { cn } from "@/lib/utils";
import { useDeferredSearch } from "@/hooks/use-deferred-search";

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

const initialFilters: PaymentFilters = {
  query: "",
  status: "all",
  period: "all",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={paymentStatusVariant[status]}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {paymentStatusLabel[status]}
    </Badge>
  );
}

function PaymentDetail({
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
                  "Información registrada del pago."
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

export function PaymentsPanel() {
  const [filters, setFilters] = useState<PaymentFilters>(initialFilters);
  const deferredQuery = useDeferredSearch(filters.query);
  const paymentsQuery = useQuery(adminDashboardQueries.payments);

  const payments = paymentsQuery.data ?? demoTransactions;

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
    { label: "Monto aprobado", value: formatCurrency(metrics.approvedAmount) },
    { label: "Transacciones", value: String(metrics.total) },
    { label: "Aprobadas", value: String(metrics.approved) },
    {
      label: "Pendientes / rechazadas",
      value: `${metrics.pending} / ${metrics.rejected}`,
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
            "Transacciones registradas por la pasarela de pago."
          </p>
        </div>
      </div>

      {paymentsQuery.isPending ? (
        <div
          role="status"
          className="mt-7 flex items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-muted-foreground"
        >
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Cargando pagos…
        </div>
      ) : null}

      {paymentsQuery.isPending ? null : (
        <>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map(({ label, value }, index) => (
              <article
                key={label}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-5",
                  index === 0
                    ? "border-[#294944] bg-primary text-white"
                    : "border-border bg-card",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-[0.12em]",
                    index === 0 ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </p>
                <p className="mt-3 font-heading text-3xl font-normal tracking-[-0.03em]">
                  {value}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_190px_170px_auto]">
              <label className="relative">
                <span className="sr-only">Buscar por comprador o correo</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      query: event.target.value,
                    }))
                  }
                  placeholder="Comprador o correo"
                  className="bg-secondary pl-9"
                />
              </label>
              <label>
                <span className="sr-only">Filtrar por estado</span>
                <select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      status: event.target.value as PaymentFilters["status"],
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-border bg-secondary px-3 text-sm"
                >
                  <option value="all">Todos los estados</option>
                  <option value="approved">Aprobado</option>
                  <option value="pending">Pendiente</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </label>
              <label>
                <span className="sr-only">Filtrar por periodo</span>
                <select
                  value={filters.period}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      period: event.target.value as PaymentFilters["period"],
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-border bg-secondary px-3 text-sm"
                >
                  <option value="all">Todo el periodo</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                </select>
              </label>
              <Button
                variant="outline"
                onClick={() => setFilters(initialFilters)}
              >
                <FilterX aria-hidden="true" /> Limpiar
              </Button>
            </div>
          </div>

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
                    {visiblePayments.map((payment) => (
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
                            onClick={() => {
                              setDetails({
                                open: true,
                                selectPayment: payment,
                              });
                            }}
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
                {visiblePayments.map((payment) => (
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
                        onClick={() => {
                          setDetails({
                            open: true,
                            selectPayment: payment,
                          });
                        }}
                      >
                        <CreditCard aria-hidden="true" /> Detalle
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <PaymentDetail
        isOpen={details.open}
        payment={details.selectPayment}
        onOpenChange={(opx) => {
          setDetails({ ...details, open: opx });
        }}
      />
    </section>
  );
}
