# Phase 6: Refactor & UI/UX Optimization - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Code quality and visual polish pass across the entire app. No new features. Three pillars: (1) install Prettier for consistent code formatting, (2) replace all native HTML form elements with shadcn components, (3) fix spacing, color, and contrast issues for better UX.

</domain>

<decisions>
## Implementation Decisions

### Prettier configuration
- Install prettier as devDependency
- Tab width: 2 spaces
- Semicolons: yes
- Quotes: single quotes
- Trailing commas: all (ES5+)
- Print width: 80 (standard)
- Add `.prettierrc` config file
- Add `.prettierignore` (node_modules, .next, dist)
- Add npm script: `"format": "prettier --write ."` and `"format:check": "prettier --check ."`
- Add `.vscode/settings.json` with `editor.formatOnSave: true` and `editor.defaultFormatter: esbenp.prettier-vscode`
- Run `npm run format` on entire codebase after setup

### shadcn component replacements
- Replace ALL native HTML form elements with shadcn equivalents — no exceptions
- Install shadcn `Select` component (not currently installed) for all `<select>` elements
- Install shadcn `Textarea` component for notes fields
- Known native elements to replace:
  - `src/components/beauty/product-form.tsx` — `<select>` on line 212
  - `src/app/(private)/admin/portfolio/new/page.tsx` — `<select>` on line 116
  - `src/app/(private)/admin/portfolio/[id]/edit/edit-form.tsx` — `<select>` on line 102
  - `src/components/beauty/routine-step-search.tsx` — `<input>` on line 102
- Use existing shadcn `Input` (already installed) for text inputs
- Use existing shadcn `Label` (already installed) for all labels
- Keep hidden `<input>` from react-dropzone (file inputs are special — shadcn doesn't wrap these)

### Fix stale UI after CRUD actions (no full page reload)
- After any create, edit, or delete action, the UI must update immediately — no manual F5 refresh
- Do NOT use `router.refresh()` on the client — it causes a visible page reload flash
- Instead, use `revalidatePath()` inside Server Actions to seamlessly revalidate server data without a full reload
- For optimistic inline actions (toggle favorite, reorder steps), update local state immediately and let `revalidatePath()` sync in background
- Applies to ALL CRUD flows across the app:
  - Beauty products: create, edit, delete, toggle favorite
  - Beauty categories: create, rename, delete
  - Portfolio items: create, edit, delete
  - Schedule jobs: create, edit, delete, mark paid/pending
  - Routines: add step, remove step, reorder steps
  - About page: update content
- Pattern: Server Action does the DB mutation → calls `revalidatePath('/beauty')` (or relevant path) → Next.js re-renders affected server components seamlessly
- For forms that navigate after submit, use `redirect()` after `revalidatePath()` in the Server Action

### UX spacing & color fixes
- Forms feel cramped — increase gap between fields, add more padding in form containers
- Calendar looks plain — improve day cell visual treatment, better job dot styling, clearer income display
- Cards need more contrast — stronger shadow or ring on JobCard, product cards, stat cards against the lavender background
- Colors feel inconsistent — audit all components to use design system tokens consistently (accent, surface, text-primary, text-secondary)
- Apply consistent spacing scale from design system (8, 16, 24, 32 gap values)

### Claude's Discretion
- Exact spacing values per component (use design system scale)
- Exact shadow/ring values for card contrast improvement
- Calendar day cell visual improvements (border, background, dot size)
- Whether to add shadcn `Badge` or `Switch` components if useful
- Order of Prettier formatting vs component changes (format last to avoid noisy diffs)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — Soft feminine aesthetic, premium feel
- `src/app/globals.css` — Design system tokens (colors, fonts, shadows, radii) — single source of truth

### Design specs
- `.planning/phases/03-beauty-tracker/03-UI-SPEC.md` — Spacing scale, typography, color contracts for beauty components
- `.planning/phases/05-polish/05-CONTEXT.md` — Hover effects, loading states, button spinners already applied

### Files to refactor
- `src/components/beauty/product-form.tsx` — native `<select>`, spacing issues
- `src/components/schedule/job-form.tsx` — form spacing
- `src/components/schedule/job-card.tsx` — card contrast
- `src/components/schedule/calendar-grid.tsx` — calendar visual treatment
- `src/components/schedule/day-cell.tsx` — day cell styling
- `src/components/schedule/stats-header.tsx` — stat card contrast
- `src/app/(private)/admin/portfolio/new/page.tsx` — native `<select>`
- `src/app/(private)/admin/portfolio/[id]/edit/edit-form.tsx` — native `<select>`
- `src/components/beauty/routine-step-search.tsx` — native `<input>`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/input.tsx` — shadcn Input (already installed)
- `src/components/ui/label.tsx` — shadcn Label (already installed)
- `src/components/ui/button.tsx` — shadcn Button (already installed)
- `src/components/ui/card.tsx` — shadcn Card (already installed)
- Need to install: `Select`, `Textarea` via shadcn CLI

### Established Patterns
- react-hook-form + zod validation for all forms
- Design system tokens in globals.css @theme block
- `motion-safe:` prefix for animations
- `transition-all duration-100` for hover effects

### Integration Points
- Prettier formatting touches every file — run last to avoid merge conflicts
- shadcn Select needs to integrate with react-hook-form Controller pattern
- All form components share the same zod + react-hook-form pattern

</code_context>

<specifics>
## Specific Ideas

- Format the entire codebase with Prettier in one pass after all other changes
- Replace native `<select>` with shadcn Select — much better styling, accessible, matches design system
- Forms should feel spacious and elegant — generous padding, clear visual hierarchy between fields
- Calendar should feel polished — subtle borders on day cells, clearer today highlight, better income amount styling
- Cards should pop slightly against the lavender background — enough contrast to feel like distinct surfaces

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-refactor-ui-ux-optimization*
*Context gathered: 2026-03-20*
