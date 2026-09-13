import { queryOptions, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";

/**
 * Sesión global de la app. Vive en shared porque solo depende de
 * `@/lib/auth-client` (importado de forma diferida para no engrosar el
 * entry público) y la consumen varios features (auth, landing) además de
 * las rutas. Los features nunca deben importar queries de otro feature:
 * componen desde routes.
 */
export const sessionQueries = {
  session: queryOptions({
    queryKey: queryKeys.session,
    queryFn: async () => {
      const { authClient } = await import("@/lib/auth-client");
      const session = await authClient.getSession();
      if (!session.data?.session || !session.data?.user) {
        return null;
      }

      return {
        user: session.data.user,
        session: session.data.session,
      };
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 30,
  }),
};

/**
 * Sesión para páginas públicas. Durante SSR no se consulta: el HTML
 * público no depende de la sesión y el fetch sin cookies agregaba una
 * ida y vuelta al API en cada render. El navbar se hidrata y consulta
 * en el cliente.
 */
export function usePublicSession() {
  return useQuery({
    ...sessionQueries.session,
    enabled: !import.meta.env.SSR,
  });
}
