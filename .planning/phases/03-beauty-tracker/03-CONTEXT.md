# Phase 3: Beauty Tracker - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Private beauty product collection and routine builder. Funnghy can add, edit, delete, rate, and favorite beauty products organized by category. She can build morning and evening routines with ordered product steps and reorder via drag-and-drop. The entire section is private (login required). Images use private Supabase Storage bucket with signed URLs.

</domain>

<decisions>
## Implementation Decisions

### Product shelf display
- Photo-only grid layout (like Instagram profile grid) — no text overlay on thumbnails
- 3 columns on mobile, 4-5 columns on desktop
- Category filter pills at top (same pattern as portfolio gallery in Phase 2)
- Tap a product photo to open a slide-up bottom sheet panel with full details (name, brand, rating, notes, photo)
- Favorites filter: heart icon overlay on top-right corner of product thumbnails
- Empty state: friendly illustration/icon + "Start your beauty collection" with an Add button

### Rating & favorites
- 5-star rating system (classic 1-5 stars)
- Favorite toggle via heart icon on the product photo in the grid
- Filled heart = favorited, outline heart = not favorited
- "Favorites" tab in the category filter pills alongside Skincare, Makeup, etc.

### Routine builder
- Beauty page has two tabs: "Products" (the photo grid) and "Routines" (morning/evening lists)
- Search-to-add: type to search existing products by name, select from results to add as a step
- Steps displayed as numbered vertical list with product photo + name per row
- Drag handle on the left of each step for reorder via drag-and-drop
- Routines are reference lists only — no daily check-off tracking
- Two default routines: Morning and Evening

### Product categories
- 4 pre-seeded categories: Skincare, Makeup, Haircare, Body care
- Funnghy can create, edit, and delete custom categories (same pattern as portfolio categories)
- Default view: "All" products selected when entering the beauty page

### Claude's Discretion
- Slide-up panel animation and height
- Star rating component styling (filled/empty star icons)
- Drag-and-drop library choice for routine reorder
- Add/edit product form layout
- Search input design for routine step picker

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Vision, constraints, two-user system, aesthetic requirements
- `.planning/REQUIREMENTS.md` — BEAU-01 through BEAU-07 acceptance criteria
- `.planning/ROADMAP.md` §Phase 3 — Goal, success criteria, dependency on Phase 1

### Prior phase patterns
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design system tokens, image upload pipeline, nav structure, DB connection fixes
- `.planning/phases/02-public-portfolio/02-CONTEXT.md` — Category filter pills pattern, masonry grid, Server Action CRUD pattern

### Existing infrastructure
- `src/lib/db/schema.ts` — Existing tables (images, imageVariants, categories, portfolioItems) as pattern reference
- `src/actions/portfolio.ts` — CRUD Server Actions pattern with auth gates and pagination
- `src/actions/categories.ts` — Category CRUD with slug generation and delete protection
- `src/components/upload/image-uploader.tsx` — Reusable drag-and-drop upload component
- `src/components/portfolio/category-filter.tsx` — Reusable category filter pills component
- `src/lib/supabase/storage.ts` — Signed URL helpers for private images

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/portfolio/category-filter.tsx` — Category filter pills with rose gold active state, reusable for beauty categories + Favorites tab
- `src/components/upload/image-uploader.tsx` — Drag-and-drop upload for product photos (use private bucket)
- `src/lib/supabase/storage.ts` — Signed URL generation for private images
- `src/components/ui/dialog.tsx` — Base for slide-up panel (or use sheet component)
- `src/actions/categories.ts` — CRUD pattern for beauty categories (same structure, different table)

### Established Patterns
- Server Actions with zod validation for all CRUD operations
- Drizzle ORM with typed schema for database queries
- Category filter pills with `role="tablist"`, `aria-selected` for accessibility
- Private images stored in "private-images" Supabase bucket with signed URLs
- `node --env-file=.env.local` for all npm scripts on Windows

### Integration Points
- `src/app/(private)/beauty/` — New route group for beauty tracker pages
- Navigation already has "Beauty" link in authenticated nav (top-nav.tsx and bottom-tab-bar.tsx)
- Auth middleware already protects `/beauty` routes
- Private images bucket already configured in Supabase Storage

</code_context>

<specifics>
## Specific Ideas

- The product grid should feel like a personal collection/vanity shelf, not a database
- Photo-only grid keeps it visual and personal — like scrolling through her real beauty shelf
- The slide-up panel for details keeps browsing fluid without full page navigations
- Category filter reuses the same rose gold pill pattern from portfolio for visual consistency
- Heart icon on thumbnails makes favoriting quick and visible at a glance

</specifics>

<deferred>
## Deferred Ideas

- Daily routine check-off tracking (ADVB-03) — v2 feature, kept as reference-only lists for v1
- Product usage tracking / last-used dates (ADVB-01) — v2 feature
- Product empties tracker (ADVB-02) — v2 feature

</deferred>

---

*Phase: 03-beauty-tracker*
*Context gathered: 2026-03-20*
