# Admin Artwork List Usability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin artwork list easier to scan by emphasizing artwork title, publication state, edit action, and a prominent add button while making the title subtext smaller.

**Architecture:** Keep the existing `AdminArtworkList` component and data flow. Add a focused component test for the list UI, then update markup and class names in the same component without changing storage or actions.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library.

---

### Task 1: Test The Artwork List Layout

**Files:**
- Create: `tests/admin-artwork-list.test.tsx`

- [ ] **Step 1: Write the failing test**

Create a test that mocks admin storage calls and renders `AdminArtworkList`. Assert that the page has a Korean heading, a visible `작품 추가` link, status badges for `공개` and `비공개`, a text table header area, and small subtext under each artwork title.

- [ ] **Step 2: Run the targeted test**

Run: `pnpm test tests/admin-artwork-list.test.tsx`

Expected before implementation: fail because the current UI does not expose the new list structure or subtext marker.

### Task 2: Update The Artwork List UI

**Files:**
- Modify: `components/admin/admin-artwork-list.tsx`

- [ ] **Step 1: Implement the layout**

Update the page header, `작품 추가` button, list header, row layout, publication badges, edit link text, and smaller title subtext.

- [ ] **Step 2: Run the targeted test**

Run: `pnpm test tests/admin-artwork-list.test.tsx`

Expected after implementation: pass.

### Task 3: Verify And Publish

**Files:**
- No additional files.

- [ ] **Step 1: Run full checks**

Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

- [ ] **Step 2: Push to GitHub and confirm Vercel**

Update changed files in `song0966-lab/al-pet`, confirm the latest Vercel deployment reaches `READY`, and fetch the admin route.
