import { useQuery } from "@tanstack/react-query";
import { AlertCircle, LoaderCircle, Search, ShoppingBag } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { Input } from "@/components/ui/input";
import { DemoDialog } from "@/features/admin-dashboard/components/demo-dialog";
import { queries } from "@/config/queries";

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
  const deferredQuery = useDeferredValue(
    query.trim().toLocaleLowerCase("es-CL"),
  );

  const purchasersQuery = useQuery(queries.courseBuyers(course?.id ?? null))

  const purchasers = purchasersQuery.data ?? [];
  const visiblePurchasers = purchasers.filter(
    ({ name, email }) =>
      !deferredQuery ||
      name.toLocaleLowerCase("es-CL").includes(deferredQuery) ||
      email.toLocaleLowerCase("es-CL").includes(deferredQuery),
  );

  return (
    <DemoDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setQuery("");
        onOpenChange(open);
      }}
      title={`Compradores de ${course?.title ?? "curso"}`}
      description="Personas que compraron este curso y la fecha de su compra."
      triggerId={course ? `purchasers-trigger-${course.id}` : undefined}
      wide
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Buscar comprador</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#788680]"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre o correo"
            className="bg-[#f1f2ec] pl-9"
          />
        </label>
      </div>

      {purchasersQuery.isPending ? (
        <div
          role="status"
          className="mt-6 flex items-center justify-center gap-2 py-10 text-[#65746f]"
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
        <div className="mt-6 rounded-2xl border border-dashed border-[#cbd7cf] bg-[#f8f7f1] px-5 py-10 text-center">
          <ShoppingBag
            aria-hidden="true"
            className="mx-auto size-8 text-[#86938e]"
          />
          <p className="mt-3 font-heading text-lg font-semibold">
            {purchasers.length === 0
              ? "Este curso aún no registra compras"
              : "No encontramos compradores"}
          </p>
          <p className="mt-1 text-sm text-[#65746f]">
            {purchasers.length === 0
              ? "Las compras aparecerán aquí cuando se registren."
              : "Intenta con otro nombre o correo."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#d9dfd8]">
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f1f2ec] text-xs uppercase tracking-[0.1em] text-[#65746f]">
                <tr>
                  <th className="px-4 py-3">Comprador</th>
                  <th className="px-4 py-3">Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e8e3]">
                {visiblePurchasers.map((purchaser) => (
                  <tr key={purchaser.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{purchaser.name}</p>
                      <p className="text-[#65746f]">{purchaser.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#52645f]">
                      {new Date(purchaser.purchasedAt).toLocaleDateString(
                        "es-CL",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-[#e4e8e3] sm:hidden">
            {visiblePurchasers.map((purchaser) => (
              <li key={purchaser.id} className="space-y-2 p-4 text-sm">
                <p className="font-semibold">{purchaser.name}</p>
                <p className="break-all text-[#65746f]">{purchaser.email}</p>
                <p className="text-xs text-[#52645f]">
                  Compra:{" "}
                  {new Date(purchaser.purchasedAt).toLocaleDateString("es-CL")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DemoDialog>
  );
}
