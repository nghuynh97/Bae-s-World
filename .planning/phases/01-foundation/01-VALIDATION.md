---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x |
| **Config file** | vitest.config.ts (Wave 0 creates) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --coverage` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | AUTH-01, AUTH-02 | integration | `npx vitest run src/__tests__/auth` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | AUTH-03 | integration | `npx vitest run src/__tests__/auth` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | AUTH-04, AUTH-05 | integration | `npx vitest run src/__tests__/middleware` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | DESG-01 | unit | `npx vitest run src/__tests__/design-tokens` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | DESG-02 | visual | manual | N/A | ⬜ pending |
| 01-02-03 | 02 | 1 | DESG-03 | unit | `npx vitest run src/__tests__/image-optimization` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | IMG-01, IMG-02 | integration | `npx vitest run src/__tests__/upload` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 2 | IMG-03 | integration | `npx vitest run src/__tests__/signed-urls` | ❌ W0 | ⬜ pending |
| 01-03-03 | 03 | 2 | IMG-04 | e2e | manual | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with React/JSX support
- [ ] `src/__tests__/auth/` — Auth test stubs for invite code flow and login
- [ ] `src/__tests__/middleware/` — Middleware test stubs for public/private route separation
- [ ] `src/__tests__/design-tokens/` — Design token verification tests
- [ ] `src/__tests__/image-optimization/` — Image processing test stubs (sharp variants)
- [ ] `src/__tests__/upload/` — Upload pipeline test stubs
- [ ] `src/__tests__/signed-urls/` — Signed URL access control tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout on mobile/desktop | DESG-02 | Visual verification needed | Open on mobile viewport (375px) and desktop (1440px), verify navigation switches from top nav to bottom tab bar |
| Drag-and-drop upload interaction | IMG-04 | Browser drag event simulation unreliable | Drag image file onto upload zone, verify progress bar appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
