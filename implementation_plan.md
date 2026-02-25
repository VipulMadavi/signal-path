# ScoutVC — Full Implementation Plan

Build a thesis-first venture intelligence platform (Next.js App Router + TypeScript + TailwindCSS + Shadcn/UI) following the 8 documentation files exactly. All phases are sequential; each phase gets its own git commit.

## User Review Required

> [!IMPORTANT]
> This project uses **TailwindCSS** as specified in the tech architecture doc (not vanilla CSS). The docs explicitly call for TailwindCSS + Shadcn/UI.

> [!IMPORTANT]
> **Phase 6 (Live Enrichment)** requires an `OPENAI_API_KEY` environment variable. The enrichment feature won't work without it, but the rest of the app will function with mock data.

> [!WARNING]
> The project will be initialized inside `f:\SEM6\test- VC app\` — the existing `docs/` folder and `.git` will be preserved.

---

## Proposed Changes

### Phase 0 — Project Setup ✅

#### [NEW] Next.js App (initialized in project root)

- Run `npx -y create-next-app@latest ./` with TypeScript, TailwindCSS, App Router, ESLint enabled
- Install: `zustand`, `@tanstack/react-query`, `lucide-react`
- Install Shadcn/UI via `npx shadcn@latest init`
- Configure dark theme in `globals.css` using design system colors (#0B0F14 primary bg, #111827 secondary, etc.)
- Create folder structure: `/components/{layout,tables,cards,timeline,score,enrichment,lists,search,ui}`, `/lib`, `/types`, `/store`

**Commit: `Phase 0: Project setup`**

---

### Phase 1 — Core Layout & Design System ✅

#### [NEW] [Sidebar.tsx](file:///f:/SEM6/test-%20VC%20app/components/layout/Sidebar.tsx)
- Fixed 240px sidebar with dark bg (#0B0F14)
- Nav links: Companies, Lists, Saved with Lucide icons
- Active route highlight with accent border left (#00E6A8)

#### [NEW] [TopBar.tsx](file:///f:/SEM6/test-%20VC%20app/components/layout/TopBar.tsx)
- Global search input, workspace indicator, notification icon, user avatar

#### [MODIFY] [layout.tsx](file:///f:/SEM6/test-%20VC%20app/app/layout.tsx)
- Integrate Sidebar + TopBar into app shell
- Inter font family, dark background

#### [NEW] Reusable UI components
- Button variants (primary #00E6A8, secondary, ghost, danger)
- Card component (#0F172A bg, rgba white 5% border)
- Badge component (pill shape, color-coded)

**Commit: `Phase 1: Core layout and design system`**

---

### Phase 2 — Companies Discovery System ✅

#### [NEW] [company.ts](file:///f:/SEM6/test-%20VC%20app/types/company.ts)
- All TypeScript interfaces from data model doc (Company, Signal, ScoreBreakdown, etc.)

#### [NEW] Mock dataset
- 20+ realistic startup companies with all fields populated

#### [NEW] [page.tsx](file:///f:/SEM6/test-%20VC%20app/app/companies/page.tsx)
- Filterable, sortable, paginated table
- Columns: Company, Stage, Sector, Country, Raised, Score, Latest Signal
- Filter dropdowns for Stage, Sector, Country
- Sorting by Score, Raised, Latest Signal
- Pagination (10 per page)
- Save Search modal → localStorage

#### [NEW] [useCompanyStore.ts](file:///f:/SEM6/test-%20VC%20app/store/useCompanyStore.ts)
- Zustand store for filters, selected company, UI toggles

**Commit: `Phase 2: Companies discovery system`**

---

### Phase 3 — Company Profile System

#### [NEW] [page.tsx](file:///f:/SEM6/test-%20VC%20app/app/companies/[id]/page.tsx)
- Profile header with name, stage badge, score indicator, website link
- Overview card
- Signal velocity timeline (vertical with colored dots by signal type)
- Score breakdown panel (horizontal progress bars)
- Notes section (localStorage persist)
- Save to list button

#### [NEW] Timeline component, Score breakdown component

**Commit: `Phase 3: Company profile system`**

---

### Phase 4 — Lists & Saved Searches

#### [NEW] [page.tsx](file:///f:/SEM6/test-%20VC%20app/app/lists/page.tsx)
- Create list modal, display lists as cards
- Add/remove companies, CSV + JSON export

#### [NEW] [page.tsx](file:///f:/SEM6/test-%20VC%20app/app/saved/page.tsx)
- Display saved searches with metadata
- Re-run and delete functionality

#### [NEW] [useListStore.ts](file:///f:/SEM6/test-%20VC%20app/store/useListStore.ts) and [useSearchStore.ts](file:///f:/SEM6/test-%20VC%20app/store/useSearchStore.ts)
- Zustand stores with localStorage persistence

**Commit: `Phase 4: Lists and saved searches`**

---

### Phase 5 — Scoring Engine

#### [NEW] [scoring.ts](file:///f:/SEM6/test-%20VC%20app/lib/scoring.ts)
- Weighted: Signal Strength 30%, Market Timing 25%, Thesis Fit 30%, Team 15%
- Deterministic, explainable, outputs breakdown + explanation bullets

**Commit: `Phase 5: Scoring engine`**

---

### Phase 6 — Live Enrichment (Server-Side)

#### [NEW] [route.ts](file:///f:/SEM6/test-%20VC%20app/app/api/enrich/route.ts)
- POST endpoint, URL validation, SSRF protection
- HTML fetch → text extraction → LLM structured extraction
- Rate limiting (5/min), error handling, timeout (20s)

#### [NEW] [enrichment.ts](file:///f:/SEM6/test-%20VC%20app/lib/enrichment.ts)
- URL validation helpers, HTML parsing utilities

#### [NEW] Enrichment UI components (idle/loading/success/error states)

**Commit: `Phase 6: Live enrichment`**

---

### Phase 7 — Caching & State Management

#### [MODIFY] Enrichment flow
- localStorage cache keyed by companyId
- React Query integration
- Cache timestamp display

**Commit: `Phase 7: Caching and state management`**

---

### Phase 8 — UI Polish & Motion

- Skeleton loaders, shimmer effects
- Hover animations (150–250ms ease-in-out)
- Toast notifications (success/error)
- Spacing and typography refinements

**Commit: `Phase 8: UI polish and motion`**

---

### Phase 9 — Testing & Hardening

- Test invalid URLs, rate limiting, edge cases
- Mobile responsiveness check
- Remove unused logs
- Verify no API key exposure

**Commit: `Phase 9: Testing and hardening`**

---

### Phase 10 — Production Deployment

#### [NEW] [README.md](file:///f:/SEM6/test-%20VC%20app/README.md)
- Setup instructions, feature list, deployment guide

#### [NEW] [.env.example](file:///f:/SEM6/test-%20VC%20app/.env.example)
- Template for environment variables

**Commit: `Phase 10: Production ready`**

---

## Verification Plan

### Automated (per phase)
After each phase, run:
```bash
npm run build    # TypeScript type check + production build
npm run dev      # Dev server starts without errors
```

### Browser Verification (after each UI phase)
- Open `http://localhost:3000` in browser
- Verify pages render correctly, navigation works, dark theme applied
- Test filters, sorting, pagination on companies page
- Test enrichment flow on company profile
- Test list creation, export functionality

### Manual Verification (Phase 9)
1. Open browser DevTools → Network tab → confirm no API keys in requests/responses
2. Test enrichment with invalid URLs (localhost, 192.168.x.x) → expect 400 errors
3. Test rapid enrichment clicks → expect rate limiting (429)
4. Test on mobile viewport → sidebar collapses, table scrolls
5. Run Lighthouse audit → target ≥ 85 on all scores

### Git Verification
- After each phase, run `git log --oneline -5` to confirm commit history
