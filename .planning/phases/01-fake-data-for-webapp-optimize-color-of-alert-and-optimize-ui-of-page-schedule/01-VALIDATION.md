---
phase: 1
slug: fake-data-for-webapp-optimize-color-of-alert-and-optimize-ui-of-page-schedule
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | seed-data | integration | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | toast-colors | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | schedule-ui | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| TBD | TBD | TBD | portfolio-form | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Vitest is already configured.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Toast colored backgrounds render correctly | toast-colors | Visual appearance | Trigger success/error/warning toasts, verify colored backgrounds |
| Seed data populates all sections visually | seed-data | End-to-end visual | Run seed script, navigate portfolio/beauty/schedule pages |
| Schedule stats cards display correctly | schedule-ui | Visual layout | Check job count cards appear alongside income stats |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
