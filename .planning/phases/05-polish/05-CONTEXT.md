# Phase 5: Polish - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Subtle micro-animations, transitions, hover effects, loading skeletons, and feedback polish across the entire app. No new features — purely visual refinement of existing pages and interactions.

</domain>

<decisions>
## Implementation Decisions

### Page transitions

- Subtle fade transition (200-300ms) on all route changes
- Applied globally — every page gets the fade, not just main sections
- Quick enough to feel smooth without slowing navigation

### Hover & interaction effects

- Very subtle hover effects — barely visible lift/shadow change on cards and interactive elements
- Elegant and minimal, like a gentle breath — not dramatic
- Buttons: scale down to 0.97x on press/tap for tactile feedback on mobile
- Existing portfolio card hover (1.02x scale from Phase 2) stays as-is

### Loading states & skeletons

- Loading skeletons on all 4 main pages: portfolio gallery, beauty product grid, schedule calendar, dashboard
- Gentle pulse animation (shadcn Skeleton default opacity pulse) — not shimmer sweep
- Skeletons should match the layout structure of the loaded content (grid shapes, card shapes, etc.)

### Toast & feedback animations

- Toasts appear from top-center (avoids bottom tab bar overlap on mobile), auto-dismiss after 3 seconds
- Form submission buttons show a small spinner + disabled state while saving
- Consistent across all forms (login, job form, product form, about editor, etc.)

### Claude's Discretion

- Exact fade timing and easing curve
- Shadow values for hover lift effect
- Skeleton layout specifics per page
- Spinner component design (size, color)
- Whether to add motion-reduce media query support

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context

- `.planning/PROJECT.md` — Aesthetic requirements, soft feminine feel
- `.planning/REQUIREMENTS.md` — DESG-04: micro-animations and transitions

### Prior phase patterns

- `.planning/phases/01-foundation/01-CONTEXT.md` — Design system tokens, component shape
- `src/app/globals.css` — All design tokens, transition defaults

### Existing code to polish

- `src/components/portfolio/gallery-card.tsx` — Existing hover effect (1.02x scale)
- `src/app/(private)/beauty/loading.tsx` — Existing beauty loading skeleton
- `src/components/ui/skeleton.tsx` — shadcn Skeleton component (pulse animation)
- `sonner` — Toast library already installed and configured

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/ui/skeleton.tsx` — shadcn Skeleton with pulse animation, reuse for all loading states
- `sonner` toaster — already configured in root layout, just needs animation customization
- Tailwind `transition-*` utilities — use for hover effects consistently
- `motion-safe:` Tailwind variant — already used on portfolio gallery cards

### Established Patterns

- `loading.tsx` convention in Next.js for route-level loading states (beauty page already has one)
- `useTransition` for form submission pending states (already used in auth forms)
- `disabled:opacity-50` pattern on buttons during pending state

### Integration Points

- Root layout (`src/app/layout.tsx`) — page transition wrapper goes here
- Every `loading.tsx` file — add/update skeletons per section
- All form submit buttons across the app — add spinner + disabled pattern
- All card components — add consistent subtle hover

</code_context>

<specifics>
## Specific Ideas

- The polish should feel invisible — users shouldn't notice animations, they should notice the app feels smooth
- Very subtle is the key phrase — this is an elegant editorial app, not a playful one
- The existing portfolio hover (1.02x) is the right level of subtlety — match that energy everywhere
- Loading skeletons prevent layout shift and make the app feel faster even before content loads

</specifics>

<deferred>
## Deferred Ideas

- Seasonal theme variations (PERS-01) — v2 feature
- Customizable accent color (PERS-02) — v2 feature

</deferred>

---

_Phase: 05-polish_
_Context gathered: 2026-03-20_
