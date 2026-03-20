---
phase: 01-foundation
plan: 04
subsystem: auth
tags: [supabase, server-actions, sign-out, session-management]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: auth actions, user menu, admin client
provides:
  - globalLogout Server Action with admin.signOut global scope
  - "Sign Out All Devices" user menu option with confirmation dialog
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "admin.signOut(userId, 'global') for cross-device session invalidation"

key-files:
  created: []
  modified:
    - src/actions/auth.ts
    - src/components/layout/user-menu.tsx

key-decisions:
  - "Used try/catch around admin signOut so local session is always cleared even if admin call fails"

patterns-established:
  - "Separate state/transition per dialog for independent pending indicators"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05]

# Metrics
duration: 1min
completed: 2026-03-20
---

# Phase 01 Plan 04: Global Sign Out Summary

**Global sign out via Supabase admin API with separate confirmation dialog in user menu dropdown**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-20T02:33:51Z
- **Completed:** 2026-03-20T02:35:08Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Added globalLogout Server Action calling auth.admin.signOut with global scope
- Added "Sign Out All Devices" menu option with dedicated confirmation dialog
- All 45 existing tests pass without modification

## Task Commits

Each task was committed atomically:

1. **Task 1: Add global sign out action and user menu option** - `0ae8b87` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `src/actions/auth.ts` - Added globalLogout function using admin client for global session invalidation
- `src/components/layout/user-menu.tsx` - Added second sign out option, separator, and confirmation dialog

## Decisions Made

- Used try/catch around admin signOut so local cookie session is always cleared even if the admin API call fails (graceful degradation)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Auth gap closure complete, all foundation auth requirements satisfied
- Ready for subsequent phases

---

_Phase: 01-foundation_
_Completed: 2026-03-20_
