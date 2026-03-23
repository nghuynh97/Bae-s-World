# Funnghy's World

## What This Is

A beautiful, personal webapp built as a gift for Funnghy — a freelance model who loves beauty, travel, and photography. It combines a public portfolio with an Instagram-style grid gallery and hero banner, private beauty product tracker with routines and a visual product picker, and a freelance schedule with income tracking. Built with Next.js 16, Supabase, and a soft feminine design system (pastels, rose gold, DM Sans typography).

## Core Value

Funnghy has a single, beautiful space that showcases her work to the world and helps her track her daily beauty and memories — all in one place that feels personally hers.

## Current State (v1.0 shipped 2026-03-23)

- **Stack:** Next.js 16 + Turbopack, Supabase (auth + storage + Postgres), Drizzle ORM, Tailwind CSS v4, shadcn/base-ui components
- **LOC:** 10,797 TypeScript/TSX across 257 files
- **Features:** Public portfolio, beauty tracker (products + routines), freelance schedule, admin panel
- **Design:** DM Sans typography, lavender backgrounds, rose gold accents, responsive (mobile bottom tabs + desktop top nav)
- **Auth:** Invite-code registration, two users (Funnghy + boyfriend), middleware route protection

## Requirements

### Validated

- ✓ Public portfolio with mixed feed (modeling, travel, beauty looks) — v1.0
- ✓ Photo gallery with Instagram-style grid and category filtering — v1.0
- ✓ Individual photo pages with full-size lightbox view — v1.0
- ✓ Private beauty/skincare product tracker (add products, rate, organize by category) — v1.0
- ✓ Beauty routine builder (morning/evening routines with visual product picker) — v1.0
- ✓ Freelance schedule & income tracker (calendar, jobs, VND income stats/charts) — v1.0
- ✓ User authentication (Funnghy as primary, boyfriend as secondary) — v1.0
- ✓ Boyfriend can upload photos and content for her — v1.0
- ✓ Public portfolio visible to anyone, private sections require login — v1.0
- ✓ Soft feminine design system — pastel tones, rose gold accents, DM Sans typography — v1.0
- ✓ Responsive design — mobile bottom tabs + desktop top nav — v1.0
- ✓ Image upload with sharp WebP processing and 4 size variants — v1.0

### Active

(None — next milestone requirements TBD)

### Out of Scope

- Real-time chat or messaging — not a communication tool
- E-commerce or product purchase links — this is personal, not a storefront
- Social features (likes, comments from public visitors) — portfolio is view-only for public
- Video hosting — photos only, keeps it focused and lightweight
- Blog/writing features — not needed for this app
- Integration with social media platforms — standalone personal space

## Context

- Funnghy is a freelance model who photographs at beaches and travel destinations
- She uses and collects beauty/skincare products as part of her profession
- The app is a personal gift — quality and aesthetic matter more than scale
- Two users total: Funnghy (full access) and her boyfriend (upload/contribute access)
- The beauty tracker should feel like a personal collection, not a database
- The portfolio should feel editorial and curated, not like a social media feed

## Constraints

- **Users**: Two users only (Funnghy + boyfriend) — no public registration
- **Aesthetic**: Must feel soft, feminine, and premium — pastels, rose gold, cream, elegant fonts
- **Privacy**: Clear separation between public portfolio and private tools
- **Performance**: Fast image loading — photos are the core content

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| Mixed portfolio feed (not separated by category) | She does modeling, travel, and beauty — all part of her identity | ✓ Good |
| Soft feminine design system | Matches her aesthetic and makes it feel like a personal gift | ✓ Good |
| Two-user system (no public registration) | This is a gift, not a platform | ✓ Good |
| Public portfolio + private tools | Best of both worlds — showcase and personal utility | ✓ Good |
| DM Sans as global font (replacing Playfair/Inter) | Cleaner, more modern feel for a creative portfolio | ✓ Good (Phase 8) |
| Instagram-style grid (replacing quilted) | Familiar pattern, clean squares, alternating large tiles | ✓ Good (Phase 8) |
| Dialog-based product picker for routines | Browse products visually instead of text search | ✓ Good (Phase 9) |
| Server Actions instead of API routes | Simpler data flow, type-safe, works with Next.js revalidation | ✓ Good |
| Invite-code registration (not email signup) | Prevents random signups, controls access for 2-user gift app | ✓ Good |
| Sharp WebP pipeline with 4 size variants | Fast loading across devices without manual optimization | ✓ Good |

---

_Last updated: 2026-03-23 after v1.0 milestone_
