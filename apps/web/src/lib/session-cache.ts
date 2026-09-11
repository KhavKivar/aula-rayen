import type { QueryClient } from "@tanstack/react-query";

/** Discard data from the previous identity before entering the next session. */
export async function clearSessionCache(queryClient: QueryClient) {
  // Cancel first so late responses cannot restore the previous account's data.
  await queryClient.cancelQueries();
  queryClient.clear();
}
