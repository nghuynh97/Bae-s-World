# Project Research Summary

**Project:** Funnghy's World
**Domain:** Personal portfolio + beauty/skincare tracker + photo journal (gift webapp for freelance model)
**Researched:** 2026-03-19
**Confidence:** HIGH

## Executive Summary

Funnghy's World is a personal gift webapp that combines three distinct feature areas into a single cohesive product: a public-facing model portfolio with gallery and editorial feel, a private beauty/skincare product tracker with routine builder, and a private photo journal. No existing product combines all three, making the unified personal space the core differentiator. Research across all four areas converges on a consistent recommendation: use the Next.js 16 App Router with Supabase (database, auth, and file storage) and Tailwind CSS v4, establishing a shared design token system before building any feature. The architecture is well-understood and the recommended stack is battle-tested for this exact use case — photo-heavy, two-user, hybrid public/private.

The recommended approach is to treat this as three concentric rings: foundation first (design system, auth, image pipeline), public portfolio second (the gift's face), then private tools third (beauty tracker and journal). Every architecture decision should be made with the constraint of two users in mind — this means deliberately under-engineering auth (no registration, no OAuth), avoiding complex state management, and leaning on Supabase's Row Level Security for access control rather than custom middleware logic. The stack is entirely free-tier eligible at launch with a clear paid upgrade path only if traffic or storage demands grow.

The highest risks are image performance (gallery pages going viral with unoptimized photos would be catastrophic), design system drift (each feature feeling like a different app), and over-engineering auth for a two-person system. All three risks are entirely preventable by sequencing work correctly: design tokens and the image pipeline must be established in Phase 1, before any feature UI is built. The beauty product data model also needs careful upfront design — flat field schemas consistently fail to capture real product diversity.

---

## Key Findings

### Recommended Stack

The stack converges cleanly on Next.js 16.1 (App Router, Turbopack, built-in image optimization) + Supabase (PostgreSQL, row-level security, file storage, auth) + Tailwind CSS v4 (CSS-first design tokens in OKLCH color space) + Drizzle ORM (type-safe queries, 90% smaller bundle than Prisma). This combination replaces what would otherwise require 4-5 separate services. shadcn/ui provides customizable component primitives, and motion (Framer Motion v12) handles the premium animations that make the app feel polished.

The key architectural insight is that Next.js's `next/image` component is not optional — it is critical infrastructure for a photo-heavy app. It handles WebP/AVIF conversion, responsive srcsets, lazy loading, and blur placeholders automatically. Supabase Storage handles up to 1 GB free, sufficient for months of two-user uploads, with Cloudinary as the migration path if storage needs grow.

**Core technologies:**

- **Next.js 16.1:** Full-stack React framework — App Router, server components, built-in image optimization justify the choice for a photo-heavy app
- **Supabase (hosted):** PostgreSQL + auth + file storage — one service replaces three; Row Level Security enforces the two-user access model at the database layer
- **Drizzle ORM 0.39+:** Type-safe database queries — 90% smaller bundle and faster cold starts than Prisma, SQL-like queries make behavior predictable
- **Tailwind CSS v4.0:** CSS-first design tokens — OKLCH color space produces more vibrant pastels; `@theme` directive makes the feminine design system straightforward to define
- **shadcn/ui CLI v4:** Component primitives — copy-paste ownership means full customization for the bespoke aesthetic
- **motion 12.x:** Animations — premium feel through subtle page transitions and gallery animations without JS overhead of older Framer Motion

**What to explicitly avoid:** Prisma (bundle size), NextAuth.js/Auth.js (unnecessary complexity over Supabase Auth for two users), MongoDB (relational data fits PostgreSQL better), Redux/Zustand (no complex client state), UploadThing (redundant with Supabase Storage already in the stack).

### Expected Features

The feature landscape has three layers with clear MVP boundaries. All P1 features are required to deliver the gift. P2 features add polish after initial use. P3 features only if real usage reveals the need.

**Must have (table stakes — P1):**

- Design system (pastel/rose gold/cream aesthetic with typography) — the aesthetic IS the gift; generic styling undermines the entire product
- Image upload and optimization pipeline — foundational infrastructure; every other feature depends on it
- Public portfolio gallery (masonry layout + lightbox + category filtering) — primary public-facing showcase
- About + Contact section — expected by agencies and photographers viewing the portfolio
- Authentication (two accounts only — no registration) — gates all private features
- Role-based access (Owner: Funnghy full access; Contributor: boyfriend upload/edit only)
- Beauty product CRUD with photo, category, rating, and notes (shelf visual grid)
- Morning/evening routine builder with drag-to-reorder step ordering
- Photo journal (entries with photo + text, chronological browse)
- Responsive/mobile-first design — her primary device is her phone

**Should have (differentiators — P2, after validation):**

- Calendar view for journal navigation
- Routine daily check-off with visual progress
- Contributor-specific streamlined upload UI for boyfriend
- Mood/location tags on journal entries
- Seasonal accent color themes (3-4 CSS custom property presets)
- Page transitions and micro-animations (polish layer)

**Defer (v2+):**

- Product wishlist, routine streak history, before/after photo comparison
- Portfolio print/PDF export (comp card)
- Dark mode

**Anti-features (deliberately excluded):**

- Public comments/likes, e-commerce links, ingredient scanning, AI skin analysis, social media integration, video hosting, blog/CMS, public user registration, push notification reminders.

### Architecture Approach

The architecture follows a clean three-layer pattern with Next.js App Router route groups creating the public/private split: `(public)` route group for the portfolio (no auth overhead, ISR-eligible), and `(private)` route group for beauty tracker and journal (auth middleware enforced at every route). All mutations go through Server Actions (no API routes needed), which run server-side, call Drizzle directly, and include auth + role checks inline. The design system lives as CSS custom properties at `:root`, referenced by Tailwind — a single source of truth that prevents aesthetic drift across features.

**Major components:**

1. **Public Portfolio** — Server-rendered gallery, lightbox, about/contact pages; ISR caching; anonymous access; indexable for SEO and Open Graph
2. **Private Dashboard** — Beauty tracker CRUD, photo journal, content management; all behind auth middleware with role-based Server Action checks
3. **Auth System** — Supabase Auth with cookie-based sessions via `@supabase/ssr`; two pre-seeded accounts; no registration; middleware matcher protects `/dashboard/*`, `/beauty/*`, `/journal/*`, `/manage/*`
4. **Image Upload Pipeline** — Shared infrastructure: react-dropzone for UX, Server Action for upload to Supabase Storage, store URL + dimensions in database, serve via `next/image`; used by portfolio, journal, and product tracker
5. **Design System** — CSS custom properties (design tokens) + Tailwind v4 + shadcn/ui primitives; established before any feature UI

**Database schema key decisions:** Separate `Photo` entity reused across portfolio, journal, and product images; `RoutineStep` has its own `stepOrder`, `amount`, and `notes` fields; `Product` has a JSON `attributes` field for category-specific data beyond the core fields. Store image dimensions at upload time (critical for CLS prevention).

**Suggested build order from architecture research:** design system → auth → database schema → image upload pipeline → public portfolio → beauty tracker → photo journal → content management (boyfriend uploads).

### Critical Pitfalls

1. **Serving unoptimized original images** — Full-resolution camera photos (3-8MB each) served directly cause 60-100MB gallery page loads and immediate mobile bounce. Prevention: use `next/image` from day one, generate thumbnail/medium/full-size variants at upload time, enforce 4096px max dimension and 10MB file size server-side. Must be addressed in the infrastructure phase before any content is uploaded.

2. **Cumulative Layout Shift (CLS) in image galleries** — Images loading without reserved space causes layout reflow, tanks Core Web Vitals, and frustrates mobile users trying to tap photos. Prevention: store image dimensions in the database at upload time, use CSS `aspect-ratio` on all image containers, calculate masonry layout on the server with stored dimensions. CLS score must be below 0.1.

3. **Design system drift** — Each feature built in sequence will subtly diverge in colors, spacing, and typography if tokens are not established upfront. Prevention: define all design tokens as CSS custom properties before building any feature; build primitive components (Card, Button, Input, ImageFrame) first; every component must use tokens only — no raw hex values. Do a side-by-side visual comparison at each feature phase.

4. **Missing API-level auth enforcement** — Private data accessible to unauthenticated requests because boundary is enforced only at the UI level. Prevention: middleware on every private route, session verification in every Server Action, private images served via signed URLs or authenticated proxy (not direct storage URLs). Add "incognito audit" to every phase's definition of done.

5. **Rigid beauty product data model** — Flat fields cannot represent the real diversity of beauty products (SPF ratings, shade names, ingredient concentrations, usage status lifecycle). Prevention: core fields + JSON `attributes` for category-specific data; `status` field (using/finished/want to try/discontinued); routine steps have their own `amount` and `wait_time`. Validate the model with 10 real products before building any UI.

---

## Implications for Roadmap

Based on the dependency analysis and pitfall mapping across all four research files, the following phase structure is strongly recommended. Each phase is a hard dependency for the next.

### Phase 1: Foundation (Design System + Infrastructure)

**Rationale:** Every other feature depends on this phase. The image pipeline must exist before content is uploaded. Design tokens must be set before any component is styled. Doing this last means rebuilding everything twice. This phase directly prevents the two most expensive pitfalls (unoptimized images, design system drift).

**Delivers:** A working Next.js project with Tailwind v4 design tokens, primitive component library (Card, Button, Input, ImageFrame, Rating), Supabase project setup with Drizzle schema, Supabase Auth with two seeded accounts, middleware route protection, and the shared image upload pipeline (react-dropzone + Supabase Storage + dimension storage).

**Addresses (from FEATURES.md):** Design system (P1), image upload infrastructure (P1), authentication (P1), public/private route separation (P1), role-based access (P1), responsive/mobile-first foundation.

**Avoids (from PITFALLS.md):** Unoptimized images (Pitfall 1), CLS in galleries (Pitfall 2), over-engineered auth (Pitfall 3), missing API auth boundary (Pitfall 5), design system drift (Pitfall 6).

**Research flag:** Standard patterns — no additional research needed. Auth with Supabase SSR + App Router is well-documented. Tailwind v4 design tokens are well-documented.

---

### Phase 2: Public Portfolio

**Rationale:** The portfolio is the most externally visible feature and the primary public value of the gift. Building it second ensures the design system is in place and the image pipeline is available. This is where the aesthetic is stress-tested at real scale (gallery with multiple photos, masonry layout, lightbox).

**Delivers:** Landing page with hero image, masonry gallery grid with category filtering, lightbox photo viewer with keyboard/swipe navigation, album organization, individual photo pages with Open Graph meta, about section, contact information, responsive mobile layout, ISR caching for public pages.

**Addresses (from FEATURES.md):** Full-screen hero (P1), masonry gallery (P1), album/category organization (P1), category filtering (P1), lightbox (P1), about/contact (P1), fast image loading (P1).

**Avoids (from PITFALLS.md):** Poor mobile gallery UX, no `srcset`, CLS on scroll, missing editorial visual hierarchy (support "featured" image sizing and manual sort order).

**Research flag:** Standard patterns — Next.js ISR + `next/image` + `react-photo-album` masonry is well-documented. No additional research needed.

---

### Phase 3: Beauty Tracker

**Rationale:** Self-contained private feature. Depends on auth (Phase 1) and image upload (Phase 1). Should be built before the journal because the routine builder adds moderate complexity (drag-to-reorder) that is worth resolving before tackling journal features. Product data model must be validated with real products before any UI is built — this is the phase most at risk from the rigid data model pitfall.

**Delivers:** Product CRUD with photo, category, rating, notes, and status lifecycle (using/finished/want to try); product shelf visual grid; morning/evening routine builder with drag-to-reorder step ordering; product category management.

**Addresses (from FEATURES.md):** Product CRUD (P1), product categories (P1), product rating + photo (P1), product shelf visual grid (P1), routine builder (P1), routine step ordering (P1).

**Avoids (from PITFALLS.md):** Rigid product data model (Pitfall 4) — validate schema with 10 real products before UI work; progressive disclosure in forms (show core fields first, expand for details); private image URLs must be access-controlled (Pitfall 5).

**Research flag:** Needs deeper research on drag-to-reorder UX patterns in Next.js App Router (Server Actions + optimistic UI for reorder). The `@dnd-kit/core` library is the current standard but integration with Server Actions needs a clear pattern.

---

### Phase 4: Photo Journal

**Rationale:** Self-contained private feature. Depends on auth and image upload (Phase 1). Simpler than the beauty tracker (no drag-to-reorder, no complex data model). Calendar view is P2 and should be deferred to Phase 5 — launch with chronological list first and validate usage patterns before investing in the calendar component.

**Delivers:** Journal entry creation (one or more photos + text, auto-populated date), chronological browse/timeline view, entry edit and delete, mobile-first entry creation form (minimal friction: photo + optional text, nothing required beyond that).

**Addresses (from FEATURES.md):** Daily journal entry (P1), chronological browse (P1). Defers calendar view to Phase 5.

**Avoids (from PITFALLS.md):** Entry form requiring too many fields (UX pitfall — default to minimal, date auto-populated, tags optional); private journal images must use signed URLs or authenticated proxy, not direct storage URLs (Pitfall 5).

**Research flag:** Standard patterns — journal CRUD is simple. Signed URL generation for private Supabase Storage objects needs verification — check Supabase documentation for time-limited signed URL generation pattern.

---

### Phase 5: Polish + P2 Features

**Rationale:** Add refinements after the core product is in use and Funnghy has provided feedback. This phase is deliberately deferred — building polish before validating core usage is waste.

**Delivers:** Calendar view for journal, routine daily check-off with visual progress indicator, boyfriend contributor-specific upload UI, mood/location tags on journal entries, seasonal accent color themes (3-4 CSS custom property presets), page transitions and micro-animations (motion library, under 300ms, AnimatePresence for route changes).

**Addresses (from FEATURES.md):** All P2 features — calendar view, routine check-off, contributor UI, mood/location tags, seasonal themes, micro-animations.

**Avoids (from PITFALLS.md):** Private sections feeling utilitarian compared to portfolio — apply same aesthetic care, same tokens, same animation budget to beauty tracker and journal as the public portfolio.

**Research flag:** Standard patterns — all P2 features are incremental additions. No research needed; build on established foundation.

---

### Phase Ordering Rationale

- **Foundation before everything:** Image pipeline and design tokens are shared infrastructure. Building them after features means retrofitting — high recovery cost per PITFALLS.md.
- **Public portfolio before private tools:** The portfolio is the external face of the gift and the primary validation that the design system works at scale. Fixes discovered here inform private feature quality.
- **Beauty tracker before journal:** Drag-to-reorder routine builder is the most technically complex UI interaction in the app. Resolving it in Phase 3 provides patterns reusable in Phase 4.
- **P2 features last:** Deferred by design until core usage validates demand. The feature dependency tree in FEATURES.md confirms no P2 feature blocks any P1 feature.
- **Incognito audit at every phase:** PITFALLS.md is explicit that API-level auth must be verified at every phase, not just once. This should be in each phase's definition of done.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3 (Beauty Tracker):** Drag-to-reorder with `@dnd-kit` + Next.js Server Actions requires a clear optimistic UI pattern. Research the specific integration before building the routine builder.
- **Phase 4 (Photo Journal):** Confirm Supabase Storage signed URL generation pattern for private image access — ensure time-limited URLs are feasible within the Server Component / Server Action architecture.

Phases with standard patterns (skip research-phase):

- **Phase 1 (Foundation):** Supabase Auth + Next.js App Router is extensively documented. Tailwind v4 design tokens are well-documented. Next.js Drizzle setup has clear official guidance.
- **Phase 2 (Public Portfolio):** `next/image` + ISR + `react-photo-album` masonry are all well-documented with official examples.
- **Phase 5 (Polish):** All P2 features are incremental additions to established foundation. No novel integrations.

---

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                                                                                                                                                                                                                                                                      |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stack        | HIGH        | Multiple official sources confirmed; version compatibility table verified in STACK.md; all major choices cross-referenced against alternatives                                                                                                                                                                                             |
| Features     | HIGH        | Grounded in real competitor analysis (Pixpa, FeelinMySkin, Skin Bliss, BasicBeauty, PicDiary, Day One); feature scope is well-bounded by PROJECT.md constraints                                                                                                                                                                            |
| Architecture | MEDIUM-HIGH | Next.js App Router patterns are well-documented at HIGH confidence; Drizzle replaces Prisma from ARCHITECTURE.md's original recommendation (note: ARCHITECTURE.md used Prisma + SQLite in diagrams but STACK.md recommends Drizzle + Supabase — use STACK.md as authoritative); some sources were vendor or community rather than official |
| Pitfalls     | HIGH        | Pitfalls are grounded in known CWV metrics (CLS thresholds), OWASP security guidance (file upload security), and well-documented Next.js/image performance patterns; all have concrete measurable verification criteria                                                                                                                    |

**Overall confidence:** HIGH

### Gaps to Address

- **ARCHITECTURE.md vs STACK.md mismatch:** The architecture document was written with Prisma + SQLite + Cloudinary + NextAuth.js, while STACK.md recommends Drizzle + Supabase (replacing all three). The data flow diagrams and code examples in ARCHITECTURE.md reference the older stack. **Resolution:** Use STACK.md as authoritative for technology choices. The structural architecture patterns (route groups, Server Actions, image pipeline) remain valid regardless of which specific tools implement them. During Phase 1, follow STACK.md for actual implementation.

- **Signed URL pattern for private Supabase Storage:** PITFALLS.md mandates that private images (beauty tracker, journal) must not be served via direct public CDN URLs. Supabase Storage supports signed URLs, but the exact integration with Next.js Server Components and the `next/image` component needs validation during Phase 4 planning.

- **Drag-to-reorder with Server Actions:** `@dnd-kit/core` is the standard library but its integration with Next.js Server Actions for persisting sort order (optimistic UI + server revalidation) is not covered in the research. Needs a clear implementation pattern before Phase 3 begins.

- **Supabase project inactivity pause:** STACK.md notes that Supabase free tier projects pause after 7 days of inactivity. For a personal app used daily this should not be an issue, but the first deploy should validate that the project remains active.

---

## Sources

### Primary (HIGH confidence)

- [Next.js 16.1 blog post](https://nextjs.org/blog/next-16-1) — confirmed latest stable version
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, OKLCH colors
- [shadcn/ui changelog - CLI v4](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) — Tailwind v4 support confirmed
- [Supabase docs - Next.js SSR auth](https://supabase.com/docs/guides/auth/server-side/nextjs) — @supabase/ssr for App Router
- [Supabase free tier limits](https://supabase.com/docs/guides/platform/billing-on-supabase) — 1 GB storage, 2 GB egress
- [Motion changelog](https://motion.dev/changelog) — v12.x current, package renamed from framer-motion
- [Vercel pricing](https://vercel.com/pricing) — free tier limits
- [Next.js Image Optimization docs](https://nextjs.org/docs/app/getting-started/images) — `next/image` patterns
- [Next.js Authentication docs](https://nextjs.org/docs/pages/building-your-application/authentication) — auth patterns
- [OWASP - File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) — upload security

### Secondary (MEDIUM confidence)

- [Drizzle vs Prisma comparison](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma) — bundle size and cold start benchmarks
- [react-photo-album](https://react-photo-album.com/examples/masonry) — masonry layout patterns
- [Next.js App Router Authentication Guide 2026 (WorkOS)](https://workos.com/blog/nextjs-app-router-authentication-guide-2026) — auth patterns
- [Pagepro - Next.js Image Component Performance and CWV](https://pagepro.co/blog/nextjs-image-component-performance-cwv/) — CLS thresholds and prevention
- [Build with Matija - Handling 500+ Images in Next.js 15](https://www.buildwithmatija.com/blog/handling-500-images-in-a-gallery-with-lazy-loading-in-next-js-15) — lazy loading patterns
- Competitor analysis: FeelinMySkin, BasicBeauty, Skin Bliss, Pixpa, PicDiary, Day One — feature benchmarks
- [Beauty Feeds - Challenges with Beauty Product Datasets](https://beautyfeeds.io/what-are-common-challenges-when-working-with-beauty-product-datasets/) — product data model complexity
- [Penpot - Developer Guide to Design Tokens](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/) — design token architecture

### Tertiary (needs validation during implementation)

- Drag-to-reorder with @dnd-kit + Server Actions — no specific source found; needs implementation research
- Supabase Storage signed URL + next/image integration pattern — not explicitly covered in researched sources

---

_Research completed: 2026-03-19_
_Ready for roadmap: yes_
