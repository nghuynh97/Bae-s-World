# Phase 2: Public Portfolio - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Public-facing portfolio showcasing Funnghy's work: masonry grid gallery, full-size lightbox, category filtering, about page with bio and contact info, and content management (upload/edit/delete) for both Funnghy and her boyfriend. All portfolio pages are publicly accessible without login. Content management requires authentication.

</domain>

<decisions>
## Implementation Decisions

### Gallery layout & presentation

- True masonry grid with mixed heights — photos keep natural aspect ratios for organic, editorial flow
- Responsive columns: 2 on mobile, 3 on desktop
- Hover effect: subtle scale (1.02x) with soft dark overlay showing title and category
- Infinite scroll for seamless browsing — photos load automatically as visitor scrolls
- Photos should feel editorial and curated, not like a social media feed

### Lightbox & photo viewing

- Full-screen overlay (no URL routing) — dark overlay on gallery, click-outside or X to close
- Blurred gallery backdrop behind the lightbox (soft, feminine feel rather than hard black)
- Shows title, description, and category alongside the full-size photo
- Navigation: arrow buttons on screen + keyboard arrows + swipe on mobile

### Category filtering

- Pill/chip buttons in a horizontal row: All, Modeling, Travel, Beauty (+ custom categories)
- Selected pill gets rose gold highlight, others are outlined/muted
- Default view: Modeling category selected first (her primary profession)
- Custom categories: Funnghy can create/edit/delete categories from admin side (not hardcoded to three)
- Smooth fade/shuffle animation when switching categories

### About page

- Layout: profile photo on the left, bio text and contact info on the right (stacks vertically on mobile)
- Contact info: email address plus social media icon links (Instagram, etc.)
- Content is editable by Funnghy from an admin/settings page (bio, photo, email, social links)
- Small photo strip (3-4 thumbnails) from portfolio shown below the bio, linking back to gallery

### Content management (Funnghy + boyfriend)

- Both users can upload portfolio photos with title, description, and category
- Funnghy can edit and delete any portfolio photo
- Boyfriend can upload photos and content for her portfolio (AUTH-06)

### Claude's Discretion

- Masonry grid implementation approach (CSS columns vs JS library)
- Lightbox animation/transition timing
- Photo strip selection logic on About page
- Admin UI layout for content management
- Empty state design for gallery with no photos

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context

- `.planning/PROJECT.md` — Core value, constraints, aesthetic requirements, two-user system
- `.planning/REQUIREMENTS.md` — PORT-01 through PORT-06, AUTH-06 acceptance criteria
- `.planning/ROADMAP.md` §Phase 2 — Goal, success criteria, dependency on Phase 1

### Existing infrastructure

- `src/lib/db/schema.ts` — images and imageVariants tables (bucket, folder, variant support)
- `src/actions/upload.ts` — Existing upload action with sharp processing
- `src/components/upload/image-uploader.tsx` — Drag-and-drop upload component
- `src/app/globals.css` — Design system tokens (pastels, rose gold, cream, typography)

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `images` + `imageVariants` DB tables: Already support bucket ("public-images"/"private-images"), folder (e.g., "portfolio"), and variant generation (thumb/medium/large/full)
- `src/components/upload/image-uploader.tsx`: Drag-and-drop upload with progress — reuse for portfolio content management
- `src/components/ui/dialog.tsx`: Can be extended for lightbox overlay
- `src/components/ui/card.tsx`: Available for admin content management views
- `src/components/ui/skeleton.tsx`: Available for gallery loading states

### Established Patterns

- Server Actions for mutations (see `src/actions/auth.ts`, `src/actions/upload.ts`)
- Drizzle ORM for database queries with typed schema
- Supabase Storage for image hosting with signed URLs for private content
- shadcn v4 with base-ui (not Radix) — DropdownMenuTrigger does not support asChild

### Integration Points

- `src/app/(public)/page.tsx` — Portfolio placeholder page, replace with masonry gallery
- `src/app/(public)/about/page.tsx` — About placeholder page, replace with bio layout
- `src/app/(public)/layout.tsx` — Public layout wrapping portfolio and about
- Navigation: top-nav and bottom-tab-bar already exist with portfolio/about links
- Auth middleware: private routes already protected, admin pages will need auth check

</code_context>

<specifics>
## Specific Ideas

- Portfolio should feel "editorial and curated, not like a social media feed" (from PROJECT.md)
- Blurred gallery backdrop for lightbox — softer, more feminine alternative to hard dark overlay
- Modeling category as default view — reflects her primary professional identity
- Custom categories give Funnghy flexibility to evolve her portfolio beyond the initial three

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-public-portfolio_
_Context gathered: 2026-03-19_
