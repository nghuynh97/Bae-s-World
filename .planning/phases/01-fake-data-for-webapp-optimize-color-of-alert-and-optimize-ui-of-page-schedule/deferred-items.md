# Deferred Items

## Pre-existing Type Error in portfolio-admin-client.tsx

**Found during:** 01-01 build verification
**File:** `src/app/(private)/admin/portfolio/portfolio-admin-client.tsx:98`
**Issue:** Zod schema `z.string().max(100).default('')` for `title` makes it optional at input level, causing type mismatch with `useForm<UploadFormData>` resolver. Pre-existing from 01-02 plan commits (44df828, 03b440a).
**Fix:** Change to `z.string().max(100).optional().default('')` or adjust the form type.
