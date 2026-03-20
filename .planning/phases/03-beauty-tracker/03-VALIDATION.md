---
phase: 03
slug: beauty-tracker
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 03 — Validation Strategy

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
| TBD | TBD | TBD | BEAU-01–07 | unit/source | `npx vitest run` | TBD | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `src/__tests__/beauty/` — test stub directory for beauty tracker tests
- [ ] Test stubs for BEAU-01 through BEAU-07

*Planner will determine if a Wave 0 test stub plan is needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Drag-and-drop routine reorder | BEAU-06 | Touch/pointer interaction requires browser | Drag a step up/down in routine, verify order persists |
| Product photo upload with private bucket | BEAU-01, BEAU-07 | Requires live Supabase Storage | Upload product photo, verify signed URL works |
| Bottom sheet slide-up interaction | BEAU-01 | CSS animation + touch behavior | Tap product, verify sheet slides up smoothly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
