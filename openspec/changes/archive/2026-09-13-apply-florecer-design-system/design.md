## Context

The user approved Florecer 01 and explicitly requested implementation and push, including administration and authentication. See proposal.md. This decision supersedes the earlier mockup-only scope; backend booking remains deferred.

## Goals / Non-Goals

Apply the approved visual language across all existing web routes. Preserve authentication, authorization, course purchase/access, management operations and user work already in progress. Do not add API endpoints, dependencies or real scheduling.

## Decisions

- Centralize semantic palette and typography in `src/styles/app.css`. Use local DM Sans/Fraunces font assets with their licenses.
- Share brand and original flower presentation through `src/components`. Features remain isolated and routes compose them.
- Rebuild the landing page around services, professional profile, courses and contact. Reuse configured profile and Instagram data; label online scheduling as upcoming, not a working calendar.
- Give authentication a shared split layout and update all four access forms through existing UI primitives. Preserve validation/mutations.
- Refresh the administrative shell, course management, payments, dialogs and learning screens using shared tokens, meaningful spacing and readable tables. Preserve ongoing edits in three existing files.
- Use the original 3D flower assets, keeping exploratory Blender alternatives separately. Load animation after hydration; respect reduced motion and expose pause.

## Commands and verification

From `apps/web`: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm test:run`, `pnpm build`. Inspect public/auth and authenticated administrator screens in a browser using local test data and existing test fixtures. Keep browser-only checks outside production code. Run the existing pre-commit hook and push only the intended commit to the current main branch.

## Code style and boundaries

Strict TypeScript, existing Tailwind/Base UI/Lucide, absolute `@/` imports. Example: `className={cn("rounded-3xl border border-border bg-card", className)}`. Never bypass route guards to preview administration, commit secrets, alter API contracts or bundle unrelated existing edits.

## Risks / Trade-offs

- Motion can distract → static reduced-motion mode and pause.
- A visual migration can disturb forms → preserve logic and run existing behavioral tests.
- Current unrelated edits overlap admin files → preserve them and isolate staging/verification of the intended change.

## Migration Plan

Publish through the user-authorized push after validation. Existing automatic web deployment applies. No manual Cloudflare deploy. A revert of the visual commit restores the previous UI without a data migration.
