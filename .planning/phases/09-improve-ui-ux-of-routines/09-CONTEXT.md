# Phase 9: Improve UI, UX of Routines - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve the add-product-to-routine interaction in the beauty tracker. The current search-only approach is hard to use when you don't remember the product name. Replace with a browsable photo grid picker in a dialog overlay, while keeping search as a filter.

</domain>

<decisions>
## Implementation Decisions

### Add-product flow
- Replace the current search-only input with an "Add step" button that opens a dialog/sheet overlay
- The dialog contains a search bar at the top for filtering, plus a browsable photo grid of all products below
- Photo grid uses the same 3-column style as the Products tab — tap a product photo to add it to the routine
- Products already in the routine appear dimmed with a checkmark overlay — tapping them does nothing (no duplicates)
- Search bar acts as a live filter on the grid, not a separate results list
- After adding a product, the dialog stays open so the user can add multiple steps without reopening
- Closing the dialog returns to the routine card with new steps visible

### What stays the same
- Drag-and-drop reorder via @dnd-kit (existing pattern)
- Optimistic UI updates with error revert
- Morning and Evening routine cards layout
- Step rows with numbered list, thumbnail, name, drag handle, remove button

### Claude's Discretion
- Dialog vs bottom sheet (whichever fits the existing project pattern better)
- Photo grid thumbnail size in the picker
- Animation/transition for dialog open/close
- Whether to include category filter pills inside the picker dialog
- Empty state when search filter returns no matches

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Vision, constraints, two-user system, aesthetic requirements
- `.planning/REQUIREMENTS.md` — BEAU-05, BEAU-06 acceptance criteria for routines

### Prior phase patterns
- `.planning/phases/03-beauty-tracker/03-CONTEXT.md` — Original routine builder decisions, product shelf display, search-to-add pattern

### Existing infrastructure
- `src/components/beauty/routine-step-search.tsx` — Current search-to-add component (to be replaced)
- `src/components/beauty/routine-list.tsx` — Routine list with DnD, step management, handleStepAdded callback
- `src/components/beauty/product-grid.tsx` — Existing photo grid component (reference for picker grid style)
- `src/components/beauty/product-card.tsx` — Product card component used in the grid
- `src/actions/beauty-products.ts` — searchBeautyProducts and getBeautyProducts server actions
- `src/actions/routines.ts` — addRoutineStep, reorderRoutineSteps, removeRoutineStep server actions
- `src/components/ui/dialog.tsx` — Existing dialog component (base-ui Dialog primitives)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/beauty/product-grid.tsx` — 3-column photo grid with category filter, can reference layout for picker
- `src/components/beauty/product-card.tsx` — Product photo card with heart overlay, adaptable for checkmark overlay
- `src/components/ui/dialog.tsx` — Base-ui Dialog primitives used throughout the app
- `src/actions/beauty-products.ts` — getBeautyProducts returns all products, searchBeautyProducts for filtered search

### Established Patterns
- Base-ui Dialog primitives for overlays (not shadcn wrapper) — used for lightbox and category manager
- Server Actions with zod validation for data operations
- Optimistic UI with state rollback on error
- `router.refresh()` after step add to get fresh signed thumbnail URLs

### Integration Points
- `RoutineStepSearch` component is rendered inside each routine card in `routine-list.tsx`
- `handleStepAdded` callback triggers `router.refresh()` for fresh data
- New picker component replaces `RoutineStepSearch` with same interface (routineId + onStepAdded)

</code_context>

<specifics>
## Specific Ideas

- The picker should feel like browsing your product shelf — same visual language as the Products tab
- Dimmed + checkmark for already-added products prevents confusion without hiding options
- Keeping the dialog open after adding allows building a full routine in one flow
- Search becomes a filter on the visual grid, not a primary interaction

</specifics>

<deferred>
## Deferred Ideas

- Custom routine creation (beyond Morning/Evening) — could be a future phase
- Routine card visual theming (morning sun / evening moon icons) — separate enhancement
- Step presentation improvements (larger thumbnails, brand info) — separate enhancement

</deferred>

---

*Phase: 09-improve-ui-ux-of-routines*
*Context gathered: 2026-03-23*
