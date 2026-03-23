---
phase: 03-beauty-tracker
plan: 03
subsystem: ui
tags: [dnd-kit, drag-and-drop, react, server-actions, sortable, routines]

requires:
  - phase: 03-01
    provides: 'routines and routineSteps schema, beauty product actions'
  - phase: 03-02
    provides: 'beauty page layout with BeautyTabs and ProductGrid'
provides:
  - 'Routine Server Actions (getRoutinesWithSteps, addRoutineStep, removeRoutineStep, reorderRoutineSteps)'
  - 'Drag-and-drop sortable routine steps with @dnd-kit'
  - 'Search-to-add product picker with debounced autocomplete'
  - 'RoutineList, RoutineStep, RoutineStepSearch client components'
affects: [03-beauty-tracker]

tech-stack:
  added: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities']
  patterns:
    [
      'optimistic drag-and-drop reorder with server persistence',
      'debounced search autocomplete with server actions',
    ]

key-files:
  created:
    - src/actions/routines.ts
    - src/components/beauty/routine-list.tsx
    - src/components/beauty/routine-step.tsx
    - src/components/beauty/routine-step-search.tsx
    - src/__tests__/beauty/routines.test.ts
  modified:
    - src/app/(private)/beauty/page.tsx
    - package.json

key-decisions:
  - 'Used @dnd-kit PointerSensor with 8px distance threshold to distinguish taps from drags'
  - 'Optimistic UI for reorder and remove with server-side persistence and error revert'
  - 'router.refresh() on step add to get fresh signed thumbnail URLs from server'

patterns-established:
  - 'Optimistic drag-and-drop: arrayMove local state, then persist via server action, revert on error'
  - 'Debounced search: useRef timeout pattern with 300ms delay for autocomplete'

requirements-completed: [BEAU-05, BEAU-06, BEAU-07]

duration: 3min
completed: 2026-03-20
---

# Phase 3 Plan 3: Routines Tab Summary

**Drag-and-drop routine builder with @dnd-kit sortable steps, search-to-add product picker, and optimistic reorder/remove**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-20T04:18:22Z
- **Completed:** 2026-03-20T04:21:12Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Routine Server Actions with auth gates and batch signed URL fetching for step thumbnails
- Morning/Evening routine cards with sortable step lists using @dnd-kit drag-and-drop
- Search-to-add product picker with 300ms debounced autocomplete
- Optimistic reorder and remove with server persistence and error revert
- Test stubs for all routine operations (12 todos)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @dnd-kit packages and create routine Server Actions with test stubs** - `c4869a7` (feat)
2. **Task 2: Create routine UI components with drag-and-drop and wire into beauty page** - `98e830f` (feat)

## Files Created/Modified

- `src/actions/routines.ts` - Server Actions for routine steps CRUD and reorder with auth gates
- `src/components/beauty/routine-list.tsx` - Morning/Evening routine cards with DndContext and SortableContext
- `src/components/beauty/routine-step.tsx` - Single sortable step row with drag handle, thumbnail, remove
- `src/components/beauty/routine-step-search.tsx` - Debounced product search dropdown for adding steps
- `src/__tests__/beauty/routines.test.ts` - Test stubs for all routine Server Actions
- `src/app/(private)/beauty/page.tsx` - Updated to fetch routines and render RoutineList
- `package.json` - Added @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

## Decisions Made

- Used @dnd-kit PointerSensor with 8px distance threshold to distinguish taps from drags
- Optimistic UI for reorder and remove with server-side persistence and error revert
- router.refresh() on step add to get fresh signed thumbnail URLs from server

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Routines tab fully functional with drag-and-drop reorder, search-to-add, and step removal
- Ready for Phase 03-04 (remaining beauty tracker polish)

## Self-Check: PASSED

All 6 created/modified files verified present. Both task commits (c4869a7, 98e830f) verified in git log.

---

_Phase: 03-beauty-tracker_
_Completed: 2026-03-20_
