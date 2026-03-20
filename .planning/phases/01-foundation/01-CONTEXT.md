# Phase 1: Foundation - Context

**Gathered:** 2026-03-19 (updated 2026-03-20)
**Status:** Updated post-implementation

<domain>
## Phase Boundary

Design system (color tokens, typography, component styling), two-user authentication with invite-code setup, image upload pipeline with optimization, and public/private route separation. Project scaffolding with Next.js, Supabase, and Tailwind CSS.

</domain>

<decisions>
## Implementation Decisions

### Color palette & design tokens

- Primary accent: soft blush rose gold (#E8B4B8) — lighter, more pink than gold, delicate and airy
- Background: cool white with hint of lavender (#F8F6FF) — fresh and modern
- Cards/surfaces: white or very subtle tint against the cool background
- Shadows: soft, blush-tinted — not stark gray
- Overall vibe: soft feminine, elegant, premium — like a fashion editorial meets personal journal

### Typography

- Headings: elegant serif font (Playfair Display or Cormorant family) — editorial, fashion-magazine feel
- Body text: clean sans-serif for readability (Claude's discretion on specific font)
- "Funnghy's World" logo text rendered in the heading serif with rose gold color

### Component shape

- Gently rounded elements — medium border radius
- Not pill-shaped (too playful), not sharp corners (too corporate)
- Cards, buttons, inputs all follow the same gentle rounding

### Login experience

- Simple centered form on the cool white background — minimal and elegant
- Stylized "Funnghy's World" text logo above the form in elegant serif + rose gold
- First-visit setup flow: user enters an invite code, then creates their own password
- Two invite codes pre-generated (one for Funnghy, one for boyfriend)
- After first setup, normal email/password login
- After login, lands on a personal dashboard

### Dashboard (post-login home)

- Quick-access cards linking to Portfolio, Beauty Tracker, and Journal
- Cards show recent activity previews (latest photos, recent products, last journal entry)
- Clean grid layout consistent with the overall design system

### Image upload pipeline

- Combined drag-and-drop zone + click-to-browse (zone is clickable)
- Batch upload supported — select or drop multiple photos at once
- Per-photo progress bars during upload
- No file size limit — accept any size, optimize server-side
- Accepted formats: JPEG, PNG, WebP (research may add HEIC)
- Automatic optimization on upload: generate WebP/AVIF variants + multiple responsive sizes
- Private images (journal, beauty tracker) require authentication to access

### Navigation structure

- Desktop: top horizontal nav bar — "Funnghy's World" logo left, nav links right (Portfolio, Beauty, Journal, About)
- Mobile: bottom tab bar (like Instagram) — fixed, easy thumb reach
- Public visitors see simplified nav: Portfolio, About, Login only
- Authenticated users see full nav including Beauty Tracker and Journal
- Private sections hidden from public nav entirely (not shown with lock icon)

### Database connection (post-implementation fix)

- DATABASE_URL with special characters (%, #, @) in password causes `URI malformed` errors with the `postgres` driver
- On Windows, `npx tsx` and `npx drizzle-kit` do not auto-load `.env.local` — all npm scripts must use `node --env-file=.env.local` with direct module paths (e.g., `node_modules/tsx/dist/cli.mjs`, `node_modules/drizzle-kit/bin.cjs`)
- `drizzle-kit push` hangs indefinitely with Supabase connection pooler (port 6543) — use the Supabase SQL Editor for DDL operations, or use the direct connection (port 5432) if available
- npm scripts `db:push`, `db:seed`, `db:seed:portfolio` all updated to use `node --env-file=.env.local`

### Session management

- Single "Sign Out" option only — no "Sign Out All Devices" (removed per user request)
- User menu with logout must appear on ALL pages (public and private) when authenticated
- Public layout passes `UserMenu` component to TopNav when user is logged in

### Claude's Discretion

- Exact body font choice (should complement the serif heading font)
- Loading skeleton design and placement
- Error state styling (form validation, upload failures)
- Exact spacing scale and typography size scale
- Session duration / remember-me behavior
- Invite code format and validation UX
- Dashboard card layout specifics (2x2 grid, stacked, etc.)

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements are fully captured in decisions above and in:

### Project context

- `.planning/PROJECT.md` — Vision, core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — Full v1 requirements with REQ-IDs (AUTH-01–05, DESG-01–03, IMG-01–04)

### Research findings

- `.planning/research/STACK.md` — Recommended stack: Next.js 16.1, Supabase, Drizzle ORM, Tailwind v4, shadcn/ui
- `.planning/research/ARCHITECTURE.md` — System structure, route groups, component boundaries
- `.planning/research/PITFALLS.md` — Image optimization pitfalls, auth over-engineering, design drift warnings

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/upload/image-uploader.tsx` — Drag-and-drop upload with batch support and per-file progress
- `src/components/layout/user-menu.tsx` — Avatar dropdown with sign-out confirmation dialog
- `src/lib/supabase/admin.ts` — Service role client for admin operations (signOut global scope)
- `src/actions/auth.ts` — Server Actions for login, signup, invite code validation, logout

### Established Patterns

- Server Actions with zod validation for all form submissions
- Supabase SSR cookie auth with `getUser()` (server-verified, not `getSession()`)
- Three Supabase client factories: browser, server, admin
- Middleware route protection via `getUser()` check then redirect
- npm scripts use `node --env-file=.env.local` for env loading on Windows

### Integration Points

- Design tokens in `globals.css` @theme block — single source of truth
- Auth middleware in `src/lib/supabase/middleware.ts` protects all private + admin routes
- Image upload pipeline (`src/actions/upload.ts`) reused by portfolio, beauty tracker, and journal
- `src/lib/supabase/admin.ts` needed for "sign out all devices" via `auth.admin.signOut(userId, 'global')`

</code_context>

<specifics>
## Specific Ideas

- The login page should feel elegant and minimal — "Funnghy's World" in beautiful serif is the hero element
- The invite-code setup is part of the gift experience — she receives a code and creates her own space
- Batch upload is important because she uploads photo shoot sets (10-50 photos at a time)
- The bottom tab bar on mobile should feel natural for someone used to Instagram
- Quick-access cards on dashboard should preview recent content to pull her into using the app daily

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 01-foundation_
_Context gathered: 2026-03-19_
