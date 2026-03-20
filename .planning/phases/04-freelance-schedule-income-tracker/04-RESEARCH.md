# Phase 5: Freelance Schedule & Income Tracker - Research

**Researched:** 2026-03-20
**Domain:** Calendar UI, chart visualization, VND currency formatting, schedule/income DB schema
**Confidence:** HIGH

## Summary

This phase adds a private freelance schedule and income tracker with a month-view calendar, job CRUD, payment status tracking, and income statistics with charts. The project already has well-established patterns for Server Actions with auth gates, Drizzle ORM schema, react-hook-form + zod validation, and Sheet/Dialog UI components that this phase should follow directly.

The calendar should be custom-built (not a library) because the requirements are specific -- month grid with custom day cells showing job count dots and income totals, Apple Calendar-style day detail below. This is a layout problem, not a scheduling problem, and date-fns provides all the date math needed. For charts, Recharts 3.x is the standard choice -- it officially supports React 19, is SVG-based, and provides the simple bar/line charts needed for income statistics. VND formatting uses the built-in `Intl.NumberFormat` API with the `vi-VN` locale, which natively handles dot-separated thousands and the dong symbol.

**Primary recommendation:** Custom calendar grid with date-fns for date math, Recharts 3.x for charts, Intl.NumberFormat for VND, and a single `schedule_jobs` table following existing Drizzle schema patterns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Each job has: client name, location, start time, end time, pay amount (VND), notes (optional)
- Jobs are single-day only -- no multi-day spanning
- Add a job by tapping a date on the calendar -- form slides up for that date
- No job types/categories for v1 -- keep it simple with core fields
- Currency: Vietnamese Dong (VND) -- no decimals, large numbers (format with dots: 5.000.000d)
- Payment status: paid or pending per job
- Color coding: paid jobs in green/accent, pending jobs in orange/yellow
- Daily income totals shown directly on calendar day cells
- All 4 time periods: daily, weekly, monthly, yearly
- Display: summary number cards + simple bar/line charts for trends
- Stats shown as summary header cards ABOVE the calendar (not a separate tab/page)
- Paid vs pending breakdown shown separately in each time period
- Monthly chart: bar chart showing daily or weekly earnings
- Yearly chart: bar chart showing monthly earnings
- Default view: month grid
- Day cells show: job count dot/badge + total income amount
- Tapping a day with jobs: job list appears BELOW the calendar (Apple Calendar pattern)
- Tapping an empty day: add job form slides up
- Both users (Funnghy + boyfriend) can view and manage the schedule

### Claude's Discretion
- Calendar component approach (custom build vs library)
- Chart library choice for income statistics
- Job form layout and slide-up animation
- VND number formatting helper
- How month navigation works (swipe vs arrows)
- Empty state design for days/months with no jobs

### Deferred Ideas (OUT OF SCOPE)
- Recurring jobs / templates (e.g., "weekly shoot with Agency X")
- Job type/category tagging
- Export to CSV/PDF for tax purposes
- Client contact info management
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| date-fns | 4.1.0 | Date math (month days, week starts, formatting) | Tree-shakeable, no class overhead, pure functions, widely used |
| recharts | 3.8.0 | Bar/line charts for income statistics | Officially supports React 19, SVG-based, declarative API, most popular React chart lib |
| Intl.NumberFormat (built-in) | N/A | VND currency formatting with dot separators | Native browser API, zero bundle cost, correct vi-VN locale formatting |

### Supporting (Already in Project)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | 7.71.2 | Job add/edit form state | All form handling (existing pattern) |
| zod | 4.3.6 | Job form + server action validation | All input validation (existing pattern) |
| @hookform/resolvers | 5.2.2 | Connect zod to react-hook-form | Form validation binding (existing pattern) |
| lucide-react | 0.577.0 | Icons (chevrons for nav, status icons) | All iconography (existing pattern) |
| sonner | 2.0.7 | Toast notifications for job CRUD | Success/error feedback (existing pattern) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom calendar | react-big-calendar | Over-engineered for month-only grid; custom cells with income totals need full control |
| Custom calendar | react-day-picker | Designed for date picking, not event display; would fight the API |
| Recharts | Chart.js + react-chartjs-2 | Canvas-based (not SSR-friendly), heavier for simple bar charts |
| Recharts | @nivo/bar | More dependencies, heavier bundle for what amounts to 2 simple charts |
| date-fns | dayjs | Either works; date-fns is more tree-shakeable and project has no existing date lib |

**Installation:**
```bash
npm install date-fns recharts
```

**Version verification:** Verified via `npm view` on 2026-03-20:
- date-fns: 4.1.0 (no peer dependencies, standalone)
- recharts: 3.8.0 (peerDependencies: react ^19.0.0 -- confirmed compatible)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/(private)/schedule/
│   ├── page.tsx              # Server Component: fetch jobs for current month, render layout
│   └── loading.tsx           # Skeleton for calendar + stats
├── components/schedule/
│   ├── calendar-grid.tsx     # Client: month grid with day cells
│   ├── calendar-header.tsx   # Client: month/year nav with prev/next arrows
│   ├── day-cell.tsx          # Client: single day cell with job dots + income
│   ├── day-detail.tsx        # Client: job list for selected day (below calendar)
│   ├── job-form.tsx          # Client: add/edit job form in Sheet
│   ├── job-card.tsx          # Client: single job in day detail list
│   ├── stats-header.tsx      # Client: income summary cards above calendar
│   ├── income-chart.tsx      # Client: Recharts bar/line chart
│   └── empty-state.tsx       # Client: empty day/month messaging
├── actions/schedule.ts       # Server Actions: CRUD with auth gates + zod
├── lib/schedule/
│   ├── format-vnd.ts         # VND currency formatter utility
│   └── date-utils.ts         # date-fns helpers for calendar math
└── __tests__/schedule/
    ├── schedule-actions.test.ts  # Server action logic tests
    ├── format-vnd.test.ts        # Currency formatting tests
    ├── calendar-grid.test.tsx    # Calendar rendering tests
    └── stats.test.ts             # Income calculation tests
```

### Pattern 1: Custom Month Calendar Grid
**What:** Build the month grid as a CSS grid with 7 columns (Sun-Sat or Mon-Sun), generating day cells from date-fns calculations.
**When to use:** When you need full control over day cell rendering (job dots, income totals, color coding).
**Example:**
```typescript
// Calendar date math with date-fns
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, format
} from "date-fns";

function getCalendarDays(currentMonth: Date): Date[] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  // Pad to full weeks
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}
```

### Pattern 2: Server Component Data Fetching + Client Interactivity
**What:** Server Component fetches all jobs for the visible month range, passes as props to Client Components.
**When to use:** Page-level data loading with client-side state for selected day, form visibility.
**Example:**
```typescript
// app/(private)/schedule/page.tsx (Server Component)
import { getJobsForMonth } from "@/actions/schedule";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1;
  const year = params.year ? parseInt(params.year) : new Date().getFullYear();
  const jobs = await getJobsForMonth(year, month);

  return (
    <div>
      <StatsHeader jobs={jobs} year={year} month={month} />
      <CalendarGrid jobs={jobs} year={year} month={month} />
    </div>
  );
}
```

### Pattern 3: Income Aggregation on Server
**What:** Compute income summaries (daily/weekly/monthly/yearly totals, paid vs pending) in Server Actions, not client-side.
**When to use:** Statistics cards and chart data. Avoids shipping raw job data for large date ranges.
**Example:**
```typescript
// Server Action: aggregate income by period
export async function getIncomeStats(year: number, month: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch all jobs in the month
  const monthJobs = await db.select()
    .from(scheduleJobs)
    .where(and(
      eq(scheduleJobs.year, year),
      eq(scheduleJobs.month, month),
    ));

  const totalPaid = monthJobs.filter(j => j.status === "paid")
    .reduce((sum, j) => sum + j.payAmount, 0);
  const totalPending = monthJobs.filter(j => j.status === "pending")
    .reduce((sum, j) => sum + j.payAmount, 0);

  return { totalPaid, totalPending, total: totalPaid + totalPending };
}
```

### Anti-Patterns to Avoid
- **Client-side date math with raw Date objects:** Always use date-fns -- timezone bugs are subtle and painful. Never do `new Date(year, month, 0).getDate()` for days-in-month.
- **Storing VND as float/decimal:** VND has no fractional units. Use integer column (bigint if totals could exceed 2B VND). Never use numeric/decimal.
- **Month navigation via client state only:** Use URL search params (`?month=3&year=2026`) so month navigation is bookmarkable and works with browser back/forward.
- **Fetching all jobs for year on calendar page load:** Only fetch the visible month's jobs. Load year data separately for yearly charts (lazy or on-demand).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Calendar date calculations | Manual month/week/day math | date-fns `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `startOfWeek` | Leap years, month boundaries, week padding are deceptively tricky |
| Currency formatting | Regex-based number formatting | `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` | Handles dot separators, dong symbol, edge cases natively |
| Chart rendering | SVG/Canvas chart from scratch | Recharts `<BarChart>`, `<LineChart>` | Axes, tooltips, responsiveness, animations are massive effort |
| Form validation | Manual field checks | zod schemas + react-hook-form (existing pattern) | Already established in project; consistency matters |
| Slide-up form | Custom animation logic | Existing Sheet component (base-ui Dialog) | Already built and used for beauty product forms |

**Key insight:** The only "new" UI pattern here is the calendar grid itself, which is just a CSS grid with date-fns math. Everything else (forms, sheets, CRUD actions, auth gates) reuses existing project patterns.

## Common Pitfalls

### Pitfall 1: Integer Overflow with VND Amounts
**What goes wrong:** VND amounts are large (a single job might be 5,000,000-50,000,000 VND). Yearly totals can exceed JavaScript's safe integer range or PostgreSQL integer limits.
**Why it happens:** PostgreSQL `integer` maxes at ~2.1 billion. A busy freelancer earning 50M VND/month = 600M/year, which fits integer. But if the schema ever stores cumulative values, it could overflow.
**How to avoid:** Use `integer` for individual job pay (max ~2.1B VND per job is safe). For aggregated stats, compute in-query with `sum()` which returns `bigint` in PostgreSQL. In TypeScript, the values come back as strings from bigint columns -- parse with `Number()` since yearly totals won't exceed Number.MAX_SAFE_INTEGER.
**Warning signs:** Aggregated totals showing as strings instead of numbers.

### Pitfall 2: Calendar Month Boundary Off-by-One
**What goes wrong:** Displaying wrong days at month start/end, especially when padding weeks.
**Why it happens:** JavaScript months are 0-indexed but display is 1-indexed. Mixing `new Date(2026, 2)` (March) with user-facing "month 3" causes confusion.
**How to avoid:** Use date-fns throughout -- it handles month indexing consistently. Pass `Date` objects internally, format to strings only for display. Use `isSameMonth()` to gray out padding days.
**Warning signs:** February showing 30 days, or first day of month appearing on wrong weekday.

### Pitfall 3: Time Zone Issues with Date Filtering
**What goes wrong:** Jobs on the last day of the month appear in the next month's query, or jobs disappear near midnight.
**Why it happens:** Storing timestamps with timezone info, then querying by date range using server's timezone vs user's timezone.
**How to avoid:** Store job dates as `date` type (not `timestamp`) in PostgreSQL since jobs are single-day. Store start_time and end_time as `time` type or as text strings ("09:00", "17:00"). Query jobs by date equality, not timestamp ranges.
**Warning signs:** Jobs appearing on wrong dates in calendar.

### Pitfall 4: Recharts Bundle Size
**What goes wrong:** Recharts adds significant bundle size (~300KB unparsed) even for simple charts.
**Why it happens:** Importing top-level `import { BarChart } from 'recharts'` pulls in everything.
**How to avoid:** Use specific imports. Recharts 3.x has improved tree-shaking. Wrap chart components in dynamic imports with `next/dynamic` and `ssr: false` since charts are client-only and below the fold.
**Warning signs:** Large initial JS bundle, slow page load.

### Pitfall 5: Form Sheet Not Resetting on Day Change
**What goes wrong:** User taps day 1, opens form, taps day 15 -- form still shows day 1's date.
**Why it happens:** React state not resetting when the "selected day" prop changes.
**How to avoid:** Use `key={selectedDate.toISOString()}` on the Sheet/form to force remount on date change. Or use react-hook-form's `reset()` in a `useEffect` watching the selected date.
**Warning signs:** Form showing stale date, editing wrong day's job.

## Code Examples

### VND Currency Formatting
```typescript
// src/lib/schedule/format-vnd.ts
const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

// Full format: "5.000.000 d"
export function formatVND(amount: number): string {
  return vndFormatter.format(amount);
}

// Compact format for calendar cells: "5M" or "500K"
export function formatVNDCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)}M`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}K`;
  }
  return String(amount);
}
```

### Database Schema (Drizzle)
```typescript
// src/lib/db/schema.ts - new table
import { date, integer, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

export const scheduleJobs = pgTable("schedule_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobDate: date("job_date").notNull(),          // DATE type, no timezone issues
  clientName: text("client_name").notNull(),
  location: text("location").notNull(),
  startTime: text("start_time").notNull(),      // "09:00" format - text for simplicity
  endTime: text("end_time").notNull(),           // "17:00" format
  payAmount: integer("pay_amount").notNull(),    // VND, no decimals
  status: text("status").notNull().default("pending"), // "paid" | "pending"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Recharts Income Bar Chart
```typescript
// src/components/schedule/income-chart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatVND } from "@/lib/schedule/format-vnd";

interface ChartData {
  label: string;
  paid: number;
  pending: number;
}

export function IncomeChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => formatVNDCompact(v)} />
        <Tooltip formatter={(value: number) => formatVND(value)} />
        <Bar dataKey="paid" stackId="income" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pending" stackId="income" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### Server Action Pattern (following beauty-products.ts)
```typescript
// src/actions/schedule.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { scheduleJobs } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { z } from "zod";

const createJobSchema = z.object({
  jobDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),  // "2026-03-20"
  clientName: z.string().min(1).max(100),
  location: z.string().min(1).max(200),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),       // "09:00"
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  payAmount: z.number().int().min(0),
  status: z.enum(["paid", "pending"]),
  notes: z.string().max(1000).optional().nullable(),
});

export async function createJob(data: z.infer<typeof createJobSchema>) {
  const parsed = createJobSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [created] = await db.insert(scheduleJobs)
    .values(parsed.data)
    .returning();

  return created;
}

export async function getJobsForMonth(year: number, month: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`; // PostgreSQL DATE handles overflow

  return db.select()
    .from(scheduleJobs)
    .where(and(
      gte(scheduleJobs.jobDate, startDate),
      lte(scheduleJobs.jobDate, endDate),
    ))
    .orderBy(scheduleJobs.jobDate, scheduleJobs.startTime);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Recharts 2.x (React 18 only) | Recharts 3.x (React 19 support) | 2025 | Can now use with React 19 without workarounds |
| moment.js for date math | date-fns 4.x (ESM-first, tree-shakeable) | 2024 | Smaller bundles, no mutable state |
| Custom number formatting | Intl.NumberFormat (widely supported) | Stable since 2020 | Zero-dependency, locale-aware |

**Deprecated/outdated:**
- moment.js: Officially in maintenance mode. Use date-fns instead.
- Recharts 2.x: Requires react-is override for React 19. Use 3.x.

## Open Questions

1. **Week start day (Monday vs Sunday)**
   - What we know: Vietnam typically uses Monday as week start
   - What's unclear: User preference not explicitly stated
   - Recommendation: Default to Monday (`weekStartsOn: 1` in date-fns). Easy to change.

2. **Stats time period selector UX**
   - What we know: Need daily/weekly/monthly/yearly views
   - What's unclear: Whether all 4 periods show simultaneously as cards, or there's a tab/toggle
   - Recommendation: Show current month total + current year total as always-visible summary cards. Monthly/yearly charts toggle between the two via a simple segmented control.

3. **Month navigation approach**
   - What we know: Need to move between months
   - What's unclear: Arrow buttons vs swipe
   - Recommendation: Arrow buttons (chevron left/right) flanking the month/year title. Simpler to implement, works on desktop and mobile. Touch swipe can be added later as enhancement.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npx vitest run src/__tests__/schedule/ --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map

Note: Phase 5 adds NEW requirements not yet in REQUIREMENTS.md. Using SCHED-XX IDs.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCHED-01 | Job CRUD (create, read, update, delete) with all fields | unit | `npx vitest run src/__tests__/schedule/schedule-actions.test.ts -x` | No - Wave 0 |
| SCHED-02 | Month calendar grid renders correct days | unit | `npx vitest run src/__tests__/schedule/calendar-grid.test.tsx -x` | No - Wave 0 |
| SCHED-03 | VND formatting (dots, dong symbol, compact) | unit | `npx vitest run src/__tests__/schedule/format-vnd.test.ts -x` | No - Wave 0 |
| SCHED-04 | Income stats aggregation (paid vs pending, time periods) | unit | `npx vitest run src/__tests__/schedule/stats.test.ts -x` | No - Wave 0 |
| SCHED-05 | Auth gate on all schedule actions | unit | `npx vitest run src/__tests__/schedule/schedule-actions.test.ts -x` | No - Wave 0 |
| SCHED-06 | Paid/pending status color coding | unit | `npx vitest run src/__tests__/schedule/calendar-grid.test.tsx -x` | No - Wave 0 |
| SCHED-07 | Route protection for /schedule | unit | `npx vitest run src/__tests__/middleware/route-protection.test.ts -x` | Exists (needs update) |

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/schedule/ --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/schedule/schedule-actions.test.ts` -- covers SCHED-01, SCHED-05
- [ ] `src/__tests__/schedule/calendar-grid.test.tsx` -- covers SCHED-02, SCHED-06
- [ ] `src/__tests__/schedule/format-vnd.test.ts` -- covers SCHED-03
- [ ] `src/__tests__/schedule/stats.test.ts` -- covers SCHED-04
- [ ] Update `src/__tests__/middleware/route-protection.test.ts` -- add /schedule route

## Sources

### Primary (HIGH confidence)
- npm registry -- verified recharts 3.8.0 peerDependencies include react ^19.0.0
- npm registry -- verified date-fns 4.1.0 (no peer dependencies)
- MDN Intl.NumberFormat docs -- vi-VN locale with VND currency produces dot-separated formatting
- Existing project codebase -- beauty-products.ts, schema.ts, middleware.ts patterns

### Secondary (MEDIUM confidence)
- [recharts/recharts releases](https://github.com/recharts/recharts/releases) -- React 19 support confirmed in 3.x
- [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) -- VND formatting reference
- [Freeformatter Vietnam standards](https://www.freeformatter.com/vietnam-standards-code-snippets.html) -- Dot separator as Vietnamese grouping character

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- recharts 3.x React 19 peer dep verified via npm registry, date-fns is dependency-free
- Architecture: HIGH -- follows established project patterns (Server Actions, Drizzle, react-hook-form, Sheet)
- Pitfalls: HIGH -- date/timezone and VND formatting issues are well-documented; calendar math verified with date-fns API
- Calendar approach: HIGH -- custom grid is straightforward CSS grid + date-fns; no complex scheduling library needed

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain, no fast-moving APIs)
