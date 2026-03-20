# Phase 6: Refactor & UI/UX Optimization - Research

**Researched:** 2026-03-20
**Domain:** Code formatting, component consistency, data revalidation, visual polish
**Confidence:** HIGH

## Summary

Phase 6 is a non-feature phase focused on code quality and visual polish across four pillars: (1) Prettier setup for consistent formatting, (2) replacing native HTML form elements with shadcn components, (3) fixing stale UI after CRUD operations by migrating from client-side `router.refresh()` to server-side `revalidatePath()`, and (4) UX spacing/color/contrast improvements.

The codebase scan reveals concrete targets: 3 native `<select>` elements, 5 native `<textarea>` elements, 1 native `<input>` (search field), and 5 files using `router.refresh()` that should be replaced with `revalidatePath()` calls in server actions. None of the 9 server action files currently use `revalidatePath()`.

**Primary recommendation:** Execute in this order -- (1) shadcn component replacements + revalidatePath migration, (2) UX spacing/color fixes, (3) Prettier setup and full-codebase format last (to avoid noisy diffs during component work).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Prettier: 2 spaces, semicolons yes, single quotes, trailing commas all, print width 80
- `.prettierrc` config file + `.prettierignore` (node_modules, .next, dist)
- npm scripts: `"format": "prettier --write ."` and `"format:check": "prettier --check ."`
- `.vscode/settings.json` with formatOnSave and esbenp.prettier-vscode
- Run `npm run format` on entire codebase after setup
- Replace ALL native HTML form elements with shadcn equivalents -- no exceptions
- Install shadcn Select and Textarea components
- Keep hidden `<input>` from react-dropzone (file inputs are special)
- Use `revalidatePath()` inside Server Actions (NOT `router.refresh()` on client)
- For optimistic inline actions, update local state immediately and let `revalidatePath()` sync in background
- Pattern: Server Action mutation -> `revalidatePath('/path')` -> Next.js re-renders seamlessly
- For forms that navigate after submit, use `redirect()` after `revalidatePath()`
- Increase form field gaps, add padding in form containers
- Improve calendar day cell visual treatment
- Stronger shadow/ring on cards against lavender background
- Audit components for consistent design system token usage
- Apply consistent spacing scale (8, 16, 24, 32 gap values)

### Claude's Discretion
- Exact spacing values per component (use design system scale)
- Exact shadow/ring values for card contrast improvement
- Calendar day cell visual improvements (border, background, dot size)
- Whether to add shadcn Badge or Switch components if useful
- Order of Prettier formatting vs component changes (format last to avoid noisy diffs)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| prettier | 3.8.1 | Code formatting | Industry standard, verified via npm registry |
| prettier-plugin-tailwindcss | 0.7.2 | Tailwind class sorting | Official Tailwind Labs plugin, auto-sorts classes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn Select | v4 (base-nova) | Dropdown replacement for native `<select>` | All category/type select fields |
| shadcn Textarea | v4 (base-nova) | Textarea replacement for native `<textarea>` | All notes/bio/description fields |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| prettier-plugin-tailwindcss | Manual class ordering | Plugin is zero-config with Tailwind v4, no reason to skip |
| shadcn Select | Native `<select>` with custom CSS | shadcn matches design system automatically, accessible |

**Installation:**
```bash
npm install -D prettier prettier-plugin-tailwindcss
npx shadcn@latest add select textarea
```

**Version verification:** prettier 3.8.1 and prettier-plugin-tailwindcss 0.7.2 confirmed current via npm registry on 2026-03-20.

## Architecture Patterns

### Pattern 1: Prettier Configuration for Tailwind v4

**What:** Prettier with the tailwindcss plugin requires a `tailwindStylesheet` option when using Tailwind v4 (CSS-based config instead of JS-based config).

**When to use:** This project uses Tailwind v4 with CSS-based configuration in `src/app/globals.css`.

**Config (.prettierrc):**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css"
}
```

**Confidence:** HIGH -- `tailwindStylesheet` is documented on the [official plugin README](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) as required for Tailwind v4.

### Pattern 2: shadcn Select with react-hook-form (Controller pattern)

**What:** shadcn Select is NOT a native `<select>` element -- it is a custom component built on Radix primitives. It cannot use `register()` from react-hook-form because there is no underlying native input to register. You MUST use `Controller` (or the shadcn `FormField` wrapper).

**Critical finding:** ALL forms in this codebase currently use `register()` for their select fields. Migrating to shadcn Select requires switching those specific fields to `Controller`.

**Example:**
```typescript
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Inside form component:
<Controller
  control={control}
  name="categoryId"
  render={({ field }) => (
    <Select onValueChange={field.onChange} value={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>
```

**Confidence:** HIGH -- this is the standard integration documented on [shadcn forms page](https://ui.shadcn.com/docs/forms/react-hook-form) and verified via the codebase scan showing all selects use `register()`.

### Pattern 3: shadcn Textarea with register()

**What:** Unlike Select, shadcn Textarea IS a native `<textarea>` wrapper (similar to how shadcn Input wraps `<input>`). It works directly with `register()`.

**Example:**
```typescript
import { Textarea } from '@/components/ui/textarea';

// Direct replacement -- register() still works:
<Textarea
  id="product-notes"
  placeholder="Notes about this product..."
  {...register('notes')}
/>
```

**Confidence:** HIGH -- shadcn Textarea is a thin wrapper around native `<textarea>`, same pattern as existing Input component.

### Pattern 4: revalidatePath in Server Actions (replacing router.refresh)

**What:** Move data revalidation from client-side `router.refresh()` to server-side `revalidatePath()` inside each mutating Server Action.

**Current state (BAD):**
```typescript
// Client component calls server action, then refreshes manually
const result = await createJob(data);
router.refresh(); // Causes visible page flash
```

**Target state (GOOD):**
```typescript
// Server action (schedule.ts)
import { revalidatePath } from 'next/cache';

export async function createJob(data) {
  // ... validation and DB insert ...
  revalidatePath('/schedule');
  return created;
}

// Client component -- no router.refresh() needed
const result = await createJob(data);
// UI updates seamlessly via Next.js server component re-render
```

**Important:** `redirect()` must be called OUTSIDE of try/catch blocks because it throws a Next.js internal error. Pattern:
```typescript
// In server action:
revalidatePath('/beauty');
redirect('/beauty'); // After revalidation, NOT inside try/catch
```

**Confidence:** HIGH -- documented in [Next.js official docs](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).

### Anti-Patterns to Avoid
- **Using `router.refresh()` for data updates:** Causes visible page reload flash; use `revalidatePath()` in server actions instead
- **Using `register()` with shadcn Select:** Will not work because Select is not a native element; must use Controller
- **Running Prettier before component changes:** Creates massive noisy diffs that obscure real changes; format last
- **Calling `redirect()` inside try/catch:** Next.js redirect throws internally; it will be caught and swallowed

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dropdown menus | Custom styled `<select>` | shadcn Select | Accessible, design-system aware, keyboard navigable |
| Multi-line text input | Styled native `<textarea>` | shadcn Textarea | Consistent with design system, proper focus ring styling |
| Code formatting | Manual style enforcement | Prettier + plugin | Automated, consistent, no human error |
| Tailwind class ordering | Manual ordering conventions | prettier-plugin-tailwindcss | Automated on save, enforces official ordering |
| Cache invalidation | Client-side router.refresh() | revalidatePath() | Server-side, no page flash, official Next.js pattern |

## Common Pitfalls

### Pitfall 1: shadcn Select + register() Incompatibility
**What goes wrong:** Replacing `<select {...register("field")}>` with `<Select {...register("field")}>` silently fails -- the form value never updates.
**Why it happens:** shadcn Select renders custom DOM, not a native `<select>`. `register()` attaches event listeners to native elements.
**How to avoid:** Always use `Controller` from react-hook-form for shadcn Select fields.
**Warning signs:** Form submits with empty/undefined values for select fields.

### Pitfall 2: redirect() Inside try/catch
**What goes wrong:** `redirect()` never executes because Next.js throws a special error internally.
**Why it happens:** `redirect()` uses throw-based control flow in Next.js App Router.
**How to avoid:** Call `redirect()` outside of try/catch blocks, after `revalidatePath()`.
**Warning signs:** Form submits successfully but user stays on the same page.

### Pitfall 3: Prettier Plugin Order with Tailwind v4
**What goes wrong:** Class sorting does not work, or Prettier errors about missing config.
**Why it happens:** Tailwind v4 uses CSS-based config, and the plugin needs `tailwindStylesheet` to find it.
**How to avoid:** Always set `"tailwindStylesheet": "./src/app/globals.css"` in `.prettierrc`.
**Warning signs:** Tailwind classes not being reordered on format.

### Pitfall 4: revalidatePath Invalidates ALL Client-side Routes
**What goes wrong:** After calling `revalidatePath('/beauty')`, navigating to ANY previously visited route causes a refetch.
**Why it happens:** Current Next.js behavior invalidates the entire client-side router cache (not just the specified path). This is documented as temporary behavior.
**How to avoid:** This is acceptable behavior -- it ensures fresh data everywhere. Do not try to work around it.
**Warning signs:** Slightly slower navigation after mutations (expected, not a bug).

### Pitfall 5: Formatting Before Component Changes
**What goes wrong:** Git diffs become unreadable, code review impossible, merge conflicts likely.
**Why it happens:** Prettier reformats every file, making it impossible to distinguish formatting changes from real logic changes.
**How to avoid:** Do ALL component and logic changes first, run Prettier format as the very last step.
**Warning signs:** PR with thousands of changed lines that are mostly whitespace.

## Codebase Scan: Concrete Targets

### Native `<select>` Elements (3 files, replace with shadcn Select + Controller)
| File | Line | Form Field |
|------|------|------------|
| `src/components/beauty/product-form.tsx` | 212 | categoryId |
| `src/app/(private)/admin/portfolio/new/page.tsx` | 116 | categoryId |
| `src/app/(private)/admin/portfolio/[id]/edit/edit-form.tsx` | 102 | categoryId |

### Native `<textarea>` Elements (5 files, replace with shadcn Textarea)
| File | Line | Form Field |
|------|------|------------|
| `src/components/beauty/product-form.tsx` | 242 | notes |
| `src/components/schedule/job-form.tsx` | 313 | notes |
| `src/app/(private)/admin/about/page.tsx` | 124 | bio |
| `src/app/(private)/admin/portfolio/new/page.tsx` | 101 | description |
| `src/app/(private)/admin/portfolio/[id]/edit/edit-form.tsx` | 87 | description |

### Native `<input>` Elements to Replace (1 file)
| File | Line | Type |
|------|------|------|
| `src/components/beauty/routine-step-search.tsx` | 102 | text search input |

**Keep as-is:** `src/components/upload/image-uploader.tsx:116` -- hidden file input from react-dropzone (per user decision).

### Files Using router.refresh() (5 files, migrate to revalidatePath in server actions)
| Client File | Line | Server Action File | Paths to Revalidate |
|-------------|------|--------------------|---------------------|
| `src/components/schedule/job-form.tsx` | 134, 149 | `src/actions/schedule.ts` | `/schedule` |
| `src/components/beauty/routine-list.tsx` | 117 | `src/actions/routines.ts` | `/beauty` |
| `src/components/beauty/product-grid.tsx` | 132 | `src/actions/beauty-products.ts` | `/beauty` |
| `src/components/beauty/product-grid.tsx` | 232 | `src/actions/beauty-categories.ts` | `/beauty` |
| `src/app/(private)/admin/portfolio/portfolio-list-client.tsx` | 56 | `src/actions/portfolio.ts` | `/admin/portfolio` |

### Server Actions Needing revalidatePath (all mutation functions)
| File | Functions Needing revalidatePath | Path |
|------|----------------------------------|------|
| `src/actions/schedule.ts` | createJob, updateJob, deleteJob | `/schedule` |
| `src/actions/beauty-products.ts` | createBeautyProduct, updateBeautyProduct, deleteBeautyProduct, toggleFavorite | `/beauty` |
| `src/actions/beauty-categories.ts` | (create, rename, delete functions) | `/beauty` |
| `src/actions/routines.ts` | (add step, remove step, reorder functions) | `/beauty` |
| `src/actions/portfolio.ts` | createPortfolioItem, updatePortfolioItem, deletePortfolioItem | `/admin/portfolio`, `/` |
| `src/actions/about.ts` | updateAboutContent | `/about`, `/admin/about` |

### Existing shadcn Components (already installed)
button, button-spinner, card, dialog, dropdown-menu, input, label, progress, separator, sheet, skeleton, sonner

### Components Needing Visual Polish
| File | Issue |
|------|-------|
| `src/components/schedule/job-form.tsx` | Form spacing cramped |
| `src/components/schedule/job-card.tsx` | Card contrast against lavender bg |
| `src/components/schedule/calendar-grid.tsx` | Calendar visual treatment |
| `src/components/schedule/day-cell.tsx` | Day cell styling (borders, today highlight) |
| `src/components/schedule/stats-header.tsx` | Stat card contrast |
| `src/components/beauty/product-form.tsx` | Form spacing |

## Code Examples

### Prettier Configuration Files

**.prettierrc:**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css"
}
```

**.prettierignore:**
```
node_modules
.next
dist
pnpm-lock.yaml
package-lock.json
```

### Controller Pattern for Select Migration
```typescript
// Before (native select with register):
<select {...register('categoryId')} className="...">
  <option value="">Select a category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>

// After (shadcn Select with Controller):
<Controller
  control={control}
  name="categoryId"
  render={({ field }) => (
    <Select onValueChange={field.onChange} value={field.value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>
```

### revalidatePath Migration Pattern
```typescript
// Server action (e.g., schedule.ts):
import { revalidatePath } from 'next/cache';

export async function createJob(data: z.infer<typeof createJobSchema>) {
  // ... existing validation and auth ...
  const [created] = await db.insert(scheduleJobs).values(parsed.data).returning();
  revalidatePath('/schedule');
  return created;
}

// Client component -- remove router.refresh():
const result = await createJob(data);
// router.refresh(); <-- DELETE THIS LINE
onOpenChange(false);
```

### Textarea Replacement (simple swap)
```typescript
// Before:
<textarea {...register('notes')} className="h-8 w-full rounded-lg ..." />

// After:
import { Textarea } from '@/components/ui/textarea';
<Textarea {...register('notes')} placeholder="Notes..." />
```

### Design System Spacing Scale
```
/* From globals.css design tokens */
/* Use Tailwind gap/padding classes mapped to 8px scale: */
gap-2  = 8px   (field labels to inputs)
gap-4  = 16px  (between form fields)
gap-6  = 24px  (between form sections)
gap-8  = 32px  (major layout sections)
p-4    = 16px  (card inner padding)
p-6    = 24px  (form container padding)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `router.refresh()` client-side | `revalidatePath()` server-side | Next.js 13.4+ (stable) | Seamless UI updates without page flash |
| JS-based Tailwind config (tailwind.config.js) | CSS-based config (globals.css @theme) | Tailwind v4 | Plugin needs `tailwindStylesheet` option |
| Radix UI primitives in shadcn | base-ui primitives in shadcn v4 | shadcn v4 | Select still uses Radix (not base-ui) per docs |

## Open Questions

1. **shadcn Select in shadcn v4 -- Radix or base-ui?**
   - What we know: The shadcn docs page for Select references Radix primitives. This project's other components (Input, Dialog) use base-ui.
   - What's unclear: Whether `npx shadcn@latest add select` in this project will install a Radix-based or base-ui-based Select.
   - Recommendation: Run the install command and inspect the generated file. If it uses Radix, it will still work fine alongside base-ui components. The shadcn CLI handles this automatically.

2. **router.refresh() in routine-list.tsx for signed URLs**
   - What we know: `routine-list.tsx:117` uses `router.refresh()` specifically to get fresh signed thumbnail URLs after adding a step.
   - What's unclear: Whether `revalidatePath()` alone will trigger server component re-render fast enough for the optimistic UI pattern.
   - Recommendation: Add `revalidatePath('/beauty')` to the relevant routines action AND keep the optimistic local state update. Remove `router.refresh()` from client.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map

This phase has no explicit requirement IDs (it is a refactoring/polish phase). Tests should verify non-regression:

| Behavior | Test Type | Automated Command | File Exists? |
|----------|-----------|-------------------|-------------|
| Prettier formats without errors | smoke | `npx prettier --check .` | N/A (CLI) |
| shadcn Select renders and accepts value | unit | `npx vitest run src/__tests__/refactor/select-integration.test.tsx` | Wave 0 |
| revalidatePath called in server actions | unit | `npx vitest run src/__tests__/refactor/revalidation.test.ts` | Wave 0 |
| Existing test suite still passes | regression | `npx vitest run` | Existing (25 files) |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + `npx prettier --check .`

### Wave 0 Gaps
- [ ] `src/__tests__/refactor/select-integration.test.tsx` -- shadcn Select renders with Controller
- [ ] `src/__tests__/refactor/revalidation.test.ts` -- server actions call revalidatePath after mutations
- [ ] No framework install needed -- vitest already configured

## Sources

### Primary (HIGH confidence)
- npm registry -- prettier 3.8.1, prettier-plugin-tailwindcss 0.7.2 (verified via `npm view`)
- [prettier-plugin-tailwindcss GitHub](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) -- tailwindStylesheet option for Tailwind v4
- [Next.js revalidatePath docs](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) -- API and behavior
- [shadcn Select docs](https://ui.shadcn.com/docs/components/select) -- installation and usage
- [shadcn React Hook Form docs](https://ui.shadcn.com/docs/forms/react-hook-form) -- Controller integration pattern
- Codebase scan -- all file locations, line numbers, and patterns verified directly

### Secondary (MEDIUM confidence)
- [shadcn Textarea docs](https://ui.shadcn.com/docs/components/textarea) -- installation command
- [Next.js Updating Data guide](https://nextjs.org/docs/app/getting-started/updating-data) -- redirect outside try/catch pattern

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- versions verified via npm registry, well-established tools
- Architecture: HIGH -- patterns verified against official docs and codebase scan
- Pitfalls: HIGH -- based on direct codebase analysis showing exact migration points
- Codebase scan: HIGH -- all file locations and line numbers verified via grep

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable tools, no fast-moving APIs)
