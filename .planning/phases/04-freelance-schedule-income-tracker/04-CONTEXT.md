# Phase 5: Freelance Schedule & Income Tracker - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Private freelance modeling schedule and income tracking. Funnghy can manage daily jobs with client, location, time, pay, and notes. Multiple jobs per day supported. Income tracked in VND with paid/pending status. Statistics by day, week, month, and year with charts. Both Funnghy and boyfriend can access and manage the schedule.

</domain>

<decisions>
## Implementation Decisions

### Job entry & fields
- Each job has: client name, location, start time, end time, pay amount (VND), notes (optional)
- Jobs are single-day only — no multi-day spanning
- Add a job by tapping a date on the calendar — form slides up for that date
- No job types/categories for v1 — keep it simple with core fields

### Income tracking
- Currency: Vietnamese Dong (VND) — no decimals, large numbers (format with dots: 5.000.000₫)
- Payment status: paid or pending per job
- Color coding: paid jobs in green/accent, pending jobs in orange/yellow
- Daily income totals shown directly on calendar day cells

### Statistics & reporting
- All 4 time periods: daily, weekly, monthly, yearly
- Display: summary number cards + simple bar/line charts for trends
- Stats shown as summary header cards ABOVE the calendar (not a separate tab/page)
- Paid vs pending breakdown shown separately in each time period (e.g., "Total: 15M₫ | Pending: 3M₫")
- Monthly chart: bar chart showing daily or weekly earnings
- Yearly chart: bar chart showing monthly earnings

### Calendar & schedule view
- Default view: month grid
- Day cells show: job count dot/badge + total income amount
- Tapping a day with jobs: job list appears BELOW the calendar (Apple Calendar pattern — calendar stays visible at top)
- Tapping an empty day: add job form slides up
- Both users (Funnghy + boyfriend) can view and manage the schedule

### Claude's Discretion
- Calendar component approach (custom build vs library)
- Chart library choice for income statistics
- Job form layout and slide-up animation
- VND number formatting helper
- How month navigation works (swipe vs arrows)
- Empty state design for days/months with no jobs

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Vision, constraints, two-user system, aesthetic requirements
- `.planning/REQUIREMENTS.md` — Full v1 requirements (this phase adds new requirements not yet in REQUIREMENTS.md)
- `.planning/ROADMAP.md` §Phase 5 — Goal, success criteria

### Prior phase patterns
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design system tokens, nav structure, DB connection fixes
- `.planning/phases/03-beauty-tracker/03-CONTEXT.md` — Bottom sheet pattern, category filter, tab pattern, star rating

### Existing infrastructure
- `src/lib/db/schema.ts` — Existing tables as pattern reference for new schedule/jobs tables
- `src/actions/beauty-products.ts` — CRUD Server Actions pattern with auth gates
- `src/components/beauty/product-form.tsx` — Form pattern with react-hook-form + zod
- `src/components/ui/sheet.tsx` — Sheet component for slide-up forms
- `src/lib/supabase/middleware.ts` — Route protection (needs /schedule added)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/sheet.tsx` — Sheet for job add/edit form slide-up
- `src/components/ui/dialog.tsx` — Dialog for delete confirmations
- Server Actions pattern from beauty-products.ts — CRUD with auth gates and zod validation
- react-hook-form + zod pattern from product-form.tsx
- `src/lib/supabase/middleware.ts` — Add `/schedule` to protected routes

### Established Patterns
- Server Actions with zod validation for all CRUD
- Drizzle ORM with typed schema
- Private routes protected by middleware
- `node --env-file=.env.local` for npm scripts on Windows
- Use Supabase SQL Editor for DDL (drizzle-kit push hangs on pooler)

### Integration Points
- `src/app/(private)/schedule/` — New route group for schedule pages
- Navigation: add "Schedule" link to authenticated nav (top-nav.tsx and bottom-tab-bar.tsx)
- Auth middleware: add `/schedule` to protected routes
- No image upload needed for this phase — text/number data only

</code_context>

<specifics>
## Specific Ideas

- The calendar should feel personal and clean — not like a corporate scheduling tool
- VND formatting matters: 5.000.000₫ not 5000000 — large numbers need dot separators
- The paid/pending color coding should be subtle (green tint vs orange tint, not traffic-light bright)
- Stats header above calendar keeps everything on one page — no context switching
- Apple Calendar pattern for day detail (list below calendar) keeps the month view always visible

</specifics>

<deferred>
## Deferred Ideas

- Recurring jobs / templates (e.g., "weekly shoot with Agency X") — future enhancement
- Job type/category tagging — could add later if she wants to filter by shoot type
- Export to CSV/PDF for tax purposes — future enhancement
- Client contact info management — separate feature

</deferred>

---

*Phase: 05-freelance-schedule-income-tracker*
*Context gathered: 2026-03-20*
