# Phase 3: Beauty Tracker - Research

**Researched:** 2026-03-20
**Domain:** Private beauty product collection with CRUD, category filtering, star ratings, favorites, routines with drag-and-drop reorder
**Confidence:** HIGH

## Summary

Phase 3 builds a private beauty product tracker with two main views: a photo-only product grid with category filter pills and favorites, and a routine builder with drag-and-drop step reordering. The entire section is behind auth (already enforced by middleware from Phase 1).

The project already has strong infrastructure to build on: category filter pills component, image upload pipeline with private bucket + signed URLs, Server Action CRUD patterns with zod validation, and Drizzle ORM schema conventions. The main new capabilities needed are: (1) a bottom sheet/slide-up panel for product details, (2) drag-and-drop reordering for routine steps, (3) a star rating UI component, and (4) new database tables for beauty products, beauty categories, routines, and routine steps.

**Primary recommendation:** Use the stable @dnd-kit/core + @dnd-kit/sortable packages (not the beta @dnd-kit/react) for drag-and-drop. Use shadcn Sheet component with `side="bottom"` for the slide-up product detail panel. Build star rating as a simple custom component with lucide Star icons -- no library needed for 5 static stars.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Photo-only grid layout (like Instagram profile grid) -- no text overlay on thumbnails
- 3 columns on mobile, 4-5 columns on desktop
- Category filter pills at top (same pattern as portfolio gallery in Phase 2)
- Tap a product photo to open a slide-up bottom sheet panel with full details (name, brand, rating, notes, photo)
- Favorites filter: heart icon overlay on top-right corner of product thumbnails
- Empty state: friendly illustration/icon + "Start your beauty collection" with an Add button
- 5-star rating system (classic 1-5 stars)
- Favorite toggle via heart icon on the product photo in the grid
- Filled heart = favorited, outline heart = not favorited
- "Favorites" tab in the category filter pills alongside Skincare, Makeup, etc.
- Beauty page has two tabs: "Products" (the photo grid) and "Routines" (morning/evening lists)
- Search-to-add: type to search existing products by name, select from results to add as a step
- Steps displayed as numbered vertical list with product photo + name per row
- Drag handle on the left of each step for reorder via drag-and-drop
- Routines are reference lists only -- no daily check-off tracking
- Two default routines: Morning and Evening
- 4 pre-seeded categories: Skincare, Makeup, Haircare, Body care
- Funnghy can create, edit, and delete custom categories (same pattern as portfolio categories)
- Default view: "All" products selected when entering the beauty page

### Claude's Discretion

- Slide-up panel animation and height
- Star rating component styling (filled/empty star icons)
- Drag-and-drop library choice for routine reorder
- Add/edit product form layout
- Search input design for routine step picker

### Deferred Ideas (OUT OF SCOPE)

- Daily routine check-off tracking (ADVB-03) -- v2 feature, kept as reference-only lists for v1
- Product usage tracking / last-used dates (ADVB-01) -- v2 feature
- Product empties tracker (ADVB-02) -- v2 feature

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                          | Research Support                                                                                                |
| ------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| BEAU-01 | Funnghy can add beauty products with name, brand, category, rating, photo, and notes | DB schema for beautyProducts table, Server Action CRUD pattern from portfolio, image upload with private bucket |
| BEAU-02 | Funnghy can edit and delete her beauty products                                      | Same CRUD Server Action pattern as portfolio, zod validation, signed URL refresh on edit                        |
| BEAU-03 | Funnghy can organize products by category (skincare, makeup, haircare, etc.)         | Separate beautyCategories table (not shared with portfolio), category filter pills component reuse              |
| BEAU-04 | Funnghy can mark products as favorites and view them in a shelf/collection view      | Boolean isFavorite column on beautyProducts, heart icon toggle, "Favorites" pseudo-category in filter pills     |
| BEAU-05 | Funnghy can create morning and evening routines with ordered product steps           | routines + routineSteps tables, search-to-add from existing products, numbered list display                     |
| BEAU-06 | Funnghy can reorder steps in a routine via drag-and-drop                             | @dnd-kit/core + @dnd-kit/sortable with vertical list strategy, persist stepOrder via Server Action              |
| BEAU-07 | Beauty tracker is private -- only accessible when logged in                          | Already enforced by existing auth middleware protecting /beauty routes                                          |

</phase_requirements>

## Standard Stack

### Core (already installed)

| Library         | Version | Purpose                                         | Why Standard                         |
| --------------- | ------- | ----------------------------------------------- | ------------------------------------ |
| next            | 16.2.0  | App Router, Server Components, Server Actions   | Already in project                   |
| react           | 19.2.4  | UI framework                                    | Already in project                   |
| drizzle-orm     | 0.45.1  | Database ORM with typed schema                  | Already in project                   |
| zod             | 4.3.6   | Schema validation for Server Actions            | Already in project                   |
| @base-ui/react  | 1.3.0   | Primitives for shadcn components                | Already in project (base-nova style) |
| lucide-react    | 0.577.0 | Icons (Star, Heart, GripVertical, Search, Plus) | Already in project                   |
| sonner          | 2.0.7   | Toast notifications                             | Already in project                   |
| react-hook-form | 7.71.2  | Form state management                           | Already in project                   |
| sharp           | 0.34.5  | Image processing for upload pipeline            | Already in project                   |

### New Dependencies

| Library            | Version | Purpose                             | When to Use                    |
| ------------------ | ------- | ----------------------------------- | ------------------------------ |
| @dnd-kit/core      | 6.3.1   | Drag-and-drop foundation            | Routine step reorder (BEAU-06) |
| @dnd-kit/sortable  | 10.0.0  | Sortable list preset for dnd-kit    | Vertical list reordering       |
| @dnd-kit/utilities | 3.2.2   | CSS transform utilities for dnd-kit | Drag animation styles          |

### Alternatives Considered

| Instead of                      | Could Use                    | Tradeoff                                                                                                                                            |
| ------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| @dnd-kit/core+sortable (stable) | @dnd-kit/react 0.3.2 (beta)  | Beta has cleaner API but known issues (#1564, #1664 -- source/target identical in onDragEnd). Stable packages are battle-tested.                    |
| shadcn Sheet side="bottom"      | vaul (Drawer)                | Vaul adds swipe-to-dismiss gestures but requires new dependency. Sheet is already available via shadcn base-ui and matches existing Dialog pattern. |
| Custom star rating              | react-rating-stars-component | 5 static stars with lucide icons is trivial -- no library needed                                                                                    |

**Installation:**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**shadcn Sheet component (if not already installed):**

```bash
npx shadcn@latest add sheet
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  app/(private)/beauty/
    page.tsx                  # Main beauty page with Products/Routines tabs
    loading.tsx               # Loading skeleton
  components/beauty/
    product-grid.tsx          # Photo-only grid with heart overlays
    product-card.tsx          # Single product thumbnail with heart toggle
    product-bottom-sheet.tsx  # Slide-up detail panel (Sheet side="bottom")
    product-form.tsx          # Add/edit product form (used in dialog or page)
    star-rating.tsx           # Reusable 5-star rating (display + interactive)
    routine-list.tsx          # Morning/Evening routine display
    routine-step.tsx          # Single sortable step row
    routine-step-search.tsx   # Search-to-add product picker
    beauty-tabs.tsx           # Products / Routines tab switcher
  actions/
    beauty-products.ts        # CRUD Server Actions for products
    beauty-categories.ts      # CRUD Server Actions for beauty categories
    routines.ts               # CRUD Server Actions for routines + steps
  lib/db/
    schema.ts                 # Add beautyCategories, beautyProducts, routines, routineSteps tables
```

### Pattern 1: Separate Beauty Categories Table

**What:** Create a `beautyCategories` table separate from the portfolio `categories` table.
**When to use:** Beauty categories (Skincare, Makeup, etc.) are a distinct domain from portfolio categories (Modeling, Travel, etc.).
**Why:** Avoids coupling two unrelated domains. The existing `categories` table has a unique constraint on name/slug, and beauty categories would collide. Each domain can evolve independently.

```typescript
// schema.ts -- new tables
export const beautyCategories = pgTable('beauty_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  isDefault: integer('is_default').notNull().default(0), // 1 for pre-seeded
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const beautyProducts = pgTable('beauty_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => beautyCategories.id),
  rating: integer('rating').notNull().default(0), // 0-5 stars
  notes: text('notes'),
  isFavorite: integer('is_favorite').notNull().default(0), // 0 or 1
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const routines = pgTable('routines', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // "Morning" or "Evening"
  slug: text('slug').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const routineSteps = pgTable('routine_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => beautyProducts.id, { onDelete: 'cascade' }),
  stepOrder: integer('step_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Pattern 2: Bottom Sheet with shadcn Sheet

**What:** Use shadcn Sheet component with `side="bottom"` for the product detail slide-up panel.
**When to use:** Tapping a product photo in the grid opens this panel.

```typescript
// product-bottom-sheet.tsx
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";

export function ProductBottomSheet({ product, open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] rounded-t-2xl overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>
        {/* Product photo, brand, rating, notes */}
      </SheetContent>
    </Sheet>
  );
}
```

### Pattern 3: Drag-and-Drop Sortable List (Stable API)

**What:** Use @dnd-kit/core + @dnd-kit/sortable for routine step reordering.
**When to use:** Routine steps view where user drags steps to reorder.

```typescript
"use client";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"; // optional

function SortableStep({ step, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: step.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3">
      <button {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <span className="text-sm font-medium w-6">{index + 1}</span>
      {/* product thumbnail + name */}
    </div>
  );
}

function RoutineStepList({ steps, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);
      const newSteps = arrayMove(steps, oldIndex, newIndex);
      onReorder(newSteps);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {steps.map((step, index) => (
          <SortableStep key={step.id} step={step} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### Pattern 4: Private Image Signed URLs for Product Photos

**What:** Beauty product photos use the existing private-images bucket with signed URLs.
**When to use:** Fetching product grid data and displaying images.

```typescript
// In beauty-products.ts Server Action
import { getSignedImageUrls } from '@/lib/supabase/storage';

// After fetching products with their imageVariants:
const paths = variants.map((v) => v.storagePath);
const signedUrls = await getSignedImageUrls(paths);
// Map signed URLs back to variants
```

**Important:** Signed URLs expire (default 1 hour). The grid view should fetch products server-side and pass signed URLs to client components. Avoid storing signed URLs in client state that persists longer than the expiry.

### Pattern 5: Star Rating Component

**What:** Simple 5-star component using lucide Star icon.
**When to use:** Display in product detail sheet and interactive in product form.

```typescript
import { Star } from "lucide-react";

export function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-0.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          role="radio"
          aria-checked={value === star}
        >
          <Star
            className={`h-5 w-5 ${
              star <= value
                ? "fill-accent text-accent"
                : "fill-none text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Sharing categories table with portfolio:** Different domains should have separate tables even if schema looks similar. Avoids slug/name collisions and coupling.
- **Client-side signed URL caching:** Signed URLs expire. Never store them in localStorage or long-lived React state. Always fetch fresh from server.
- **Optimistic reorder without server confirmation:** After drag-and-drop reorder, update local state optimistically but always persist to DB. Show error toast if server update fails and revert.
- **Using @dnd-kit/react (beta) in production:** Version 0.3.2 has known bugs with source/target being identical in onDragEnd handlers. Use the stable @dnd-kit/core + @dnd-kit/sortable.

## Don't Hand-Roll

| Problem                       | Don't Build                | Use Instead                                  | Why                                                                    |
| ----------------------------- | -------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| Drag-and-drop reorder         | Custom drag event handlers | @dnd-kit/core + @dnd-kit/sortable            | Touch support, keyboard accessibility, collision detection, animations |
| Bottom sheet / slide-up panel | Custom CSS transform panel | shadcn Sheet side="bottom"                   | Focus trapping, backdrop, animation, accessibility                     |
| Image upload + processing     | Custom file handling       | Existing image-uploader.tsx + sharp pipeline | Already built and tested in Phase 1                                    |
| Category filter pills         | New filter component       | Existing CategoryFilter component            | Same rose gold pill pattern, just pass beauty categories               |
| Form validation               | Manual field checks        | zod + react-hook-form                        | Already in project, type-safe, consistent with other forms             |

**Key insight:** Phase 1 and 2 built most of the infrastructure. Phase 3 is primarily assembling existing patterns (CRUD actions, category filters, image upload) with a few new UI components (bottom sheet, star rating, sortable list).

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with DnD

**What goes wrong:** @dnd-kit generates unique IDs client-side. Server-rendered HTML won't match.
**Why it happens:** Next.js Server Components render on server first.
**How to avoid:** The drag-and-drop list MUST be a client component ("use client"). Ensure the DndContext is only rendered client-side. If needed, use dynamic import with `ssr: false`.
**Warning signs:** Console hydration warnings mentioning dnd-kit elements.

### Pitfall 2: Signed URL Expiration in Product Grid

**What goes wrong:** Product images stop loading after ~1 hour if user keeps tab open.
**Why it happens:** Signed URLs from Supabase Storage have a default 1-hour TTL.
**How to avoid:** Fetch products server-side in the page component. If implementing infinite scroll or long sessions, refresh URLs on user interaction (e.g., refetch on tab focus).
**Warning signs:** Broken image icons appearing after idle period.

### Pitfall 3: Category Seed Data Idempotency

**What goes wrong:** Running seed script twice creates duplicate categories.
**Why it happens:** INSERT without ON CONFLICT handling.
**How to avoid:** Use upsert (INSERT ... ON CONFLICT DO NOTHING) for pre-seeded categories. Mark them with `isDefault: 1` so they can't be deleted.
**Warning signs:** Duplicate filter pills appearing.

### Pitfall 4: Step Order Gaps After Delete

**What goes wrong:** Deleting step 2 of 5 leaves orders [1, 3, 4, 5] -- no gap closure.
**Why it happens:** Only deleting the row without renumbering.
**How to avoid:** After deleting a step, renumber remaining steps in the same Server Action transaction. Or accept gaps and sort by stepOrder (gaps don't affect display).
**Warning signs:** Step numbers displayed as 1, 3, 4, 5 instead of 1, 2, 3, 4.

### Pitfall 5: Missing "use client" on Interactive Components

**What goes wrong:** onClick handlers, useState, drag-and-drop don't work in Server Components.
**Why it happens:** Forgetting "use client" directive.
**How to avoid:** All components with state, event handlers, or dnd-kit hooks need "use client". Keep the page.tsx as a Server Component that fetches data and passes to client children.
**Warning signs:** "Event handlers cannot be passed to Client Component props" errors.

## Code Examples

### Seed Beauty Categories

```typescript
// scripts/seed-beauty-categories.ts
import { db } from '@/lib/db';
import { beautyCategories } from '@/lib/db/schema';

const defaults = [
  { name: 'Skincare', slug: 'skincare', displayOrder: 0, isDefault: 1 },
  { name: 'Makeup', slug: 'makeup', displayOrder: 1, isDefault: 1 },
  { name: 'Haircare', slug: 'haircare', displayOrder: 2, isDefault: 1 },
  { name: 'Body Care', slug: 'body-care', displayOrder: 3, isDefault: 1 },
];

for (const cat of defaults) {
  await db.insert(beautyCategories).values(cat).onConflictDoNothing();
}
```

### Seed Default Routines

```typescript
const defaultRoutines = [
  { name: 'Morning', slug: 'morning', displayOrder: 0 },
  { name: 'Evening', slug: 'evening', displayOrder: 1 },
];

for (const routine of defaultRoutines) {
  await db.insert(routines).values(routine).onConflictDoNothing();
}
```

### Reorder Steps Server Action

```typescript
'use server';
export async function reorderRoutineSteps(
  routineId: string,
  stepIds: string[], // ordered array of step IDs
) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Update each step's order in a transaction-like batch
  for (let i = 0; i < stepIds.length; i++) {
    await db
      .update(routineSteps)
      .set({ stepOrder: i })
      .where(eq(routineSteps.id, stepIds[i]));
  }
}
```

### Toggle Favorite Server Action

```typescript
'use server';
export async function toggleFavorite(productId: string) {
  // Auth check...
  const [product] = await db
    .select()
    .from(beautyProducts)
    .where(eq(beautyProducts.id, productId))
    .limit(1);
  if (!product) throw new Error('Product not found');

  const [updated] = await db
    .update(beautyProducts)
    .set({
      isFavorite: product.isFavorite === 1 ? 0 : 1,
      updatedAt: new Date(),
    })
    .where(eq(beautyProducts.id, productId))
    .returning();
  return updated;
}
```

## State of the Art

| Old Approach            | Current Approach                 | When Changed | Impact                                                                                     |
| ----------------------- | -------------------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| @dnd-kit/core only      | @dnd-kit/react (new unified API) | 2025 (beta)  | New API is cleaner but still beta 0.3.x. Use stable packages for now.                      |
| Radix-based shadcn      | Base-UI based shadcn (base-nova) | 2025 Q3      | This project already uses base-nova style. Sheet component follows same Dialog primitives. |
| Individual @radix-ui/\* | Unified radix-ui package         | 2025         | Not relevant -- project uses @base-ui/react                                                |

**Deprecated/outdated:**

- react-beautiful-dnd: Unmaintained since 2024, does not support React 19. Use @dnd-kit instead.
- react-dnd: Open issue for React 19 support (#3655), no official fix. Use @dnd-kit instead.

## Open Questions

1. **Sheet component availability in base-nova style**
   - What we know: shadcn docs show Sheet for both base-ui and radix variants. `npx shadcn@latest add sheet` should auto-detect.
   - What's unclear: Whether the base-nova Sheet uses Dialog or a separate primitive internally.
   - Recommendation: Install via CLI and inspect. If it doesn't exist for base-nova, build a simple one using the existing Dialog component with bottom positioning CSS.

2. **@dnd-kit touch support on mobile**
   - What we know: @dnd-kit/core PointerSensor handles both mouse and touch. TouchSensor also available.
   - What's unclear: Whether drag handle + scroll conflict on mobile (drag handle intercepts scroll).
   - Recommendation: Use PointerSensor with activation constraint (distance: 8px) to distinguish tap from drag. Test on mobile.

## Validation Architecture

### Test Framework

| Property           | Value                                        |
| ------------------ | -------------------------------------------- |
| Framework          | vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file        | vitest.config.ts                             |
| Quick run command  | `npx vitest run --reporter=verbose`          |
| Full suite command | `npx vitest run --reporter=verbose`          |

### Phase Requirements to Test Map

| Req ID  | Behavior                                                        | Test Type | Automated Command                                                               | File Exists? |
| ------- | --------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------- | ------------ |
| BEAU-01 | Create product with name, brand, category, rating, photo, notes | unit      | `npx vitest run src/__tests__/beauty/products.test.ts -t "create" -x`           | No -- Wave 0 |
| BEAU-02 | Edit and delete beauty products                                 | unit      | `npx vitest run src/__tests__/beauty/products.test.ts -t "update\|delete" -x`   | No -- Wave 0 |
| BEAU-03 | Organize products by category, filter                           | unit      | `npx vitest run src/__tests__/beauty/categories.test.ts -x`                     | No -- Wave 0 |
| BEAU-04 | Mark favorites, view favorites filter                           | unit      | `npx vitest run src/__tests__/beauty/products.test.ts -t "favorite" -x`         | No -- Wave 0 |
| BEAU-05 | Create routines with ordered steps                              | unit      | `npx vitest run src/__tests__/beauty/routines.test.ts -t "create\|add step" -x` | No -- Wave 0 |
| BEAU-06 | Reorder steps via drag-and-drop                                 | unit      | `npx vitest run src/__tests__/beauty/routines.test.ts -t "reorder" -x`          | No -- Wave 0 |
| BEAU-07 | Private access (auth required)                                  | unit      | `npx vitest run src/__tests__/beauty/auth.test.ts -x`                           | No -- Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/beauty/products.test.ts` -- covers BEAU-01, BEAU-02, BEAU-04
- [ ] `src/__tests__/beauty/categories.test.ts` -- covers BEAU-03
- [ ] `src/__tests__/beauty/routines.test.ts` -- covers BEAU-05, BEAU-06
- [ ] `src/__tests__/beauty/auth.test.ts` -- covers BEAU-07
- [ ] Test stubs with `it.todo()` following Phase 2 pattern

## Sources

### Primary (HIGH confidence)

- Project codebase: `src/lib/db/schema.ts`, `src/actions/portfolio.ts`, `src/actions/categories.ts`, `src/lib/supabase/storage.ts` -- established patterns
- npm registry: @dnd-kit/core@6.3.1, @dnd-kit/sortable@10.0.0, @dnd-kit/utilities@3.2.2 -- verified current
- shadcn/ui Sheet docs: https://ui.shadcn.com/docs/components/base/sheet -- base-ui variant confirmed
- @dnd-kit sortable docs: https://docs.dndkit.com/presets/sortable -- stable API reference

### Secondary (MEDIUM confidence)

- @dnd-kit/react migration guide: https://dndkit.com/react/guides/migration -- new API details
- @dnd-kit/react useSortable hook: https://dndkit.com/react/hooks/use-sortable -- newer hook API

### Tertiary (LOW confidence)

- @dnd-kit/react beta stability: GitHub issues #1564, #1654, #1664 -- reported bugs in onDragEnd handler. Validated by multiple independent reports but not confirmed fixed.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all core libraries already installed, only @dnd-kit packages are new and well-established
- Architecture: HIGH -- follows exact same patterns as Phase 2 (CRUD actions, category filters, image upload)
- Pitfalls: HIGH -- documented from known React 19 + Next.js + dnd-kit interaction patterns
- DB Schema: HIGH -- follows established Drizzle conventions from existing schema.ts

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain, established libraries)
