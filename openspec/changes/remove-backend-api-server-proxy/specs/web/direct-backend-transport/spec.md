## Purpose

Permite al frontend TanStack Start consumir la API de cursos, pagos y gestión directamente contra `VITE_PUBLIC_API_URL` vía Cloudflare Tunnel `aula-rayen.vasvani.shop/api` a través de la capa `apiClient` (axios), eliminando el helper SSR `backend-api.server.ts` y los wrappers `createServerFn`. Restaura el patrón directo previo a `01a7676` (axios `withCredentials: true`) para todos los endpoints.

## ADDED Requirements

### Requirement: Central apiClient provides direct transport

The system SHALL provide a central `apiClient` at `src/lib/api-client.ts` implemented with `axios` configured as `baseURL: VITE_PUBLIC_API_URL` (from `src/config/env.ts`), `withCredentials: true`, and `headers: { Accept: "application/json" }`, and SHALL export `SessionExpiredError` thrown by a response interceptor when `status === 401`.

#### Scenario: apiClient is configured with env origin and credentials
- **WHEN** `apiClient` is imported
- **THEN** its `baseURL` equals `env.VITE_PUBLIC_API_URL` (e.g., `https://aula-rayen.vasvani.shop/api` in prod, `http://localhost:3000` in dev), `withCredentials` is `true`, and default header `Accept: application/json` is present

#### Scenario: 401 is mapped to SessionExpiredError
- **WHEN** any `apiClient` request receives a `401` response
- **THEN** the interceptor rejects with `SessionExpiredError` (`name === "SessionExpiredError"`, `message === "Sesión expirada"`) instead of the raw `AxiosError`

#### Scenario: Non-401 errors pass through
- **WHEN** the API responds with `400`, `409`, `422`, etc.
- **THEN** the interceptor rejects with the original `AxiosError` (with `response.data` and `status` intact)

### Requirement: Course data is fetched via apiClient without SSR proxy

The system SHALL fetch course catalog, course detail and Webpay creation exclusively via `apiClient`, without routing through `requestBackendJson`, `BackendApiError`, `getRequestHeader("cookie")` or `createServerFn` server functions, and SHALL validate responses with contracts (`courseCatalogSchema`, `courseDetailSchema`, `createWebPayResponseSchema`).

#### Scenario: Catalog fetch goes via apiClient
- **WHEN** `getCourses` is called from the dashboard (via `useQuery` in `CourseDashboard`)
- **THEN** it calls `apiClient.get("/courses")`, parses `response.data` with `courseCatalogSchema`, and returns `CourseCatalog` without invoking any serverFn hop

#### Scenario: Course detail fetch validates input before network
- **WHEN** `getCourse(0)` or any non-positive integer is called
- **THEN** the system throws a zod validation error synchronously and does NOT call `apiClient`

#### Scenario: Course detail fetch goes via apiClient when id is valid
- **WHEN** `getCourse(42)` is called with a valid positive integer
- **THEN** it calls `apiClient.get("/courses/42")` and returns `CourseDetail` validated by `courseDetailSchema`

#### Scenario: No SSR cookie forwarding code executes
- **WHEN** any course API function runs in browser or SSR
- **THEN** no code reads `getRequestHeader("cookie")` nor calls `setResponseHeader("Cache-Control", "no-store")` for these paths; authentication relies on `apiClient` `withCredentials: true` on the same-origin Worker

### Requirement: Webpay creation is performed via apiClient

The system SHALL create a Webpay transaction by calling `apiClient.post("/webpay", { course_id })` and SHALL validate input with `createWebPayDtoSchema` and response with `createWebPayResponseSchema`, mapping `AxiosError` to `CreateWebPayError`.

#### Scenario: Successful Webpay creation returns token and url
- **WHEN** `createWebPay({ course_id: 4 })` is called and the API responds `200` with `{ token, url }`
- **THEN** it returns `CreateWebPayResponse` parsed by `createWebPayResponseSchema`

#### Scenario: Webpay error surfaces structured failure via AxiosError
- **WHEN** the API responds with non-2xx (e.g., `401` or `422`) containing `{ message }` (string or string[])
- **THEN** `createWebPay` rejects with `CreateWebPayError` carrying `message` (array joined by space) and `status` from `error.response.status`, preserving backend message

#### Scenario: Invalid Webpay payload is rejected before apiClient call
- **WHEN** `createWebPay` is called with `course_id` non-positive or missing
- **THEN** it throws a zod validation error and does not call `apiClient`

### Requirement: Unified error and validation semantics are preserved

The system SHALL preserve observable validation semantics after removing the SSR proxy: catalog responses containing private fields (`videoLink`, `fileLink`) are rejected, detail responses missing `videoLink`/`fileLink` are rejected, and HTTP errors expose `message` and `status` without `BackendApiError`.

#### Scenario: Catalog with private links is rejected
- **WHEN** the API returns a catalog entry containing `videoLink`
- **THEN** `getCourses` rejects with a validation error (zod) and does not return partial data

#### Scenario: Detail without content links is rejected
- **WHEN** the API returns a course detail without `videoLink` or `fileLink`
- **THEN** `getCourse` rejects with a validation error

#### Scenario: Backend error message array is joined
- **WHEN** the API returns `400` with `{ message: ["Sesión", "expirada"] }`
- **THEN** the thrown `CreateWebPayError` message equals `"Sesión expirada"` and `status` equals `400`

### Requirement: Authenticated requests use withCredentials and respect env origin

The system SHALL resolve the API base URL from `VITE_PUBLIC_API_URL` (e.g., `https://aula-rayen.vasvani.shop/api` in prod, `http://localhost:3000` in dev) via `src/config/env.ts`, and all course/Webpay/management calls SHALL be issued through `apiClient` with `withCredentials: true` so cookies are sent same-origin via the Cloudflare Tunnel without manual header manipulation.

#### Scenario: Production origin resolves to Worker URL
- **WHEN** the app runs in production with `VITE_PUBLIC_API_URL=https://aula-rayen.vasvani.shop/api`
- **THEN** course calls target `https://aula-rayen.vasvani.shop/api/courses` (and subpaths) via `apiClient` with `withCredentials: true`

#### Scenario: Development origin resolves to localhost
- **WHEN** the app runs locally with `VITE_PUBLIC_API_URL=http://localhost:3000`
- **THEN** course calls target `http://localhost:3000/courses` via `apiClient` with `withCredentials: true`

### Requirement: Course management mutations use apiClient for all endpoints

The system SHALL perform all course-management mutations exclusively via `apiClient`: `createCourse` → `apiClient.post("/courses", data)`, `updateCourse` → `apiClient.patch("/courses/:id", data)`, `deleteCourse` → `apiClient.delete("/courses/:id")`, with contract validation (`createCourseRequestSchema`, `updateCourseRequestSchema`, `courseDetailSchema`) and without `createServerFn` wrappers.

#### Scenario: Create course via apiClient POST
- **WHEN** `createCourse` is called with valid `createCourseRequestSchema` data
- **THEN** it calls `apiClient.post("/courses", data)` and returns validated `CourseDetail`

#### Scenario: Update course via apiClient PATCH
- **WHEN** `updateCourse({ id: 1, data: {...} })` is called with valid input
- **THEN** it calls `apiClient.patch("/courses/1", data)` and returns validated `CourseDetail`

#### Scenario: Delete course via apiClient DELETE
- **WHEN** `deleteCourse({ id: 1 })` is called
- **THEN** it calls `apiClient.delete("/courses/1")` and returns validated `CourseDetail`

#### Scenario: Invalid management payload is rejected before apiClient call
- **WHEN** `createCourse` is called with invalid payload (e.g., `title: ""`)
- **THEN** it throws a zod validation error and does not call `apiClient`

### Requirement: Removal is verifiable and leaves no dead SSR proxy code

The system SHALL remove `src/lib/backend-api.server.ts` and its test, remove `createServerFn` wrappers from all course APIs, and guarantee that every endpoint in `apps/web/src` uses `apiClient` with no remaining imports of `backend-api.server`, `requestBackendJson`, `BackendApiError`, or `@tanstack/react-start/server` for course data paths.

#### Scenario: No dead imports remain
- **WHEN** searching for `requestBackendJson`, `BackendApiError`, or `backend-api.server` in `apps/web/src`
- **THEN** zero matches exist outside archived change history and this spec itself

#### Scenario: No serverFn wrappers remain for any endpoint
- **WHEN** inspecting `apps/web/src/features/course-dashboard/api/get-courses.ts`, `get-course.ts`, `create-webpay.ts`, `apps/web/src/features/course-management/api/create-course.ts`, `update-course.ts`, `delete-course.ts`
- **THEN** none imports `createServerFn` from `@tanstack/react-start` for data fetching; all import `apiClient` from `@/lib/api-client`

#### Scenario: Build and tests pass with apiClient
- **WHEN** running `pnpm exec tsc --noEmit`, `pnpm build`, and `pnpm test` in `apps/web`
- **THEN** they succeed with `apiClient` (axios) and the updated tests mock `apiClient` instead of `requestBackendJson` or `fetch`
