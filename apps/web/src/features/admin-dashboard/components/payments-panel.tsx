import { CreditCard, FilterX, ReceiptText, Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoBadge } from "@/features/admin-dashboard/components/demo-badge";
import { DemoDialog } from "@/features/admin-dashboard/components/demo-dialog";
import {
  demoTransactions,
  filterPayments,
  getPaymentMetrics,
} from "@/features/admin-dashboard/data";
import type {
  DemoTransaction,
  PaymentFilters,
  PaymentStatus,
} from "@/features/admin-dashboard/types";
import { cn } from "@/lib/utils";

const paymentStatusLabel: Record<PaymentStatus, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
};

const statusClass: Record<PaymentStatus, string> = {
  approved: "bg-[#e4f2e8] text-[#286044]",
  pending: "bg-[#fff0cc] text-[#76540e]",
  rejected: "bg-[#fbe6df] text-[#934d3b]",
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
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        statusClass[status],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {paymentStatusLabel[status]}
    </span>
  );
}

function PaymentDetail({
  payment,
  onOpenChange,
}: {
  payment: DemoTransaction | null;
  onOpenChange: (open: boolean) => void;
}) {
  const rows = payment
    ? [
        ["Orden", payment.orderId],
        ["Comprador", payment.buyerName],
        ["Correo", payment.buyerEmail],
        ["Curso", payment.courseTitle],
        ["Monto", formatCurrency(payment.amount)],
        ["Fecha", new Date(payment.date).toLocaleString("es-CL")],
        ["Medio de pago", payment.maskedCard],
        ["Código de autorización", payment.authorizationCode ?? "No disponible"],
      ]
    : [];

  return (
    <DemoDialog
      open={Boolean(payment)}
      onOpenChange={onOpenChange}
      title="Detalle de transacción"
      description="Información ficticia para validar el flujo administrativo."
      triggerId={payment ? `payment-trigger-${payment.orderId}` : undefined}
    >
      {payment ? (
        <>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f1f2ec] p-4">
            <span className="font-mono text-sm font-semibold">{payment.orderId}</span>
            <PaymentStatusBadge status={payment.status} />
          </div>
          <dl className="mt-5 divide-y divide-[#e4e8e3]">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[170px_1fr]">
                <dt className="text-sm font-semibold text-[#65746f]">{label}</dt>
                <dd className="break-words text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <DemoBadge />
          </div>
        </>
      ) : null}
    </DemoDialog>
  );
}

export function PaymentsPanel() {
  const [filters, setFilters] = useState<PaymentFilters>(initialFilters);
  const deferredQuery = useDeferredValue(filters.query);
  const [selectedPayment, setSelectedPayment] =
    useState<DemoTransaction | null>(null);
  const visiblePayments = filterPayments(demoTransactions, {
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
            className="mt-2 font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            Pagos
          </h1>
          <p className="mt-2 max-w-2xl leading-7 text-[#65746f]">
            Explora una muestra de transacciones antes de conectar la conciliación real.
          </p>
        </div>
        <DemoBadge />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ label, value }, index) => (
          <article
            key={label}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-5",
              index === 0
                ? "border-[#294944] bg-[#294944] text-white"
                : "border-[#dce2dc] bg-[#fffdf8]",
            )}
          >
            <p className={cn("text-xs font-bold uppercase tracking-[0.12em]", index === 0 ? "text-[#f0c972]" : "text-[#71807b]")}>{label}</p>
            <p className="mt-3 font-heading text-2xl font-semibold tracking-[-0.03em]">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#dce2dc] bg-[#fffdf8] p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_190px_170px_auto]">
          <label className="relative">
            <span className="sr-only">Buscar por comprador u orden</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#788680]" />
            <Input
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({ ...current, query: event.target.value }))
              }
              placeholder="Comprador, correo u orden"
              className="bg-[#f1f2ec] pl-9"
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
              className="h-9 w-full rounded-full border border-[#d9dfd8] bg-[#f1f2ec] px-3 text-sm"
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
              className="h-9 w-full rounded-full border border-[#d9dfd8] bg-[#f1f2ec] px-3 text-sm"
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
        <div className="mt-6 rounded-3xl border border-dashed border-[#cbd7cf] bg-[#fffdf8] px-5 py-14 text-center">
          <ReceiptText aria-hidden="true" className="mx-auto size-9 text-[#87948f]" />
          <h2 className="mt-3 font-heading text-xl font-semibold">Sin resultados de pago</h2>
          <p className="mt-1 text-sm text-[#65746f]">No hay transacciones que coincidan con los filtros.</p>
          <Button className="mt-5" variant="outline" onClick={() => setFilters(initialFilters)}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#dce2dc] bg-[#fffdf8]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[#ecefe9] text-xs uppercase tracking-[0.11em] text-[#65746f]">
                <tr>
                  <th className="px-5 py-4">Orden</th>
                  <th className="px-5 py-4">Comprador</th>
                  <th className="px-5 py-4">Curso</th>
                  <th className="px-5 py-4">Monto</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e8e3]">
                {visiblePayments.map((payment) => (
                  <tr key={payment.orderId} className="hover:bg-[#f7f6f0]">
                    <td className="px-5 py-4 font-mono text-xs font-semibold">{payment.orderId}</td>
                    <td className="px-5 py-4"><p className="font-semibold">{payment.buyerName}</p><p className="text-xs text-[#65746f]">{payment.buyerEmail}</p></td>
                    <td className="max-w-56 truncate px-5 py-4">{payment.courseTitle}</td>
                    <td className="px-5 py-4 font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="px-5 py-4 text-[#65746f]">{new Date(payment.date).toLocaleDateString("es-CL")}</td>
                    <td className="px-5 py-4"><PaymentStatusBadge status={payment.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <Button id={`payment-trigger-${payment.orderId}`} variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>Ver detalle</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-[#e4e8e3] md:hidden">
            {visiblePayments.map((payment) => (
              <li key={payment.orderId} className="p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold">{payment.orderId}</p><p className="mt-1 font-semibold">{payment.buyerName}</p></div><PaymentStatusBadge status={payment.status} /></div>
                <p className="mt-3 text-sm text-[#65746f]">{payment.courseTitle}</p>
                <div className="mt-4 flex items-center justify-between gap-4"><p className="font-heading text-lg font-semibold">{formatCurrency(payment.amount)}</p><Button id={`payment-trigger-${payment.orderId}`} variant="outline" size="sm" onClick={() => setSelectedPayment(payment)}><CreditCard aria-hidden="true" /> Detalle</Button></div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <PaymentDetail
        payment={selectedPayment}
        onOpenChange={(open) => {
          if (!open) setSelectedPayment(null);
        }}
      />
    </section>
  );
}
