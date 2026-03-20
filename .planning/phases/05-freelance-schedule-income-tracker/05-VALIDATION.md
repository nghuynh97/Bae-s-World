---
phase: 05
slug: freelance-schedule-income-tracker
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
| TBD | TBD | TBD | SCHED-* | unit/source | `npx vitest run` | TBD | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `src/__tests__/schedule/` — test stub directory for schedule tracker tests

*Planner will determine if a Wave 0 test stub plan is needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Calendar month grid rendering | SCHED | CSS grid layout requires browser | View /schedule, verify month grid renders correctly |
| Tap date to add job | SCHED | Touch/click interaction | Tap a date, verify form slides up |
| Income chart rendering | SCHED | Recharts SVG output requires browser | View stats header, verify bar chart renders |
| VND formatting display | SCHED | Locale-dependent Intl output | Verify amounts show as "5.000.000₫" format |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
