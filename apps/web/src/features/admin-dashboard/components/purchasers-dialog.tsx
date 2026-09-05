import { useQuery } from "@tanstack/react-query";
import { AlertCircle, LoaderCircle, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
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
import { adminDashboardQueries } from "@/features/admin-dashboard/api/queries";
import { useDeferredSearch } from "@/hooks/use-deferred-search";

export function PurchasersDialog({
  course,
  onOpenChange,
  isOpen,
}: {
  course: { id: number; title: string } | null;
  isOpen:boolean;
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setQuery("");
        onOpenChange(open);
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport className="items-end p-0 sm:items-center sm:p-5">
          <DialogPopup className="rounded-b-none rounded-t-[1.75rem] sm:max-w-3xl sm:rounded-[1.75rem] sm:p-7">
            <DialogHeader>
              <div>
                <DialogTitle>
                  {`Compradores de ${course?.title ?? "curso"}`}
                </DialogTitle>
                <DialogDescription>
                  Personas que compraron este curso y la fecha de su compra.
                </DialogDescription>
              </div>
              <DialogClose />
            </DialogHeader>
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

      {purchasersQuery.isPending ? (
        <div
          role="status"
          className="mt-6 flex items-center justify-center gap-2 py-10 text-muted-foreground"
        >
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          Cargando compradores…
        </div>
      ) : purchasersQuery.isError ? (
        <div
          role="alert"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#fff8f4] px-5 py-10 text-[#934d3b]"
        >
          <AlertCircle className="size-5" aria-hidden="true" />
          No fue posible cargar los compradores.
        </div>
      ) : visiblePurchasers.length === 0 ? (
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
                      {new Date(purchaser.purchasedAt).toLocaleDateString(
                        "es-CL",
                      )}
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
                <p className="break-all text-muted-foreground">{purchaser.email}</p>
                <p className="text-xs text-muted-foreground">
                  Compra:{" "}
                  {new Date(purchaser.purchasedAt).toLocaleDateString("es-CL")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
