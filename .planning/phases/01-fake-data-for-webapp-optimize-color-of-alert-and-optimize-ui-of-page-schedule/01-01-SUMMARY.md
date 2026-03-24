---
phase: 01-fake-data-for-webapp-optimize-color-of-alert-and-optimize-ui-of-page-schedule
plan: 01
subsystem: database
tags: [seed, drizzle, supabase-storage, cataas, admin, server-action]

# Dependency graph
requires:
  - phase: v1.0
    provides: All table schemas, Supabase storage buckets, admin page, auth system
provides:
  - Unified seed script (CLI) that resets and populates all content tables
  - Admin-only seed button with confirmation dialog
  - npm run seed command for quick data population
affects: [01-02, admin, portfolio, beauty, schedule]

# Tech tracking
tech-stack:
  added: []
  patterns: [FK-safe delete order, cataas.com cat image fetching, isBoyfriend auth check via invite_codes]

key-files:
  created:
    - scripts/seed-all.ts
    - src/actions/seed.ts
    - src/app/(private)/admin/seed-button.tsx
  modified:
    - package.json
    - src/app/(private)/admin/page.tsx

key-decisions:
  - "Duplicated seed logic between CLI script and server action (simpler than shared module across Next.js/CLI boundary)"
  - "isBoyfriend check uses invite_codes.assignedName='Boyfriend' match against current user auth ID"
  - "22 portfolio items, 10 beauty products, ~15-20 schedule jobs for realistic demo data density"

patterns-established:
  - "FK-safe delete order: routineSteps > portfolioItems > beautyProducts > imageVariants > images > routines > categories > beautyCategories > scheduleJobs > aboutContent"
  - "isBoyfriend() pattern for boyfriend-only admin features"

requirements-completed: []

# Metrics
duration: 4min
completed: 2026-03-24
---

# Phase 01 Plan 01: Seed Script Summary

**Unified reset-and-seed CLI script and admin button populating 22 portfolio cat images, 10 beauty products with routines, and 15-20 schedule jobs across 3 months**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-24T02:19:21Z
- **Completed:** 2026-03-24T02:23:45Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- CLI seed script (`npm run seed`) that resets all content tables in FK-safe order and populates with realistic demo data
- 22 portfolio items with cat images fetched from cataas.com and uploaded to Supabase Storage
- 10 Vietnamese-named beauty products with categories, routines, and routine steps
- 15-20 schedule jobs spread across 3 months with Vietnamese client names and VND pay amounts
- Admin-only "Reset & Seed Data" button visible only to boyfriend account with confirmation dialog

## Task Commits

Each task was committed atomically:

1. **Task 1: Create unified seed-all.ts script and add npm run seed command** - `bd32028` (feat)
2. **Task 2: Create admin seed server action and conditional button** - `4fbd17f` (feat)

## Files Created/Modified
- `scripts/seed-all.ts` - Unified CLI seed script (411 lines) with storage cleanup, FK-safe reset, portfolio/beauty/schedule seeding
- `src/actions/seed.ts` - Server action with isBoyfriend() auth check and resetAndSeed() action
- `src/app/(private)/admin/seed-button.tsx` - Client component with confirmation dialog and loading state
- `src/app/(private)/admin/page.tsx` - Added conditional seed button rendering
- `package.json` - Added "seed" script

## Decisions Made
- Duplicated seed logic between CLI script and server action rather than creating a shared module, since CLI runs outside Next.js and server action runs inside (different module resolution)
- Used invite_codes table `assignedName='Boyfriend'` to identify boyfriend account (no role column in profiles)
- 22 portfolio items for realistic gallery density, 10 beauty products across 4 categories, 15-20 jobs across 3 months

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript error in `portfolio-admin-client.tsx` (from 01-02 plan commits) causes `next build` type-check failure. Not caused by 01-01 changes. Logged to deferred-items.md.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Seed infrastructure complete for both CLI and admin UI usage
- Plan 01-02 (toast colors, job count stat, portfolio form fix) can proceed independently

---
*Phase: 01-fake-data-for-webapp-optimize-color-of-alert-and-optimize-ui-of-page-schedule*
*Completed: 2026-03-24*
