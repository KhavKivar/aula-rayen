import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { authClient } from "@/lib/auth-client";

/**
 * Sesión global de la app. Vive en shared porque solo depende de
 * `@/lib/auth-client` y la consumen varios features (auth, landing)
 * además de las rutas. Los features nunca deben importar queries de
 * otro feature: componen desde routes.
 */
export const sessionQueries = {
  session: queryOptions({
    queryKey: queryKeys.session,
    queryFn: async () => {
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
