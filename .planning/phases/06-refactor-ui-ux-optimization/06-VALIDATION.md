---
phase: 06
slug: refactor-ui-ux-optimization
status: draft
nyquist_compliant: false
wave_0_complete: false
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

*Populated by planner during plan creation.*

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | REFAC-* | build/grep | TBD | TBD | ⬜ pending |

---

## Wave 0 Requirements

*Planner will determine if test stubs are needed (refactor phase may rely on existing tests + build checks).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| shadcn Select renders correctly | REFAC | Component visual output | Open forms, verify Select dropdowns work |
| UI updates after CRUD without reload | REFAC | Server Action + React re-render | Create/edit/delete, verify list updates instantly |
| Spacing/color improvements | REFAC | Visual assessment | Compare before/after on all pages |
| Prettier formatting consistency | REFAC | Code style | Run format:check, verify 0 errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
