# Phase 5: Polish - Research

**Researched:** 2026-03-20
**Domain:** CSS animations, page transitions, loading states, micro-interactions
**Confidence:** HIGH

## Summary

This phase adds subtle micro-animations, page transitions, loading skeletons, and feedback polish across the entire app. The project uses Next.js 16.2.0 with App Router, Tailwind CSS 4, and shadcn/ui components. No new libraries are needed -- everything can be accomplished with CSS animations, Tailwind utilities, the existing shadcn Skeleton component, and the already-installed sonner toast library.

The key technical challenge is page transitions in the App Router. Next.js 16 has an experimental `viewTransition` flag, but it is explicitly not recommended for production. The recommended approach is using `template.tsx` files with CSS keyframe animations -- `template.tsx` re-mounts on every navigation (unlike `layout.tsx`), making it the correct place for fade-in animations. Exit animations are not feasible without JavaScript animation libraries, but a fade-in-only approach (200-300ms) is perfectly sufficient for the "invisible polish" aesthetic the user wants.

**Primary recommendation:** Use pure CSS animations via Tailwind + `template.tsx` for page fades, shadcn Skeleton for loading states, a reusable `ButtonSpinner` component with Lucide's `Loader2` icon for form submissions, and `motion-safe:` prefix on all animations for accessibility.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Subtle fade transition (200-300ms) on all route changes, applied globally
- Very subtle hover effects -- barely visible lift/shadow change on cards and interactive elements
- Buttons: scale down to 0.97x on press/tap for tactile feedback on mobile
- Existing portfolio card hover (1.02x scale from Phase 2) stays as-is
- Loading skeletons on all 4 main pages: portfolio gallery, beauty product grid, schedule calendar, dashboard
- Gentle pulse animation (shadcn Skeleton default opacity pulse) -- not shimmer sweep
- Skeletons should match the layout structure of the loaded content
- Toasts slide up from bottom, auto-dismiss with fade after 3 seconds
- Form submission buttons show a small spinner + disabled state while saving
- Consistent spinner across all forms (login, job form, product form, about editor, etc.)

### Claude's Discretion

- Exact fade timing and easing curve
- Shadow values for hover lift effect
- Skeleton layout specifics per page
- Spinner component design (size, color)
- Whether to add motion-reduce media query support

### Deferred Ideas (OUT OF SCOPE)

- Seasonal theme variations (PERS-01) -- v2 feature
- Customizable accent color (PERS-02) -- v2 feature

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                           | Research Support                                                                                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DESG-04 | UI includes subtle micro-animations and transitions (hover effects, page transitions, loading states) | All research sections below directly enable this -- page fade via template.tsx, hover effects via Tailwind transitions, loading skeletons via shadcn Skeleton + loading.tsx, button spinners via Loader2 icon |

</phase_requirements>

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library         | Version   | Purpose                                                            | Why Standard                                                            |
| --------------- | --------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Tailwind CSS    | 4.x       | Transition/animation utilities, motion-safe/motion-reduce variants | Already in project, provides all needed animation utilities             |
| shadcn Skeleton | (bundled) | Loading skeleton pulse animation                                   | Already in project at `src/components/ui/skeleton.tsx`                  |
| sonner          | 2.0.7     | Toast notifications with slide-up animation                        | Already installed and configured in root layout                         |
| lucide-react    | 0.577.0   | Loader2 spinner icon for button loading states                     | Already installed, Loader2 is the standard spinner icon                 |
| tw-animate-css  | 1.4.0     | CSS animation utilities for Tailwind                               | Already installed, provides `animate-in`, `fade-in`, keyframe utilities |

### Alternatives Considered

| Instead of           | Could Use                   | Tradeoff                                                                                   |
| -------------------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| CSS keyframes        | framer-motion               | Adds 30KB+ bundle for animations achievable with CSS; overkill for subtle fades            |
| template.tsx fade-in | experimental viewTransition | viewTransition is experimental in Next.js 16, not production-ready; template.tsx is stable |
| CSS active:scale     | framer-motion whileTap      | CSS is zero-JS, works identically for 0.97x scale on press                                 |

**Installation:** None required. All dependencies already present.

## Architecture Patterns

### Recommended File Structure

```
src/
  app/
    (public)/
      template.tsx          # NEW -- fade-in wrapper for public routes
    (private)/
      template.tsx          # NEW -- fade-in wrapper for private routes
      dashboard/
        loading.tsx          # NEW -- dashboard skeleton
      beauty/
        loading.tsx          # EXISTS -- update to match content layout
      schedule/
        loading.tsx          # EXISTS -- already good
    (auth)/
      template.tsx          # NEW -- fade-in wrapper for auth routes
  components/
    ui/
      button-spinner.tsx     # NEW -- reusable spinner inside buttons
      skeleton.tsx           # EXISTS -- no changes needed
      sonner.tsx             # EXISTS -- update position + duration props
  globals.css                # ADD -- @keyframes fade-in, hover utility classes
```

### Pattern 1: Page Fade via template.tsx

**What:** `template.tsx` re-renders on every route change (unlike `layout.tsx` which persists). Place a CSS fade-in animation wrapper here.

**When to use:** Every route group that needs page transitions.

**Why template.tsx:** Next.js App Router re-creates template instances on navigation. A CSS `animation` on mount creates the fade-in effect automatically without any JavaScript state management.

**Example:**

```tsx
// src/app/(public)/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-fade-in">{children}</div>;
}
```

```css
/* In globals.css */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 250ms ease-out;
}
```

**Key detail:** Only fade-IN is implemented. Fade-out requires JavaScript animation libraries to intercept navigation and delay unmount. For 200-300ms subtle transitions, fade-in-only feels natural and doesn't fight the router.

### Pattern 2: Subtle Card Hover with Lift

**What:** Cards get a barely-visible shadow increase and tiny translateY on hover.

**When to use:** All interactive card-like elements (dashboard cards, beauty product cards, schedule items).

**Example:**

```tsx
// Hover pattern for cards
<Card className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg">
  {/* content */}
</Card>
```

The existing design tokens provide `--shadow-sm`, `--shadow-md`, `--shadow-lg` with the rose-tinted shadows. The hover should go from `shadow-sm` to `shadow-md` (not all the way to `shadow-lg` -- keep it subtle).

### Pattern 3: Active Press Scale

**What:** Buttons and tappable elements scale to 0.97x on active/press for tactile feedback.

**Example:**

```tsx
<button className="transition-transform duration-100 active:scale-[0.97]">
  Save
</button>
```

This is especially important for mobile where hover states don't exist. The `active:` pseudo-class fires on touch press.

### Pattern 4: Button Spinner Component

**What:** A reusable component that shows a spinning Loader2 icon inside a button when a form is submitting.

**Example:**

```tsx
// src/components/ui/button-spinner.tsx
import { Loader2 } from 'lucide-react';

export function ButtonSpinner() {
  return <Loader2 className="size-4 animate-spin" />;
}

// Usage in forms:
<Button type="submit" disabled={isPending}>
  {isPending && <ButtonSpinner />}
  {isPending ? 'Saving...' : 'Save Changes'}
</Button>;
```

### Pattern 5: Loading Skeleton Matching Content Layout

**What:** Each `loading.tsx` file renders Skeleton components that match the shape of the actual loaded content -- same grid columns, same card aspect ratios, same spacing.

**Example for dashboard:**

```tsx
// src/app/(private)/dashboard/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="py-8 md:py-12">
      <Skeleton className="mb-6 h-8 w-64 md:mb-8" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Animating layout properties (width, height, top, left):** These trigger browser reflow. Use `transform` and `opacity` only -- they are GPU-composited and jank-free.
- **Exit animations without a library:** Do NOT try to delay Next.js navigation to play exit animations with pure CSS. It will create race conditions and broken back-button behavior.
- **Shimmer/sweep skeletons:** The user explicitly wants pulse only. shadcn Skeleton's `animate-pulse` is correct.
- **Long animation durations:** Keep everything under 300ms. Anything longer feels sluggish for a utility app.
- **Hover effects on mobile:** Use `motion-safe:` and consider that hover doesn't exist on touch. The `active:scale-[0.97]` handles mobile tactile feedback instead.

## Don't Hand-Roll

| Problem                  | Don't Build                                    | Use Instead                                         | Why                                                                                      |
| ------------------------ | ---------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Page transition system   | Custom router interceptor with animation state | `template.tsx` + CSS keyframes                      | template.tsx is the App Router's built-in solution for per-navigation re-render          |
| Toast animations         | Custom toast animation system                  | sonner's built-in slide animation                   | sonner already handles enter/exit/swipe animations; just configure position and duration |
| Skeleton pulse animation | Custom CSS shimmer/pulse                       | shadcn `Skeleton` component                         | Already installed, uses `animate-pulse`, matches design system                           |
| Reduced motion handling  | Custom JS `matchMedia` listener                | Tailwind `motion-safe:` / `motion-reduce:` variants | Built into Tailwind, zero JS, works with CSS animations                                  |
| Spinner animation        | Custom SVG spinner                             | Lucide `Loader2` + `animate-spin`                   | Already used in sonner config, consistent with icon set                                  |

## Common Pitfalls

### Pitfall 1: template.tsx vs layout.tsx Confusion

**What goes wrong:** Placing animation wrapper in `layout.tsx` -- animations only play on first load, never again on navigation.
**Why it happens:** `layout.tsx` persists across navigations and does not re-mount.
**How to avoid:** Always use `template.tsx` for animations that should replay on every route change.
**Warning signs:** Animation works on hard refresh but not on client-side navigation.

### Pitfall 2: Forgetting motion-safe Prefix

**What goes wrong:** Users with "reduce motion" OS setting still see all animations.
**Why it happens:** Animations applied without the `motion-safe:` variant.
**How to avoid:** Prefix all animation/transition classes with `motion-safe:`. The project already uses this pattern on gallery cards.
**Warning signs:** Accessibility audit flags motion issues.

### Pitfall 3: Skeleton Layout Mismatch Causing Layout Shift

**What goes wrong:** Page content "jumps" when it replaces the skeleton because skeleton dimensions don't match.
**Why it happens:** Skeleton uses different grid columns or padding than actual content.
**How to avoid:** Copy the exact same grid/spacing classes from the page component into the loading.tsx skeleton.
**Warning signs:** Visible layout shift (CLS) when content loads.

### Pitfall 4: Button Spinner Without disabled State

**What goes wrong:** User double-submits a form while the first submission is still in progress.
**Why it happens:** Button shows spinner but isn't disabled.
**How to avoid:** Always pair spinner display with `disabled={isPending}` on the button.
**Warning signs:** Duplicate entries created, toast errors about concurrent submissions.

### Pitfall 5: Animating Non-Composited Properties

**What goes wrong:** Janky, stuttery animations on lower-powered mobile devices.
**Why it happens:** Animating `margin`, `padding`, `width`, `height` triggers CPU layout recalculation every frame.
**How to avoid:** Only animate `opacity` and `transform` (translate, scale, rotate). These are GPU-composited.
**Warning signs:** Animations stutter on mobile, Chrome DevTools shows layout thrashing.

### Pitfall 6: Sonner Position Conflicting with Bottom Tab Bar

**What goes wrong:** Toast appears behind or overlapping with the bottom tab bar on mobile.
**Why it happens:** Sonner defaults to bottom-right, mobile layout has a fixed bottom tab bar.
**How to avoid:** Use `position="top-center"` or add bottom offset. Check the existing `BottomTabBar` height (h-14 = 56px) and add appropriate offset.
**Warning signs:** Toasts invisible or partially hidden on mobile.

## Code Examples

### CSS Keyframes for Page Fade (globals.css addition)

```css
/* Page transition fade-in */
@keyframes page-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Utility class -- apply in template.tsx */
.animate-page-fade-in {
  animation: page-fade-in 250ms ease-out;
}
```

### Template.tsx (identical for each route group)

```tsx
// src/app/(public)/template.tsx
// src/app/(private)/template.tsx
// src/app/(auth)/template.tsx

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page-fade-in">{children}</div>;
}
```

### Sonner Toaster Configuration Update

```tsx
// src/components/ui/sonner.tsx -- update Toaster props
<Sonner
  position="top-center"
  duration={3000}
  // ... existing props
/>
```

Note: `top-center` avoids bottom tab bar conflict on mobile. The slide-down animation is built into sonner for top positions. Duration 3000 = 3 seconds auto-dismiss.

### ButtonSpinner Reusable Component

```tsx
// src/components/ui/button-spinner.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn('size-4 animate-spin', className)}
      aria-hidden="true"
    />
  );
}
```

### Form Button Update Pattern (applied to all forms)

```tsx
// Before (current pattern):
<button type="submit" disabled={isPending}
  className="... disabled:opacity-50">
  {isPending ? "Saving..." : "Save"}
</button>

// After (with spinner + active press):
<button type="submit" disabled={isPending}
  className="... disabled:opacity-50 transition-transform duration-100 active:scale-[0.97]">
  <span className="inline-flex items-center gap-2">
    {isPending && <ButtonSpinner />}
    {isPending ? "Saving..." : "Save"}
  </span>
</button>
```

### Hover Effect for Dashboard Cards

```tsx
// Current:
<Card className="rounded-[16px] shadow-md bg-surface hover:shadow-lg transition-shadow">

// Updated (subtle lift + shadow transition):
<Card className="rounded-[16px] shadow-sm bg-surface motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5">
```

## State of the Art

| Old Approach                                         | Current Approach                       | When Changed           | Impact                                           |
| ---------------------------------------------------- | -------------------------------------- | ---------------------- | ------------------------------------------------ |
| Framer Motion `AnimatePresence` for page transitions | CSS keyframes in `template.tsx`        | Next.js 13+ App Router | No JS bundle cost, works with streaming/Suspense |
| `pages/_app.tsx` transition wrapper                  | `app/**/template.tsx` per route group  | Next.js 13+            | template.tsx re-mounts on navigation by design   |
| Custom shimmer CSS                                   | shadcn `Skeleton` with `animate-pulse` | shadcn adoption        | Consistent with design system, zero config       |
| Experimental `viewTransition` config                 | Still experimental in Next.js 16.2     | Ongoing                | Not production-ready; use template.tsx instead   |

**Deprecated/outdated:**

- `next-page-transitions` library: Designed for Pages Router, does not work with App Router
- `viewTransition` experimental flag: Available but explicitly marked "not recommended for production" in Next.js 16.2 docs

## Open Questions

1. **Toast position vs bottom tab bar**
   - What we know: Bottom tab bar is 56px tall (h-14), fixed at bottom on mobile. Sonner defaults to bottom-right.
   - What's unclear: Whether `top-center` or `bottom-center` with offset is better UX.
   - Recommendation: Use `top-center` to completely avoid the conflict. It's simpler and toasts are visible without scrolling.

2. **Dashboard page loading skeleton**
   - What we know: Dashboard is a Server Component that fetches user data. Currently has no loading.tsx.
   - What's unclear: Whether dashboard loads fast enough that a skeleton is noticeable.
   - Recommendation: Add skeleton anyway for consistency and to handle slow network conditions.

## Validation Architecture

### Test Framework

| Property           | Value                                        |
| ------------------ | -------------------------------------------- |
| Framework          | vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file        | `vitest.config.ts`                           |
| Quick run command  | `npx vitest run --reporter=verbose`          |
| Full suite command | `npx vitest run --reporter=verbose`          |

### Phase Requirements -> Test Map

| Req ID   | Behavior                                               | Test Type   | Automated Command                                                   | File Exists? |
| -------- | ------------------------------------------------------ | ----------- | ------------------------------------------------------------------- | ------------ |
| DESG-04a | Page fade animation renders via template.tsx           | unit        | `npx vitest run src/__tests__/polish/page-fade.test.tsx -x`         | Wave 0       |
| DESG-04b | ButtonSpinner component renders spinner when isPending | unit        | `npx vitest run src/__tests__/polish/button-spinner.test.tsx -x`    | Wave 0       |
| DESG-04c | Loading skeletons exist for all 4 main pages           | unit        | `npx vitest run src/__tests__/polish/loading-skeletons.test.tsx -x` | Wave 0       |
| DESG-04d | Hover effects use motion-safe prefix                   | manual-only | Visual inspection                                                   | N/A          |
| DESG-04e | Toast configuration has correct position and duration  | unit        | `npx vitest run src/__tests__/polish/toast-config.test.tsx -x`      | Wave 0       |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/polish/page-fade.test.tsx` -- covers DESG-04a (template renders with animation class)
- [ ] `src/__tests__/polish/button-spinner.test.tsx` -- covers DESG-04b (spinner renders, accepts className)
- [ ] `src/__tests__/polish/loading-skeletons.test.tsx` -- covers DESG-04c (all 4 loading.tsx files render skeletons)
- [ ] `src/__tests__/polish/toast-config.test.tsx` -- covers DESG-04e (sonner configured with position + duration)

## Sources

### Primary (HIGH confidence)

- [Next.js viewTransition docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) -- confirmed experimental status, not production-ready
- Existing codebase analysis -- `template.tsx`, `loading.tsx`, `skeleton.tsx`, `sonner.tsx`, `gallery-card.tsx` patterns
- [Sonner official site](https://sonner.emilkowal.ski/) -- position prop, duration prop, built-in animations
- package.json -- verified all dependency versions (sonner 2.0.7, next 16.2.0, lucide-react 0.577.0)

### Secondary (MEDIUM confidence)

- [Next.js GitHub Discussion #42658](https://github.com/vercel/next.js/discussions/42658) -- community consensus on template.tsx approach
- [Next.js GitHub Discussion #59723](https://github.com/vercel/next.js/discussions/59723) -- fade transition patterns with App Router
- [Epic Web Dev - Motion Safe/Reduce](https://www.epicweb.dev/tips/motion-safe-and-motion-reduce-modifiers) -- Tailwind motion-safe/motion-reduce usage
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) -- accessibility standard

### Tertiary (LOW confidence)

- None -- all findings verified with primary or secondary sources

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all libraries already installed, no new dependencies
- Architecture: HIGH -- template.tsx pattern well-documented, loading.tsx is Next.js convention, CSS animations are standard
- Pitfalls: HIGH -- based on direct codebase analysis (bottom tab bar conflict, existing patterns)

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain, CSS animations don't change)
