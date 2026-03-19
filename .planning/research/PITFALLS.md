# Pitfalls Research

**Domain:** Personal portfolio + beauty tracker webapp (image-heavy, two-user system)
**Researched:** 2026-03-19
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Serving Unoptimized Original Images

**What goes wrong:**
Photos are uploaded at full camera resolution (4000x3000px, 3-8MB each) and served directly to visitors. The portfolio page loads 20+ images at once, resulting in 60-100MB page loads. Mobile users on cellular connections bounce immediately. Google PageSpeed scores crater below 20.

**Why it happens:**
During development, images load fast on localhost. The developer uploads test images that are already small, or tests on fast WiFi. The problem only becomes visible with real photography at real resolutions on real connections. A jump from 1 to 3-second load time increases bounce rates by 32%.

**How to avoid:**
- Use next/image (or equivalent) with automatic WebP/AVIF generation from day one -- never use raw `<img>` tags for portfolio content
- Set up an image processing pipeline at upload time: generate thumbnails (400px), medium (800px), and full-size (1920px max) variants
- Serve AVIF as primary format (41% smaller than JPEG), WebP as fallback
- Enforce max upload dimensions and file size limits server-side (e.g., 4096px max dimension, 10MB max file)
- Implement lazy loading for below-fold images; only eager-load the first 1-3 visible images

**Warning signs:**
- Lighthouse performance score below 50
- Portfolio page takes more than 3 seconds on throttled 3G in DevTools
- Total page weight exceeds 3MB on any gallery page
- No `srcset` or `sizes` attributes on image elements

**Phase to address:**
Foundation/Infrastructure phase. The image pipeline must be built before any content is uploaded. Retrofitting image optimization after hundreds of photos are already stored in one format is painful.

---

### Pitfall 2: Cumulative Layout Shift (CLS) in Image Galleries

**What goes wrong:**
Gallery images load without reserved space, causing the page to jump and reflow as each image appears. Users try to tap a photo but the layout shifts and they hit the wrong one. This is the single most frustrating UX issue in image-heavy sites and directly tanks Core Web Vitals scores.

**Why it happens:**
The `fill` property in Next.js Image component is convenient but frequently misapplied -- it is one of the top sources of production CLS regressions. Developers set `fill` without constraining the parent container's aspect ratio, or they omit `width`/`height` props entirely on standard image elements.

**How to avoid:**
- Always provide explicit `width` and `height` props, or use `fill` with a parent that has a fixed aspect ratio (e.g., `aspect-ratio: 3/4` in CSS)
- Store image dimensions in the database at upload time so they are available before the image loads
- Use CSS `aspect-ratio` on image containers to reserve space before load
- For masonry/grid layouts, calculate layout on the server using stored dimensions, not on client after images load
- Test CLS specifically: Chrome DevTools > Performance > check "Layout Shift Regions"

**Warning signs:**
- CLS score above 0.1 in Lighthouse
- Images "pop in" visibly when scrolling
- Grid items rearrange after initial paint
- Users report accidentally tapping wrong items on mobile

**Phase to address:**
Foundation phase, alongside the image component system. The gallery grid component must enforce aspect ratios from the start.

---

### Pitfall 3: Over-Engineering Authentication for Two Users

**What goes wrong:**
Developer implements a full auth system with registration flows, password reset emails, OAuth providers, email verification, and role-based access control -- for an app with exactly two users who will never change. Weeks are spent on auth infrastructure instead of the actual product. Alternatively, the developer rolls custom auth with password hashing bugs, session management flaws, or token storage mistakes.

**Why it happens:**
Auth tutorials and libraries assume SaaS-scale user management. Developers follow patterns designed for thousands of users. Building safe authentication is genuinely hard -- even large companies have been caught not hashing passwords properly or dumping credentials in log files.

**How to avoid:**
- Use a managed auth service (NextAuth.js / Auth.js, or Supabase Auth) even for two users -- the security is worth it
- Pre-seed the two user accounts; disable all registration endpoints entirely
- Use a simple role model: "owner" (Funnghy -- full access) and "contributor" (boyfriend -- upload/edit access). No RBAC framework needed, a simple string field suffices
- Skip email verification, password reset flows, and OAuth -- use strong passwords stored in a password manager
- If using NextAuth, use the Credentials provider with bcrypt-hashed passwords in the database

**Warning signs:**
- More than 2 days spent on authentication
- Building registration pages or invite flows
- Implementing more than 2 roles
- Custom session management code instead of using a library

**Phase to address:**
Early phase, but timebox strictly. Auth should take less than a day with a managed library. Build it, seed the users, move on.

---

### Pitfall 4: Beauty Product Data Model That Cannot Handle Real Products

**What goes wrong:**
The skincare/beauty tracker is modeled with rigid, flat fields: `name`, `brand`, `category`, `rating`. In reality, beauty products have wildly inconsistent attributes -- a sunscreen has SPF and PA rating, a serum has active ingredient concentrations, a lipstick has shade names. The flat model either forces dozens of nullable columns or loses important product details. Routines break because they cannot express "use half a pump" or "wait 2 minutes before next step."

**Why it happens:**
Beauty/cosmetics data mixes emotional language with technical claims. Products vary by shade, skin type, region, and formulation. New products launch constantly. Developers who are not domain-familiar model it like a simple inventory system.

**How to avoid:**
- Use a flexible schema: core fields (name, brand, category, rating, photo, purchase date, status) plus a JSON/JSONB `attributes` field for category-specific data
- Define category templates (skincare has "skin type", "key ingredients", "texture"; makeup has "shade", "finish", "coverage") that guide the UI but do not constrain the database
- Model routines as ordered lists of steps, where each step references a product and has its own fields: `amount`, `wait_time`, `notes`
- Include a `status` field on products: "using", "finished", "want to try", "discontinued" -- products cycle through states
- Store product photos separately from portfolio photos -- they are different entities with different display needs

**Warning signs:**
- Product form has more than 15 fields visible at once
- Cannot add a product without filling in fields that do not apply to it
- Routine builder cannot express ordering or timing between steps
- No way to mark a product as finished vs. currently using

**Phase to address:**
Data modeling phase, before any UI is built. Get the schema right with real product examples (ask Funnghy to list 10 products she actually uses and see if the model captures them all).

---

### Pitfall 5: No Public/Private Boundary Enforcement at the API Level

**What goes wrong:**
The portfolio is public and the beauty tracker/photo journal are private, but the boundary is enforced only at the UI level (hiding navigation links, conditional rendering). An unauthenticated user who knows the API routes can access private data directly. Or worse, private photos are stored with predictable URLs that anyone can guess.

**Why it happens:**
During development, the developer is always logged in. The public/private split feels obvious in the UI, so API-level enforcement is forgotten or inconsistent. Image storage URLs are often direct S3/Cloudinary links that do not require authentication.

**How to avoid:**
- Enforce authentication middleware on every private API route -- not at the page level, at the route handler level
- Use signed URLs or proxy private images through an authenticated API endpoint instead of exposing direct storage URLs
- Create a clear route convention: `/api/public/*` vs `/api/private/*` with middleware that rejects unauthenticated requests to any `/api/private/*` route
- Test with an incognito browser: visit every private URL, every API route, every image URL directly without logging in
- Portfolio images can be public CDN URLs; beauty tracker and journal photos must be access-controlled

**Warning signs:**
- Private pages work when you paste the URL in an incognito window
- Image URLs in the beauty tracker are direct Cloudinary/S3 links without expiration
- No middleware file or auth wrapper exists for the private API routes
- All images stored in the same bucket/folder regardless of public/private status

**Phase to address:**
Must be established in the auth/infrastructure phase and verified at every subsequent phase. Add an "incognito audit" to every phase's definition of done.

---

### Pitfall 6: Design System Drift -- Inconsistent Aesthetic Across Features

**What goes wrong:**
The portfolio looks editorial and polished, but the beauty tracker feels like a generic CRUD app with default component styles. The photo journal uses slightly different pastel shades. Rose gold appears in 4 different hex values across the codebase. Typography is inconsistent between pages. The app feels like three different apps glued together rather than one cohesive gift.

**Why it happens:**
Each feature is built in sequence. Without a shared design token system, each feature's developer (even if it is the same person) makes slightly different color/spacing/typography choices. CSS is duplicated and values are hardcoded. This is especially insidious with a specific aesthetic like "soft feminine pastel" where small variations are very noticeable.

**How to avoid:**
- Define design tokens as CSS custom properties before building any feature:
  - Colors: `--color-cream`, `--color-rose-gold`, `--color-blush`, `--color-sage` (exact hex values, decided once)
  - Typography: `--font-heading`, `--font-body`, `--font-accent` with size scale
  - Spacing: 4px base unit scale
  - Border radius: consistent roundedness across all components
  - Shadows: one or two elevation levels, not ad-hoc
- Build a small component library (Card, Button, Input, ImageFrame) styled with tokens before building features
- Every new component must use only tokens -- no raw hex values, no magic numbers
- Review each feature against the portfolio page: does it feel like the same app?

**Warning signs:**
- grep for hex color codes finds more than 5-6 unique values outside the token definition file
- Different pages use different font sizes for similar elements
- Components are styled with inline styles or one-off CSS classes
- The beauty tracker "feels different" from the portfolio

**Phase to address:**
Design system must be the first thing built, before any feature UI. Tokens and base components come before portfolio, tracker, or journal pages.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Storing images only as originals, generating variants on-the-fly | Simpler upload flow | Every page load triggers expensive image processing; CDN bills grow; slow loads | Never for a photo-heavy site -- generate variants at upload time |
| Using localStorage for auth tokens | Quick to implement | XSS vulnerability exposes tokens; no server-side session invalidation | Never -- use httpOnly cookies via auth library |
| Hardcoding the two user accounts in code | No database needed for auth | Cannot change passwords without redeployment; credentials in source control | Only for initial prototype, replace within same phase |
| Single database table for all photos (portfolio + journal + products) | Simpler schema | Querying becomes complex; access control logic pollutes every query; cannot optimize differently | Never -- separate concerns from the start |
| Skipping image alt text | Faster development | Inaccessible portfolio; poor SEO; unprofessional for a model's portfolio | Never -- alt text is part of the content model |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Image CDN (Cloudinary/S3) | Exceeding free tier bandwidth without monitoring; surprise bills | Set up billing alerts at 50% and 80% of free tier; implement bandwidth monitoring; cache aggressively with proper Cache-Control headers |
| Image CDN | Storing images with predictable sequential filenames | Use UUIDs or content hashes as filenames; never expose original filenames |
| Next.js Image | Mixing deprecated `images.domains` with `remotePatterns` in next.config | Use only `remotePatterns`; restart dev server after config changes |
| Auth library (NextAuth) | Configuring multiple providers when only one is needed | Use Credentials provider only; skip OAuth complexity for two known users |
| Database (if using Supabase/Planetscale) | Not setting up Row Level Security for private data | Enable RLS from day one; default-deny policy on private tables |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading entire photo gallery at once | 5+ second load time; high memory usage on mobile | Virtual scrolling or pagination; load 12-20 images per page; infinite scroll with intersection observer | At 50+ images in a single view |
| No CDN for static assets | Slow loads for geographically distant visitors | Serve all images through a CDN; use next/image built-in optimization which handles this | Immediately for any user not near the origin server |
| Unoptimized database queries for routine builder | Slow routine page load; N+1 queries fetching products for each step | Eager-load products with routine steps in a single query; denormalize product name/photo into routine step if needed | At 20+ products with 10+ routine steps |
| Client-side image resizing before upload | Browser tab crashes or freezes on mobile with large photos | Resize on the server or use the CDN's upload API with transformation; if client-side, use web workers and process one image at a time | With photos over 5MB on mobile devices with limited RAM |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Validating image uploads by MIME type only | Attackers can set any MIME type in the HTTP request; malicious files pass validation | Whitelist extensions (.jpg, .png, .webp, .heic) AND validate file magic bytes server-side; reject everything else |
| Storing uploaded files in the web-accessible public directory | Uploaded files can be executed as code if the server misconfigures handling | Store uploads in external storage (S3/Cloudinary) or outside the web root; serve through an API route |
| Exposing private photo journal images via direct URLs | Anyone with the URL can view private memories permanently | Use signed URLs with expiration (15-60 minutes) for private images; proxy through authenticated API |
| No rate limiting on image upload endpoints | Storage/bandwidth exhaustion; cost spike | Limit uploads to 20 images per hour per user; enforce max file size (10MB) server-side |
| Predictable image filenames exposing content | Enumeration attack reveals all photos | Generate UUID filenames at upload; never use sequential IDs or original filenames in storage paths |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Photo journal entry form requiring too many fields | Funnghy skips journaling because it feels like work; the feature goes unused | Default to minimal: one photo + optional text. Date auto-populated. Tags/mood optional. Make it faster to create an entry than to open Instagram |
| Beauty product form showing all possible fields at once | Overwhelming; feels like a database, not a personal collection | Progressive disclosure: show name, brand, photo, rating first. Expand for ingredients, notes, routine links. Let it feel like adding to a collection, not filling a spreadsheet |
| Portfolio gallery without clear visual hierarchy | Every photo feels the same; nothing stands out; the editorial feel is lost | Support "featured" sizing -- some images larger than others in the grid. Allow manual ordering, not just chronological. A curated portfolio needs editorial control |
| No upload progress or feedback on slow connections | User thinks upload failed; re-uploads; duplicate content; frustration | Show upload progress bar; confirm success with thumbnail preview; handle failures gracefully with retry option |
| Touch targets too small on mobile gallery | Users tap the wrong photo; frustration on the primary viewing device | Minimum 44x44px touch targets; adequate spacing between gallery items; test on actual phone, not just responsive browser mode |
| Making the private sections feel utilitarian compared to the public portfolio | The "gift" feeling is lost; private tools feel like an afterthought | Apply the same aesthetic care to the beauty tracker and journal as the portfolio. Same design tokens, same attention to spacing, typography, and animation |

## "Looks Done But Isn't" Checklist

- [ ] **Image upload:** Often missing server-side file type validation -- verify files are validated by magic bytes, not just extension or MIME type
- [ ] **Portfolio gallery:** Often missing responsive image sizes -- verify `srcset` delivers appropriately sized images for mobile vs. desktop
- [ ] **Auth boundary:** Often missing API-level protection -- verify every private API route rejects unauthenticated requests (test in incognito)
- [ ] **Beauty tracker:** Often missing product status lifecycle -- verify products can be marked as "finished", "repurchased", "discontinued", not just "exists"
- [ ] **Photo journal:** Often missing date-based navigation -- verify entries can be browsed by month/date, not just a flat infinite scroll
- [ ] **Design system:** Often missing dark-on-light contrast ratios -- verify pastel text on cream backgrounds meets WCAG AA (4.5:1 ratio minimum)
- [ ] **Mobile layout:** Often missing landscape orientation support -- verify the app does not break when phone is rotated
- [ ] **Image deletion:** Often missing cleanup of storage -- verify deleting a photo from the app also deletes it from the CDN/storage bucket
- [ ] **Routine builder:** Often missing step reordering -- verify routine steps can be dragged to reorder, not just added in sequence

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Unoptimized images already in production | MEDIUM | Write a migration script to regenerate all variants from originals; update database records with new URLs; redirect old URLs |
| Design system drift (inconsistent colors/typography) | MEDIUM | Audit all color/font values in codebase; extract to tokens; find-and-replace; visual regression test each page |
| Flat product data model needs restructuring | HIGH | Database migration to add JSON attributes column; backfill existing products; update all queries and forms |
| Missing API-level auth on private routes | LOW | Add auth middleware to route group; test all endpoints; one afternoon of work if routes are well-organized |
| CLS issues in gallery | LOW-MEDIUM | Add aspect-ratio CSS to containers; store dimensions in DB (may need backfill script to read from stored images); update gallery component |
| Private images exposed via direct URLs | MEDIUM | Move to signed URLs; update all image-serving code; regenerate any URLs stored in database; invalidate CDN cache |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Unoptimized images | Infrastructure / Foundation | Lighthouse performance score above 80 on gallery page with 20+ images |
| CLS in galleries | Infrastructure / Foundation | CLS score below 0.1 in Lighthouse on all pages with images |
| Over-engineered auth | Auth phase (timebox to 1 day) | Auth works, two users seeded, no registration endpoints exist |
| Rigid product data model | Data modeling phase | Model can represent 10 real products from Funnghy's collection accurately |
| Missing API auth boundary | Auth phase + every subsequent phase | Incognito browser cannot access any private route or API endpoint |
| Design system drift | Design system phase (before features) | All colors/fonts/spacing come from tokens; grep finds zero raw hex values outside token definitions |
| Image storage cost surprise | Infrastructure phase | Billing alerts configured; bandwidth monitoring in place; free tier limits documented |
| File upload security gaps | Infrastructure phase | Upload endpoint rejects non-image files; files stored with UUID names outside web root |
| Poor mobile gallery UX | Portfolio phase | Gallery tested on real phone; touch targets measured; no layout shifts on scroll |
| Journal/tracker feels utilitarian | Each feature phase | Side-by-side visual comparison with portfolio confirms consistent aesthetic |

## Sources

- [Shopify - Image Optimization Tips](https://www.shopify.com/blog/7412852-10-must-know-image-optimization-tips)
- [Hostinger - Image Optimization 2026](https://www.hostinger.com/tutorials/complete-guide-to-image-optimization)
- [Pagepro - Next.js Image Component Performance and CWV](https://pagepro.co/blog/nextjs-image-component-performance-cwv/)
- [Build with Matija - Handling 500+ Images in Next.js 15](https://www.buildwithmatija.com/blog/handling-500-images-in-a-gallery-with-lazy-loading-in-next-js-15)
- [Beauty Feeds - Challenges with Beauty Product Datasets](https://beautyfeeds.io/what-are-common-challenges-when-working-with-beauty-product-datasets/)
- [OWASP - File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [PortSwigger - File Upload Vulnerabilities](https://portswigger.net/web-security/file-upload)
- [With Blue Ink - Stop Writing Your Own Auth](https://withblue.ink/2020/04/08/stop-writing-your-own-user-authentication-code.html)
- [Penpot - Developer Guide to Design Tokens](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/)
- [Bytescale - Cloudinary vs S3](https://www.bytescale.com/blog/cloudinary-vs-s3/)
- [KnackForge - S3 vs Cloudinary vs imgix Cost Breakdown](https://knackforge.com/blog/aws-s3)
- [Mobisoft - Mobile App UX Mistakes](https://mobisoftinfotech.com/resources/blog/ui-ux-design/mobile-app-ux-mistakes)

---
*Pitfalls research for: Personal portfolio + beauty tracker webapp (Funnghy's World)*
*Researched: 2026-03-19*
