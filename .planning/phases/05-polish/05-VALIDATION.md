---
phase: 05
slug: polish
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

| Task ID  | Plan  | Wave | Requirement                     | Test Type  | Automated Command                                                                                                                                                                                                                                      | File Exists        | Status  |
| -------- | ----- | ---- | ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ------- |
| 05-00-T1 | 05-00 | 0    | POLISH-01..05                   | scaffold   | `ls src/__tests__/polish/*.test.tsx \| wc -l`                                                                                                                                                                                                          | Wave 0 creates     | pending |
| 05-01-T1 | 05-01 | 1    | POLISH-01, POLISH-02, POLISH-04 | unit+grep  | `npx vitest run src/__tests__/polish/page-fade.test.tsx src/__tests__/polish/button-spinner.test.tsx src/__tests__/polish/toast-config.test.tsx --reporter=verbose`                                                                                    | Wave 0             | pending |
| 05-01-T2 | 05-01 | 1    | POLISH-02                       | grep+suite | `grep -c "motion-safe:hover:shadow-md" src/app/\(private\)/dashboard/page.tsx src/components/schedule/job-card.tsx src/components/schedule/stats-header.tsx src/components/beauty/product-grid.tsx; npx vitest run --reporter=verbose 2>&1 \| tail -5` | N/A (CSS classes)  | pending |
| 05-02-T1 | 05-02 | 2    | POLISH-03                       | unit+grep  | `npx vitest run src/__tests__/polish/loading-skeletons.test.tsx --reporter=verbose`                                                                                                                                                                    | Wave 0             | pending |
| 05-02-T2 | 05-02 | 2    | POLISH-05                       | grep+suite | `grep -rl "ButtonSpinner" src/components/auth/ src/components/schedule/ src/components/beauty/ src/app/\(private\)/admin/ src/components/layout/ \| wc -l; npx vitest run --reporter=verbose 2>&1 \| tail -5`                                          | N/A (import check) | pending |

---

## Wave 0 Requirements

Wave 0 plan `05-00-PLAN.md` creates 4 test stub files:

- [x] `src/__tests__/polish/page-fade.test.tsx` -- covers DESG-04a (template renders with animation class)
- [x] `src/__tests__/polish/button-spinner.test.tsx` -- covers DESG-04b (spinner renders, accepts className)
- [x] `src/__tests__/polish/loading-skeletons.test.tsx` -- covers DESG-04c (all 4 loading.tsx files render skeletons)
- [x] `src/__tests__/polish/toast-config.test.tsx` -- covers DESG-04e (sonner configured with position + duration)

---

## Manual-Only Verifications

| Behavior               | Requirement | Why Manual                     | Test Instructions                               |
| ---------------------- | ----------- | ------------------------------ | ----------------------------------------------- |
| Page fade transitions  | DESG-04     | CSS animation requires browser | Navigate between pages, verify smooth fade      |
| Hover effects on cards | DESG-04     | CSS hover requires browser     | Hover over portfolio/beauty/schedule cards      |
| Button press scale     | DESG-04     | Touch interaction              | Tap buttons on mobile, verify 0.97x scale       |
| Loading skeletons      | DESG-04     | Visual rendering               | Refresh pages, verify skeleton pulse appears    |
| Toast animations       | DESG-04     | Animation timing               | Trigger success/error, verify top-center + fade |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
