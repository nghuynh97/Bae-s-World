---
phase: 05-freelance-schedule-income-tracker
plan: 01
subsystem: database, api
tags: [drizzle, server-actions, zod, date-fns, vnd, calendar]

requires:
  - phase: 01-foundation
    provides: Drizzle ORM setup, Supabase auth, Server Actions pattern

provides:
  - scheduleJobs table definition in schema.ts
  - 7 CRUD server actions with auth gates and zod validation
  - VND currency formatting utilities (full and compact)
  - Calendar date math utility (Monday-start week grid)
  - Test suite for format-vnd, date-utils, and schedule actions

affects: [05-02, 05-03]

tech-stack:
  added: [date-fns@4.1.0]
  patterns: [schedule server actions with auth gates, VND formatting, calendar date math]

key-files:
  created:
    - src/actions/schedule.ts
    - src/lib/schedule/format-vnd.ts
    - src/lib/schedule/date-utils.ts
    - src/__tests__/schedule/format-vnd.test.ts
    - src/__tests__/schedule/date-utils.test.ts
    - src/__tests__/schedule/schedule-actions.test.ts
  modified:
    - src/lib/db/schema.ts
    - package.json

key-decisions:
  - "Used text type for jobDate (YYYY-MM-DD string) to avoid timezone issues with date-only values"
  - "Used Intl.NumberFormat vi-VN for VND formatting (zero-dependency, native browser API)"
  - "Monday-start week (weekStartsOn: 1) for calendar grid matching Vietnamese convention"

patterns-established:
  - "Schedule action pattern: auth gate + zod validation + drizzle query, following beauty-products.ts"
  - "VND compact format: M suffix for millions, K for thousands"
  - "Calendar grid: date-fns startOfWeek/endOfWeek with weekStartsOn:1 for Monday-start padding"

requirements-completed: [SCHED-01, SCHED-03, SCHED-05]

duration: 5min
completed: 2026-03-20
---

# Phase 5 Plan 1: Schedule Data Layer Summary

**Drizzle scheduleJobs table with 7 auth-gated server actions, VND currency formatter, and Monday-start calendar date utility -- all with 28 passing tests**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-20T05:24:25Z
- **Completed:** 2026-03-20T05:29:35Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- scheduleJobs table with jobDate, clientName, location, startTime, endTime, payAmount, status, notes
- 7 server actions (createJob, getJobsForMonth, getJobById, updateJob, deleteJob, getIncomeStats, getYearlyStats) all with auth gates and zod validation
- formatVND (Intl.NumberFormat vi-VN) and formatVNDCompact (M/K suffixes) utilities
- getCalendarDays utility returning padded Monday-start month grids via date-fns
- 28 passing tests across format-vnd, date-utils, and schedule-actions

## Task Commits

Each task was committed atomically:

1. **Task 1: Schema, utilities, and test stubs** - `a7caefc` (feat)
2. **Task 2: Server actions with auth gates and tests** - `e82fdff` (feat)

## Files Created/Modified
- `src/lib/db/schema.ts` - Added scheduleJobs table with SQL comment for manual creation
- `src/actions/schedule.ts` - 7 CRUD server actions with auth gates and zod validation
- `src/lib/schedule/format-vnd.ts` - VND currency formatting (full and compact)
- `src/lib/schedule/date-utils.ts` - Calendar date math with date-fns (Monday-start weeks)
- `src/__tests__/schedule/format-vnd.test.ts` - 9 tests for VND formatting
- `src/__tests__/schedule/date-utils.test.ts` - 6 tests for calendar date utility
- `src/__tests__/schedule/schedule-actions.test.ts` - 13 tests for server actions

## Decisions Made
- Used text type for jobDate (YYYY-MM-DD string) to avoid timezone issues -- plan specified this approach
- Used Intl.NumberFormat vi-VN for VND formatting -- zero bundle cost, locale-aware
- Monday-start week (weekStartsOn: 1) for calendar grid matching Vietnamese convention

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed mock structure for getIncomeStats test**
- **Found during:** Task 2 (schedule-actions tests)
- **Issue:** Mock db.select().from().where() returned non-thenable object, but getIncomeStats awaits the where() result directly without chaining .orderBy()
- **Fix:** Made where() mock return a Promise with additional chainable methods via Object.assign
- **Files modified:** src/__tests__/schedule/schedule-actions.test.ts
- **Verification:** All 13 action tests pass
- **Committed in:** e82fdff (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug in test mock)
**Impact on plan:** Trivial test mock fix. No scope creep.

## Issues Encountered
None beyond the mock fix documented above.

## User Setup Required

The scheduleJobs table needs to be created in Supabase. The CREATE TABLE SQL is included as a comment block in `src/lib/db/schema.ts` above the table definition. Run it in the Supabase SQL Editor.

## Next Phase Readiness
- Data layer complete, ready for calendar UI components (Plan 02)
- Server actions provide all data fetching needed by calendar grid and stats header
- date-fns installed and calendar math utility ready for UI consumption

---
*Phase: 05-freelance-schedule-income-tracker*
*Completed: 2026-03-20*
