import { AlertCircle, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const loadingClasses =
  "flex items-center justify-center gap-3 rounded-[2rem] border border-border bg-card px-6 py-16 text-muted-foreground";

const errorClasses =
  "flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-error-border bg-error-surface px-6 py-16 text-error";

type QueryStateStatus = {
  isPending: boolean;
  isLoadingError: boolean;
  refetch: () => Promise<unknown>;
};

/**
 * Render condicional de los estados de una query: spinner al cargar,
 * alerta con acción al fallar y `children` con datos. Las propiedades
 * `errorDescription` y `errorAction` cubren pantallas con mensaje
 * extendido o CTA propia (por defecto: botón Reintentar vía `onRetry`).
 */
export function QueryState({
  query,
  loading,
  error,
  errorDescription,
  errorAction,
  onRetry,
  loadingClassName,
  errorClassName,
  children,
}: {
  query: QueryStateStatus;
  loading: string;
  error: string;
  errorDescription?: string;
  errorAction?: ReactNode;
  onRetry?: () => void;
  loadingClassName?: string;
  errorClassName?: string;
  children: ReactNode;
}) {
  if (query.isPending) {
    return (
      <div role="status" className={cn(loadingClasses, loadingClassName)}>
        <LoaderCircle className="animate-spin" aria-hidden="true" />
        {loading}
      </div>
    );
  }

  if (query.isLoadingError) {
    return (
      <div role="alert" className={cn(errorClasses, errorClassName)}>
        <div className="flex items-center gap-2">
          <AlertCircle aria-hidden="true" />
          {error}
        </div>
        {errorDescription ? (
          <p className="max-w-md text-center text-sm leading-7">
            {errorDescription}
          </p>
        ) : null}
        {errorAction ??
          (onRetry ? (
            <Button
              variant="outline"
              onClick={() => void query.refetch()}
              className="mt-2"
            >
              Reintentar
            </Button>
          ) : null)}
      </div>
    );
  }

  return <>{children}</>;
}
