import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { FormDialog } from "@/components/ui/form-dialog";
import { QueryState } from "@/components/ui/query-state";
import { adminDashboardQueries } from "@/features/admin-dashboard/api/queries";
import { formatDate } from "@/features/admin-dashboard/components/payment-format";
import { useDeferredSearch } from "@/hooks/use-deferred-search";

export function PurchasersDialog({
  course,
  onOpenChange,
  isOpen,
}: {
  course: { id: number; title: string } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredSearch(query);

  const purchasersQuery = useQuery(
    adminDashboardQueries.courseBuyers(course?.id ?? null),
  );

  const purchasers = purchasersQuery.data ?? [];
  const visiblePurchasers = purchasers.filter(
    ({ name, email }) =>
      !deferredQuery ||
      name.toLocaleLowerCase("es-CL").includes(deferredQuery) ||
      email.toLocaleLowerCase("es-CL").includes(deferredQuery),
  );

  return (
    <FormDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setQuery("");
        onOpenChange(open);
      }}
      title={`Compradores de ${course?.title ?? "curso"}`}
      description="Personas que compraron este curso y la fecha de su compra."
      variant="sheet"
      size="xl"
    >
      <div className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Buscar comprador</span>
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre o correo"
              className="bg-secondary pl-9"
            />
          </label>
        </div>
      </div>

      <QueryState
        query={purchasersQuery}
        loading="Cargando compradores…"
        error="No fue posible cargar los compradores."
        loadingClassName="mt-6 flex-row gap-2 rounded-2xl border-0 bg-transparent px-5 py-10"
        errorClassName="mt-6 flex-row gap-2 rounded-2xl border-0 px-5 py-10"
      >
        {visiblePurchasers.length === 0 ? (
          <EmptyState
            className="mt-6 rounded-2xl border-border bg-background px-5 py-10"
            icon={
              <ShoppingBag
                aria-hidden="true"
                className="mx-auto size-8 text-muted-foreground"
              />
            }
            title={
              purchasers.length === 0
                ? "Este curso aún no registra compras"
                : "No encontramos compradores"
            }
            titleId="purchasers-empty-title"
            titleClassName="mt-3 text-lg"
            description={
              purchasers.length === 0
                ? "Las compras aparecerán aquí cuando se registren."
                : "Intenta con otro nombre o correo."
            }
          />
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Comprador</th>
                    <th className="px-4 py-3">Compra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visiblePurchasers.map((purchaser) => (
                    <tr key={purchaser.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{purchaser.name}</p>
                        <p className="text-muted-foreground">{purchaser.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(purchaser.purchasedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-border sm:hidden">
              {visiblePurchasers.map((purchaser) => (
                <li key={purchaser.id} className="space-y-2 p-4 text-sm">
                  <p className="font-semibold">{purchaser.name}</p>
                  <p className="break-all text-muted-foreground">
                    {purchaser.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Compra: {formatDate(purchaser.purchasedAt)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </QueryState>
    </FormDialog>
  );
}
