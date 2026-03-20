# Architecture Research

**Domain:** Personal portfolio webapp with integrated private tools (beauty tracker, photo journal)
**Researched:** 2026-03-19
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Public Site   │  │ Private App  │  │ Design System        │   │
│  │ (Portfolio,   │  │ (Beauty      │  │ (Tokens, Components, │   │
│  │  Gallery,     │  │  Tracker,    │  │  Layouts)            │   │
│  │  Photo Pages) │  │  Photo       │  │                      │   │
│  │              │  │  Journal)    │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘   │
│         │                 │                                      │
├─────────┴─────────────────┴──────────────────────────────────────┤
│                      Application Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Middleware    │  │ Server       │  │ Image Processing     │   │
│  │ (Auth Guard, │  │ Actions      │  │ Pipeline             │   │
│  │  Route       │  │ (CRUD,       │  │ (Upload, Optimize,   │   │
│  │  Protection) │  │  Uploads)    │  │  Transform)          │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
├─────────┴─────────────────┴──────────────────────┴───────────────┤
│                      Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Prisma ORM   │  │ SQLite DB    │  │ Cloudinary           │   │
│  │ (Models,     │  │ (All app     │  │ (Image storage,      │   │
│  │  Relations)  │  │  data)       │  │  CDN, transforms)    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component         | Responsibility                                                  | Typical Implementation                                         |
| ----------------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| Public Portfolio  | Serve gallery, photo pages, about section to anonymous visitors | Next.js App Router static/ISR pages with `next/image`          |
| Private Dashboard | Beauty tracker CRUD, photo journal entries, content management  | Next.js App Router dynamic pages behind auth middleware        |
| Auth System       | Two-user login, session management, route protection            | NextAuth.js with credentials provider, middleware matcher      |
| Image Pipeline    | Upload, optimize, store, serve responsive images                | Cloudinary SDK for upload/transform, `next/image` for delivery |
| Design System     | Consistent pastel/rose-gold aesthetic across all pages          | CSS custom properties (design tokens) + Tailwind CSS           |
| Data Access       | All database reads/writes, relation management                  | Prisma ORM with SQLite, Server Actions for mutations           |
| Content Upload    | Boyfriend uploads photos/content for Funnghy                    | Server Actions with role-based permission checks               |

## Recommended Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group: no auth required
│   │   ├── page.tsx              # Landing / portfolio home
│   │   ├── gallery/
│   │   │   ├── page.tsx          # Full gallery grid
│   │   │   └── [albumId]/
│   │   │       └── page.tsx      # Album view
│   │   ├── photo/
│   │   │   └── [photoId]/
│   │   │       └── page.tsx      # Individual photo page
│   │   └── about/
│   │       └── page.tsx          # About Funnghy
│   ├── (private)/                # Route group: auth required
│   │   ├── layout.tsx            # Private layout with nav
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Private home
│   │   ├── beauty/
│   │   │   ├── page.tsx          # Product collection overview
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # All products
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Add product
│   │   │   │   └── [productId]/
│   │   │   │       └── page.tsx  # Product detail/edit
│   │   │   └── routines/
│   │   │       ├── page.tsx      # Morning/evening routines
│   │   │       └── [routineId]/
│   │   │           └── page.tsx  # Routine detail/edit
│   │   ├── journal/
│   │   │   ├── page.tsx          # Journal feed (timeline)
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # New entry
│   │   │   └── [entryId]/
│   │   │       └── page.tsx      # Entry detail/edit
│   │   └── manage/
│   │       ├── portfolio/
│   │       │   └── page.tsx      # Upload/manage portfolio photos
│   │       └── albums/
│   │           └── page.tsx      # Manage albums/categories
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts      # NextAuth API route
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Design tokens + base styles
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── Rating.tsx            # Star/heart rating component
│   ├── portfolio/                # Public portfolio components
│   │   ├── PhotoGrid.tsx         # Masonry/grid layout
│   │   ├── PhotoCard.tsx         # Individual photo in grid
│   │   ├── PhotoViewer.tsx       # Full-size photo view
│   │   ├── AlbumCard.tsx
│   │   └── HeroSection.tsx
│   ├── beauty/                   # Beauty tracker components
│   │   ├── ProductCard.tsx
│   │   ├── ProductForm.tsx
│   │   ├── RoutineBuilder.tsx
│   │   ├── RoutineStep.tsx
│   │   └── CategoryFilter.tsx
│   ├── journal/                  # Photo journal components
│   │   ├── JournalEntry.tsx
│   │   ├── EntryForm.tsx
│   │   ├── Timeline.tsx
│   │   └── CalendarView.tsx
│   └── layout/                   # Shared layout components
│       ├── PublicNav.tsx
│       ├── PrivateNav.tsx
│       ├── Footer.tsx
│       └── ImageUploader.tsx     # Shared upload component
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── cloudinary.ts             # Cloudinary config + helpers
│   └── utils.ts                  # Shared utilities
├── actions/
│   ├── portfolio.ts              # Portfolio CRUD server actions
│   ├── beauty.ts                 # Beauty tracker server actions
│   ├── journal.ts                # Journal CRUD server actions
│   └── upload.ts                 # Image upload server actions
├── types/
│   └── index.ts                  # Shared TypeScript types
└── prisma/
    ├── schema.prisma             # Database schema
    ├── seed.ts                   # Seed data (categories, etc.)
    └── dev.db                    # SQLite database file
```

### Structure Rationale

- **`app/(public)/` and `app/(private)/`:** Next.js route groups create a clean public/private boundary without affecting URLs. The `(private)` group shares an authenticated layout, while `(public)` pages have no auth overhead.
- **`components/` by domain:** Grouping components by feature domain (portfolio, beauty, journal) keeps related UI together and makes it clear which components belong to which feature area.
- **`actions/` at top level:** Server Actions separated by domain. Keeps mutation logic out of components and makes permission checks centralized and auditable.
- **`lib/` for singletons and config:** Prisma client, auth config, and Cloudinary helpers each get a single source of truth. The Prisma singleton pattern prevents connection pool exhaustion during Next.js hot reloading.
- **`components/ui/` for design system:** Primitive UI components that enforce the feminine design tokens. Every domain-specific component composes from these, ensuring visual consistency.

## Architectural Patterns

### Pattern 1: Route Group Boundaries for Public/Private Split

**What:** Use Next.js route groups `(public)` and `(private)` to create two distinct application surfaces that share the same codebase but have different authentication requirements and layouts.
**When to use:** Any app with mixed public-facing and authenticated sections.
**Trade-offs:** Clean URL structure (no `/private/` prefix in URLs), clear code organization. Slight mental overhead of understanding route groups. Middleware still needed for actual auth enforcement.

**Example:**

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  // Protect all routes under (private) group
  // These map to /dashboard, /beauty, /journal, /manage
  matcher: [
    '/dashboard/:path*',
    '/beauty/:path*',
    '/journal/:path*',
    '/manage/:path*',
  ],
};
```

### Pattern 2: Server Actions for All Mutations

**What:** Use Next.js Server Actions for every data mutation (create, update, delete) instead of API routes. Server Actions run on the server, can directly call Prisma, and include auth checks inline.
**When to use:** All CRUD operations in Next.js App Router projects. This is the modern replacement for custom API routes.
**Trade-offs:** Simpler code (no fetch calls for mutations), type-safe with TypeScript, automatic revalidation. Less familiar to developers used to REST APIs. Not suitable if you need a public API consumed by other clients.

**Example:**

```typescript
// actions/beauty.ts
'use server';

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const product = await prisma.product.create({
    data: {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
      rating: Number(formData.get('rating')),
      notes: formData.get('notes') as string,
    },
  });

  revalidatePath('/beauty/products');
  return product;
}
```

### Pattern 3: Design Token Architecture

**What:** Define all visual properties (colors, spacing, typography, shadows, radii) as CSS custom properties at the `:root` level using a semantic naming convention. Tailwind CSS references these tokens for utility classes.
**When to use:** Any project with a strong design identity that must be consistent across many components.
**Trade-offs:** Single source of truth for all design values, easy to tweak the entire aesthetic by changing a few root variables. Requires upfront planning of the token hierarchy.

**Example:**

```css
/* globals.css */
:root {
  /* Primitive tokens */
  --color-rose-50: #fff1f2;
  --color-rose-100: #ffe4e6;
  --color-rose-200: #fecdd3;
  --color-rose-gold: #b76e79;
  --color-cream: #fffdf7;
  --color-blush: #f8e8e0;
  --color-lavender: #e8dff5;
  --color-sage: #d4e2d4;

  /* Semantic tokens */
  --color-bg-primary: var(--color-cream);
  --color-bg-card: #ffffff;
  --color-bg-accent: var(--color-blush);
  --color-text-primary: #4a3728;
  --color-text-secondary: #8b7355;
  --color-accent: var(--color-rose-gold);
  --color-accent-hover: #a05d68;
  --color-border: var(--color-rose-100);

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Lato', sans-serif;

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-soft: 0 2px 15px rgba(183, 110, 121, 0.08);
  --shadow-card: 0 4px 20px rgba(183, 110, 121, 0.12);
}
```

### Pattern 4: Image Upload Pipeline

**What:** A consistent flow for all image uploads: client-side preview, upload to Cloudinary via Server Action, store the Cloudinary URL and public_id in the database, serve via `next/image` with Cloudinary as the image loader.
**When to use:** Every image upload in the app (portfolio photos, product images, journal entries).
**Trade-offs:** Cloudinary handles all optimization/CDN/transforms (no self-managed image processing). Cost scales with usage but the free tier (25 credits/month) is generous for a two-user app. Vendor lock-in to Cloudinary.

## Data Flow

### Public Portfolio Request Flow

```
[Anonymous Visitor]
    |
    v
[Next.js Middleware] -- no auth required for (public) routes --> pass through
    |
    v
[Server Component] -- fetches data -->
    |
    v
[Prisma Query] -- reads from SQLite --> [photos, albums, metadata]
    |
    v
[Server-Rendered HTML] -- images via -->
    |
    v
[next/image + Cloudinary loader] -- optimized delivery from CDN
    |
    v
[Visitor sees portfolio]
```

### Private Feature Request Flow (Beauty Tracker Example)

```
[Funnghy or Boyfriend]
    |
    v
[Next.js Middleware] -- checks session token --> redirect to /login if missing
    |
    v
[Server Component] -- fetches data with session context -->
    |
    v
[Prisma Query] -- reads products/routines from SQLite
    |
    v
[Rendered Page]
    |
    v (user submits form)
[Server Action] -- validates session + role --> [Prisma Mutation] --> [revalidatePath]
    |
    v
[Updated Page] (automatic revalidation)
```

### Image Upload Flow

```
[User selects image]
    |
    v
[Client: preview with URL.createObjectURL]
    |
    v
[User submits form]
    |
    v
[Server Action: upload.ts]
    |-- Verify auth session
    |-- Upload buffer to Cloudinary (with folder + tags)
    |-- Receive { public_id, secure_url, width, height }
    |-- Store metadata in SQLite via Prisma
    |-- revalidatePath for affected pages
    v
[Image available via Cloudinary CDN]
```

### Key Data Flows

1. **Portfolio viewing:** Anonymous request -> Server Component -> Prisma query -> render with Cloudinary-optimized images via `next/image`. Static generation (ISR) for portfolio pages so they load instantly.
2. **Beauty product CRUD:** Authenticated user -> form submission -> Server Action -> Prisma mutation -> revalidate path -> updated UI. No client-side state management needed.
3. **Photo upload (any section):** Authenticated user -> file input -> Server Action -> Cloudinary upload -> save URL to SQLite -> revalidate affected pages. One pipeline serves portfolio, journal, and product images.
4. **Role-based permissions:** Session includes user role (primary/secondary). Server Actions check role before allowing destructive operations. Boyfriend can upload but cannot delete Funnghy's content.

## Scaling Considerations

| Scale                  | Architecture Adjustments                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 users (this project) | SQLite is perfect. No connection pooling needed. Cloudinary free tier covers image hosting. Deploy to Vercel free tier.                      |
| If photos grow to 10K+ | Cloudinary still handles it well. Consider paginating gallery queries. Add database indexes on frequently filtered columns (category, date). |
| If moved to a platform | Replace SQLite with PostgreSQL, add proper user registration, but this is a fundamental scope change and not planned.                        |

### Scaling Priorities

1. **First bottleneck (image loading):** Large portfolio pages with many photos. Mitigate with pagination, lazy loading via `next/image`, and blur placeholders. ISR caching prevents repeated DB hits.
2. **Second bottleneck (upload size):** Large RAW or high-res photos from camera. Mitigate with client-side resize before upload or Cloudinary's upload widget which handles chunked uploads.

## Anti-Patterns

### Anti-Pattern 1: Client-Side Auth Checking Only

**What people do:** Check authentication in React components with `useSession()` and conditionally render content, without server-side enforcement.
**Why it's wrong:** Client-side checks are cosmetic. Anyone can view the page source or call Server Actions directly. Private data leaks to the client even if UI hides it.
**Do this instead:** Use middleware for route protection AND verify the session in every Server Action. Server Components should fetch data only after confirming the session server-side. Client-side `useSession()` is fine for UI hints (showing/hiding nav items) but never as the security boundary.

### Anti-Pattern 2: Storing Images in the Database or Git Repo

**What people do:** Store image files as blobs in SQLite or commit them to the repository.
**Why it's wrong:** SQLite file bloats rapidly, backups become unwieldy, no CDN delivery, no automatic format optimization. Git repos become unusably large.
**Do this instead:** Store images in Cloudinary (or any object storage). Store only the Cloudinary `public_id` and metadata (dimensions, alt text) in the database. Reconstruct URLs at render time using Cloudinary's URL API for any size/format needed.

### Anti-Pattern 3: Building a SPA with Client-Side Routing for the Portfolio

**What people do:** Build the public portfolio as a fully client-side React app with client-side routing and data fetching.
**Why it's wrong:** No SEO for the public portfolio. Slow initial load (JavaScript must download, parse, then fetch data). No social media preview cards (Open Graph). Poor accessibility for crawlers.
**Do this instead:** Use Next.js Server Components for all public portfolio pages. They render to HTML on the server, are indexable by search engines, support Open Graph meta tags, and load faster because data fetching happens server-side.

### Anti-Pattern 4: One Giant Form Component

**What people do:** Build the beauty product form or journal entry form as a single massive component with all state, validation, and submission logic inline.
**Why it's wrong:** Becomes unmaintainable, hard to test, and forces the entire form to be a Client Component (losing Server Component benefits for the page).
**Do this instead:** Compose forms from small, focused Client Components (ImageUploader, RatingInput, CategorySelect) embedded within a Server Component page. Use the `<form action={serverAction}>` pattern for progressive enhancement.

## Integration Points

### External Services

| Service          | Integration Pattern                                                                                                    | Notes                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudinary       | Server-side SDK (`cloudinary` npm package) via Server Actions for upload; `next/image` with custom loader for delivery | Free tier: 25 credits/month. More than enough for a two-user app. Use folders to organize (portfolio/, journal/, products/).                    |
| NextAuth.js      | Credentials provider with hardcoded users (or env-stored hashes)                                                       | Only two users ever. No need for OAuth providers or a users table with registration flow. Store bcrypt hashes in env vars.                      |
| Vercel (hosting) | `next deploy` or Git-push deploy                                                                                       | Free tier handles this project easily. Edge middleware for auth. Automatic HTTPS. SQLite file persists with serverless caveats -- see pitfalls. |
| Google Fonts     | `next/font/google` for Playfair Display + Lato                                                                         | Self-hosted by Next.js for performance. No external requests at runtime.                                                                        |

### Internal Boundaries

| Boundary                         | Communication                                                          | Notes                                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public pages <-> Data layer      | Server Components call Prisma directly                                 | No API layer needed. Server Components run on the server and can import Prisma.                                                                           |
| Private pages <-> Data layer     | Server Actions with auth checks                                        | Every mutation goes through a Server Action that verifies the session before touching the database.                                                       |
| Any page <-> Image storage       | Cloudinary URLs stored in DB, rendered via `next/image`                | `next/image` handles responsive sizing, lazy loading, and format negotiation automatically.                                                               |
| Auth middleware <-> Route groups | Middleware `matcher` config aligned with `(private)` route group paths | Middleware protects `/dashboard/*`, `/beauty/*`, `/journal/*`, `/manage/*`. Public routes pass through untouched.                                         |
| Boyfriend role <-> Mutations     | Role check inside Server Actions                                       | The boyfriend user has an `isSecondary` flag. Server Actions for destructive operations (delete) reject secondary users. Upload actions allow both users. |

## Database Schema (Conceptual)

```
User (id, name, email, passwordHash, role: PRIMARY|SECONDARY)

Photo (id, cloudinaryId, url, width, height, altText, createdAt)
  -> used by Portfolio, Journal, and Product images

Album (id, name, slug, description, coverPhotoId?, sortOrder)
PortfolioPhoto (id, photoId, albumId?, category, caption, featured, sortOrder)

Product (id, name, brand, category, rating, notes, photoId?, purchaseUrl?, createdAt)
ProductCategory (id, name, icon, sortOrder)

Routine (id, name, type: MORNING|EVENING, createdAt)
RoutineStep (id, routineId, productId, stepOrder, notes)

JournalEntry (id, date, text, mood?, createdAt)
JournalPhoto (id, entryId, photoId, sortOrder)
```

## Suggested Build Order

Based on dependency analysis, components should be built in this order:

1. **Design system + project scaffolding** -- Everything depends on this. Set up Next.js, Tailwind, design tokens, and primitive UI components first. No feature can look right without the design foundation.

2. **Auth system** -- Both the public/private split and all Server Actions depend on auth. Set up NextAuth.js with credentials provider, middleware route protection, and the two user accounts.

3. **Database schema + Prisma setup** -- All features need data persistence. Define the full schema upfront (it can evolve, but the core models should exist). Set up the Prisma singleton and seed script.

4. **Image upload pipeline** -- Portfolio, journal, and beauty tracker all need image uploads. Build the Cloudinary integration and reusable ImageUploader component once, then reuse everywhere.

5. **Public portfolio** -- The most visible feature with the most external value. Build gallery grid, album pages, individual photo pages, and the landing page. Uses the image pipeline from step 4.

6. **Beauty tracker** -- Self-contained private feature. Product CRUD, category management, rating system, and routine builder. Depends on auth, database, and image upload.

7. **Photo journal** -- Self-contained private feature. Daily entries with photos and notes, timeline view. Depends on auth, database, and image upload.

8. **Content management (boyfriend uploads)** -- The manage section where either user can upload portfolio content. Depends on portfolio being built and role-based auth working.

**Rationale:** Each step builds on the previous. The design system is the foundation. Auth enables the public/private split. The image pipeline is shared infrastructure. Then features can be built in parallel if needed, though portfolio first makes sense as the primary public-facing value.

## Sources

- [Next.js Image Optimization docs](https://nextjs.org/docs/app/getting-started/images) -- HIGH confidence
- [Next.js App Router Authentication Guide 2026 (WorkOS)](https://workos.com/blog/nextjs-app-router-authentication-guide-2026) -- MEDIUM confidence
- [Next.js Authentication docs](https://nextjs.org/docs/pages/building-your-application/authentication) -- HIGH confidence
- [Next.js with Prisma and SQLite (Robin Wieruch)](https://www.robinwieruch.de/next-prisma-sqlite/) -- MEDIUM confidence
- [Cloudinary vs S3 guide](https://cloudinary.com/guides/ecosystems/cloudinary-vs-s3) -- MEDIUM confidence (vendor source)
- [Design Tokens with CSS Custom Properties](https://medium.com/design-bootcamp/simple-design-tokens-with-css-custom-properties-7ab69b71d8ad) -- MEDIUM confidence
- [Prisma ORM Production Guide for Next.js 2025](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs) -- MEDIUM confidence
- [Modern Full Stack Application Architecture Using Next.js 15+](https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/) -- MEDIUM confidence

---

_Architecture research for: Funnghy's World -- personal portfolio with beauty tracker and photo journal_
_Researched: 2026-03-19_
