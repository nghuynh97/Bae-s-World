# Stack Research

**Domain:** Personal portfolio webapp with image galleries, beauty tracker, and photo journal
**Researched:** 2026-03-19
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.1 | Full-stack React framework | Built-in image optimization (critical for photo-heavy app), App Router with server components for fast initial loads, API routes for backend logic, and Vercel deployment is zero-config. The image component alone justifies the choice -- automatic WebP/AVIF, lazy loading, and responsive sizing. |
| React | 19 | UI library | Ships with Next.js 16. Concurrent rendering, server components, and the `use` hook simplify data fetching patterns. |
| TypeScript | 5.7+ | Type safety | Non-negotiable for any project beyond a toy. Catches schema mismatches between frontend and Supabase types at compile time. |
| Supabase | Latest (hosted) | Database, auth, file storage | PostgreSQL gives you relational data (products, routines, journal entries with proper foreign keys). Row Level Security enforces the two-user access model at the database level. Built-in auth with cookie-based sessions via `@supabase/ssr`. File storage for photo uploads with access control tied to auth. One service replaces what would otherwise be 3-4 separate tools. |
| Tailwind CSS | 4.0 | Styling | CSS-first configuration with `@theme` directive makes building a custom feminine design system trivial -- define pastel palette, rose gold accents, and cream backgrounds as design tokens in CSS. 5x faster builds than v3. OKLCH color space produces more vibrant pastels on modern displays. |

### Database & ORM

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Drizzle ORM | 0.39+ | Type-safe database queries | 90% smaller bundle than Prisma, cold starts under 500ms vs 1-3s with Prisma. Schema defined in TypeScript (no separate schema language). SQL-like query builder means you understand exactly what query runs. Works directly with Supabase PostgreSQL via connection string. |
| drizzle-kit | Latest | Migrations & schema management | Generates SQL migrations from TypeScript schema changes. `drizzle-kit push` for dev, `drizzle-kit generate` + `drizzle-kit migrate` for production. |

### Image Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Supabase Storage | Included | Primary image storage | Already included with Supabase. Bucket-based with RLS policies. Free tier: 1 GB storage, 2 GB egress. For two users uploading personal photos, this is sufficient for months of use. |
| next/image | Built-in | Image rendering & optimization | Automatic format conversion (WebP/AVIF), responsive `srcSet`, lazy loading, blur placeholders. The backbone of making a photo-heavy site feel fast. |
| sharp | 0.33+ | Server-side image processing | Next.js uses this under the hood for image optimization. Also useful for generating thumbnails on upload. Already a Next.js dependency. |

### UI Components & Design System

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | CLI v4 | Component primitives | Copy-paste components you own and customize. Perfect for building a bespoke feminine design system -- you modify the source directly. Not a dependency, just scaffolding. Use for: buttons, dialogs, dropdowns, forms, cards, tabs. |
| Radix UI | Latest | Accessible primitives (via shadcn) | shadcn/ui is built on Radix. You get accessible dialogs, popovers, and dropdowns without building from scratch. |
| motion (formerly Framer Motion) | 12.x | Animations | Subtle page transitions, image gallery animations, hover effects. Essential for making the app feel premium and polished. The `AnimatePresence` component handles enter/exit animations for route changes. |
| react-photo-album | 3.x | Masonry photo grid | Purpose-built for photo galleries with masonry layout. Lightweight, responsive, handles variable aspect ratios. Better than rolling your own CSS grid masonry. |
| react-dropzone | 14.x | File upload UX | Drag-and-drop file upload zones. Headless (no styles imposed), so it fits any design system. Handles file validation, multiple files, and preview generation. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @supabase/ssr | 0.6+ | Server-side Supabase client | Cookie-based auth sessions for Next.js App Router. Required for SSR auth checks in middleware and server components. |
| @supabase/supabase-js | 2.x | Client-side Supabase SDK | Database queries, storage uploads, and realtime subscriptions from client components. |
| zod | 3.x | Schema validation | Validate form inputs (product details, journal entries, routine steps). Pairs with react-hook-form for type-safe form handling. |
| react-hook-form | 7.x | Form management | Lightweight form library with minimal re-renders. Beauty tracker and journal entry forms will be form-heavy -- this keeps them performant. |
| date-fns | 4.x | Date formatting | Journal entries need date display, routine tracking needs time-of-day logic. Lightweight, tree-shakeable, no moment.js bloat. |
| nuqs | 2.x | URL state management | Type-safe search params for filtering portfolio by category, searching products. Keeps filter state in the URL for shareability. |
| next-themes | 0.4+ | Theme switching | Not for dark/light mode -- for potential seasonal theme variations (spring pastels, winter tones). Lightweight, SSR-safe. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Linting | Use `next lint` config. Add `eslint-plugin-drizzle` to catch common ORM mistakes. |
| Prettier | Formatting | With `prettier-plugin-tailwindcss` to auto-sort Tailwind classes. |
| Turbopack | Dev server bundler | Built into Next.js 16. 100x faster incremental builds than Webpack. Use `next dev --turbopack`. |

## Installation

```bash
# Create Next.js project
npx create-next-app@latest funnghy-world --typescript --tailwind --app --turbopack

# Core dependencies
npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres

# UI & animation
npm install motion react-photo-album react-dropzone

# Forms & validation
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install date-fns nuqs next-themes

# Dev dependencies
npm install -D drizzle-kit @types/node prettier prettier-plugin-tailwindcss
```

```bash
# Initialize shadcn/ui (run after project setup)
npx shadcn@latest init
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Supabase | Firebase | If you need global edge performance or offline-first sync. Firebase's NoSQL model is worse for relational data (products with categories, routines with steps). |
| Supabase Storage | Cloudinary | If you outgrow 1 GB storage and need advanced image transformations (face detection, smart crop, artistic filters). Cloudinary free tier gives 25 credits/month (~25 GB storage OR bandwidth). Consider migrating to Cloudinary if the portfolio goes viral. |
| Drizzle ORM | Prisma | If you prefer a more abstracted API and don't care about bundle size. Prisma 7 has improved edge support, but Drizzle remains lighter for serverless. |
| shadcn/ui | Mantine UI | If you want a batteries-included component library with built-in theming. But you lose the ability to deeply customize component source code, which matters for a bespoke design system. |
| motion (Framer Motion) | CSS animations + View Transitions API | If you want zero JS animation overhead. View Transitions API is natively supported in Chrome/Edge but not Firefox. motion gives cross-browser consistency and more complex animation patterns. |
| react-photo-album | CSS columns masonry | If you want zero dependencies. CSS `columns` property can create masonry-like layouts, but handling variable aspect ratios, click-to-lightbox, and responsive breakpoints is painful. |
| Vercel | Coolify (self-hosted) | If you want to avoid Vercel's bandwidth limits (100 GB/month free). Coolify on a $5/month VPS gives unlimited bandwidth. More DevOps work though. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Prisma (for this project) | 3-6x larger bundle, slower cold starts on serverless. For a two-user app, the DX advantages of Prisma's abstraction don't justify the performance cost. | Drizzle ORM |
| MongoDB / Mongoose | Beauty products have categories, routines have ordered steps, journal entries have dates -- this is relational data. Document databases make these relationships painful. | Supabase (PostgreSQL) |
| NextAuth.js / Auth.js | Unnecessary complexity for two hardcoded users. Supabase Auth handles email/password auth with RLS policies. Adding another auth layer creates confusion about which system is authoritative. | Supabase Auth |
| Material UI / Chakra UI | Opinionated design systems that fight against custom aesthetics. You'd spend more time overriding Material's design language than building. Neither feels "soft and feminine" out of the box. | shadcn/ui + custom theme |
| Moment.js | 300KB+ bundle, mutable API, officially in maintenance mode. | date-fns |
| Redux / Zustand | Two users, no complex client state. Server components + React's built-in `useState` and URL state (nuqs) cover every state management need. Adding a state management library is over-engineering. | React state + nuqs |
| UploadThing | Adds a third-party dependency and another service to manage for file uploads. Supabase Storage already handles file uploads with auth-gated access. UploadThing makes sense when you don't have a backend -- you already have Supabase. | Supabase Storage + react-dropzone |
| WordPress / Strapi CMS | This is a custom app with private tools (tracker, journal), not a content site. A CMS adds a layer that doesn't map to the beauty tracker or journal features. | Next.js + Supabase (custom) |

## Stack Patterns by Variant

**If Supabase free tier storage becomes insufficient:**
- Migrate image storage to Cloudinary (free: 25 credits/month)
- Keep Supabase for database and auth
- Use Cloudinary's Next.js SDK (`next-cloudinary`) for optimized delivery
- This is an additive change, not a rewrite

**If you want offline journal access later:**
- Add a service worker with Workbox
- Cache recent journal entries in IndexedDB
- Sync when back online via Supabase realtime
- This can be added in a later phase without architecture changes

**If the portfolio needs to handle high traffic:**
- Enable ISR (Incremental Static Regeneration) for public portfolio pages
- Use Supabase CDN URLs for public images
- Consider upgrading to Vercel Pro ($20/month) for more bandwidth
- The Next.js architecture already supports this -- no code changes needed

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.1 | React 19, Tailwind CSS 4.0 | Turbopack requires Tailwind v4 for full CSS-first config support |
| shadcn/ui CLI v4 | Tailwind CSS 4.0, Next.js 16 | Auto-detects Tailwind version. Run `npx shadcn@latest init` after project creation. |
| Drizzle ORM 0.39+ | @supabase/supabase-js 2.x | Use Supabase's "Session Mode" connection string (port 5432), not "Transaction Mode" |
| motion 12.x | React 19 | Improved concurrent rendering support in v12. Use `motion` package name (not `framer-motion` for new projects). |
| @supabase/ssr 0.6+ | Next.js 16, @supabase/supabase-js 2.x | Replaces deprecated `@supabase/auth-helpers-nextjs`. Cookie-based sessions work with App Router middleware. |

## Hosting & Infrastructure

| Service | Tier | Purpose | Limits |
|---------|------|---------|--------|
| Vercel | Hobby (free) | Next.js hosting | 100 GB bandwidth/month, 150K function invocations, 6K build minutes. Sufficient for a personal portfolio with moderate traffic. |
| Supabase | Free | Database, auth, storage | 500 MB database, 1 GB file storage, 2 GB egress, 50K MAU. Projects pause after 7 days inactivity -- upgrade to Pro ($25/month) if this becomes an issue. |

**Cost for v1:** $0/month. Upgrade path: Supabase Pro ($25/month) when you need always-on + more storage, Vercel Pro ($20/month) if traffic exceeds free tier.

## Sources

- [Next.js 16.1 blog post](https://nextjs.org/blog/next-16-1) -- confirmed latest stable version (HIGH confidence)
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4) -- confirmed CSS-first config, OKLCH colors (HIGH confidence)
- [shadcn/ui changelog - CLI v4](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- confirmed Tailwind v4 support (HIGH confidence)
- [Supabase docs - Next.js SSR auth](https://supabase.com/docs/guides/auth/server-side/nextjs) -- confirmed @supabase/ssr package for App Router (HIGH confidence)
- [Supabase free tier limits](https://supabase.com/docs/guides/platform/billing-on-supabase) -- 1 GB storage, 2 GB egress confirmed (HIGH confidence)
- [Drizzle vs Prisma comparison](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma) -- bundle size and cold start benchmarks (MEDIUM confidence)
- [Motion changelog](https://motion.dev/changelog) -- v12.x current, package renamed from framer-motion (HIGH confidence)
- [Vercel pricing](https://vercel.com/pricing) -- free tier limits confirmed (HIGH confidence)
- [Cloudinary free plan](https://cloudinary.com/documentation/developer_onboarding_faq_free_plan) -- 25 credits/month, no time limit (HIGH confidence)
- [react-photo-album](https://react-photo-album.com/examples/masonry) -- masonry layout component (MEDIUM confidence)

---
*Stack research for: Personal portfolio + beauty tracker webapp (Funnghy's World)*
*Researched: 2026-03-19*
