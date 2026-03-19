# Requirements: Funnghy's World

**Defined:** 2026-03-19
**Core Value:** Funnghy has a single, beautiful space that showcases her work to the world and helps her track her daily beauty and memories.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Portfolio

- [x] **PORT-01**: User can view a masonry grid gallery of all portfolio photos
- [x] **PORT-02**: User can click a photo to view it full-size in a lightbox with navigation
- [x] **PORT-03**: User can filter portfolio photos by category (modeling, travel, beauty)
- [x] **PORT-04**: Public visitors can view an About page with Funnghy's bio, photo, and contact info
- [x] **PORT-05**: Funnghy can upload, edit, and delete portfolio photos with title, description, and category
- [x] **PORT-06**: Portfolio pages are publicly accessible without login

### Beauty Tracker

- [ ] **BEAU-01**: Funnghy can add beauty products with name, brand, category, rating, photo, and notes
- [ ] **BEAU-02**: Funnghy can edit and delete her beauty products
- [ ] **BEAU-03**: Funnghy can organize products by category (skincare, makeup, haircare, etc.)
- [ ] **BEAU-04**: Funnghy can mark products as favorites and view them in a shelf/collection view
- [ ] **BEAU-05**: Funnghy can create morning and evening routines with ordered product steps
- [ ] **BEAU-06**: Funnghy can reorder steps in a routine via drag-and-drop
- [ ] **BEAU-07**: Beauty tracker is private — only accessible when logged in

### Photo Journal

- [ ] **JOUR-01**: Funnghy can create daily journal entries with a photo and text notes
- [ ] **JOUR-02**: Funnghy can browse journal entries chronologically (newest first)
- [ ] **JOUR-03**: Funnghy can browse journal entries via a calendar view by date
- [ ] **JOUR-04**: Funnghy can tag journal entries with mood or custom tags
- [ ] **JOUR-05**: Funnghy can edit and delete her journal entries
- [ ] **JOUR-06**: Photo journal is private — only accessible when logged in

### Authentication & Users

- [x] **AUTH-01**: Funnghy can log in with email and password
- [x] **AUTH-02**: Boyfriend can log in with email and password (separate account)
- [x] **AUTH-03**: User sessions persist across browser refresh
- [x] **AUTH-04**: Public portfolio pages are accessible without login
- [x] **AUTH-05**: Private sections (beauty tracker, photo journal) require login
- [x] **AUTH-06**: Boyfriend can upload photos and content for Funnghy's portfolio

### Design & UX

- [x] **DESG-01**: App uses a soft feminine design system — pastel tones, rose gold accents, cream backgrounds, elegant typography
- [x] **DESG-02**: All pages are fully responsive on mobile and desktop
- [x] **DESG-03**: Images are automatically optimized for fast loading (WebP/AVIF, lazy loading, responsive sizes)
- [ ] **DESG-04**: UI includes subtle micro-animations and transitions (hover effects, page transitions, loading states)

### Image Management

- [ ] **IMG-01**: Users can upload images (JPEG, PNG, WebP) with automatic optimization
- [ ] **IMG-02**: Uploaded images generate multiple size variants for responsive display
- [ ] **IMG-03**: Private images (journal, beauty tracker) are only accessible to authenticated users
- [ ] **IMG-04**: Image upload supports drag-and-drop and file picker

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Notifications

- **NOTF-01**: Funnghy receives notification when boyfriend uploads new content
- **NOTF-02**: "On this day" daily memory reminders from past journal entries

### Advanced Beauty

- **ADVB-01**: Product usage tracking (when was a product last used)
- **ADVB-02**: Product empties tracker (finished products log)
- **ADVB-03**: Routine check-off (mark today's routine as done)

### Personalization

- **PERS-01**: Seasonal theme variations (spring pastels, summer golden, autumn warm)
- **PERS-02**: Customizable accent color

### Portfolio Enhancement

- **PORTE-01**: SEO-optimized photo pages with meta tags
- **PORTE-02**: Portfolio sharing via social media preview cards

## Out of Scope

| Feature | Reason |
|---------|--------|
| Public registration | Two users only — this is a personal gift, not a platform |
| Real-time chat/messaging | Not a communication tool |
| E-commerce / product links | Personal tracker, not a storefront |
| Video hosting | Photos only — keeps it focused and lightweight |
| Social features (likes, comments) | Portfolio is view-only for public visitors |
| Social media integration | Standalone personal space |
| AI skin analysis | Over-complex for a gift app |
| Ingredient scanning/database | Would require external data sources and add massive scope |
| Push notifications | Overkill for two users |
| Blog/writing features | Photo journal covers personal expression |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| AUTH-05 | Phase 1 | Complete |
| DESG-01 | Phase 1 | Complete |
| DESG-02 | Phase 1 | Complete |
| DESG-03 | Phase 1 | Complete |
| IMG-01 | Phase 1 | Pending |
| IMG-02 | Phase 1 | Pending |
| IMG-03 | Phase 1 | Pending |
| IMG-04 | Phase 1 | Pending |
| PORT-01 | Phase 2 | Complete |
| PORT-02 | Phase 2 | Complete |
| PORT-03 | Phase 2 | Complete |
| PORT-04 | Phase 2 | Complete |
| PORT-05 | Phase 2 | Complete |
| PORT-06 | Phase 2 | Complete |
| AUTH-06 | Phase 2 | Complete |
| BEAU-01 | Phase 3 | Pending |
| BEAU-02 | Phase 3 | Pending |
| BEAU-03 | Phase 3 | Pending |
| BEAU-04 | Phase 3 | Pending |
| BEAU-05 | Phase 3 | Pending |
| BEAU-06 | Phase 3 | Pending |
| BEAU-07 | Phase 3 | Pending |
| JOUR-01 | Phase 4 | Pending |
| JOUR-02 | Phase 4 | Pending |
| JOUR-03 | Phase 4 | Pending |
| JOUR-04 | Phase 4 | Pending |
| JOUR-05 | Phase 4 | Pending |
| JOUR-06 | Phase 4 | Pending |
| DESG-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 after roadmap creation*
