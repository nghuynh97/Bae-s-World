---
phase: 02
slug: public-portfolio
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                        |
| ---------------------- | -------------------------------------------- |
| **Framework**          | vitest 4.1.0 + @testing-library/react 16.3.2 |
| **Config file**        | vitest.config.ts                             |
| **Quick run command**  | `npx vitest run --reporter=verbose`          |
| **Full suite command** | `npx vitest run`                             |
| **Estimated runtime**  | ~10 seconds                                  |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type | Automated Command                                                                            | File Exists     | Status     |
| -------- | ---- | ---- | ----------- | --------- | -------------------------------------------------------------------------------------------- | --------------- | ---------- |
| 02-01-01 | 01   | 1    | PORT-01     | unit      | `npx vitest run src/__tests__/portfolio/masonry-grid.test.tsx -t "distributes items"`        | ❌ W0           | ⬜ pending |
| 02-01-02 | 01   | 1    | PORT-02     | unit      | `npx vitest run src/__tests__/portfolio/lightbox.test.tsx -t "navigation"`                   | ❌ W0           | ⬜ pending |
| 02-01-03 | 01   | 1    | PORT-03     | unit      | `npx vitest run src/__tests__/portfolio/category-filter.test.tsx`                            | ❌ W0           | ⬜ pending |
| 02-02-01 | 02   | 2    | PORT-04     | unit      | `npx vitest run src/__tests__/portfolio/about-section.test.tsx`                              | ❌ W0           | ⬜ pending |
| 02-02-02 | 02   | 2    | PORT-05     | unit      | `npx vitest run src/__tests__/portfolio/portfolio-actions.test.ts`                           | ❌ W0           | ⬜ pending |
| 02-02-03 | 02   | 2    | PORT-06     | unit      | Covered by existing middleware test pattern                                                  | Extend existing | ⬜ pending |
| 02-02-04 | 02   | 2    | AUTH-06     | unit      | `npx vitest run src/__tests__/portfolio/portfolio-actions.test.ts -t "boyfriend can upload"` | ❌ W0           | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `src/__tests__/portfolio/masonry-grid.test.tsx` — stubs for PORT-01 (column distribution, responsive)
- [ ] `src/__tests__/portfolio/lightbox.test.tsx` — stubs for PORT-02 (open/close, keyboard nav)
- [ ] `src/__tests__/portfolio/category-filter.test.tsx` — stubs for PORT-03 (filter selection, active state)
- [ ] `src/__tests__/portfolio/about-section.test.tsx` — stubs for PORT-04 (bio rendering, contact info)
- [ ] `src/__tests__/portfolio/portfolio-actions.test.ts` — stubs for PORT-05, AUTH-06 (CRUD, auth checks)

---

## Manual-Only Verifications

| Behavior                            | Requirement | Why Manual            | Test Instructions                                                             |
| ----------------------------------- | ----------- | --------------------- | ----------------------------------------------------------------------------- |
| Masonry visual layout looks correct | PORT-01     | Visual layout quality | Open portfolio page, verify photos display in masonry grid with mixed heights |
| Lightbox blurred backdrop           | PORT-02     | Visual effect quality | Click a photo, verify blurred gallery backdrop behind lightbox                |
| Category filter animation           | PORT-03     | Animation smoothness  | Click different category pills, verify smooth fade/shuffle transition         |
| About page responsive layout        | PORT-04     | Layout verification   | View about page on mobile and desktop widths                                  |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
