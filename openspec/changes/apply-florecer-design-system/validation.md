# Validation

Florecer 01 is applied to the landing page, authentication/recovery, learner catalog and course content, payment result, admin navigation, courses, payments and dialogs. The original Blender flower is retained as a local poster and muted looping video with a pause control and reduced-motion behavior.

- `pnpm lint` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm test:run` — 30 files, 105 tests passed.
- `pnpm test:e2e` — 5 tests passed (login guards, looping/pause/resume, reduced motion, mobile appointment navigation).
- `pnpm build` — passed.
- Browser review at 1440 px and 390 px: public/auth screens, course catalog/content, admin courses/payments, create-course, buyers and payment-detail dialogs. No horizontal page overflow or JavaScript page errors in the checked flows. Protected screens used intercepted local fixture responses; no production records were changed.

Validation was repeated against an isolated checkout of the exact staged change, excluding the user's preexisting payment/dialog edits. Existing work remains in the primary working tree.

Appointments currently lead to the configured Instagram contact; an online booking backend is outside this change. Publication uses the repository's normal push-triggered web deployment.
