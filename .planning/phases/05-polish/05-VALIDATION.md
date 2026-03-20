---
phase: 05
slug: polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 05 — Validation Strategy

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
| TBD | TBD | TBD | DESG-04 | source/build | TBD | TBD | ⬜ pending |

---

## Wave 0 Requirements

*Planner will determine if test stubs are needed (polish is mostly visual — may be manual-only).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page fade transitions | DESG-04 | CSS animation requires browser | Navigate between pages, verify smooth fade |
| Hover effects on cards | DESG-04 | CSS hover requires browser | Hover over portfolio/beauty/schedule cards |
| Button press scale | DESG-04 | Touch interaction | Tap buttons on mobile, verify 0.97x scale |
| Loading skeletons | DESG-04 | Visual rendering | Refresh pages, verify skeleton pulse appears |
| Toast animations | DESG-04 | Animation timing | Trigger success/error, verify slide-up + fade |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
