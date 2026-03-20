# Phase 8: Portfolio Redesign & Typography Enhancement - Research

**Researched:** 2026-03-20
**Domain:** CSS Grid layout, Google Fonts typography, Next.js font optimization, database schema migration
**Confidence:** HIGH

## Summary

This phase is a visual redesign touching four areas: (1) global font replacement from dual-font (Playfair Display + Inter) to a single modern geometric sans-serif, (2) replacing the masonry grid with a quilted CSS Grid layout, (3) merging the About page into a hero banner on the portfolio page, and (4) upgrading the admin about editor with new profile fields (tagline, height, weight).

The codebase scan reveals `font-display` is used in 26 files and `font-body` in 21 files across the project. These are referenced via Tailwind utility classes (`font-display`, `font-body`) and CSS variables, so the font swap is primarily a matter of updating `layout.tsx` imports and `globals.css` tokens -- all downstream usage will automatically inherit. The quilted grid replaces `masonry-grid.tsx` with a new CSS Grid component. The About page removal is clean -- delete the route, remove nav links, and repurpose the data into a hero banner component.

**Primary recommendation:** Use DM Sans as the single font family (100-1000 weight range, optical sizing axis). Replace masonry with a CSS Grid using `nth-child` selectors for the repeating 6-item tile pattern. Add three nullable text columns to `aboutContent` table via ALTER TABLE.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Replace BOTH Playfair Display (headings) and Inter (body) with a single modern minimal sans-serif font family
- Apply globally across the ENTIRE app -- all pages use the new font
- Vibe: clean geometric sans-serif like modern Dribbble/Behance portfolios
- Headings use bold/semibold weight, body uses regular weight -- one font family, multiple weights
- Claude researches and picks the best Google Font (candidates: DM Sans, Plus Jakarta Sans, Outfit, Space Grotesk)
- Update globals.css @theme font tokens and layout.tsx font imports
- Replace current equal-column masonry grid with quilted layout
- Repeating pattern: 1 large tile (2x2), 2 small tiles (1x1), 1 wide tile (2x1), 2 small tiles -- then repeats
- 3 columns on desktop, 2 columns on mobile
- Photos cropped to fit tile shapes (object-cover) -- clean geometric look
- CSS Grid implementation for precise tile sizing and placement
- Keep category filter pills above the grid (unchanged)
- Keep infinite scroll behavior (unchanged)
- Keep lightbox on click (unchanged)
- Remove standalone /about page entirely (delete route)
- Remove "About" from navigation links (both top-nav and bottom-tab-bar)
- Add full-width hero banner at TOP of portfolio page (above category pills and gallery)
- Hero banner content: profile photo, name + tagline, short bio, height/weight stats, social links + email
- Data comes from existing aboutContent table (extended with new fields)
- Upgrade existing /admin/about page to be the profile editor
- Add new fields: tagline, height, weight
- Keep existing fields: bio, profile photo, email, Instagram URL, TikTok URL
- Add new columns to aboutContent database table: tagline, height, weight
- URL stays at /admin/about (or rename to /admin/profile -- Claude's discretion)

### Claude's Discretion
- Exact font choice (research Google Fonts for best modern portfolio sans-serif)
- Quilted grid tile gap/spacing values
- Hero banner layout details (padding, photo size, text alignment)
- How height/weight are displayed in the hero (inline, pills, subtle text)
- Whether to add a background image or gradient to the hero banner
- Profile editor form layout for new fields

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/font/google | 16.2.0 (bundled) | Google Font loading with automatic optimization | Built into Next.js, self-hosts fonts, zero CLS |
| CSS Grid | Native CSS | Quilted tile layout with precise placement | No library needed; native browser feature |
| Tailwind CSS v4 | ^4 | Utility classes for layout, spacing, responsive | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| drizzle-orm | 0.45.1 | Schema definition for new columns | Adding tagline/height/weight to aboutContent |
| react-hook-form | 7.71.2 | Profile editor form with new fields | Already used in admin/about page |
| zod | 4.3.6 | Validation schema for new fields | Already used in about actions |
| lucide-react | 0.577.0 | Icons for hero banner social links | Already in project |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| DM Sans | Plus Jakarta Sans | Jakarta has 200-800 weight range vs DM Sans 100-1000; DM Sans has optical sizing axis |
| DM Sans | Outfit | Outfit lacks optical sizing; narrower weight range |
| DM Sans | Space Grotesk | Space Grotesk only has 300-700 weights; more technical/developer feel, less creative portfolio |
| CSS Grid nth-child | Explicit grid-area names | nth-child is simpler for repeating patterns; grid-area better for one-off layouts |

**No new packages required.** All dependencies already exist in the project.

## Architecture Patterns

### Font Choice: DM Sans

**Recommendation: DM Sans** (HIGH confidence)

| Property | DM Sans | Plus Jakarta Sans | Outfit | Space Grotesk |
|----------|---------|-------------------|--------|---------------|
| Weight range | 100-1000 | 200-800 | 100-900 | 300-700 |
| Variable font | Yes | Yes | Yes | Yes |
| Optical sizing | Yes (9-40) | No | No | No |
| Italic support | Yes | Yes | No | No |
| Feel | Modern geometric, warm | Modern geometric, slightly rounder | Geometric, clean | Technical, monospace-derived |

**Why DM Sans wins:**
1. Widest weight range (100-1000) -- covers everything from thin decorative to extra-black headings
2. Optical sizing axis automatically adjusts letterforms for small vs large text -- headings look better at display sizes without manual tuning
3. Italian foundry Colophon designed it -- widely used on Dribbble/Behance creative portfolios
4. Italic axis for emphasis without needing a second font
5. Clean geometric feel matches the "modern creative portfolio" vibe requested

**next/font import pattern:**
```typescript
// layout.tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
```

**Note:** Use a single `--font-sans` variable instead of separate `--font-display` and `--font-body`. This simplifies the token system since it's now one font family.

### Recommended Changes to globals.css

```css
@theme {
  /* Replace both font tokens with single font */
  --font-display: 'DM Sans', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
```

Keep both `--font-display` and `--font-body` tokens pointing to DM Sans rather than removing one. This avoids breaking the 26+ files that reference `font-display` and the 21+ files that reference `font-body`. They just both resolve to the same font now.

### Quilted Grid Pattern

The repeating 6-item pattern maps to CSS Grid with `nth-child` selectors:

```
Pattern (3-column, repeating every 6 items):
┌──────┬──────┬──────┐
│      │      │      │
│  2x2 │ 1x1  │ 1x1  │  Items 1, 2, 3
│      │      │      │
│      ├──────┴──────┤
│      │             │
├──────┤    2x1      │  Item 4
│      │             │
│ 1x1  ├──────┬──────┤
│      │      │      │
├──────┤ 1x1  │      │  Items 5, 6
│      │      │      │
└──────┴──────┴──────┘
```

**CSS Grid implementation:**
```css
.quilted-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;   /* Base row height */
  gap: 4px;                 /* Tight gap for clean geometric look */
}

/* Every 6n+1: large tile (2x2) */
.quilted-grid > *:nth-child(6n+1) {
  grid-column: span 2;
  grid-row: span 2;
}

/* Every 6n+4: wide tile (2x1) */
.quilted-grid > *:nth-child(6n+4) {
  grid-column: span 2;
}

/* 6n+2, 6n+3, 6n+5, 6n+6: small tiles (1x1) -- default, no special styling */
```

**Mobile (2 columns):**
```css
@media (max-width: 768px) {
  .quilted-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 160px;
  }
  /* On mobile, large tile still spans 2 cols but only 2 rows */
  /* Wide tile spans 2 cols, 1 row */
}
```

**Key implementation detail:** Use `grid-auto-flow: dense` to prevent gaps when items don't fit perfectly. Each tile uses `object-fit: cover` to crop images to the tile shape.

### Hero Banner Layout

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   ┌───────┐  Name                               │
│   │       │  Tagline                            │
│   │ Photo │  Bio text (2-3 lines)               │
│   │       │  Height · Weight                    │
│   └───────┘  [Instagram] [TikTok] [Email]       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Desktop:** Side-by-side layout with `grid grid-cols-[auto_1fr]` -- photo on left, content on right
**Mobile:** Stacked layout with centered photo on top, content below

**Stats display recommendation:** Height and weight as subtle inline text with a separator dot, styled in `text-text-secondary` -- e.g., "170cm . 52kg". This matches the "soft metadata below the bio" feel requested.

### Database Schema Changes

Add three nullable text columns to `aboutContent`:

```typescript
// schema.ts addition
export const aboutContent = pgTable('about_content', {
  // ... existing columns ...
  tagline: text('tagline'),        // NEW: "Freelance Model & Creator"
  height: text('height'),          // NEW: "170cm" or "5'7\""
  weight: text('weight'),          // NEW: "52kg" or "115lbs"
});
```

**Migration SQL:**
```sql
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS height text;
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS weight text;
```

Text type (not integer) for height/weight because values include units and mixed formats (cm/ft, kg/lbs).

### Files to Modify (Complete Inventory)

**Create:**
- `src/components/portfolio/quilted-grid.tsx` -- New quilted CSS Grid component
- `src/components/portfolio/hero-banner.tsx` -- New hero banner component

**Modify:**
- `src/app/layout.tsx` -- Replace Playfair Display + Inter imports with DM Sans
- `src/app/globals.css` -- Update `--font-display` and `--font-body` tokens to DM Sans
- `src/lib/db/schema.ts` -- Add tagline, height, weight to aboutContent
- `scripts/setup-db.ts` -- Add new columns to about_content CREATE TABLE
- `src/actions/about.ts` -- Add tagline/height/weight to getAboutContent return and updateAboutContent schema
- `src/app/(public)/page.tsx` -- Add hero banner, replace masonry with quilted grid
- `src/components/portfolio/infinite-scroll-gallery.tsx` -- Replace MasonryGrid with QuiltedGrid
- `src/components/portfolio/gallery-card.tsx` -- Remove aspect-ratio style (grid controls sizing now)
- `src/app/(private)/admin/about/page.tsx` -- Add tagline, height, weight fields
- `src/components/layout/top-nav.tsx` -- Remove About link from publicLinks and mainLinks
- `src/components/layout/bottom-tab-bar.tsx` -- Remove About tab from publicTabs

**Delete:**
- `src/app/(public)/about/page.tsx` -- About page route
- `src/components/portfolio/photo-strip.tsx` -- Photo strip (only used on about page)
- `src/components/portfolio/masonry-grid.tsx` -- Replaced by quilted grid

**Update tests:**
- `src/__tests__/design-tokens/tokens.test.ts` -- Update font token assertions (Playfair Display -> DM Sans, Inter -> DM Sans)
- `src/__tests__/portfolio/masonry-grid.test.tsx` -- Replace with quilted-grid tests
- `src/__tests__/portfolio/about-section.test.tsx` -- Replace with hero-banner tests

### Anti-Patterns to Avoid
- **Removing font-display/font-body CSS variables:** Keep both tokens, just point them both to DM Sans. Removing one would break 26+ files.
- **Using grid-template-areas for repeating pattern:** Named areas don't repeat well for infinite scroll. Use `nth-child` selectors instead.
- **Fixed grid height that doesn't scale:** Use `grid-auto-rows` with relative units or a reasonable fixed base (200px desktop, 160px mobile).
- **Fetching about content twice:** The portfolio page already has a server component -- fetch about content there and pass to hero banner as props.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading/optimization | Manual @font-face declarations | `next/font/google` | Automatic self-hosting, zero CLS, preload hints |
| Responsive grid columns | JavaScript column counting | CSS Grid + media queries | CSS-only solution, no hydration mismatch |
| Image cropping in tiles | Manual aspect ratio calculations | `object-fit: cover` on img | Native CSS, handles any image aspect ratio |
| Schema migration | Manual SQL file management | ALTER TABLE in setup script + Drizzle schema update | Matches existing project pattern (raw SQL in setup-db.ts) |

## Common Pitfalls

### Pitfall 1: Quilted Grid Gaps with Infinite Scroll
**What goes wrong:** When new items load via infinite scroll, the `nth-child` pattern may break if items are appended naively, causing layout shifts.
**Why it happens:** `nth-child` selectors apply to DOM position, not data index. If items are appended in a new container, counting restarts.
**How to avoid:** Render ALL items in a single flat grid container. The `nth-child` pattern naturally continues as items are appended. Do NOT wrap each "page" of items in a separate div.
**Warning signs:** Pattern resets after loading more items; first item of each page is always 2x2.

### Pitfall 2: Gallery Card Aspect Ratio Conflict
**What goes wrong:** The current `GalleryCard` sets `style={{ aspectRatio: width/height }}` which conflicts with CSS Grid row spanning.
**Why it happens:** Grid cells have explicit row spans defining their height; the inline aspect-ratio fights this.
**How to avoid:** Remove the `aspectRatio` style from `GalleryCard` when used inside the quilted grid. The grid cell defines the shape; the image uses `object-fit: cover` to fill it. Make the card fill its grid cell with `h-full w-full`.

### Pitfall 3: Font Variable Name Collision
**What goes wrong:** Changing `--font-sans` in the `@theme inline` block (shadcn) while also having `--font-body` in the `@theme` block can cause unexpected cascading.
**Why it happens:** The project has TWO @theme blocks -- one `@theme inline` for shadcn mappings and one `@theme` for custom tokens.
**How to avoid:** Update `--font-display` and `--font-body` in the custom `@theme` block. The shadcn `@theme inline` maps `--font-sans: var(--font-body)` which will automatically pick up the new value. Also update the layout.tsx `variable` to `--font-body` so Next.js injects the CSS variable the token references.

### Pitfall 4: Navigation Removal Breaking Mobile Layout
**What goes wrong:** Removing the About tab from mobile bottom bar leaves uneven spacing.
**Why it happens:** The bottom bar uses `justify-around` and removing one item changes the distribution.
**How to avoid:** After removing About, verify the remaining tabs still look balanced. For public visitors: just Portfolio + Sign In (2 items). For authenticated: Portfolio + Beauty + Schedule (3 items) + admin tabs.

### Pitfall 5: Revalidation Path Update
**What goes wrong:** The `updateAboutContent` action revalidates `/about` which will no longer exist.
**Why it happens:** The old route is being deleted but the action still references it.
**How to avoid:** Change `revalidatePath('/about')` to `revalidatePath('/')` since about content now displays on the portfolio home page.

### Pitfall 6: Mobile Quilted Grid 2x2 Tile on 2-Column Layout
**What goes wrong:** A `grid-column: span 2` tile on a 2-column grid takes the full width, looking like a banner rather than a "large" tile.
**Why it happens:** 2 columns spanning 2 = 100% width.
**How to avoid:** On mobile, the 2x2 tile becomes full-width which is actually fine for mobile -- it creates a hero-like focal image. The wide tile (2x1) also goes full-width. Accept this as a valid mobile layout.

## Code Examples

### DM Sans Font Setup (layout.tsx)
```typescript
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// In the html tag:
<html lang="en" className={`${dmSans.variable} h-full antialiased`}>
```

### Quilted Grid Component
```typescript
'use client';

interface QuiltedGridProps {
  children: React.ReactNode;
}

export function QuiltedGrid({ children }: QuiltedGridProps) {
  return (
    <div className="quilted-grid grid grid-cols-3 gap-1 max-md:grid-cols-2"
         style={{ gridAutoRows: '200px' }}>
      {children}
    </div>
  );
}
```

With CSS in globals.css or a CSS module:
```css
.quilted-grid > *:nth-child(6n+1) {
  grid-column: span 2;
  grid-row: span 2;
}
.quilted-grid > *:nth-child(6n+4) {
  grid-column: span 2;
}
```

### Hero Banner Component
```typescript
interface HeroBannerProps {
  profileImageUrl: string | null;
  name: string;
  tagline: string | null;
  bio: string;
  height: string | null;
  weight: string | null;
  email: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
}

export function HeroBanner({ profileImageUrl, name, tagline, bio, height, weight, email, instagramUrl, tiktokUrl }: HeroBannerProps) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-6 rounded-xl bg-surface p-6 shadow-sm md:grid-cols-[160px_1fr] md:p-8">
      {/* Profile photo */}
      <div className="flex justify-center md:justify-start">
        {profileImageUrl ? (
          <img src={profileImageUrl} alt={name}
               className="h-32 w-32 rounded-full object-cover shadow-md md:h-40 md:w-40" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-accent/20 md:h-40 md:w-40">
            {/* placeholder */}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-text-primary">{name}</h1>
        {tagline && <p className="mt-1 text-sm text-text-secondary">{tagline}</p>}
        <p className="mt-3 text-sm leading-relaxed text-text-primary">{bio}</p>
        {(height || weight) && (
          <p className="mt-2 text-xs text-text-secondary">
            {[height, weight].filter(Boolean).join(' \u00b7 ')}
          </p>
        )}
        {/* Social links */}
      </div>
    </section>
  );
}
```

### Database Migration Pattern
```typescript
// In setup-db.ts, add after existing about_content CREATE TABLE:
await sql`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS tagline text`;
await sql`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS height text`;
await sql`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS weight text`;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dual font families (display + body) | Single variable font for everything | 2023+ trend | Fewer HTTP requests, simpler token system |
| Masonry with flexbox columns | CSS Grid with explicit spanning | CSS Grid matured 2020+ | Precise control over tile sizes and patterns |
| Separate About page | Integrated hero/bio section | Modern portfolio trend | Single-page experience, less navigation friction |
| next/font with fixed weights | Variable font with weight range | next/font supports variable fonts | Smooth weight interpolation, smaller bundle |

## Open Questions

1. **Grid auto-rows base height**
   - What we know: 200px works well for desktop 3-column layouts with typical portfolio photos
   - What's unclear: Exact height depends on viewport width and desired visual density
   - Recommendation: Start with 200px desktop / 160px mobile, adjust during implementation based on visual testing

2. **Hero banner background treatment**
   - What we know: User mentioned subtle gradient as Claude's discretion
   - What's unclear: Whether a gradient or solid bg-surface works better with the lavender dominant color
   - Recommendation: Use `bg-surface` (white) with `shadow-sm` for clean card-like appearance matching project pattern. Skip gradient for now -- can be added later.

3. **Admin page URL -- /admin/about vs /admin/profile**
   - What we know: User said Claude's discretion
   - Recommendation: Keep `/admin/about` to avoid breaking admin navigation links. The page title can change to "Profile" without changing the URL.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FONT-01 | DM Sans font tokens in globals.css | unit | `npx vitest run src/__tests__/design-tokens/tokens.test.ts -x` | Exists (needs update) |
| GRID-01 | Quilted grid renders 6-item pattern with correct spans | unit | `npx vitest run src/__tests__/portfolio/quilted-grid.test.tsx -x` | Wave 0 |
| HERO-01 | Hero banner renders profile data, stats, social links | unit | `npx vitest run src/__tests__/portfolio/hero-banner.test.tsx -x` | Wave 0 |
| NAV-01 | About link removed from navigation | unit | `npx vitest run src/__tests__/portfolio/navigation.test.tsx -x` | Wave 0 |
| SCHEMA-01 | aboutContent schema includes tagline/height/weight | unit | `npx vitest run src/__tests__/portfolio/about-schema.test.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before /gsd:verify-work

### Wave 0 Gaps
- [ ] `src/__tests__/portfolio/quilted-grid.test.tsx` -- covers GRID-01
- [ ] `src/__tests__/portfolio/hero-banner.test.tsx` -- covers HERO-01
- [ ] `src/__tests__/portfolio/navigation.test.tsx` -- covers NAV-01 (About link removed)
- [ ] `src/__tests__/portfolio/about-schema.test.ts` -- covers SCHEMA-01
- [ ] Update `src/__tests__/design-tokens/tokens.test.ts` -- update font assertions for DM Sans

## Sources

### Primary (HIGH confidence)
- [Fontsource DM Sans](https://fontsource.org/fonts/dm-sans) -- Weight range 100-1000, variable axes (ital, opsz, wght)
- [Fontsource Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans) -- Weight range 200-800
- [Next.js Font Optimization docs](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/google setup
- [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts) -- Grid layout fundamentals
- Codebase scan -- All file references verified by direct source reading

### Secondary (MEDIUM confidence)
- [Typewolf Google Fonts 2026](https://www.typewolf.com/google-fonts) -- DM Sans listed as top recommendation
- [Medium: Mosaic Layouts with CSS Grid](https://medium.com/@axel/mosaic-layouts-with-css-grid-d13f4e3ed2ae) -- nth-child pattern for repeating tile layouts
- [Bestfolios: Portfolio Fonts](https://bestfolios.medium.com/10-great-fonts-for-portfolio-design-2debfe2f1bb9) -- Portfolio font usage patterns

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies, just reconfiguring existing tools
- Architecture: HIGH -- CSS Grid quilted pattern is well-documented and straightforward; font swap is mechanical
- Pitfalls: HIGH -- Identified from direct codebase analysis (aspect-ratio conflict, revalidation paths, nth-child with infinite scroll)

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain -- CSS Grid and Google Fonts are mature)
