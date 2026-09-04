import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function TestProviders({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

interface TestRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export function render(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...options }: TestRenderOptions = {},
) {
  return testingLibraryRender(ui, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>{children}</TestProviders>
    ),
    ...options,
  });
}

interface RouterRenderOptions extends TestRenderOptions {
  initialEntries?: string[];
}

export async function renderWithRouter(
  ui: ReactElement,
  {
    initialEntries = ["/"],
    queryClient = createTestQueryClient(),
    ...options
  }: RouterRenderOptions = {},
) {
  const rootRoute = createRootRoute({ component: Outlet });
  const contentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => ui,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([contentRoute]),
    history: createMemoryHistory({ initialEntries }),
  });

  await router.load();
  const result = testingLibraryRender(
    <TestProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </TestProviders>,
    options,
  );

  return { ...result, queryClient, router };
}
