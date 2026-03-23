# Retrospective

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-23
**Phases:** 9 (1 skipped) | **Plans:** 25

### What Was Built
- Public portfolio with Instagram-style grid, lightbox, hero banner with model profile
- Beauty product tracker with photo grid, favorites, star ratings, category management
- Morning/evening routine builder with drag-and-drop and visual product picker dialog
- Freelance schedule with month-view calendar, job CRUD, VND income stats and charts
- Invite-code auth system for two users with middleware route protection
- Sharp WebP image pipeline with 4 size variants and drag-and-drop upload
- Soft feminine design system with DM Sans, responsive layout, micro-animations

### What Worked
- Server Actions + revalidatePath for seamless CRUD without manual refresh
- Phase-by-phase execution with verification at each step caught issues early
- Optimistic UI with error revert for responsive feel (favorites, DnD, routine steps)
- Base-ui Dialog primitives gave full control over overlay behavior
- Client-side filtering for small datasets (products, categories) avoided unnecessary server calls

### What Was Inefficient
- Phase 7 (Navigation Menu Optimization) was planned but never executed — improvements were made ad-hoc in later phases and session fixes
- `globalLogout` feature from Phase 01-04 was overwritten by later phases without tracking the regression
- Phase 6 Prettier formatting pass didn't account for planning docs written afterward
- Some SUMMARY metadata became stale as later phases changed earlier code

### Patterns Established
- Base-ui Dialog (not Sheet) for all interactive overlays
- `value={field.value ?? null}` + `items` prop for base-ui Select with react-hook-form
- DialogBody component for scrollable dialog content with fixed header/footer
- `[[...tab]]` catch-all route for URL-based tab state (/beauty/products, /beauty/routines)
- Intercepting routes with @modal parallel slot for edit-in-dialog pattern

### Key Lessons
- Base-ui Select needs explicit `items` prop for label resolution — without it, trigger shows raw value (UUID)
- `DialogPrimitive.Close` renders a `<button>` — don't wrap it in another `<button>` component
- Upload actions that store single imageId miss multi-file uploads — use array state from the start
- `getRoutinesWithSteps` should fallback through variant names (thumb → medium → large) since small images skip thumb generation

### Cost Observations
- Model mix: ~70% opus (planning, execution), ~30% sonnet (verification, checking)
- Sessions: ~15 across 5 days
- Notable: Most phases completed in under 10 minutes each

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 9 |
| Plans | 25 |
| LOC | 10,797 |
| Days | 5 |
| Tech debt items | 5 |
