---
phase: 09-improve-ui-ux-of-routines
verified: 2026-03-23T00:00:00Z
status: human_needed
score: 9/9 must-haves verified
re_verification: false
human_verification:
  - test: "Open /beauty, switch to Routines tab, tap 'Add step' on a routine card"
    expected: "Dialog opens showing a 3-column photo grid of all beauty products"
    why_human: "Cannot verify dialog open/close interaction or visual photo grid rendering programmatically"
  - test: "In the picker dialog, type a product name in the search bar"
    expected: "Grid filters instantly to matching products (name or brand)"
    why_human: "Client-side filter behavior requires browser interaction to confirm"
  - test: "Tap a category pill in the picker dialog"
    expected: "Grid filters to show only products in that category"
    why_human: "Pill selection state and filtered rendering require visual inspection"
  - test: "Open the picker for a routine that already has steps; observe the grid"
    expected: "Products already in the routine appear dimmed (opacity-40) with a white checkmark overlay and cannot be tapped"
    why_human: "CSS overlay and pointer-events-none behavior requires visual/interaction inspection"
  - test: "Tap an available (non-dimmed) product in the picker"
    expected: "Product immediately dims with checkmark (optimistic), dialog stays open, product appears in the routine card after close"
    why_human: "Optimistic UI feedback, dialog stay-open behavior, and server refresh are all interaction/timing concerns"
  - test: "Drag a step row in a routine card to a different position"
    expected: "Step reorders successfully; no regression in existing DnD behavior"
    why_human: "Drag-and-drop gesture behavior cannot be verified by static analysis"
---

# Phase 9: Improve UI/UX of Routines — Verification Report

**Phase Goal:** The routine step builder uses a visual photo grid picker dialog instead of a search-only input, making it easy to browse and add products even when you cannot remember names
**Verified:** 2026-03-23
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User sees an "Add step" button below the routine steps list | VERIFIED | `routine-product-picker.tsx` line 107: `<Button variant="outline" className="mt-4">` with `Add step` text |
| 2 | Tapping "Add step" opens a dialog with a photo grid of all products | VERIFIED | `DialogTrigger` wraps the button; `DialogContent` contains `grid grid-cols-3 gap-2` rendering `filteredProducts` — needs human confirmation of open behavior |
| 3 | User can type in the search bar to filter the product grid by name or brand | VERIFIED | `filteredProducts` filter logic at lines 64-72 matches on `p.name` and `p.brand`; `onChange` wired to `setSearchQuery` |
| 4 | User can tap category pills to filter by category | VERIFIED | Inline pill row at lines 131-145 wired to `activeCategory` state; filter at line 70 gates on `p.categorySlug === activeCategory` |
| 5 | Products already in the routine appear dimmed with a checkmark overlay and cannot be tapped | VERIFIED | Lines 165-168: `isAdded` branch applies `pointer-events-none opacity-40`; lines 189-193: `Check` icon overlay rendered when `isAdded` |
| 6 | Tapping an available product adds it as a routine step | VERIFIED | `onClick` calls `handleAddProduct(product.id)` at line 171; `handleAddProduct` calls `addRoutineStep` server action at line 77 |
| 7 | Dialog stays open after adding a product so multiple can be added | VERIFIED | `handleAddProduct` does not call `setOpen(false)`; dialog state managed independently by `handleOpenChange` only |
| 8 | Closing the dialog shows the newly added steps in the routine card | VERIFIED | `onStepAdded` callback triggers `router.refresh()` in `routine-list.tsx` line 148; server data refreshed after each add |
| 9 | Drag-and-drop reorder of existing steps still works | VERIFIED | `routine-list.tsx` retains full DnD context (lines 181-199) with `DndContext`, `SortableContext`, `RoutineStep` — no regression path identified |

**Score:** 9/9 truths verified (automated checks; 6 truths require human confirmation for UX behavior)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/beauty/routine-product-picker.tsx` | Dialog-based product picker with photo grid, search, category filter, dimmed overlay | VERIFIED | 207 lines; exceeds min_lines: 80; contains all required structural elements |
| `src/components/beauty/routine-list.tsx` | Updated routine list accepting allProducts and categories props; renders picker | VERIFIED | Props interface updated at lines 52-56; `RoutineProductPicker` rendered at lines 202-208; `RoutineStepSearch` fully removed |
| `src/app/(private)/beauty/page.tsx` | Passes products data to RoutineList | VERIFIED | Line 30: `<RoutineList initialRoutines={routines} allProducts={products} categories={categories} />` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/(private)/beauty/page.tsx` | `src/components/beauty/routine-list.tsx` | `allProducts={products}` prop | WIRED | Line 30 of beauty page confirms `allProducts={products} categories={categories}` |
| `src/components/beauty/routine-list.tsx` | `src/components/beauty/routine-product-picker.tsx` | `RoutineProductPicker` component render | WIRED | Line 20 imports `RoutineProductPicker`; lines 202-208 render it with all required props |
| `src/components/beauty/routine-product-picker.tsx` | `src/actions/routines.ts` | `addRoutineStep` server action call | WIRED | Line 15 imports `addRoutineStep`; line 77 calls `await addRoutineStep(routineId, productId)` |

All three key links fully wired.

---

### Requirements Coverage

The PLAN declares requirements `[P09-01, P09-02, P09-03, P09-04, P09-05, P09-06, P09-07]`. These IDs appear in the ROADMAP at line 172 and are used as phase-internal handles. They are **not individually defined in REQUIREMENTS.md** — that file uses a different scheme (BEAU-xx, PORT-xx, etc.) and does not contain any P09 entries.

REQUIREMENTS.md traceability table (lines 96-124) maps all v1 requirements through Phase 8 but contains no Phase 9 row. Phase 9 is an enhancement phase with its own requirement namespace.

| Requirement | Description (derived from PLAN/ROADMAP goal) | Status | Evidence |
|-------------|----------------------------------------------|--------|----------|
| P09-01 | "Add step" trigger button in routine card | SATISFIED | Button at picker line 107 |
| P09-02 | Dialog with 3-column photo grid | SATISFIED | `DialogContent` + `grid-cols-3` at picker lines 113, 154 |
| P09-03 | Search bar filters grid by name/brand | SATISFIED | Filter logic lines 64-72; Input wired to `searchQuery` |
| P09-04 | Category pills filter grid | SATISFIED | Inline pill row + `activeCategory` filter |
| P09-05 | Already-added products dimmed with checkmark overlay | SATISFIED | `opacity-40 pointer-events-none` + `Check` icon overlay |
| P09-06 | Dialog stays open for multi-add flow | SATISFIED | No `setOpen(false)` in `handleAddProduct` |
| P09-07 | Wired to `addRoutineStep` server action with optimistic add and error revert | SATISFIED | Full optimistic pattern with `localAddedIds` and `toast.error` revert |

Note: P09-01 through P09-07 do not appear in REQUIREMENTS.md and are not orphaned from REQUIREMENTS.md perspective — they are enhancement IDs defined solely within the phase documents. No REQUIREMENTS.md IDs map to Phase 9 in the traceability table.

---

### Anti-Patterns Found

No anti-patterns detected in the three modified files.

| File | Pattern Scanned | Result |
|------|----------------|--------|
| `routine-product-picker.tsx` | TODO/FIXME/stubs/empty returns | Clean — only legitimate `placeholder` attribute on `<Input>` |
| `routine-list.tsx` | TODO/FIXME/RoutineStepSearch remnants | Clean — old import and JSX fully removed |
| `beauty/page.tsx` | TODO/FIXME/missing prop wiring | Clean |

---

### Human Verification Required

#### 1. Dialog Opens with Photo Grid

**Test:** Navigate to `/beauty`, switch to the Routines tab, tap "Add step" on any routine card.
**Expected:** A dialog overlay appears with a search bar, category pills, and a 3-column grid of product photos.
**Why human:** Dialog open trigger and visual photo grid rendering cannot be verified by static code analysis.

#### 2. Search Bar Filters Grid Instantly

**Test:** With the picker dialog open, type a partial product name or brand in the search field.
**Expected:** The grid updates in real-time to show only matching products.
**Why human:** Client-side state update and re-render timing require browser interaction.

#### 3. Category Pills Filter Grid

**Test:** Tap a category pill (e.g., "Skincare") in the picker.
**Expected:** Grid shows only products in that category; pill becomes visually active (accent background).
**Why human:** Interactive pill state change and filtered grid require visual inspection.

#### 4. Dimmed Overlay for Already-Added Products

**Test:** Open the picker for a routine that already has at least one product step.
**Expected:** That product's thumbnail appears washed out (opacity-40) with a white checkmark overlaid; tapping it does nothing.
**Why human:** CSS opacity and pointer-events-none cannot be confirmed without rendering.

#### 5. Multi-Add Flow — Dialog Stays Open

**Test:** Tap an available product to add it; observe the dialog.
**Expected:** The product immediately dims with a checkmark (optimistic update), the dialog stays open, and another product can be added without reopening.
**Why human:** Dialog stay-open behavior and optimistic state update timing require real interaction.

#### 6. Drag-and-Drop Reorder Regression Check

**Test:** In a routine card with multiple steps, drag a step row to a different position.
**Expected:** Steps reorder correctly; no error; reorder persists after page refresh.
**Why human:** DnD gesture handling requires physical or automated browser interaction.

---

### Gaps Summary

No gaps identified. All automated checks pass:
- All three artifacts exist, are substantive, and are wired.
- All three key links are confirmed in source.
- TypeScript compiles without errors (source files — `.next/dev/types/` generated errors are not project source errors).
- No anti-patterns found.
- SUMMARY commit hashes `f1d4511` and `e740355` both exist in the repository.

Status is `human_needed` rather than `passed` because the UX behaviors central to the phase goal (dialog interaction, visual overlay, multi-add flow, DnD regression) are by nature visual and interaction-based and cannot be fully verified programmatically.

---

_Verified: 2026-03-23_
_Verifier: Claude (gsd-verifier)_
