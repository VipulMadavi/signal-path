# ScoutVC — Full Build Task List

## ⚠️ AI Agent: Follow This Priority Order

These phases must be completed in the following order. Do NOT skip ahead or work out of sequence.

1. 🔴 **Phase 6 — Live Enrichment** ← Build this FIRST. This is the core engineering test of the assignment. Requires `/api/enrich` server route, URL validation, SSRF protection, HTML fetch, LLM structured extraction, and enrichment UI panel on the company profile page (idle / loading / success / error states, sources listed with timestamp, keywords, derived signals).

2. 🟠 **Phase 4 — Lists & Saved Searches** ← Build this SECOND. Both `/lists` and `/saved` pages are required deliverables. Must include create list, add/remove companies, CSV export, JSON export, re-run saved search, and delete saved search.

3. 🟡 **Phase 10 — Production Deployment** ← Build this THIRD. Push to GitHub, deploy to Vercel, add env vars in Vercel dashboard, write README with setup instructions and env var documentation.

4. 🟢 **Phase 5 — Scoring Engine** ← Build this FOURTH. Replace mock score data with real `/lib/scoring.ts` logic using weighted formula. Mock data currently covers scores in the UI so this is lower urgency.

5. 🟢 **Phase 8 & 9 — Polish & Hardening** ← Build this LAST. Skeleton loaders, hover animations, toast notifications, mobile responsiveness check, Lighthouse ≥ 85, no API key exposure.

---

Based on the 8 documentation files, following the implementation roadmap strictly.

## Phase 0 — Project Setup ✅
- [x] Initialize Next.js app with App Router + TypeScript
- [x] Install dependencies: TailwindCSS, Shadcn/UI, Lucide icons, Zustand, React Query
- [x] Configure global styles for dark theme
- [x] Setup `layout.tsx` with dark background
- [x] Create base folder structure per architecture doc
- [ ] Commit: "Phase 0: Project setup"

## Phase 1 — Core Layout & Design System ✅
- [x] Build Sidebar component with navigation links
- [x] Build TopBar (global search, user avatar, notification icon)
- [x] Apply design tokens (colors, spacing, typography from design doc)
- [x] Create reusable Button, Card, Badge components
- [ ] Commit: "Phase 1: Core layout and design system"

## Phase 2 — Companies Discovery System ✅
- [x] Create mock company dataset (20+ companies)
- [x] Define Company interface in `/types/company.ts`
- [x] Build Companies table component with columns
- [x] Add filter dropdowns (Stage, Sector, Country)
- [x] Implement sorting (Score, Raised, Latest Signal)
- [x] Implement pagination
- [x] Create Save Search modal
- [x] Persist saved searches in localStorage
- [ ] Commit: "Phase 2: Companies discovery system"

## Phase 3 — Company Profile System ✅
- [x] Create dynamic route `/companies/[id]`
- [x] Build profile header (name, stage badge, score, website link)
- [x] Implement signal timeline component
- [x] Create score breakdown visualization
- [x] Add notes panel (persist in localStorage)
- [x] Add save-to-list button
- [ ] Commit: "Phase 3: Company profile system"

## Phase 4 — Lists & Saved Searches ✅
- [x] Create `/lists` page
- [x] Implement create list modal
- [x] Add/remove companies from lists
- [x] Implement CSV export
- [x] Implement JSON export
- [x] Create `/saved` page with saved searches display
- [x] Add re-run saved search functionality
- [ ] Commit: "Phase 4: Lists and saved searches"

## Phase 5 — Scoring Engine
- [ ] Create `/lib/scoring.ts` with weighted formula
- [ ] Generate explanation bullets
- [ ] Attach scores to companies
- [ ] Display breakdown in profile page
- [ ] Display total score in companies table
- [ ] Commit: "Phase 5: Scoring engine"

## Phase 6 — Live Enrichment (Server-Side) ✅
- [x] Create `/api/enrich/route.ts`
- [x] Add URL validation + SSRF protection
- [x] Implement website fetch with timeout
- [x] Extract readable text from HTML
- [x] Call LLM with structured prompt
- [x] Parse JSON response
- [x] Return enrichment object
- [x] Add rate limiting
- [x] Add error handling
- [ ] Commit: "Phase 6: Live enrichment"

## Phase 7 — Caching & State Management
- [ ] Store enrichment in localStorage
- [ ] Check cache before fetch
- [ ] Add timestamp label in UI
- [ ] Use React Query for caching
- [ ] Avoid redundant renders
- [ ] Commit: "Phase 7: Caching and state management"

## Phase 8 — UI Polish & Motion
- [ ] Add skeleton loaders to enrichment
- [ ] Add shimmer effects
- [ ] Add hover animations
- [ ] Add toast notifications (success/error)
- [ ] Improve spacing consistency
- [ ] Refine typography hierarchy
- [ ] Commit: "Phase 8: UI polish and motion"

## Phase 9 — Testing & Hardening
- [ ] Test invalid URLs
- [ ] Test rate limiting
- [ ] Test mobile responsiveness
- [ ] Remove unused logs
- [ ] Verify no API key exposure
- [ ] Check Lighthouse score ≥ 85
- [ ] Commit: "Phase 9: Testing and hardening"

## Phase 10 — Production Deployment
- [ ] Create `.env.local` template
- [ ] Create README.md
- [ ] Verify production build passes
- [ ] Commit: "Phase 10: Production ready"
