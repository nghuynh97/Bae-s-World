---
phase: 05
slug: freelance-schedule-income-tracker
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-20
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                               |
| ---------------------- | ----------------------------------- |
| **Framework**          | vitest 4.1                          |
| **Config file**        | vitest.config.ts                    |
| **Quick run command**  | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime**  | ~5 seconds                          |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID  | Plan  | Wave | Requirement                  | Test Type | Automated Command                                                                     | File Exists                                       | Status  |
| -------- | ----- | ---- | ---------------------------- | --------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ------- |
| 05-01-T1 | 05-01 | 1    | SCHED-01, SCHED-03, SCHED-05 | unit      | `npx vitest run src/__tests__/schedule/format-vnd.test.ts --reporter=verbose`         | src/**tests**/schedule/format-vnd.test.ts         | pending |
| 05-01-T2 | 05-01 | 1    | SCHED-01, SCHED-03, SCHED-05 | unit      | `npx vitest run src/__tests__/schedule/schedule-actions.test.ts --reporter=verbose`   | src/**tests**/schedule/schedule-actions.test.ts   | pending |
| 05-02-T1 | 05-02 | 2    | SCHED-02, SCHED-06           | unit      | `npx vitest run src/__tests__/schedule/calendar-grid.test.tsx --reporter=verbose`     | src/**tests**/schedule/calendar-grid.test.tsx     | pending |
| 05-02-T2 | 05-02 | 2    | SCHED-02, SCHED-06, SCHED-01 | source    | `npx tsc --noEmit 2>&1 \| head -30`                                                   | src/components/schedule/job-form.tsx              | pending |
| 05-03-T1 | 05-03 | 3    | SCHED-04                     | unit      | `npx vitest run src/__tests__/schedule/stats.test.ts --reporter=verbose`              | src/**tests**/schedule/stats.test.ts              | pending |
| 05-03-T2 | 05-03 | 3    | SCHED-07                     | unit      | `npx vitest run src/__tests__/middleware/route-protection.test.ts --reporter=verbose` | src/**tests**/middleware/route-protection.test.ts | pending |

---

## Wave 0 Requirements

- [x] Test stubs created within tasks -- no separate Wave 0 plan needed
- [x] `src/__tests__/schedule/format-vnd.test.ts` created in 05-01 Task 1
- [x] `src/__tests__/schedule/schedule-actions.test.ts` created in 05-01 Task 2
- [x] `src/__tests__/schedule/calendar-grid.test.tsx` created in 05-02 Task 1

---

## Manual-Only Verifications

| Behavior                      | Requirement | Why Manual                           | Test Instructions                                   |
| ----------------------------- | ----------- | ------------------------------------ | --------------------------------------------------- |
| Calendar month grid rendering | SCHED-02    | CSS grid layout requires browser     | View /schedule, verify month grid renders correctly |
| Tap date to add job           | SCHED-06    | Touch/click interaction              | Tap a date, verify form slides up                   |
| Income chart rendering        | SCHED-04    | Recharts SVG output requires browser | View stats header, verify bar chart renders         |
| VND formatting display        | SCHED-05    | Locale-dependent Intl output         | Verify amounts show as "5.000.000₫" format          |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
