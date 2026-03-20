---
phase: 01-foundation
plan: 02
subsystem: auth
tags:
  [
    supabase-auth,
    supabase-ssr,
    drizzle-orm,
    invite-code,
    middleware,
    zod,
    react-hook-form,
    server-actions,
  ]

# Dependency graph
requires:
  - phase: 01-foundation-01
    provides: Project scaffold, design tokens, route groups, navigation components, shadcn/ui
provides:
  - Supabase client factories (browser, server, admin)
  - Auth middleware protecting private routes via getUser()
  - Drizzle ORM schema with invite_codes and profiles tables
  - Seed script for two invite codes (FNGH01, BF0001)
  - Server Actions for login, signup, invite code validation, logout
  - Login form with react-hook-form and zod validation
  - Invite code setup flow (validate code, create account via admin API)
  - User menu with sign-out confirmation dialog
  - Dynamic navigation based on auth state
affects: [01-03, 02-portfolio, 03-beauty, 04-journal, 05-polish]

# Tech tracking
tech-stack:
  added: [drizzle-kit]
  patterns:
    [
      supabase-ssr-cookie-auth,
      admin-api-user-creation,
      middleware-route-protection,
      server-actions-with-zod,
    ]

key-files:
  created:
    - src/lib/supabase/client.ts
    - src/lib/supabase/server.ts
    - src/lib/supabase/admin.ts
    - src/lib/supabase/middleware.ts
    - src/lib/db/index.ts
    - src/lib/db/schema.ts
    - src/middleware.ts
    - src/actions/auth.ts
    - src/components/auth/login-form.tsx
    - src/components/auth/invite-code-input.tsx
    - src/components/auth/setup-form.tsx
    - src/components/layout/user-menu.tsx
    - scripts/seed-invite-codes.ts
    - drizzle.config.ts
    - src/__tests__/middleware/route-protection.test.ts
    - src/__tests__/auth/login.test.ts
    - src/__tests__/auth/invite-code.test.ts
  modified:
    - src/app/(auth)/login/page.tsx
    - src/app/(auth)/setup/page.tsx
    - src/app/(public)/layout.tsx
    - src/app/(private)/layout.tsx
    - src/app/(private)/dashboard/page.tsx
    - src/components/layout/top-nav.tsx
    - package.json

key-decisions:
  - 'Used admin.createUser() instead of auth.signUp() since public signup is disabled in Supabase'
  - 'Middleware uses getUser() (server-verified) instead of getSession() (cookie-only) per Supabase best practice'
  - 'Removed asChild prop from DropdownMenuTrigger due to base-ui v4 API change (shadcn v4 uses base-ui, not Radix)'

patterns-established:
  - 'Server Actions with zod validation for all form submissions'
  - 'Three Supabase client factories: browser (client.ts), server (server.ts), admin (admin.ts)'
  - 'Middleware route protection pattern: getUser() check then redirect'
  - 'Invite code flow: validate code -> admin.createUser -> mark used -> signIn -> redirect'

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05]

# Metrics
duration: 7min
completed: 2026-03-19
---

# Phase 1 Plan 02: Authentication System Summary

**Supabase SSR auth with invite-code setup flow, admin API user creation, middleware route protection via getUser(), and dynamic navigation based on auth state**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-19T09:04:33Z
- **Completed:** 2026-03-19T09:11:41Z
- **Tasks:** 3
- **Files modified:** 25

## Accomplishments

- Three Supabase client factories (browser, server, admin) with cookie-based SSR auth
- Middleware protecting /dashboard, /beauty, /journal, /upload using getUser() with redirect to /login
- Complete invite-code setup flow: validate code, create account via admin API, auto-login, redirect to dashboard
- Email/password login with react-hook-form, zod validation, and proper error states
- User menu with dropdown and sign-out confirmation dialog
- Dynamic navigation showing public vs authenticated links based on real auth state
- 14 new tests (32 total) all passing, production build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Supabase client factories, Drizzle schema, middleware, seed script** - `cb414e6` (feat)
2. **Task 2: Auth Server Actions, login/setup forms, user menu** - `a53c022` (feat)
3. **Task 3: Dynamic navigation with auth state, real user data** - `2d6bac8` (feat)

## Files Created/Modified

- `src/lib/supabase/client.ts` - Browser Supabase client factory using createBrowserClient
- `src/lib/supabase/server.ts` - Server Component Supabase client with cookie handling
- `src/lib/supabase/admin.ts` - Service role client for admin operations (user creation)
- `src/lib/supabase/middleware.ts` - Session refresh and route protection logic
- `src/middleware.ts` - Root middleware entry point with route matcher
- `src/lib/db/schema.ts` - Drizzle schema: invite_codes and profiles tables
- `src/lib/db/index.ts` - Drizzle client singleton with prepare: false for Supabase
- `drizzle.config.ts` - Drizzle Kit configuration for PostgreSQL
- `scripts/seed-invite-codes.ts` - Idempotent seed for FNGH01 and BF0001 invite codes
- `src/actions/auth.ts` - Server Actions: login, setupAccount, validateInviteCode, logout
- `src/components/auth/login-form.tsx` - Email/password form with react-hook-form + zod
- `src/components/auth/invite-code-input.tsx` - 6-char auto-uppercase code input with auto-submit
- `src/components/auth/setup-form.tsx` - Account creation form with email/password/confirm
- `src/components/layout/user-menu.tsx` - Avatar dropdown with sign-out confirmation dialog
- `src/app/(auth)/login/page.tsx` - Wired with LoginForm component
- `src/app/(auth)/setup/page.tsx` - Two-step flow: InviteCodeInput then SetupForm
- `src/app/(public)/layout.tsx` - Dynamic auth check for navigation
- `src/app/(private)/layout.tsx` - Real user data + UserMenu in navigation
- `src/app/(private)/dashboard/page.tsx` - Greets user by display_name from metadata
- `src/components/layout/top-nav.tsx` - Added userMenu prop for authenticated dropdown

## Decisions Made

- Used `admin.createUser()` instead of `auth.signUp()` because public signup is disabled in Supabase Dashboard -- the admin API bypasses this restriction using the service role key
- Middleware uses `getUser()` (server-verified) not `getSession()` (cookie-only) per Supabase security best practice
- Removed `asChild` prop from DropdownMenuTrigger because shadcn v4 uses base-ui (not Radix), which does not support `asChild`
- Redirect calls placed after try/catch blocks in Server Actions (Next.js requirement -- redirect throws)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed test false positive from comment containing getSession()**

- **Found during:** Task 1 (route protection tests)
- **Issue:** The comment "Use getUser(), not getSession()" in middleware.ts caused the test checking for absence of getSession() to fail
- **Fix:** Rewrote comment to avoid the literal string "getSession()"
- **Files modified:** src/lib/supabase/middleware.ts
- **Verification:** All 6 route protection tests pass
- **Committed in:** cb414e6 (Task 1 commit)

**2. [Rule 3 - Blocking] Fixed DropdownMenuTrigger asChild prop not supported in base-ui**

- **Found during:** Task 2 (user menu component)
- **Issue:** shadcn v4 uses base-ui instead of Radix, and MenuPrimitive.Trigger does not support the asChild prop
- **Fix:** Removed asChild, passed className and children directly to DropdownMenuTrigger
- **Files modified:** src/components/layout/user-menu.tsx
- **Verification:** npx tsc --noEmit exits 0
- **Committed in:** a53c022 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for test correctness and type safety. No scope creep.

## Issues Encountered

None beyond the auto-fixed issues above.

## User Setup Required

**External services require manual configuration before auth can be tested end-to-end:**

- Create a Supabase project and configure .env.local with real credentials
- Disable public signup in Supabase Dashboard (Authentication > Settings)
- Run `npx drizzle-kit push` to create database tables
- Run `npm run db:seed` to insert the two invite codes

## Next Phase Readiness

- Auth system complete, ready for image upload pipeline (Plan 03)
- All navigation components accept dynamic auth state
- Middleware protects all private route prefixes
- Invite code flow ready for end-to-end testing once Supabase is configured

## Self-Check: PASSED

All 17 key files verified present. All 3 task commits (cb414e6, a53c022, 2d6bac8) confirmed in git history.

---

_Phase: 01-foundation_
_Completed: 2026-03-19_
