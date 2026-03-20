---
phase: 06
slug: refactor-ui-ux-optimization
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-20
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1 |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-T1 | 06-01 | 1 | REFAC-02, REFAC-03 | build + grep | `npx vitest run --reporter=verbose` | vitest.config.ts | ⬜ pending |
| 06-01-T2 | 06-01 | 1 | REFAC-04, REFAC-05 | build + grep | `npx vitest run --reporter=verbose` | vitest.config.ts | ⬜ pending |
| 06-02-T1 | 06-02 | 2 | REFAC-06, REFAC-07 | build + grep | `npx vitest run --reporter=verbose` | vitest.config.ts | ⬜ pending |
| 06-02-T2 | 06-02 | 2 | REFAC-08, REFAC-09 | build + grep | `npx vitest run --reporter=verbose` | vitest.config.ts | ⬜ pending |
| 06-03-T1 | 06-03 | 3 | REFAC-01 | build + format:check | `npm run format:check && npx vitest run --reporter=verbose` | .prettierrc | ⬜ pending |

---

## Wave 0 Requirements

No test stubs needed. This is a refactor phase — all tasks rely on existing vitest suite for regression checks plus grep/build verification for structural correctness. No new behavioral tests required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| shadcn Select renders correctly | REFAC-02 | Component visual output | Open forms, verify Select dropdowns work |
| UI updates after CRUD without reload | REFAC-04, REFAC-05 | Server Action + React re-render | Create/edit/delete, verify list updates instantly |
| Spacing/color improvements | REFAC-06 to REFAC-09 | Visual assessment | Compare before/after on all pages |
| Prettier formatting consistency | REFAC-01 | Code style | Run format:check, verify 0 errors |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
