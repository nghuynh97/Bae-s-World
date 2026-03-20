# Roadmap: Funnghy's World

## Overview

Funnghy's World delivers a personal gift webapp in five phases: first establishing the design system, authentication, and image infrastructure that every feature depends on; then building the public portfolio (the gift's face); then the two private tools (beauty tracker and photo journal); and finally applying cross-cutting polish. Each phase delivers a complete, verifiable capability.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Design system, authentication, image pipeline, and project scaffolding (gap closure pending) (completed 2004-03-20)
- [x] **Phase 2: Public Portfolio** - Gallery, lightbox, filtering, about page, and content management (gap closure pending) (completed 2004-03-20)
- [ ] **Phase 3: Beauty Tracker** - Product CRUD, categories, favorites, routines with drag-and-drop
- [ ] **Phase 4: Freelance Schedule & Income Tracker** - Calendar schedule, job CRUD, income statistics with charts

## Phase Details

### Phase 1: Foundation

**Goal**: Funnghy and her boyfriend can log in to a beautifully styled app with working image uploads, where public pages are open and private sections are locked down
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DESG-01, DESG-02, DESG-03, IMG-01, IMG-02, IMG-03, IMG-04
**Success Criteria** (what must be TRUE):

1. Funnghy can log in with email/password and her session persists across browser refresh
2. Boyfriend can log in with a separate account and his session persists across browser refresh
3. Public routes (portfolio placeholder) are accessible without login; private routes redirect to login
4. The app displays with the soft feminine design system (pastel tones, rose gold accents, cream backgrounds, elegant typography) on both mobile and desktop
5. A user can upload an image via drag-and-drop or file picker, and it is automatically optimized with multiple size variants generated; private images are inaccessible without authentication
   **Plans:** 4/4 plans complete

Plans:

- [x] 01-01-PLAN.md — Scaffold project, design system tokens, shadcn/ui, fonts, navigation components, route groups, placeholder pages
- [x] 01-02-PLAN.md — Supabase auth, invite-code setup flow, login, middleware route protection, dynamic navigation
- [x] 01-03-PLAN.md — Image upload pipeline with sharp processing, variant generation, signed URLs, drag-and-drop UI
- [ ] 01-04-PLAN.md — Gap closure: Add "Sign out all devices" global session invalidation

### Phase 2: Public Portfolio

**Goal**: Anyone on the internet can browse Funnghy's portfolio in a beautiful masonry gallery, view photos full-size, filter by category, and read her about page -- and Funnghy or her boyfriend can manage the content
**Depends on**: Phase 1
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06, AUTH-06
**Success Criteria** (what must be TRUE):

1. A public visitor can view a masonry grid gallery of portfolio photos without logging in
2. A visitor can click any photo to open a full-size lightbox with navigation between photos
3. A visitor can filter portfolio photos by category (modeling, travel, beauty)
4. A visitor can view an About page with Funnghy's bio, photo, and contact info
5. Funnghy can upload, edit, and delete portfolio photos with title, description, and category; boyfriend can upload photos and content for her portfolio
   **Plans:** 5/5 plans complete

Plans:

- [ ] 02-00-PLAN.md — Wave 0 test stubs for all portfolio requirements (vitest)
- [ ] 02-01-PLAN.md — DB schema (categories, portfolioItems, aboutContent), Server Actions for CRUD, seed script
- [ ] 02-02-PLAN.md — Public gallery (masonry grid, category filter, infinite scroll, lightbox) and about page
- [ ] 02-03-PLAN.md — Admin content management (portfolio CRUD UI, category management, about editor)
- [ ] 02-04-PLAN.md — Gap closure: middleware admin route protection + portfolio variant query fix

### Phase 3: Beauty Tracker

**Goal**: Funnghy can manage her beauty product collection and build daily routines in a private, visually rich section that feels like a personal shelf
**Depends on**: Phase 1
**Requirements**: BEAU-01, BEAU-02, BEAU-03, BEAU-04, BEAU-05, BEAU-06, BEAU-07
**Success Criteria** (what must be TRUE):

1. Funnghy can add a beauty product with name, brand, category, rating, photo, and notes -- and later edit or delete it
2. Funnghy can browse her products organized by category (skincare, makeup, haircare, etc.) in a visual shelf/collection view, with favorites highlighted
3. Funnghy can create morning and evening routines with ordered product steps, and reorder steps via drag-and-drop
4. The beauty tracker is only accessible when logged in; unauthenticated visitors cannot access it or its images
   **Plans:** 3/4 plans executed

Plans:

- [ ] 03-01-PLAN.md — DB schema (beautyCategories, beautyProducts, routines, routineSteps), Server Actions for product + category CRUD, seed script, test stubs
- [ ] 03-02-PLAN.md — Products tab UI (photo grid, bottom sheet, product form, star rating, category filter with favorites)
- [ ] 03-03-PLAN.md — Routines tab UI (morning/evening cards, drag-and-drop step reorder, search-to-add product picker)
- [ ] 03-04-PLAN.md — Beauty category management UI (create, rename, delete custom categories dialog)

### Phase 4: Freelance Schedule & Income Tracker

**Goal:** Funnghy can manage her freelance modeling schedule with a month-view calendar, track job income in VND with paid/pending status, and view income statistics with charts -- all in a private section accessible to both users
**Requirements**: SCHED-01, SCHED-02, SCHED-03, SCHED-04, SCHED-05, SCHED-06, SCHED-07
**Depends on:** Phase 1
**Success Criteria** (what must be TRUE):

1. Funnghy can add, edit, and delete jobs with client name, location, time, pay (VND), and status
2. A month-view calendar shows job dots and daily income totals on each day cell
3. Tapping a day shows job details below the calendar; tapping an empty day opens the add job form
4. Income statistics show paid vs pending breakdown for current month and year
5. Monthly and yearly income charts visualize earnings trends
6. The schedule is private -- only accessible when logged in
7. Both Funnghy and boyfriend can view and manage the schedule
   **Plans:** 2/3 plans executed

Plans:

- [ ] 04-01-PLAN.md — DB schema (scheduleJobs), Server Actions for job CRUD + income stats, VND formatter, date utilities, tests
- [ ] 04-02-PLAN.md — Calendar month grid, day cells with job dots + income, day detail panel, job cards, job form sheet
- [ ] 04-03-PLAN.md — Stats header cards, income bar charts with monthly/yearly toggle, nav links, middleware route protection

### Phase 5: Polish

**Goal:** The app feels smooth and responsive with subtle micro-animations, page fade transitions, loading skeletons, hover effects, and consistent form feedback across all pages
**Requirements**: POLISH-01, POLISH-02, POLISH-03, POLISH-04, POLISH-05
**Depends on:** Phase 4
**Success Criteria** (what must be TRUE):

1. Every route change shows a subtle fade-in animation (200-300ms)
2. Cards show barely-visible lift/shadow change on hover; buttons scale to 0.97x on press
3. All 4 main pages (portfolio, dashboard, beauty, schedule) have layout-matching loading skeletons
4. Toasts appear from top-center and auto-dismiss after 3 seconds
5. Every form submit button shows a spinner icon while saving
   **Plans:** 3/3 plans complete

Plans:

- [ ] 05-00-PLAN.md — Wave 0 test stubs for all polish requirements (page-fade, button-spinner, loading-skeletons, toast-config)
- [ ] 05-01-PLAN.md — CSS keyframes, page fade template.tsx, ButtonSpinner component, toast config, card hover effects
- [ ] 05-02-PLAN.md — Loading skeletons for portfolio and dashboard, form button spinners across all forms

### Phase 6: Refactor & UI/UX Optimization

**Goal:** All forms use shadcn components consistently, CRUD operations update the UI seamlessly via server-side revalidation, visual spacing and contrast are polished, and the entire codebase is Prettier-formatted with Tailwind class sorting
**Requirements**: REFAC-01, REFAC-02, REFAC-03, REFAC-04, REFAC-05, REFAC-06, REFAC-07, REFAC-08, REFAC-09
**Depends on:** Phase 5
**Success Criteria** (what must be TRUE):

1. All form dropdowns use shadcn Select (no native `<select>` elements remain)
2. All textareas use shadcn Textarea (no native `<textarea>` elements remain)
3. All CRUD actions update the UI without manual page refresh (revalidatePath in server actions)
4. Forms have generous spacing and cards have visible contrast against lavender background
5. The entire codebase passes `prettier --check .` with zero violations
   **Plans:** 2/3 plans executed

Plans:

- [ ] 06-01-PLAN.md — Replace native form elements with shadcn Select/Textarea + migrate router.refresh() to revalidatePath()
- [ ] 06-02-PLAN.md — UX spacing, calendar visual treatment, and card contrast improvements
- [ ] 06-03-PLAN.md — Prettier setup with Tailwind plugin and full codebase format
