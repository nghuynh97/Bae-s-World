# Phase 1: Fake Data, Toast Colors, Schedule UI, Portfolio Form Fix - Research

**Researched:** 2026-03-24
**Domain:** Seed data scripting, Sonner toast styling, Next.js UI components, Zod form validation
**Confidence:** HIGH

## Summary

This phase covers four independent concerns in an existing Next.js 16 + Supabase + Drizzle ORM webapp. The codebase already has partial seed scripts (`seed-portfolio.ts`, `seed-beauty.ts`, `seed-invite-codes.ts`) that seed categories and invite codes but not actual content data (no portfolio items, beauty products, or schedule jobs). The new unified seed script must delete all existing data and insert realistic fake data across all tables.

Toast styling uses Sonner with a single `cn-toast` class currently applied to all toast types. Sonner's `toastOptions.classNames` supports per-type class names (`success`, `error`, `warning`) which map directly to the requirement for colored backgrounds.

The schedule page already fetches `monthStats` (which includes `jobCount`) and renders two `StatCard` components. Adding a "This Week" job count card requires a new server action to count jobs in the current ISO week, plus a third `StatCard` in the existing grid. The portfolio form fix is a one-line Zod schema change removing `.min(1)` from the title field.

**Primary recommendation:** Implement as four independent work streams: (1) seed script, (2) toast colors via Sonner classNames, (3) schedule stats card addition, (4) portfolio schema fix.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- CLI script (`npm run seed`) that connects to Supabase and resets all table data, then inserts fake data
- Admin button visible only to boyfriend's account (not Funnghy) that triggers the same reset + seed
- No role column exists in profiles -- identify boyfriend by display_name or email from invite_codes table
- Portfolio: 20+ items using cute cat meme images
- Beauty: Seed products with categories and a couple of routines with steps
- Schedule: 3 months of job data (15-20 jobs) spread across months for meaningful chart/stats data
- Script resets ALL tables before inserting (clean slate approach)
- Make title and description fields optional (not required) in the admin portfolio add form
- Colored backgrounds for each toast type (success=light green, error=light red, warning=light amber)
- Keep existing Sonner setup (top-center, 3000ms duration)
- Colors should be soft/pastel to match the feminine design system
- Add job count statistics alongside existing income stats (not replacing them)
- Add a third stat card: "This Week: X jobs" with upcoming job count
- Card style matches existing StatCard pattern (white bg, shadow-sm, ring-1)

### Claude's Discretion
- Exact shade of pastel green/red/amber for toast backgrounds (should complement rose gold accent)
- Seed data content: specific cat image URLs, Vietnamese client names, beauty product names
- Whether job count row uses same StatCard component or a simpler badge/pill style
- How to source cat meme images for portfolio seed (placeholder URLs vs bundled assets)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| drizzle-orm | 0.45.x | Database queries for seed script | Already used for all DB operations |
| postgres | 3.4.x | PostgreSQL client for direct connection | Already used in `src/lib/db/index.ts` |
| zod | 4.3.x | Form validation schema | Already used for all form validation |
| sonner | 2.0.x | Toast notifications | Already installed and configured |
| date-fns | 4.1.x | Date arithmetic for week calculations | Already installed |
| @supabase/supabase-js | 2.99.x | Admin client for seed operations | Already installed, admin client exists |

### Supporting (no new dependencies needed)
This phase requires zero new npm packages. Everything is achievable with the existing stack.

## Architecture Patterns

### Seed Script Structure
```
scripts/
  seed-all.ts          # NEW: unified reset-and-seed script
```

The script should follow the existing pattern from `seed-portfolio.ts` and `seed-beauty.ts`:
- Import `db` from `../src/lib/db`
- Import schema tables from `../src/lib/db/schema`
- Use `db.delete(table)` for reset, `db.insert(table).values(...)` for seeding
- Run via: `node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/seed-all.ts`

### Table Deletion Order (foreign key constraints)
Based on the schema's foreign key references, tables must be deleted in this order:
1. `routineSteps` (references `routines` and `beautyProducts`)
2. `portfolioItems` (references `categories` and `images`)
3. `beautyProducts` (references `beautyCategories` and `images`)
4. `imageVariants` (references `images`)
5. `images` (no dependents after above cleared)
6. `routines` (no dependents after routineSteps cleared)
7. `categories` (no dependents after portfolioItems cleared)
8. `beautyCategories` (no dependents after beautyProducts cleared)
9. `scheduleJobs` (standalone, no FK dependencies)
10. `aboutContent` (standalone)

Do NOT delete `inviteCodes` or `profiles` -- these are auth-related and should be preserved.

### Insertion Order (reverse of deletion)
1. `categories` (portfolio categories)
2. `beautyCategories`
3. `images` + `imageVariants` (for portfolio items)
4. `portfolioItems`
5. `images` + `imageVariants` (for beauty products)
6. `beautyProducts`
7. `routines`
8. `routineSteps`
9. `scheduleJobs`
10. `aboutContent`

### Portfolio Image Seeding Strategy
The existing image pipeline uses Sharp to process uploads into 4 WebP variants (400w, 800w, 1200w, 1920w) stored in `public-images` bucket. For seed data, there are two approaches:

**Recommended approach: Use placeholder image URLs directly**
- Use free cat image APIs (e.g., `https://placekitten.com/WIDTH/HEIGHT` or `https://cataas.com/cat`) or hardcoded URLs to publicly available cat meme images
- Create `images` table entries with realistic dimensions
- Create `imageVariants` entries where `storagePath` points to a known path pattern
- Upload placeholder images to Supabase Storage via the admin client during seeding

**Why this works:** The seed script has access to `SUPABASE_SERVICE_ROLE_KEY` via `.env.local`, and the admin client (`createAdminClient()`) can upload files to storage buckets. Download cat images from URLs, then upload them through the existing pipeline or directly to storage.

**Simpler alternative:** Skip actual image files in storage. Create `images` and `imageVariants` records that point to non-existent paths. The gallery will show broken images but the data structure will be complete. This is acceptable for dev/demo purposes.

### Admin Seed Button -- Boyfriend Identification
The `inviteCodes` table has `assignedName: 'Boyfriend'` for code `BF0001`. The `profiles` table has `displayName` which was set during registration. The `inviteCodes.usedByAuthId` links to the auth user ID.

To identify the boyfriend:
```typescript
// In a server action:
const boyfriendCode = await db.select().from(inviteCodes)
  .where(eq(inviteCodes.assignedName, 'Boyfriend'))
  .limit(1);

// Compare with current user's auth ID
const isBoyfriend = boyfriendCode[0]?.usedByAuthId === user.id;
```

### Admin Seed Button -- Server Action Pattern
Create a new server action `resetAndSeed()` in `src/actions/seed.ts` that:
1. Verifies the caller is the boyfriend (via invite_codes lookup)
2. Performs the same delete-then-insert logic as the CLI script
3. Calls `revalidatePath('/')` to refresh all cached pages
4. Returns success/failure

The admin page (`src/app/(private)/admin/page.tsx`) conditionally renders the button based on boyfriend check.

### Sonner Toast Colored Backgrounds
The current Sonner configuration uses `toastOptions.classNames` with only a generic `toast` class. Sonner supports per-type class names:

```typescript
toastOptions={{
  classNames: {
    toast: 'cn-toast',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
  },
}}
```

**Recommended pastel colors** (complementing rose gold accent `#e8b4b8` and lavender dominant `#f8f6ff`):
- Success: `bg-emerald-50` (#ecfdf5) with `border-emerald-200` and `text-emerald-800`
- Error: `bg-red-50` (#fef2f2) with `border-red-200` and `text-red-800`
- Warning: `bg-amber-50` (#fffbeb) with `border-amber-200` and `text-amber-800`

These are soft pastels that won't clash with the feminine design system.

**Important Sonner detail:** The `style` prop on the Toaster sets CSS variables for `--normal-bg`, `--normal-text`, `--normal-border`. For typed toasts (success/error/warning), Sonner applies `data-type` attributes. The `classNames` object per type will override these defaults with Tailwind classes. The Tailwind classes need `!important` or higher specificity if Sonner's inline styles conflict -- use `!bg-emerald-50` syntax or override via the Sonner CSS custom properties `--success-bg`, `--error-bg`, etc.

### StatCard for Job Count
The existing `StatsHeader` renders two `StatCard` components in a `sm:grid-cols-2` grid. Adding a third card requires changing to `sm:grid-cols-3` or keeping the existing horizontal scroll on mobile.

The `StatCard` currently expects a `StatGroup` with `totalPaid`, `totalPending`, and `total`. For job count, a simpler card is needed that shows just a number. Options:
1. Create a new `JobCountCard` component with similar styling
2. Extend `StatCard` to accept a different data shape

**Recommendation:** Create a lightweight `JobCountCard` component that matches the visual style (white bg, shadow-sm, ring-1 ring-black/5) but displays job count instead of income breakdown.

### Week Calculation for Job Count
Use `date-fns` (already installed) for ISO week calculation:
```typescript
import { startOfWeek, endOfWeek, format } from 'date-fns';

const now = new Date();
const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
```
The `weekStartsOn: 1` matches the existing Monday-start convention (from Phase 05 decisions).

A new server action `getWeekJobCount(year, month)` should be added to `src/actions/schedule.ts` that returns the count of jobs in the current week.

### Portfolio Form Fix
The current upload schema in `portfolio-admin-client.tsx` line 72:
```typescript
title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
```

Change to:
```typescript
title: z.string().max(100, 'Title too long').optional().default(''),
```

Also update the server-side `createPortfolioItemSchema` in `src/actions/portfolio.ts` line 161:
```typescript
title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
```

Change to:
```typescript
title: z.string().max(100, 'Title too long').optional().default(''),
```

And the DB schema has `title: text('title').notNull()` -- since we want to allow empty strings (not NULL), the DB constraint is fine. Just remove the Zod `.min(1)` validation.

### Anti-Patterns to Avoid
- **Don't seed via API routes or the browser:** The seed script should use direct DB access via Drizzle, not go through Next.js server actions (except for the admin button which uses server actions)
- **Don't hardcode UUIDs in seed data:** Use `crypto.randomUUID()` or let the DB generate them via `.defaultRandom()`
- **Don't forget to clean Supabase Storage:** When resetting, also remove files from `public-images` and `private-images` buckets
- **Don't modify the `profiles` or `inviteCodes` tables:** These contain auth-critical data

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date/week calculations | Manual date math | `date-fns` startOfWeek/endOfWeek | Already installed, handles edge cases |
| Toast type styling | Custom toast component | Sonner `toastOptions.classNames` per type | Built-in Sonner feature |
| UUID generation | Custom ID generator | DB `defaultRandom()` or `crypto.randomUUID()` | Standard, collision-free |
| VND formatting | Custom number formatter | Existing `formatVND` utility | Already implemented at `src/lib/schedule/format-vnd.ts` |

## Common Pitfalls

### Pitfall 1: Foreign Key Cascade Issues During Reset
**What goes wrong:** Deleting tables in wrong order causes foreign key violation errors
**Why it happens:** `portfolioItems` references `images` and `categories`; `beautyProducts` references `images` and `beautyCategories`; `routineSteps` references `routines` and `beautyProducts`
**How to avoid:** Delete in strict reverse-dependency order as documented above. Delete child tables first.
**Warning signs:** `violates foreign key constraint` errors during seed reset

### Pitfall 2: Sonner Inline Styles Override Tailwind Classes
**What goes wrong:** Toast backgrounds don't change despite adding Tailwind classes
**Why it happens:** Sonner sets `background` via inline `style` attribute which has higher specificity than Tailwind classes
**How to avoid:** Use Sonner's CSS custom properties (`--success-bg`, `--success-border`, `--success-text`) in the style prop, OR use Tailwind's `!important` modifier (e.g., `!bg-emerald-50`), OR override via `[data-sonner-toast][data-type="success"]` CSS selector in globals.css
**Warning signs:** Toast appears with default white/gray background despite class additions

### Pitfall 3: Storage Bucket Cleanup
**What goes wrong:** After resetting DB, orphaned files remain in Supabase Storage buckets
**Why it happens:** Deleting `images` rows doesn't automatically remove files from storage
**How to avoid:** Before deleting `images` rows, list and remove all files from `public-images/portfolio/` and `private-images/beauty/` via the admin client
**Warning signs:** Storage usage grows over repeated seeds; new seed images conflict with old paths

### Pitfall 4: Missing Auth for Admin Seed Button
**What goes wrong:** Non-boyfriend user can trigger data reset
**Why it happens:** Server action doesn't verify caller identity
**How to avoid:** Always check `inviteCodes.usedByAuthId === user.id` where `assignedName === 'Boyfriend'` before executing seed
**Warning signs:** Any logged-in user can reset all data

### Pitfall 5: Portfolio Title NotNull DB Constraint
**What goes wrong:** Saving portfolio item with empty title causes DB error
**Why it happens:** The `portfolioItems.title` column is `text('title').notNull()` in schema
**How to avoid:** The Zod schema should default to empty string `''`, not to `null` or `undefined`. The `.notNull()` constraint allows empty strings, just not NULL.
**Warning signs:** `null value in column "title" of relation "portfolio_items" violates not-null constraint`

## Code Examples

### Seed Script -- Delete Order
```typescript
// Source: schema.ts foreign key analysis
import { db } from '../src/lib/db';
import * as schema from '../src/lib/db/schema';

async function resetAllData() {
  // Delete in reverse-dependency order
  await db.delete(schema.routineSteps);
  await db.delete(schema.portfolioItems);
  await db.delete(schema.beautyProducts);
  await db.delete(schema.imageVariants);
  await db.delete(schema.images);
  await db.delete(schema.routines);
  await db.delete(schema.categories);
  await db.delete(schema.beautyCategories);
  await db.delete(schema.scheduleJobs);
  await db.delete(schema.aboutContent);
}
```

### Sonner Per-Type Styling
```typescript
// Source: Sonner docs -- toastOptions.classNames supports per-type keys
<Sonner
  toastOptions={{
    classNames: {
      toast: 'cn-toast',
      success: '!bg-emerald-50 !border-emerald-200 !text-emerald-800',
      error: '!bg-red-50 !border-red-200 !text-red-800',
      warning: '!bg-amber-50 !border-amber-200 !text-amber-800',
    },
  }}
/>
```

### Week Job Count Query
```typescript
// Source: existing schedule.ts pattern + date-fns
import { startOfWeek, endOfWeek, format } from 'date-fns';

export async function getWeekJobCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const now = new Date();
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const jobs = await db.select().from(scheduleJobs)
    .where(and(
      gte(scheduleJobs.jobDate, weekStart),
      lte(scheduleJobs.jobDate, weekEnd),
    ));

  return jobs.length;
}
```

### Portfolio Schema Fix
```typescript
// In portfolio-admin-client.tsx -- change line 72:
// FROM:
title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
// TO:
title: z.string().max(100, 'Title too long').optional().default(''),

// In src/actions/portfolio.ts -- change line 161:
// FROM:
title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
// TO:
title: z.string().max(100, 'Title too long').optional().default(''),
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate seed scripts per domain | Single unified seed-all script | This phase | One command resets everything |
| Default Sonner styling (white bg) | Per-type colored backgrounds | This phase | Visual feedback clarity |
| Income-only stats | Income + job count stats | This phase | Better schedule overview |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.x |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
No formal requirement IDs for this phase (post-v1.0 enhancement). Key behaviors to validate:

| Behavior | Test Type | Automated Command | Notes |
|----------|-----------|-------------------|-------|
| Seed script runs without FK errors | smoke | `npm run seed` (manual) | DB-dependent, requires env |
| Toast success shows green bg | manual-only | N/A | Visual styling, needs browser |
| Toast error shows red bg | manual-only | N/A | Visual styling, needs browser |
| Week job count returns correct number | unit | `npx vitest run -t "week job count"` | Mock DB |
| Portfolio form allows empty title | unit | `npx vitest run -t "portfolio title optional"` | Zod schema test |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + manual toast color verification

### Wave 0 Gaps
- [ ] Zod schema unit test for optional title could be added but is low value for a single-line change
- Existing test infrastructure covers basic needs; no new test files required for this phase

## Open Questions

1. **Cat meme image sourcing**
   - What we know: Need 20+ cat meme images for portfolio seed
   - What's unclear: Whether to download and upload to Supabase Storage (realistic but slower) or use placeholder URLs (faster but images won't render correctly in the app since they expect Storage paths)
   - Recommendation: Download from a free source (e.g., Lorem Picsum, Unsplash cat collection, or cataas.com) and upload to Supabase Storage via the admin client during seeding. This makes the seed data fully functional.

2. **Sonner CSS specificity**
   - What we know: Sonner uses inline styles AND CSS custom properties for backgrounds
   - What's unclear: Whether Tailwind classes alone will override Sonner's inline styles
   - Recommendation: Test with `!important` Tailwind modifiers first. If that fails, use CSS custom properties in globals.css targeting `[data-sonner-toast][data-type="success"]` etc.

## Sources

### Primary (HIGH confidence)
- `src/components/ui/sonner.tsx` -- current Sonner configuration with classNames API
- `src/lib/db/schema.ts` -- all table schemas and FK relationships
- `src/components/schedule/stats-header.tsx` -- existing StatCard pattern
- `src/app/(private)/schedule/page.tsx` -- current schedule page data flow
- `src/app/(private)/admin/portfolio/portfolio-admin-client.tsx` -- portfolio form with Zod schema
- `src/actions/portfolio.ts` -- server-side portfolio validation
- `src/actions/schedule.ts` -- existing schedule server actions
- `scripts/seed-portfolio.ts`, `scripts/seed-beauty.ts` -- existing seed script patterns
- `package.json` -- all installed dependencies (no new ones needed)

### Secondary (MEDIUM confidence)
- Sonner classNames API for per-type styling -- verified via existing code using `classNames.toast`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed, no new deps
- Architecture: HIGH -- patterns derived directly from existing codebase
- Pitfalls: HIGH -- FK ordering and Sonner specificity verified from schema and code

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable codebase, no framework migrations planned)
