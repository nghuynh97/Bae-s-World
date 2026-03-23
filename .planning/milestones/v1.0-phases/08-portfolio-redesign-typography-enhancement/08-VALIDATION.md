---
phase: 08
slug: portfolio-redesign-typography-enhancement
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-20
---

# Phase 08 — Validation Strategy

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
| 08-01-T1 | 01 | 1 | REDESIGN-01 | unit | `npx vitest run src/__tests__/design-tokens/tokens.test.ts -x` | Yes (update) | pending |
| 08-01-T2 | 01 | 1 | REDESIGN-05 | grep | `grep -c "tagline" src/lib/db/schema.ts && grep -c "tagline" src/actions/about.ts` | N/A | pending |
| 08-02-T1 | 02 | 2 | REDESIGN-02 | unit | `npx vitest run src/__tests__/portfolio/quilted-grid.test.tsx src/__tests__/portfolio/hero-banner.test.tsx -x` | Wave 0 (created in task) | pending |
| 08-02-T2 | 02 | 2 | REDESIGN-03, REDESIGN-04, REDESIGN-06 | unit | `npx vitest run src/__tests__/portfolio/ src/__tests__/design-tokens/ -x` | Wave 0 (navigation.test.tsx, about-schema.test.ts created in task) | pending |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| New font renders correctly | REDESIGN-01 | Font loading requires browser | Check all pages use DM Sans |
| Quilted grid tile sizes | REDESIGN-02 | CSS Grid visual layout | Verify large/small/wide tile pattern |
| Hero banner profile display | REDESIGN-03 | Visual layout assessment | Check photo, name, stats, bio, socials |
| Height/weight display | REDESIGN-03 | Visual elegance | Verify model stats shown subtly |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [x] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
