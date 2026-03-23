# Phase 9: Improve UI, UX of Routines - Research

**Researched:** 2026-03-23
**Domain:** React dialog-based product picker UI, client-side filtering, overlay interaction patterns
**Confidence:** HIGH

## Summary

This phase replaces the search-only `RoutineStepSearch` component with a dialog-based product picker that shows a browsable photo grid. The existing codebase already contains all the building blocks: the `Dialog` component (base-ui primitives), the `ProductCard` photo grid layout (3-column `grid-cols-3`), the `getBeautyProducts` server action for fetching all products with signed URLs, and the `addRoutineStep` action for adding steps. The work is primarily UI composition -- assembling existing patterns into a new picker dialog.

The key technical challenge is data flow: the picker dialog needs all products with signed image URLs, but the current `RoutineList` component only receives routine data. The products data is already fetched in the beauty page's server component for the Products tab. The simplest approach is to pass the products data down to `RoutineList` as an additional prop, avoiding a duplicate fetch.

**Primary recommendation:** Build a `RoutineProductPicker` dialog component that receives the full products array, renders a searchable photo grid, dims already-added products, and calls `addRoutineStep` on tap. Replace `RoutineStepSearch` usage in `routine-list.tsx` with this new component.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Replace the current search-only input with an "Add step" button that opens a dialog/sheet overlay
- The dialog contains a search bar at the top for filtering, plus a browsable photo grid of all products below
- Photo grid uses the same 3-column style as the Products tab -- tap a product photo to add it to the routine
- Products already in the routine appear dimmed with a checkmark overlay -- tapping them does nothing (no duplicates)
- Search bar acts as a live filter on the grid, not a separate results list
- After adding a product, the dialog stays open so the user can add multiple steps without reopening
- Closing the dialog returns to the routine card with new steps visible
- Drag-and-drop reorder via @dnd-kit stays the same
- Optimistic UI updates with error revert stays the same
- Morning and Evening routine cards layout stays the same
- Step rows with numbered list, thumbnail, name, drag handle, remove button stays the same

### Claude's Discretion
- Dialog vs bottom sheet (whichever fits the existing project pattern better)
- Photo grid thumbnail size in the picker
- Animation/transition for dialog open/close
- Whether to include category filter pills inside the picker dialog
- Empty state when search filter returns no matches

### Deferred Ideas (OUT OF SCOPE)
- Custom routine creation (beyond Morning/Evening) -- could be a future phase
- Routine card visual theming (morning sun / evening moon icons) -- separate enhancement
- Step presentation improvements (larger thumbnails, brand info) -- separate enhancement
</user_constraints>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @base-ui/react | ^1.3.0 | Dialog primitives | Already used for all overlays in the project |
| next/image | 16.2.0 | Optimized image rendering | Already used in ProductCard |
| lucide-react | ^0.577.0 | Icons (Search, Check, Plus) | Already used project-wide |
| sonner | ^2.0.7 | Toast notifications | Already used for error/success feedback |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/core | ^6.3.1 | Drag and drop | Existing routine reorder -- no changes needed |
| @dnd-kit/sortable | ^10.0.0 | Sortable lists | Existing routine reorder -- no changes needed |

### No New Dependencies Needed
This phase requires zero new npm packages. All UI primitives and interaction patterns are already available in the project.

## Architecture Patterns

### Recommended Component Structure
```
src/components/beauty/
  routine-list.tsx           # MODIFY: accept products prop, render picker button
  routine-step-search.tsx    # DELETE or deprecate (replaced by picker)
  routine-product-picker.tsx # NEW: dialog with photo grid picker
```

### Pattern 1: Dialog-Based Picker (Use Project Dialog Pattern)
**What:** Use the existing `Dialog` component from `src/components/ui/dialog.tsx` which wraps base-ui DialogPrimitive. This is the established overlay pattern (used for lightbox, category manager, product form).
**When to use:** Always -- this is a locked project pattern.
**Recommendation on Claude's discretion (dialog vs bottom sheet):** Use `Dialog` component. The project already uses Dialog for all overlays including the ProductForm and BeautyCategoryManager. Bottom sheets were only used once (ProductBottomSheet) for detail views, not for selection flows. Dialog is the right fit.

```typescript
// Pattern from existing dialog usage
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger render={<Button variant="outline" />}>
    <Plus className="mr-1 h-4 w-4" />
    Add step
  </DialogTrigger>
  <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-md">
    {/* Search + Grid content */}
  </DialogContent>
</Dialog>
```

### Pattern 2: Client-Side Filtering on Pre-Fetched Data
**What:** Load all products once at the page level, pass to picker, filter client-side with `useState` search query. This matches the existing `ProductGrid` pattern which does client-side category filtering.
**When to use:** Always -- the product count is small (personal beauty tracker, likely <100 products).

```typescript
// Filter pattern matching existing ProductGrid
const filteredProducts = allProducts.filter((p) => {
  const matchesSearch = !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSearch;
});
```

### Pattern 3: Dimmed + Checkmark Overlay for Already-Added Products
**What:** Products already in the routine get visual treatment: reduced opacity + checkmark badge. Tap does nothing (no-op, no error toast).
**When to use:** For every product card in the picker grid.

```typescript
// Derive set of already-added product IDs from routine steps
const addedProductIds = new Set(routine.steps.map(s => s.product.id));
const isAlreadyAdded = addedProductIds.has(product.id);

// In render:
<div className={isAlreadyAdded ? 'opacity-40 pointer-events-none' : ''}>
  <ProductImage />
  {isAlreadyAdded && (
    <div className="absolute inset-0 flex items-center justify-center">
      <Check className="h-6 w-6 text-white drop-shadow" />
    </div>
  )}
</div>
```

### Pattern 4: Dialog Stays Open After Adding (Multi-Add Flow)
**What:** After tapping a product to add it, the dialog remains open. The added product immediately gets the dimmed+checkmark treatment. This allows building a full routine without reopening.
**When to use:** This is a locked decision.

```typescript
const handleAddProduct = async (productId: string) => {
  // Optimistic: add to local "added" set immediately
  setLocalAddedIds(prev => new Set([...prev, productId]));
  try {
    await addRoutineStep(routineId, productId);
    onStepAdded(); // triggers router.refresh() in parent
  } catch {
    // Revert optimistic update
    setLocalAddedIds(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
    toast.error('Failed to add step');
  }
};
```

### Pattern 5: Data Flow -- Products Prop Threading
**What:** The beauty page already fetches all products for the Products tab. Pass this same data to `RoutineList` to avoid a duplicate server call.
**When to use:** This is the simplest and most efficient approach.

```typescript
// In beauty/page.tsx -- add products to RoutineList
<RoutineList initialRoutines={routines} allProducts={products} />
```

### Anti-Patterns to Avoid
- **Separate fetch in picker dialog:** Do NOT call `getBeautyProducts()` from inside the picker client component. Products are already available from the page-level fetch.
- **Using searchBeautyProducts for filtering:** Do NOT make server calls on each keystroke. The full product list is already in client state -- filter locally.
- **Closing dialog after each add:** The user explicitly wants multi-add flow. Do NOT auto-close on product tap.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dialog overlay | Custom modal with portals | `Dialog` from `src/components/ui/dialog.tsx` | Already handles backdrop, focus trap, animation, close button |
| Image optimization | Raw `<img>` tags | `next/image` with `fill` + `sizes` | Already used in ProductCard, handles lazy loading and responsive sizes |
| Search debounce | Custom debounce timer | Direct `includes()` filter on state change | Product list is small (<100), no need for debouncing client-side filtering |
| Toast notifications | Custom error UI | `sonner` toast | Already used everywhere in the project |

## Common Pitfalls

### Pitfall 1: Signed URL Expiration in Picker Grid
**What goes wrong:** Product image URLs are signed with expiration (Supabase signed URLs). If the dialog stays open too long, images may fail to load.
**Why it happens:** Signed URLs from `getBeautyProducts` have a default expiration (typically 60 minutes).
**How to avoid:** This is unlikely to be an issue in practice for a personal app. If needed, the page refresh on dialog close would get fresh URLs. No special handling needed.
**Warning signs:** Broken images after leaving dialog open for extended periods.

### Pitfall 2: Stale "Already Added" State After Adding Steps
**What goes wrong:** After adding a step, the routine's step list in the parent component updates via `router.refresh()`, but the picker dialog's local state may not reflect the new step.
**Why it happens:** `router.refresh()` triggers server re-render, but the dialog is client-side state that may not re-sync.
**How to avoid:** Track added products in local state within the picker component (`localAddedIds` Set). On each add, optimistically add the product ID to this Set. Combine with the initial `routine.steps` product IDs to build the complete "already added" set.
**Warning signs:** User can tap the same product twice before the server responds.

### Pitfall 3: DialogContent Height on Mobile
**What goes wrong:** The dialog content overflows the viewport on mobile when showing many products.
**Why it happens:** The default DialogContent has no max-height constraint for scrollable content.
**How to avoid:** Add `max-h-[80vh]` to DialogContent and make the grid area scrollable with `overflow-y-auto`. Keep the search bar sticky at the top.
**Warning signs:** Content hidden below the fold, no scroll available.

### Pitfall 4: Product Data Shape Mismatch
**What goes wrong:** `getBeautyProducts` returns products with full variant data (`variants[]` with signed URLs), but the picker only needs the medium/small variant for thumbnails.
**Why it happens:** The data is already structured for ProductGrid consumption.
**How to avoid:** Reuse the same data shape. The picker can use the same variant selection logic as `ProductCard` (`find 'medium' || find 'small' || first`).
**Warning signs:** N/A -- just be aware of the data shape when building the picker card.

### Pitfall 5: Dialog Z-Index Conflict with DnD Overlay
**What goes wrong:** If somehow DnD and dialog overlap, z-index conflicts could occur.
**Why it happens:** DnD overlays use z-10, dialog uses z-50.
**How to avoid:** This should not be an issue since the dialog blocks interaction with the routine list. No special handling needed.

## Code Examples

### Existing Dialog Usage Pattern (from ProductForm)
```typescript
// Source: src/components/beauty/product-form.tsx (inferred from project patterns)
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Existing Product Card Image Selection
```typescript
// Source: src/components/beauty/product-card.tsx
const mediumVariant =
  product.variants.find((v) => v.variantName === 'medium') ??
  product.variants.find((v) => v.variantName === 'small') ??
  product.variants[0];
```

### Existing Grid Layout from ProductGrid
```typescript
// Source: src/components/beauty/product-grid.tsx line 194
<div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
  {filteredProducts.map((product) => (
    <ProductCard key={product.id} product={product} ... />
  ))}
</div>
```

### Existing "Add Step" Flow
```typescript
// Source: src/components/beauty/routine-step-search.tsx
const handleSelect = async (productId: string) => {
  await addRoutineStep(routineId, productId);
  onStepAdded(); // triggers router.refresh() in parent
};
```

## Claude's Discretion Recommendations

### Dialog vs Bottom Sheet
**Recommendation: Dialog.** The project uses `Dialog` for all interactive overlays (ProductForm, BeautyCategoryManager, photo upload). Bottom sheet is only used for the ProductBottomSheet detail view. A picker with search + grid is an interactive form-like overlay, so Dialog is the right choice.

### Photo Grid Thumbnail Size
**Recommendation: Same aspect-square as ProductCard.** Use `aspect-square` with the 3-column grid layout. Inside the dialog (which is narrower than the full page), this will result in smaller thumbnails naturally. The grid class `grid-cols-3 gap-2` in a `sm:max-w-md` dialog gives roughly 120px thumbnails on mobile -- appropriate for recognition.

### Animation/Transition
**Recommendation: Use the existing Dialog animations.** The `DialogContent` and `DialogOverlay` already have `data-open:animate-in`/`data-closed:animate-out` with fade and zoom. No additional animation work needed.

### Category Filter Pills Inside Picker
**Recommendation: Yes, include them.** The `BeautyCategoryFilter` component already exists and is lightweight (horizontal scroll of pills). Adding it below the search bar and above the grid provides a familiar browsing experience that matches the Products tab. If the product count is small (<20), this could be skipped, but it costs almost nothing to include.

### Empty State for No Search Matches
**Recommendation:** Simple centered text message matching existing patterns:
```typescript
<p className="py-12 text-center text-sm text-text-secondary">
  No products match your search
</p>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Search-only text input | Visual photo grid picker in dialog | This phase | Much better UX when you don't remember product names |
| Type-to-search with debounced server call | Client-side filter on pre-loaded data | This phase | Instant filtering, no network latency |
| Single-add (dialog closes) | Multi-add (dialog stays open) | This phase | Faster routine building |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/__tests__/beauty/routines.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| P09-01 | Picker dialog opens with "Add step" button | component | `npx vitest run src/__tests__/beauty/routine-picker.test.tsx -x` | No -- Wave 0 |
| P09-02 | Photo grid displays all products with images | component | `npx vitest run src/__tests__/beauty/routine-picker.test.tsx -x` | No -- Wave 0 |
| P09-03 | Search bar filters grid client-side | component | `npx vitest run src/__tests__/beauty/routine-picker.test.tsx -x` | No -- Wave 0 |
| P09-04 | Already-added products appear dimmed | component | `npx vitest run src/__tests__/beauty/routine-picker.test.tsx -x` | No -- Wave 0 |
| P09-05 | Tapping product calls addRoutineStep | component | `npx vitest run src/__tests__/beauty/routine-picker.test.tsx -x` | No -- Wave 0 |
| P09-06 | Dialog stays open after adding | component | `npx vitest run src/__tests__/beauty/routine-picker.test.tsx -x` | No -- Wave 0 |
| P09-07 | Existing DnD reorder still works | manual-only | N/A (drag interaction not testable in jsdom) | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/beauty/routine-picker.test.tsx`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/beauty/routine-picker.test.tsx` -- covers P09-01 through P09-06
- [ ] Existing `src/__tests__/beauty/routines.test.ts` has only `it.todo()` stubs -- not blocking but noted

## Open Questions

1. **Product count scalability**
   - What we know: This is a personal app with likely <100 products. Client-side filtering is appropriate.
   - What's unclear: If product count grew to 500+, the dialog grid could become slow.
   - Recommendation: Not a concern for this phase. Client-side filtering is the right call.

2. **Duplicate step prevention at server level**
   - What we know: The UI will prevent tapping already-added products. The server `addRoutineStep` has no duplicate check.
   - What's unclear: Whether a race condition could allow duplicate steps.
   - Recommendation: The optimistic local tracking + `pointer-events-none` makes duplicates very unlikely. A server-side unique constraint could be added but is likely unnecessary for a 2-user app.

## Sources

### Primary (HIGH confidence)
- Project source code: `src/components/beauty/routine-list.tsx`, `routine-step-search.tsx`, `product-grid.tsx`, `product-card.tsx`
- Project source code: `src/components/ui/dialog.tsx` -- base-ui Dialog wrapper
- Project source code: `src/actions/beauty-products.ts`, `src/actions/routines.ts`
- Project source code: `src/app/(private)/beauty/page.tsx`

### Secondary (MEDIUM confidence)
- Project state and decisions: `.planning/STATE.md` -- established patterns for Dialog, optimistic UI, router.refresh()

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all components exist
- Architecture: HIGH -- straightforward composition of existing patterns
- Pitfalls: HIGH -- based on direct code reading, well-understood edge cases

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable -- no external dependencies changing)
