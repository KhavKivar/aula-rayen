import { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { setUnauthorizedHandler } from "@/lib/api-client";
import { clearSessionCache } from "@/lib/session-cache";
import { sessionQueries } from "@/lib/session-queries";

/**
 * Reacción global ante un 401 del API: descarta los datos de la sesión
 * vencida y lleva al login conservando la ruta solicitada. Vive en el
 * documento raíz porque lib no puede depender del router.
 */
export function SessionExpiryListener() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearSessionCache(queryClient);
      queryClient.setQueryData(sessionQueries.session.queryKey, null);
      await navigate({
        to: "/login",
        search: { redirect: router.state.location.href },
        replace: true,
      });
      await router.invalidate();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [queryClient, navigate, router]);

  return null;
}
