# Phase 2: Public Portfolio - Research

**Researched:** 2026-03-19
**Domain:** Portfolio gallery, lightbox, filtering, about page, content management
**Confidence:** HIGH

## Summary

Phase 2 builds the public-facing portfolio: a masonry gallery with infinite scroll, a full-screen lightbox, category filtering, an about page, and admin content management. The existing infrastructure (images/imageVariants tables, upload action with sharp processing, Supabase Storage with public URL helpers) provides a solid foundation. The main new work is: (1) new DB tables for portfolio items, categories, and about-page content, (2) a CSS-columns masonry grid with JS column distribution for correct reading order, (3) a custom lightbox built on the existing base-ui Dialog, (4) cursor-based infinite scroll using Server Actions + IntersectionObserver, and (5) admin CRUD pages behind auth.

Portfolio images use the "public-images" bucket (already configured) so no signed URLs are needed for the gallery -- just `getPublicImageUrl()` from `src/lib/supabase/storage.ts`. The upload pipeline already generates thumb (400px), medium (800px), large (1200px), and full (1920px) WebP variants, which map perfectly to gallery thumbnails (medium), lightbox display (large/full), and about-page thumbnails (thumb).

**Primary recommendation:** Use CSS columns with JS round-robin distribution for masonry, build the lightbox custom on base-ui Dialog (matches existing shadcn v4 stack), use react-intersection-observer for infinite scroll triggers, and Server Actions for all data mutations.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- True masonry grid with mixed heights -- photos keep natural aspect ratios for organic, editorial flow
- Responsive columns: 2 on mobile, 3 on desktop
- Hover effect: subtle scale (1.02x) with soft dark overlay showing title and category
- Infinite scroll for seamless browsing -- photos load automatically as visitor scrolls
- Full-screen overlay lightbox (no URL routing) -- dark overlay on gallery, click-outside or X to close
- Blurred gallery backdrop behind the lightbox (soft, feminine feel rather than hard black)
- Shows title, description, and category alongside the full-size photo
- Navigation: arrow buttons on screen + keyboard arrows + swipe on mobile
- Pill/chip buttons in a horizontal row: All, Modeling, Travel, Beauty (+ custom categories)
- Selected pill gets rose gold highlight, others are outlined/muted
- Default view: Modeling category selected first (her primary profession)
- Custom categories: Funnghy can create/edit/delete categories from admin side (not hardcoded to three)
- Smooth fade/shuffle animation when switching categories
- About page layout: profile photo on the left, bio text and contact info on the right (stacks vertically on mobile)
- Contact info: email address plus social media icon links (Instagram, etc.)
- Content is editable by Funnghy from an admin/settings page (bio, photo, email, social links)
- Small photo strip (3-4 thumbnails) from portfolio shown below the bio, linking back to gallery
- Both users can upload portfolio photos with title, description, and category
- Funnghy can edit and delete any portfolio photo
- Boyfriend can upload photos and content for her portfolio (AUTH-06)

### Claude's Discretion

- Masonry grid implementation approach (CSS columns vs JS library)
- Lightbox animation/transition timing
- Photo strip selection logic on About page
- Admin UI layout for content management
- Empty state design for gallery with no photos

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                 | Research Support                                                              |
| ------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| PORT-01 | User can view a masonry grid gallery of all portfolio photos                                | CSS columns masonry with JS distribution, infinite scroll, public image URLs  |
| PORT-02 | User can click a photo to view it full-size in a lightbox with navigation                   | Custom lightbox on base-ui Dialog, keyboard/swipe/arrow nav                   |
| PORT-03 | User can filter portfolio photos by category (modeling, travel, beauty)                     | Dynamic categories from DB, pill/chip filter UI, Server Action queries        |
| PORT-04 | Public visitors can view an About page with bio, photo, and contact info                    | About content table, server-rendered page, editable from admin                |
| PORT-05 | Funnghy can upload, edit, and delete portfolio photos with title, description, and category | Reuse existing upload pipeline, new portfolio CRUD Server Actions             |
| PORT-06 | Portfolio pages are publicly accessible without login                                       | Public route group already exists, no middleware changes needed               |
| AUTH-06 | Boyfriend can upload photos and content for Funnghy's portfolio                             | Auth check in Server Actions allows both users, no role restriction on upload |

</phase_requirements>

## Standard Stack

### Core (already installed)

| Library         | Version | Purpose                                          | Why Standard                                |
| --------------- | ------- | ------------------------------------------------ | ------------------------------------------- |
| next            | 16.2.0  | Framework, Server Actions, routing               | Already in project                          |
| drizzle-orm     | 0.45.1  | Database ORM for portfolio/category/about tables | Already in project                          |
| @base-ui/react  | 1.3.0   | Dialog primitive for lightbox                    | Already in project (shadcn v4 uses base-ui) |
| sharp           | 0.34.5  | Image processing (already in upload pipeline)    | Already in project                          |
| react-dropzone  | 15.0.0  | File upload drag-and-drop                        | Already in project                          |
| lucide-react    | 0.577.0 | Icons (arrows, X, social media)                  | Already in project                          |
| zod             | 4.3.6   | Form validation for CRUD actions                 | Already in project                          |
| react-hook-form | 7.71.2  | Form state management                            | Already in project                          |

### New Dependencies

| Library                     | Version | Purpose                                               | When to Use                           |
| --------------------------- | ------- | ----------------------------------------------------- | ------------------------------------- |
| react-intersection-observer | 10.0.3  | IntersectionObserver hook for infinite scroll trigger | Sentinel element at bottom of gallery |

### Alternatives Considered

| Instead of                  | Could Use                       | Tradeoff                                                                                     |
| --------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| CSS columns masonry         | masonry-layout (Desandro)       | JS library adds 7KB+, CSS columns are zero-dependency with JS distribution fix               |
| Custom lightbox             | yet-another-react-lightbox      | YARL is 15KB+, project already has base-ui Dialog; custom build matches design system better |
| react-intersection-observer | Raw IntersectionObserver API    | The hook handles cleanup, SSR safety, and provides simple `inView` boolean; 1.8KB gzipped    |
| Server Actions pagination   | TanStack Query useInfiniteQuery | TanStack adds 12KB+, Server Actions with simple state are sufficient for this use case       |

**Installation:**

```bash
npm install react-intersection-observer
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  lib/db/schema.ts            # ADD: portfolioItems, categories, aboutContent tables
  actions/
    upload.ts                  # EXISTING: reuse for portfolio uploads
    portfolio.ts               # NEW: CRUD for portfolio items
    categories.ts              # NEW: CRUD for categories
    about.ts                   # NEW: update about page content
  app/
    (public)/
      page.tsx                 # REPLACE: masonry gallery with infinite scroll
      about/page.tsx           # REPLACE: about page with bio layout
    (private)/
      admin/
        portfolio/page.tsx     # NEW: manage portfolio items (list, edit, delete)
        portfolio/new/page.tsx # NEW: upload new portfolio item
        categories/page.tsx    # NEW: manage categories
        about/page.tsx         # NEW: edit about page content
  components/
    portfolio/
      masonry-grid.tsx         # Client component: CSS columns layout
      gallery-card.tsx         # Server/client: individual photo card with hover
      lightbox.tsx             # Client component: full-screen photo viewer
      category-filter.tsx      # Client component: pill/chip filter row
      infinite-scroll.tsx      # Client component: scroll trigger wrapper
    about/
      about-section.tsx        # Server component: bio + photo layout
      photo-strip.tsx          # Server component: thumbnail strip
```

### Pattern 1: CSS Columns Masonry with JS Column Distribution

**What:** Use separate flex columns with round-robin JavaScript distribution to achieve masonry layout with correct left-to-right reading order.
**When to use:** When you need true masonry (mixed heights) with predictable item ordering.
**Why not pure CSS columns:** CSS `column-count` fills top-to-bottom, not left-to-right. Items appear out of order. The popular JS array reorder trick breaks with real variable-height content.
**Example:**

```typescript
// masonry-grid.tsx
"use client";

import { useMemo } from "react";

interface MasonryGridProps {
  items: React.ReactNode[];
  columns?: number;
}

export function MasonryGrid({ items, columns = 3 }: MasonryGridProps) {
  // Round-robin distribute items into columns for correct L-to-R reading order
  const columnItems = useMemo(() => {
    const cols: React.ReactNode[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, index) => {
      cols[index % columns].push(item);
    });
    return cols;
  }, [items, columns]);

  return (
    <div className="flex gap-4">
      {columnItems.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4">
          {col}
        </div>
      ))}
    </div>
  );
}
```

**Responsive columns:** Use a custom hook or render 2 columns on mobile, 3 on desktop. Two approaches:

- CSS: Render all items in a single list and use `columns-2 md:columns-3` (but this has ordering issues)
- JS: Use `useMediaQuery` or window width to pass the correct column count (recommended -- preserves reading order)

### Pattern 2: Infinite Scroll with Server Actions

**What:** Load initial page server-side, then use a client component with IntersectionObserver to fetch more pages via Server Actions.
**When to use:** Gallery with many photos that should load seamlessly.
**Example:**

```typescript
// infinite-scroll.tsx
"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps<T> {
  initialItems: T[];
  initialCursor: string | null;
  fetchMore: (cursor: string) => Promise<{ items: T[]; nextCursor: string | null }>;
  renderItem: (item: T) => React.ReactNode;
  columns?: number;
}

export function InfiniteGallery<T extends { id: string }>({
  initialItems,
  initialCursor,
  fetchMore,
  renderItem,
  columns = 3,
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();

  const { ref, inView } = useInView({ threshold: 0, rootMargin: "200px" });

  const loadMore = useCallback(() => {
    if (!cursor || isPending) return;
    startTransition(async () => {
      const result = await fetchMore(cursor);
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    });
  }, [cursor, isPending, fetchMore]);

  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore]);

  return (
    <>
      <MasonryGrid items={items.map(renderItem)} columns={columns} />
      {cursor && <div ref={ref} className="h-10" />}
      {isPending && <LoadingSkeleton />}
    </>
  );
}
```

### Pattern 3: Custom Lightbox on base-ui Dialog

**What:** Full-screen overlay lightbox using the existing Dialog primitive, with keyboard navigation, swipe support, and blurred backdrop.
**When to use:** The lightbox requirement specifies blurred gallery backdrop (not hard black), which is easy to achieve with `backdrop-blur` on the Dialog overlay.
**Example:**

```typescript
// lightbox.tsx -- key structure
"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useEffect, useCallback } from "react";

// Keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [goToPrev, goToNext, onClose]);

// Swipe detection: track touchstart/touchend X delta
// If deltaX > 50px, navigate; negative = next, positive = prev

// Blurred backdrop
<DialogPrimitive.Backdrop
  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
/>
```

### Pattern 4: Server Action CRUD with Auth Check

**What:** All mutations go through Server Actions with auth verification. Both users can upload, but only Funnghy can edit/delete.
**Example:**

```typescript
// actions/portfolio.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { portfolioItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function deletePortfolioItem(itemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Only Funnghy (primary user) can delete
  // Check user role or use a simple email/id check
  const item = await db.query.portfolioItems.findFirst({
    where: eq(portfolioItems.id, itemId),
  });
  if (!item) throw new Error('Not found');

  // Delete from storage, then from DB
  // ...
}
```

### Anti-Patterns to Avoid

- **URL-based lightbox routing:** User explicitly decided against this. Lightbox is overlay-only, no URL change.
- **Hardcoded categories:** Categories MUST be dynamic from the database. Never hardcode "Modeling", "Travel", "Beauty" in the UI code.
- **Offset pagination:** Use cursor-based pagination for infinite scroll. Offset pagination breaks when new items are added (duplicates, skips).
- **Client-side image optimization:** Images are already processed by sharp in the upload pipeline. Do not add next/image optimization on top of Supabase Storage URLs (it would double-process). Use regular `<img>` tags with `loading="lazy"` for public storage URLs.
- **Radix Dialog:** Project uses base-ui (shadcn v4), NOT Radix. Do not import from @radix-ui.

## Don't Hand-Roll

| Problem                   | Don't Build                     | Use Instead                           | Why                                                                      |
| ------------------------- | ------------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| Infinite scroll trigger   | Custom scroll event listeners   | react-intersection-observer           | Handles cleanup, SSR, threshold config; scroll events cause perf issues  |
| Image variants            | Custom resizing at display time | Existing upload pipeline (sharp)      | Already generates thumb/medium/large/full WebP variants                  |
| Public image URLs         | Custom URL construction         | `getPublicImageUrl()` from storage.ts | Already handles Supabase URL pattern                                     |
| Form validation           | Manual validation in actions    | zod schemas                           | Already in project, type-safe, reusable                                  |
| Drag-and-drop upload      | Custom file handling            | Existing ImageUploader component      | Already built with react-dropzone, progress tracking, concurrent uploads |
| Dialog/overlay primitives | Custom portal/focus-trap        | base-ui Dialog (existing)             | Already has focus trapping, portal, animations, accessibility            |

**Key insight:** The Phase 1 upload pipeline and component infrastructure cover most of the heavy lifting. Phase 2's main work is the gallery presentation layer and the CRUD actions connecting portfolio content to the existing image system.

## Common Pitfalls

### Pitfall 1: CSS Columns Reading Order

**What goes wrong:** Using `column-count` CSS property causes items to flow top-to-bottom within each column, not left-to-right across columns.
**Why it happens:** CSS multi-column layout is designed for text flow, not grid item ordering.
**How to avoid:** Use the flex-column approach with JS round-robin distribution (Pattern 1 above). Each column is a flex container; items are distributed column[i % numColumns].
**Warning signs:** Photo #2 appears below photo #1 instead of to its right.

### Pitfall 2: Infinite Scroll Double-Fetching

**What goes wrong:** The IntersectionObserver fires multiple times, causing duplicate fetches and duplicate items in the gallery.
**Why it happens:** State updates during fetch cause re-renders, the sentinel re-enters viewport, observer fires again before the previous fetch completes.
**How to avoid:** Use `useTransition` isPending as a guard -- skip fetch if already pending. Also use cursor-based pagination (cursor is null when no more items).
**Warning signs:** Duplicate photos appearing in gallery, network tab shows rapid repeated requests.

### Pitfall 3: Lightbox Body Scroll Leak

**What goes wrong:** When lightbox is open, the page behind scrolls when user tries to swipe through photos.
**Why it happens:** Touch events propagate to the body/document.
**How to avoid:** Set `document.body.style.overflow = 'hidden'` when lightbox opens, restore on close. base-ui Dialog may handle this automatically -- verify.
**Warning signs:** Gallery scrolls behind the lightbox overlay on mobile.

### Pitfall 4: Missing Category Default State

**What goes wrong:** Gallery loads empty or shows "All" instead of defaulting to "Modeling" category.
**Why it happens:** Default filter state not set, or categories load asynchronously and the default isn't applied.
**How to avoid:** Fetch categories server-side, identify the default category (store a `isDefault` flag or use display order), pass it as the initial filter state to the client component.
**Warning signs:** First page load shows no photos or all photos instead of Modeling.

### Pitfall 5: Supabase Public Bucket Not Actually Public

**What goes wrong:** Gallery images return 403 errors for unauthenticated visitors.
**Why it happens:** Supabase Storage buckets need explicit RLS policies for public access. Creating a bucket named "public-images" does NOT automatically make it publicly readable.
**How to avoid:** Verify that the "public-images" bucket has a storage policy allowing anonymous SELECT. Check Supabase dashboard or run the policy SQL.
**Warning signs:** Images load when logged in but fail for anonymous visitors.

### Pitfall 6: Swipe Conflicts with Scroll

**What goes wrong:** Horizontal swipe in lightbox also triggers vertical scroll or browser back navigation.
**Why it happens:** Touch events need `preventDefault()` at the right moment; too aggressive prevents all scrolling, too lenient allows scroll interference.
**How to avoid:** Only preventDefault on horizontal swipes (|deltaX| > |deltaY|). Use a minimum threshold (50px) before considering it a swipe.
**Warning signs:** Swiping through photos in lightbox also scrolls the page or triggers browser back.

## Code Examples

### Database Schema Extension

```typescript
// Add to src/lib/db/schema.ts

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  isDefault: integer('is_default').notNull().default(0), // 1 for Modeling
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id),
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aboutContent = pgTable('about_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  bio: text('bio').notNull().default(''),
  email: text('email'),
  instagramUrl: text('instagram_url'),
  tiktokUrl: text('tiktok_url'),
  profileImageId: uuid('profile_image_id').references(() => images.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Cursor-Based Pagination Server Action

```typescript
// actions/portfolio.ts
'use server';

const PAGE_SIZE = 12;

export async function getPortfolioItems(
  cursor?: string,
  categorySlug?: string,
) {
  let query = db
    .select({
      item: portfolioItems,
      image: images,
      category: categories,
    })
    .from(portfolioItems)
    .innerJoin(images, eq(portfolioItems.imageId, images.id))
    .innerJoin(categories, eq(portfolioItems.categoryId, categories.id))
    .orderBy(desc(portfolioItems.createdAt))
    .limit(PAGE_SIZE + 1); // +1 to check if more exist

  if (categorySlug && categorySlug !== 'all') {
    query = query.where(eq(categories.slug, categorySlug));
  }

  if (cursor) {
    query = query.where(lt(portfolioItems.createdAt, new Date(cursor)));
  }

  const results = await query;
  const hasMore = results.length > PAGE_SIZE;
  const items = hasMore ? results.slice(0, PAGE_SIZE) : results;
  const nextCursor = hasMore
    ? items[items.length - 1].item.createdAt.toISOString()
    : null;

  return { items, nextCursor };
}
```

### Gallery Card with Hover Effect

```typescript
// components/portfolio/gallery-card.tsx
"use client";

interface GalleryCardProps {
  title: string;
  category: string;
  imageUrl: string;
  width: number;
  height: number;
  onClick: () => void;
}

export function GalleryCard({ title, category, imageUrl, width, height, onClick }: GalleryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg cursor-pointer"
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-4">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
          <p className="font-display text-sm font-semibold">{title}</p>
          <p className="text-xs opacity-80">{category}</p>
        </div>
      </div>
    </button>
  );
}
```

### Category Filter Pills

```typescript
// components/portfolio/category-filter.tsx
"use client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({ categories, activeSlug, onSelect }: CategoryFilterProps) {
  const allCategories = [{ id: "all", name: "All", slug: "all" }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-colors ${
            activeSlug === cat.slug
              ? "bg-accent text-white"
              : "border border-border text-text-secondary hover:border-accent hover:text-accent"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
```

## State of the Art

| Old Approach                                  | Current Approach                                | When Changed              | Impact                                                                                                      |
| --------------------------------------------- | ----------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Client-side data fetching (useEffect + fetch) | Server Actions + useTransition for pagination   | Next.js 14+ (2024)        | Less client JS, better initial load, no API routes needed                                                   |
| Masonry.js / Isotope.js                       | CSS columns or flex-column with JS distribution | 2023+                     | Zero-dependency masonry, no layout thrashing                                                                |
| react-images / react-photo-gallery            | Custom lightbox on native Dialog/base-ui        | 2024+                     | Most React lightbox libs are abandoned or bloated; custom is cleaner                                        |
| Offset pagination (LIMIT/OFFSET)              | Cursor-based pagination                         | Established best practice | No duplicate/skip issues when content changes                                                               |
| next/image for all images                     | Raw `<img>` for Supabase Storage public URLs    | Project-specific          | Images are pre-optimized by sharp; next/image would double-process and add complexity with external domains |

**Deprecated/outdated:**

- `react-masonry-css`: Last updated 2021, not maintained for React 19
- `react-photo-gallery`: Archived, not compatible with React 19
- `react-images`: Archived since 2020

## Open Questions

1. **Supabase public bucket RLS policy status**
   - What we know: Upload action uses "public-images" bucket, `getPublicImageUrl()` constructs direct URLs
   - What's unclear: Whether the bucket's RLS policies actually allow anonymous read access
   - Recommendation: Verify in first implementation task; add storage policy if missing

2. **About content seeding**
   - What we know: aboutContent table will store single-row editable content
   - What's unclear: Should we seed initial about content or handle empty state?
   - Recommendation: Seed a default row during migration; admin UI edits it (no create needed)

3. **Category seeding**
   - What we know: Default categories are Modeling (default), Travel, Beauty
   - What's unclear: Whether to seed via migration or first-run admin action
   - Recommendation: Seed via migration script with the three initial categories; admin can add/edit/delete later

## Validation Architecture

### Test Framework

| Property           | Value                                        |
| ------------------ | -------------------------------------------- |
| Framework          | vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file        | vitest.config.ts (exists)                    |
| Quick run command  | `npx vitest run --reporter=verbose`          |
| Full suite command | `npx vitest run`                             |

### Phase Requirements -> Test Map

| Req ID  | Behavior                                                | Test Type | Automated Command                                                                            | File Exists?    |
| ------- | ------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------- | --------------- |
| PORT-01 | Masonry grid renders with correct column distribution   | unit      | `npx vitest run src/__tests__/portfolio/masonry-grid.test.tsx -t "distributes items"`        | Wave 0          |
| PORT-02 | Lightbox opens/closes, keyboard nav works               | unit      | `npx vitest run src/__tests__/portfolio/lightbox.test.tsx -t "navigation"`                   | Wave 0          |
| PORT-03 | Category filter updates active state and triggers fetch | unit      | `npx vitest run src/__tests__/portfolio/category-filter.test.tsx`                            | Wave 0          |
| PORT-04 | About page renders bio, contact info, photo strip       | unit      | `npx vitest run src/__tests__/portfolio/about-section.test.tsx`                              | Wave 0          |
| PORT-05 | Portfolio CRUD actions validate input and check auth    | unit      | `npx vitest run src/__tests__/portfolio/portfolio-actions.test.ts`                           | Wave 0          |
| PORT-06 | Public pages accessible without auth                    | unit      | Covered by existing middleware test pattern                                                  | Extend existing |
| AUTH-06 | Both users can upload portfolio content                 | unit      | `npx vitest run src/__tests__/portfolio/portfolio-actions.test.ts -t "boyfriend can upload"` | Wave 0          |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before verification

### Wave 0 Gaps

- [ ] `src/__tests__/portfolio/masonry-grid.test.tsx` -- covers PORT-01 (column distribution, responsive)
- [ ] `src/__tests__/portfolio/lightbox.test.tsx` -- covers PORT-02 (open/close, keyboard nav)
- [ ] `src/__tests__/portfolio/category-filter.test.tsx` -- covers PORT-03 (filter selection, active state)
- [ ] `src/__tests__/portfolio/about-section.test.tsx` -- covers PORT-04 (bio rendering, contact info)
- [ ] `src/__tests__/portfolio/portfolio-actions.test.ts` -- covers PORT-05, AUTH-06 (CRUD, auth checks)

## Sources

### Primary (HIGH confidence)

- Project codebase -- `src/lib/db/schema.ts`, `src/actions/upload.ts`, `src/lib/supabase/storage.ts`, `src/components/ui/dialog.tsx`
- npm registry -- react-intersection-observer@10.0.3, yet-another-react-lightbox@3.29.1 (version verified)

### Secondary (MEDIUM confidence)

- [CSS columns ordering problem](https://dev.to/iurii_rogulia/react-masonry-layout-why-the-popular-reorder-trick-fails-5f9l) -- DEV Community article on why pure CSS columns break reading order
- [CSS-Tricks masonry approaches](https://css-tricks.com/piecing-together-approaches-for-a-css-masonry-layout/) -- comprehensive comparison of masonry techniques
- [Next.js infinite scroll with Server Actions](https://blog.logrocket.com/implementing-infinite-scroll-next-js-server-actions/) -- LogRocket guide on the pattern
- [MDN CSS Masonry](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout) -- CSS grid masonry spec status (still experimental)

### Tertiary (LOW confidence)

- CSS grid-lanes masonry spec -- still experimental, not production-ready; do NOT use

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all core libraries already installed, only adding react-intersection-observer (widely used, verified version)
- Architecture: HIGH -- patterns are well-established (CSS flex masonry, Server Actions pagination, Dialog-based lightbox); all building on existing project infrastructure
- Pitfalls: HIGH -- CSS column ordering issue is well-documented; infinite scroll double-fetch is a known React pattern problem; Supabase bucket policy is a common gotcha

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable domain, no fast-moving dependencies)
