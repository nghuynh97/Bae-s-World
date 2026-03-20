---
status: testing
phase: 01-foundation
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md
started: 2026-03-20T10:00:00Z
updated: 2026-03-20T10:00:00Z
---

## Current Test

<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
Kill any running dev server. Run `npm run dev` from scratch. Server boots without errors, homepage loads at http://localhost:3000 with the lavender-tinted background and navigation visible.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test

expected: Kill any running dev server. Run `npm run dev` from scratch. Server boots without errors, homepage loads at http://localhost:3000 with the lavender-tinted background and navigation visible.
result: [pending]

### 2. Design System Tokens

expected: Homepage shows lavender-tinted background (#F8F6FF), headings in Playfair Display serif font, body text in Inter sans-serif, rose gold accent color (#B76E79) on interactive elements, and soft rounded corners on cards.
result: [pending]

### 3. Responsive Navigation - Desktop

expected: On desktop (window wider than 768px), a top navigation bar is visible with "Funnghy's World" logo on the left and navigation links (Portfolio, About, Sign In) on the right. No bottom tab bar visible.
result: [pending]

### 4. Responsive Navigation - Mobile

expected: Resize browser below 768px. Top nav disappears. A fixed bottom tab bar appears with icon + label tabs for navigation. Tabs should include Portfolio, About, and Sign In.
result: [pending]

### 5. Public Routes Accessible

expected: Visit / (homepage) and /about without being logged in. Both pages render with public navigation. No redirect to login.
result: [pending]

### 6. Route Protection

expected: Visit /dashboard without being logged in. You should be redirected to /login automatically.
result: [pending]

### 7. Login Page Layout

expected: Visit /login. See a centered card with "Funnghy's World" in Playfair Display at the top, email and password fields below, a Sign In button, and a "First time? Use your invite code" link at the bottom.
result: [pending]

### 8. Invite Code Setup Flow

expected: Visit /setup. Enter invite code "FNGH01" or "BF0001". If valid, transitions to account creation form with email, password, and confirm password fields. Submit creates the account and redirects to dashboard.
result: [pending]

### 9. Login Flow

expected: After creating an account via invite code, visit /login. Enter email and password. On success, redirected to /dashboard showing "Welcome back, [Name]".
result: [pending]

### 10. Dynamic Navigation After Login

expected: After logging in, navigation shows authenticated links (Portfolio, Beauty, Journal, About) instead of Sign In. A user menu (avatar/initial circle) appears in the top-right.
result: [pending]

### 11. User Menu and Sign Out

expected: Click the user menu (avatar circle). A dropdown appears with Sign Out option. Click Sign Out, confirm in dialog. You are redirected to /login.
result: [pending]

### 12. Upload Page - Drag and Drop

expected: Navigate to /upload (while logged in). See a drag-and-drop zone with "Drag photos here or click to browse" text (or similar). Drop or select multiple image files. Per-file progress bars appear showing upload status for each file.
result: [pending]

## Summary

total: 12
passed: 0
issues: 0
pending: 12
skipped: 0

## Gaps

[none yet]
