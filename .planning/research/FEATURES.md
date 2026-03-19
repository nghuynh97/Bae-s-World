# Feature Research

**Domain:** Personal portfolio + beauty tracker + photo journal webapp (gift for freelance model)
**Researched:** 2026-03-19
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features that must exist for the app to feel complete and functional. Since this is a personal gift with only two users, "table stakes" means what Funnghy needs to actually use the app daily and showcase her work publicly.

#### Public Portfolio

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full-screen hero image on landing | Model portfolios universally lead with striking imagery; sets the editorial tone immediately | MEDIUM | Needs responsive image sizing and fast loading; use next-gen formats (WebP with JPEG fallback) |
| Image gallery with grid/masonry layout | Standard for photography portfolios; visitors expect to browse visually without clicking through pages one at a time | MEDIUM | Masonry handles mixed aspect ratios (landscape beach shots, portrait modeling shots) better than uniform grids; requires careful lazy loading to avoid layout shift |
| Album/category organization | Visitors (agencies, photographers) expect to filter by type: modeling, travel, beauty looks | LOW | Keep it simple: tag-based categories, not deep folder hierarchies. 3-5 categories max |
| Category filtering on gallery | Visitors expect to click a category and see only relevant work; standard on every portfolio platform | LOW | Client-side filtering is sufficient for the expected image count (under 200); no need for server-side pagination |
| Individual photo page with full-size view | Clicking a photo should show it large with details; lightbox pattern is universal | MEDIUM | Lightbox overlay with keyboard navigation (arrow keys, escape), swipe on mobile, pinch-to-zoom. Do not navigate away from gallery |
| About section | Agencies and photographers expect a brief bio, background, and modeling goals | LOW | Static page or section; can include a professional headshot and short text |
| Contact information | Must be easy to reach Funnghy for bookings; expected on every model portfolio | LOW | Simple contact form or displayed email. No need for a full CRM |
| Responsive/mobile-first design | Over 60% of portfolio traffic is mobile; broken mobile experience is a dealbreaker | MEDIUM | Every component must be designed mobile-first. Gallery columns should reduce (3 cols desktop, 2 tablet, 1 mobile) |
| Fast image loading | Photos are the core content; slow loading kills the editorial feel | MEDIUM | Responsive image srcsets, lazy loading, WebP format, CDN delivery. Budget: under 3 seconds for initial gallery render |

#### Private Beauty/Skincare Tracker

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Add/edit/delete products | Core CRUD for the product collection; without this the tracker is useless | LOW | Fields: name, brand, category, photo, rating, notes, purchase date |
| Product categories | Products must be organized (cleansers, serums, moisturizers, sunscreen, masks, etc.) | LOW | Pre-defined categories with option to add custom ones |
| Product rating/review | Funnghy needs to remember what she liked and why; every tracker app has this | LOW | Simple 5-star rating + free-text notes field |
| Product photo | Visual recognition is essential for beauty products; she should see the bottle, not just text | LOW | Single photo per product, uploaded from phone camera or gallery |
| Morning/evening routine builder | Skincare routines are split AM/PM universally; every competitor (FeelinMySkin, Skin Bliss, BasicBeauty) has this | MEDIUM | Ordered list of products per routine. Products should be selectable from the tracked collection |
| Routine step ordering | Products must be applied in a specific layering order (cleanser before serum before moisturizer before SPF); users expect drag-to-reorder | MEDIUM | Drag-and-drop reordering on both mobile and desktop |

#### Private Photo Journal

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Daily journal entry (photo + text) | Core purpose of a photo journal; every competitor (PicDiary, Day One, Orca) has this | LOW | One or more photos per entry plus a text/notes field, associated with a date |
| Calendar or timeline view | Standard way to browse journal entries by date; PicDiary and Day One both use this as primary navigation | MEDIUM | Calendar view with thumbnail indicators on days that have entries; clicking opens that day's entry |
| Browse/scroll through past entries | Must be able to look back through memories; timeline or infinite scroll | LOW | Reverse chronological list as default view, with calendar as alternative navigation |

#### Authentication and Privacy

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| User authentication (login/logout) | Private sections require access control; non-negotiable | MEDIUM | Two hardcoded accounts (Funnghy + boyfriend). No public registration |
| Public/private content separation | Portfolio is public, beauty tracker and journal are private; clear boundary required | LOW | Route-level protection: public routes serve portfolio, authenticated routes serve private tools |
| Role-based access (owner vs contributor) | Boyfriend can upload content for her but should not have identical permissions | MEDIUM | Two roles: Owner (full access) and Contributor (can upload photos, add journal entries, but limited admin) |

#### Core Infrastructure

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Image upload and management | Photos are the core content across all features; must work reliably from mobile | MEDIUM | Support camera capture and gallery selection on mobile. Compress and optimize on upload |
| Soft feminine design system | Core requirement from PROJECT.md; the aesthetic IS the gift | MEDIUM | Pastels, rose gold accents, cream backgrounds, elegant serif + sans-serif typography. Must be consistent across all views |

### Differentiators (Competitive Advantage)

Features that make this feel like a personal, curated gift rather than a generic portfolio template or off-the-shelf tracker app.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Unified personal space (portfolio + tools) | No existing product combines a model portfolio with a beauty tracker and photo journal. This is the core differentiator -- one app that is "her world" | LOW (architectural) | The unification itself is the value; the individual features exist elsewhere but never together |
| Boyfriend contributor role | He can upload photos she took on his phone, add journal entries on her behalf, contribute to the portfolio -- makes it a shared project, not just a tool | MEDIUM | Contributor sees an upload-focused UI: "Add photos for Funnghy" rather than a full admin panel |
| Curated editorial portfolio feel | Unlike Instagram or social media feeds, the portfolio should feel like a magazine editorial: clean, intentional, no clutter | LOW | Achieved through design: generous whitespace, no social metrics, no timestamps on public views, careful typography |
| Product collection "shelf" view | Beauty products displayed as a visual collection (grid of product photos) rather than a database table; feels like browsing her actual shelf | LOW | Visual grid of product images with name and rating overlay; click to see details. Inspired by BasicBeauty's approach |
| Routine daily check-off | Mark routine steps as done each day; lightweight habit-tracking feel without being a full habit app | MEDIUM | Daily state that resets. Visual progress indicator (3 of 6 steps done). Not gamified -- keep it gentle |
| Photo journal with location/mood tags | Add optional mood or location context to journal entries beyond just text | LOW | Optional tags: mood emoji picker, location text field. Keeps entries browsable and adds warmth |
| Smooth page transitions and micro-animations | Premium feel through subtle animations: fade-ins, parallax on hero images, smooth lightbox transitions | MEDIUM | Keep animations under 300ms. Use CSS transitions primarily. Avoid heavy animation libraries |
| Seasonal/themed accent colors | Ability to subtly shift the color palette (e.g., warmer rose tones in autumn, softer lavender in spring) | LOW | CSS custom properties for accent colors; a simple theme selector with 3-4 presets |

### Anti-Features (Deliberately NOT Building)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Public comments/likes on portfolio | "Social proof" for her work | Requires moderation, attracts spam, changes the intimate portfolio feel into a social media clone. PROJECT.md explicitly excludes this | Portfolio is view-only for the public. Contact form for professional inquiries only |
| E-commerce / product purchase links | Could monetize beauty product recommendations | Transforms a personal gift into a storefront. Changes the relationship with the product. Explicitly out of scope | Beauty tracker is for personal use only. No affiliate links, no "buy" buttons |
| Ingredient analysis / product scanning | Leading skincare apps (SkinSort, OnSkin) have this as a major feature | Requires a massive ingredients database or third-party API integration. Enormous complexity for two users. Not the purpose of this app | Simple notes field where she can write her own observations about ingredients |
| AI skin analysis or progress tracking | Skin Bliss uses AI photo comparison for skin changes | Requires ML models, consistent lighting/angle enforcement, privacy concerns with facial analysis. Overkill for a personal gift | Photo journal serves the "track changes over time" need without AI complexity |
| Social media integration / cross-posting | "Post to Instagram from your portfolio" | Creates platform dependency, requires API maintenance, social APIs change frequently. Explicitly out of scope | Portfolio stands alone. She can screenshot or share URLs manually |
| Video hosting | "Show behind-the-scenes footage" | Dramatically increases storage costs, requires transcoding, complicates the gallery. Explicitly out of scope for v1 | Photos only. Video can be linked externally if ever needed |
| Blog / long-form writing | "Share thoughts about beauty and travel" | Adds content management complexity (rich text editor, drafts, publishing). Photo journal already covers personal expression | Photo journal with text notes is sufficient. If she writes a lot, the journal text field can be generous |
| Public user registration | "Let fans create accounts" | This is a two-user system by design. Registration means security exposure, moderation burden, GDPR/privacy obligations | Two hardcoded accounts. No registration form exists |
| Notification/reminder system for routines | Leading skincare apps push reminders to do your routine | Requires push notification infrastructure (service workers, FCM). High complexity for a feature that may annoy rather than help | She can use her phone's built-in reminders. The check-off feature provides gentle accountability without push notifications |
| Product expiration date tracking | FeelinMySkin and Skin Bliss track when products expire | Requires date math, notification system, and users consistently entering purchase/open dates. Low ROI for a personal tool | Optional "notes" field where she can note expiration if she wants |

## Feature Dependencies

```
[Image Upload + Management]
    |
    +--required-by--> [Public Portfolio Gallery]
    |                      |
    |                      +--required-by--> [Album/Category Organization]
    |                      |
    |                      +--required-by--> [Lightbox Full-Size View]
    |                      |
    |                      +--required-by--> [Category Filtering]
    |
    +--required-by--> [Beauty Product Photos]
    |                      |
    |                      +--required-by--> [Product Shelf View]
    |
    +--required-by--> [Photo Journal Entries]
                           |
                           +--required-by--> [Calendar/Timeline View]

[Authentication]
    |
    +--required-by--> [Public/Private Separation]
    |                      |
    |                      +--required-by--> [Beauty Tracker (all)]
    |                      |
    |                      +--required-by--> [Photo Journal (all)]
    |
    +--required-by--> [Role-Based Access]
                           |
                           +--required-by--> [Contributor Upload UI]

[Design System (pastels, rose gold, typography)]
    |
    +--required-by--> [Every UI component]
    +--enhances-----> [Seasonal Accent Colors]

[Product CRUD]
    |
    +--required-by--> [Product Categories]
    +--required-by--> [Product Rating]
    +--required-by--> [Routine Builder]
                           |
                           +--required-by--> [Routine Daily Check-off]

[Responsive Design]
    +--required-by--> [Gallery Grid/Masonry]
    +--required-by--> [Routine Drag-and-Drop Reorder]
```

### Dependency Notes

- **Image Upload requires nothing else:** This is the foundational capability. Build it first and well -- every feature depends on it.
- **Authentication is a parallel foundation:** Portfolio can work without auth (public), but all private features are blocked until auth exists.
- **Design System should be established before building UI components:** Otherwise you build twice -- once with placeholder styles, once with the real aesthetic.
- **Product CRUD before Routine Builder:** Routines reference products from the collection. The collection must exist first.
- **Gallery before filtering/albums:** You need images displayed before you can filter or organize them.
- **Calendar view enhances but does not block Photo Journal:** Journal entries can be listed chronologically first; calendar is a navigation enhancement.

## MVP Definition

### Launch With (v1)

The minimum to make this a usable gift that Funnghy would actually open daily.

- [ ] **Design system** -- Establish the pastel/rose gold/cream aesthetic with typography. This IS the gift; generic styling would undermine everything
- [ ] **Public portfolio gallery** -- Masonry grid with category filtering, lightbox view. Her public-facing showcase
- [ ] **About + Contact section** -- Simple but essential for professional inquiries
- [ ] **Image upload and management** -- Core infrastructure. Upload from mobile, auto-optimize, serve responsively
- [ ] **Authentication** -- Two accounts (Funnghy + boyfriend), route protection for private sections
- [ ] **Role-based access** -- Owner vs contributor permissions
- [ ] **Beauty product tracker** -- Add products with photo, category, rating, notes. Shelf-style visual grid
- [ ] **Morning/evening routine builder** -- Create routines from tracked products with step ordering
- [ ] **Photo journal** -- Daily entries with photos and text, chronological browse
- [ ] **Responsive design** -- Must work beautifully on mobile (her primary device for daily use)

### Add After Validation (v1.x)

Features to add once she is actively using the core app and has feedback.

- [ ] **Calendar view for journal** -- Once she has enough entries that scrolling becomes cumbersome
- [ ] **Routine daily check-off** -- Once she has routines set up and wants to track adherence
- [ ] **Contributor upload UI** -- Boyfriend gets a streamlined upload experience rather than using the same admin interface
- [ ] **Photo journal mood/location tags** -- Once basic journaling is established, add metadata richness
- [ ] **Seasonal accent color themes** -- A delightful touch once the core design system is solid
- [ ] **Smooth page transitions and micro-animations** -- Polish layer once core functionality works

### Future Consideration (v2+)

Features to defer until the app is actively used and real needs emerge.

- [ ] **Product wishlist** -- Track products she wants to try (only if she asks for it)
- [ ] **Routine history/streak tracking** -- See how consistently she followed routines over time (only if check-off is used)
- [ ] **Before/after photo comparison in journal** -- Side-by-side view of journal photos from different dates
- [ ] **Portfolio print/PDF export** -- Generate a comp card or lookbook PDF from selected portfolio images
- [ ] **Dark mode** -- Alternative theme if she uses the app at night (private sections especially)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Design system (pastel/rose gold aesthetic) | HIGH | MEDIUM | P1 |
| Image upload + optimization pipeline | HIGH | MEDIUM | P1 |
| Public portfolio gallery (masonry + lightbox) | HIGH | MEDIUM | P1 |
| About + Contact section | MEDIUM | LOW | P1 |
| Authentication (two users) | HIGH | MEDIUM | P1 |
| Public/private route separation | HIGH | LOW | P1 |
| Role-based access (owner/contributor) | MEDIUM | MEDIUM | P1 |
| Beauty product CRUD | HIGH | LOW | P1 |
| Product categories | MEDIUM | LOW | P1 |
| Product rating + photo | MEDIUM | LOW | P1 |
| Product shelf visual grid | MEDIUM | LOW | P1 |
| Morning/evening routine builder | HIGH | MEDIUM | P1 |
| Routine step ordering (drag-drop) | MEDIUM | MEDIUM | P1 |
| Photo journal entries (photo + text) | HIGH | LOW | P1 |
| Journal chronological browse | MEDIUM | LOW | P1 |
| Responsive/mobile-first design | HIGH | MEDIUM | P1 |
| Category filtering on gallery | MEDIUM | LOW | P1 |
| Calendar view for journal | MEDIUM | MEDIUM | P2 |
| Routine daily check-off | MEDIUM | MEDIUM | P2 |
| Contributor-specific upload UI | LOW | MEDIUM | P2 |
| Mood/location tags on journal | LOW | LOW | P2 |
| Seasonal color themes | LOW | LOW | P2 |
| Page transitions + micro-animations | LOW | MEDIUM | P2 |
| Product wishlist | LOW | LOW | P3 |
| Routine streak/history | LOW | MEDIUM | P3 |
| Before/after journal comparison | LOW | MEDIUM | P3 |
| Portfolio PDF export | LOW | HIGH | P3 |
| Dark mode | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch -- the gift is incomplete without these
- P2: Should have, add after core is working and she has feedback
- P3: Nice to have, only if real usage reveals the need

## Competitor Feature Analysis

| Feature | Model Portfolio Sites (Pixpa, Squarespace) | Skincare Apps (FeelinMySkin, Skin Bliss) | Photo Journals (PicDiary, Day One) | Funnghy's World |
|---------|---------------------------------------------|------------------------------------------|-------------------------------------|-----------------|
| Image gallery | Grid/masonry with lightbox, standard | N/A | N/A | Masonry with lightbox, category filtering |
| Portfolio categories | Tags, albums, multi-level filtering | N/A | N/A | Simple tag-based categories (3-5 max) |
| Product tracking | N/A | Full CRUD, expiration dates, ingredient scanning | N/A | CRUD with photos, ratings, categories. No ingredient scanning |
| Routine builder | N/A | AM/PM routines, layering order, reminders, timers | N/A | AM/PM routines with drag-to-reorder. No reminders or timers |
| Journal entries | N/A (some have blogs) | Skin symptom logging | Photo + text entries, calendar view, mood tracking | Photo + text entries, chronological + calendar views |
| Multi-user | Client proofing (different purpose) | Single user | Single user (some share via export) | Two users with distinct roles (owner + contributor) |
| Design aesthetic | Customizable templates | Functional/clinical UI | Minimal, diary-like | Custom soft feminine aesthetic (pastels, rose gold) -- not templated |
| Privacy model | All public, or client-gated galleries | All private | All private, password-locked | Hybrid: public portfolio + private tools in one app |

## Sources

- [Pixpa - What to Include in a Modeling Portfolio](https://www.pixpa.com/blog/what-to-include-in-a-modeling-portfolio) - Portfolio content standards
- [Gallery Layout Best Practices for Photography Websites](https://onewebcare.com/blog/gallery-layout-best-practices/) - Gallery patterns and image optimization
- [FooPlugins - Portfolio Gallery with Filtering](https://fooplugins.com/portfolio-gallery-with-filtering/) - Filtering patterns for galleries
- [FeelinMySkin](https://www.feelinmyskin.com/) - Skincare routine tracking features
- [BasicBeauty](https://basicbeauty.app/) - Beauty product tracking and journal features
- [Skincare Routine App](https://skincareroutine.app) - Routine builder with layering order
- [SkinSort Routine Creator](https://skinsort.com/routine) - Routine building patterns
- [Orca Photo Journal App](https://www.okorca.com/photo-journal-app) - Photo journal feature patterns
- [PicDiary](https://play.google.com/store/apps/details?id=com.picdiary.app&hl=en) - Calendar view and daily photo entries

---
*Feature research for: Personal portfolio + beauty tracker + photo journal (Funnghy's World)*
*Researched: 2026-03-19*
