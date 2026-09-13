import { FilterX, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaymentFilters } from "@/features/admin-dashboard/api/payment-selectors";

export function PaymentFiltersBar({
  filters,
  onChange,
  onReset,
}: {
  filters: PaymentFilters;
  onChange: (filters: PaymentFilters) => void;
  onReset: () => void;
}) {
  return (
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
              onChange({ ...filters, query: event.target.value })
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
              onChange({
                ...filters,
                status: event.target.value as PaymentFilters["status"],
              })
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
              onChange({
                ...filters,
                period: event.target.value as PaymentFilters["period"],
              })
            }
            className="h-12 w-full rounded-xl border border-border bg-secondary px-3 text-sm"
          >
            <option value="all">Todo el periodo</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </label>
        <Button variant="outline" onClick={onReset}>
          <FilterX aria-hidden="true" /> Limpiar
        </Button>
      </div>
    </div>
  );
}
