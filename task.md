# ScoutVC — Full Build Task List

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

## Phase 2 — Companies Discovery System
- [ ] Create mock company dataset (20+ companies)
- [ ] Define Company interface in `/types/company.ts`
- [ ] Build Companies table component with columns
- [ ] Add filter dropdowns (Stage, Sector, Country)
- [ ] Implement sorting (Score, Raised, Latest Signal)
- [ ] Implement pagination
- [ ] Create Save Search modal
- [ ] Persist saved searches in localStorage
- [ ] Commit: "Phase 2: Companies discovery system"

## Phase 3 — Company Profile System
- [ ] Create dynamic route `/companies/[id]`
- [ ] Build profile header (name, stage badge, score, website link)
- [ ] Implement signal timeline component
- [ ] Create score breakdown visualization
- [ ] Add notes panel (persist in localStorage)
- [ ] Add save-to-list button
- [ ] Commit: "Phase 3: Company profile system"

## Phase 4 — Lists & Saved Searches
- [ ] Create `/lists` page
- [ ] Implement create list modal
- [ ] Add/remove companies from lists
- [ ] Implement CSV export
- [ ] Implement JSON export
- [ ] Create `/saved` page with saved searches display
- [ ] Add re-run saved search functionality
- [ ] Commit: "Phase 4: Lists and saved searches"

## Phase 5 — Scoring Engine
- [ ] Create `/lib/scoring.ts` with weighted formula
- [ ] Generate explanation bullets
- [ ] Attach scores to companies
- [ ] Display breakdown in profile page
- [ ] Display total score in companies table
- [ ] Commit: "Phase 5: Scoring engine"

## Phase 6 — Live Enrichment (Server-Side)
- [ ] Create `/api/enrich/route.ts`
- [ ] Add URL validation + SSRF protection
- [ ] Implement website fetch with timeout
- [ ] Extract readable text from HTML
- [ ] Call LLM with structured prompt
- [ ] Parse JSON response
- [ ] Return enrichment object
- [ ] Add rate limiting
- [ ] Add error handling
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
