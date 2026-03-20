# Phase 8: Portfolio Redesign & Typography Enhancement - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual redesign of the portfolio page and global typography. Replace current fonts with a modern minimal sans-serif across the entire app. Rebuild the gallery as a quilted image grid with varied tile sizes. Merge the About page into a hero banner at the top of the portfolio. Upgrade the About editor to a full profile management page with new fields (tagline, height, weight). Remove the standalone /about page.

</domain>

<decisions>
## Implementation Decisions

### Typography
- Replace BOTH Playfair Display (headings) and Inter (body) with a single modern minimal sans-serif font family
- Apply globally across the ENTIRE app — all pages use the new font
- Vibe: clean geometric sans-serif like modern Dribbble/Behance portfolios
- Headings use bold/semibold weight, body uses regular weight — one font family, multiple weights
- Claude researches and picks the best Google Font (candidates: DM Sans, Plus Jakarta Sans, Outfit, Space Grotesk)
- Update globals.css @theme font tokens and layout.tsx font imports

### Quilted image grid
- Replace the current equal-column masonry grid with a quilted layout
- Repeating pattern: 1 large tile (2x2), 2 small tiles (1x1), 1 wide tile (2x1), 2 small tiles — then repeats
- 3 columns on desktop, 2 columns on mobile
- Photos cropped to fit tile shapes (object-cover) — clean geometric look
- CSS Grid implementation for precise tile sizing and placement
- Keep category filter pills above the grid (unchanged)
- Keep infinite scroll behavior (unchanged)
- Keep lightbox on click (unchanged)

### About section → Portfolio hero banner
- Remove standalone /about page entirely (delete route)
- Remove "About" from navigation links (both top-nav and bottom-tab-bar)
- Add full-width hero banner at the TOP of the portfolio page (above category pills and gallery)
- Hero banner content:
  - Profile photo (large, circular or rounded square)
  - Name + tagline (e.g., "Funnghy — Freelance Model & Creator")
  - Short bio text (2-3 sentences)
  - Height and weight (model stats — displayed elegantly, not like a database)
  - Social links (Instagram, TikTok icons) + email contact
- Data comes from the existing `aboutContent` table (extended with new fields)

### Profile management page
- Upgrade existing /admin/about page to be the profile editor
- Add new fields to the editor:
  - Tagline (short one-liner)
  - Height (text field, e.g., "170cm" or "5'7\"")
  - Weight (text field, e.g., "52kg" or "115lbs")
- Keep existing fields: bio, profile photo, email, Instagram URL, TikTok URL
- Add new columns to `aboutContent` database table: tagline, height, weight
- URL stays at /admin/about (or rename to /admin/profile — Claude's discretion)

### Claude's Discretion
- Exact font choice (research Google Fonts for best modern portfolio sans-serif)
- Quilted grid tile gap/spacing values
- Hero banner layout details (padding, photo size, text alignment)
- How height/weight are displayed in the hero (inline, pills, subtle text)
- Whether to add a background image or gradient to the hero banner
- Profile editor form layout for new fields

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Aesthetic requirements, soft feminine feel
- `src/app/globals.css` — Current design tokens (fonts, colors) — will be updated

### Current implementation to replace
- `src/app/layout.tsx` — Current Playfair Display + Inter font imports
- `src/components/portfolio/masonry-grid.tsx` — Current equal-column masonry grid
- `src/components/portfolio/infinite-scroll-gallery.tsx` — Gallery wrapper with infinite scroll
- `src/app/(public)/page.tsx` — Current portfolio page
- `src/app/(public)/about/page.tsx` — About page to be removed
- `src/components/portfolio/about-section.tsx` — About component to be replaced with hero banner
- `src/app/(private)/admin/about/page.tsx` — About editor to be upgraded

### Database
- `src/lib/db/schema.ts` — `aboutContent` table (needs tagline, height, weight columns)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/portfolio/category-filter.tsx` — Category pills, keep as-is above the new grid
- `src/components/portfolio/lightbox.tsx` — Lightbox component, keep as-is
- `src/components/portfolio/infinite-scroll-gallery.tsx` — Infinite scroll logic, adapt for quilted grid
- `src/components/upload/image-uploader.tsx` — Profile photo upload in admin editor
- `src/lib/supabase/storage.ts` — Signed URLs for profile photo

### Established Patterns
- Server Actions with revalidatePath for CRUD
- react-hook-form + zod for form validation
- shadcn components for all form elements (Select, Textarea, Input, Label)

### Integration Points
- `src/app/layout.tsx` — Font import change (global)
- `src/app/globals.css` — @theme font tokens change (global)
- Navigation: remove "About" link from top-nav.tsx and bottom-tab-bar.tsx
- `scripts/setup-db.ts` — Add new columns to aboutContent table creation

</code_context>

<specifics>
## Specific Ideas

- The new font should feel like a modern creative portfolio — think Behance project pages, not corporate websites
- Quilted grid creates visual rhythm — the large tile draws the eye, then smaller tiles provide variety
- Hero banner should feel like a professional model's comp card — elegant stats display
- Height/weight displayed subtly — not in bold, more like soft metadata below the bio
- The overall feel should shift from "personal blog" to "professional creative portfolio"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-portfolio-redesign-typography-enhancement*
*Context gathered: 2026-03-20*
