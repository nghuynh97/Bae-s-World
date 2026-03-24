# Phase 1: Fake data for webapp, optimize color of alert and optimize UI of page /schedule - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers four improvements to the existing v1.0 webapp:
1. A reset-and-seed data script (CLI + admin button) that populates all sections with realistic fake data
2. Colored toast/alert styling for success, error, and warning states
3. Schedule page UI enhancements: job count statistics and weekly job reminder
4. Portfolio admin form fix: make title and description optional

</domain>

<decisions>
## Implementation Decisions

### Seed Data Script
- CLI script (`npm run seed`) that connects to Supabase and resets all table data, then inserts fake data
- Admin button visible only to boyfriend's account (not Funnghy) that triggers the same reset + seed
- No role column exists in profiles — identify boyfriend by display_name or email from invite_codes table
- **Portfolio:** 20+ items using cute cat meme images
- **Beauty:** Seed products with categories and a couple of routines with steps
- **Schedule:** 3 months of job data (15-20 jobs) spread across months for meaningful chart/stats data
- Script resets ALL tables before inserting (clean slate approach)

### Portfolio Form Fix
- Make `title` and `description` fields optional (not required) in the admin portfolio add form
- Currently these fields likely have validation requiring them — remove the required constraint

### Toast/Alert Colors
- Colored backgrounds for each toast type (not just borders/icons):
  - Success: light green background
  - Error: light red background
  - Warning: light amber background
- Keep existing Sonner setup (top-center, 3000ms duration)
- Colors should be soft/pastel to match the feminine design system — not harsh saturated colors

### Schedule Page — Job Count Statistics
- Add job count statistics alongside existing income stats (not replacing them)
- Add a row below the income stat cards showing: "This Week: X jobs", "This Month: Y jobs"
- Keep existing month/year income stat cards as-is

### Schedule Page — Weekly Job Reminder
- Add a third stat card in the stats area: "This Week: X jobs" with upcoming job count
- This serves as a reminder for jobs coming in the current week
- Card style matches existing StatCard pattern (white bg, shadow-sm, ring-1)

### Claude's Discretion
- Exact shade of pastel green/red/amber for toast backgrounds (should complement rose gold accent)
- Seed data content: specific cat image URLs, Vietnamese client names, beauty product names
- Whether job count row uses same StatCard component or a simpler badge/pill style
- How to source cat meme images for portfolio seed (placeholder URLs vs bundled assets)

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/sonner.tsx`: Sonner Toaster with custom icons, position, duration — modify toastOptions.classNames for colored backgrounds
- `src/components/schedule/stats-header.tsx`: StatCard component — reuse pattern for job count card
- `src/components/schedule/job-form.tsx`: Uses react-hook-form + zod validation — portfolio form likely similar pattern
- `src/lib/db/schema.ts`: All table schemas (portfolioItems, beautyProducts, beautyCategories, routines, routineSteps, jobs, images, etc.)
- `src/actions/schedule.ts`: Server actions for job CRUD — reference for seed data insertion

### Established Patterns
- CSS custom properties for colors: `--color-paid: #059669`, `--color-pending: #d97706`, `--color-accent: #e8b4b8`
- Server Actions for all data mutations (not API routes)
- Drizzle ORM for database queries
- `public-images` bucket for portfolio, `private-images` bucket for beauty
- Sharp WebP pipeline for image processing (4 size variants)

### Integration Points
- Seed script needs Supabase admin client (service role key) for auth user creation and storage operations
- Portfolio images go through the existing image pipeline (sharp processing)
- Admin button connects via Server Action triggered from admin page
- Toast color changes are global via sonner.tsx toastOptions

</code_context>

<specifics>
## Specific Ideas

- Portfolio seed data should use cute cat meme images specifically
- Vietnamese-style client names and locations for schedule seed data (matching the existing VND currency format)
- The admin seed button should only be visible to the boyfriend's account — acts as a dev/maintenance tool

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-fake-data-for-webapp-optimize-color-of-alert-and-optimize-ui-of-page-schedule*
*Context gathered: 2026-03-24*
