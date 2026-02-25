# Product Requirements Document (PRD)
## ScoutVC — Precision AI Scout for Venture Capital

---

# 1. Overview

## 1.1 Product Name
ScoutVC

## 1.2 Product Vision

ScoutVC is a thesis-first venture intelligence platform designed to transform fragmented VC sourcing workflows into a structured, explainable, always-on discovery engine.

The system enables:

Discover → Evaluate → Enrich → Score → Save → Export

ScoutVC reduces noise, surfaces high-signal companies earlier, and ensures that every surfaced opportunity is explainable and aligned with the fund’s thesis.

---

# 2. Problem Statement

Venture capital sourcing today suffers from:

- Tool fragmentation (multiple dashboards, alerts, newsletters)
- Generic keyword alerts instead of thesis-driven discovery
- Manual spreadsheet tracking
- Shallow company profiles
- Non-explainable scoring
- Duplicate entries
- Time lost in triage

VC teams struggle to translate “what we invest in” into durable filters and repeatable scouting workflows.

---

# 3. Product Goals

## 3.1 Primary Goals

1. Enable thesis-first discovery workflows
2. Provide fast and usable intelligence interface
3. Implement live enrichment via public data
4. Ensure explainable scoring
5. Allow structured deal tracking via lists and saved searches

## 3.2 Success Criteria

- User can discover companies via filters and search
- User can open profile and understand signals instantly
- Enrichment works end-to-end via server-side API
- Scoring breakdown is visible and explainable
- Lists and saved searches persist correctly
- Application deploys securely with no exposed API keys

---

# 4. Target Users

## 4.1 Primary Users

- VC Associates
- Investment Analysts
- Venture Scouts
- Solo GPs

## 4.2 Secondary Users

- Growth investors
- Corporate VC teams

---

# 5. Core Workflows

## 5.1 Discover Workflow

User lands on Companies page and can:

- Use global search
- Apply filters (Stage, Sector, Country)
- Sort by score or latest signal
- Paginate results
- Save search
- View high-level signals

Outcome: Identify promising companies quickly.

---

## 5.2 Profile Workflow

User opens a company profile and sees:

- Company header
- Overview
- Signal timeline
- Score breakdown
- Key stats
- Thesis match explanation

Outcome: Quickly evaluate opportunity.

---

## 5.3 Enrichment Workflow

User clicks "Enrich Profile":

1. Client calls server endpoint
2. Server fetches public website content
3. AI extracts structured fields
4. Results displayed with sources + timestamp
5. Data cached locally

Outcome: Upgrade shallow profile into intelligence-grade profile.

---

## 5.4 Action Workflow

User can:

- Save to list
- Add notes
- Export list (CSV / JSON)
- Save search
- Re-run search

Outcome: Operationalize discovery.

---

# 6. Feature Requirements (MVP)

---

## 6.1 App Shell

Must include:

- Left sidebar navigation
- Global search bar (top)
- Workspace indicator
- Notification icon
- User avatar dropdown
- Dark premium theme

Routes:

- /companies
- /companies/[id]
- /lists
- /saved

---

## 6.2 Companies Page

### Functional Requirements

- Display table of companies
- Columns:
  - Company
  - Stage
  - Sector
  - Country
  - Raised
  - Score
  - Latest Signal
- Filters:
  - Stage
  - Sector
  - Country
- Sorting:
  - Score
  - Raised
  - Latest Signal
- Pagination
- Save Search
- Add Company (mock entry)

### UI Requirements

- Hover row highlight
- Circular score badge
- Stage pill badges
- Clean spacing
- Fast filtering response

---

## 6.3 Company Profile Page

### Sections

1. Header
   - Company name
   - Stage badge
   - Score indicator
   - Website link
2. Overview card
3. Signal velocity timeline
4. Key stats panel
5. Score breakdown panel
6. Live enrichment section
7. Save to list
8. Notes section

---

## 6.4 Lists

### Functional Requirements

- Create list
- Add/remove companies
- Display companies inside list
- Export list as CSV
- Export list as JSON
- Persist data in localStorage (MVP)

---

## 6.5 Saved Searches

### Functional Requirements

- Save current filter configuration
- Store metadata:
  - Created date
  - Last run
  - New results indicator
- Re-run search button
- Delete saved search
- Persist in localStorage

---

## 6.6 Live Enrichment (Server-Side Only)

### Must Display

- Summary (1–2 sentences)
- What they do (3–6 bullets)
- Keywords (5–10)
- Derived signals (2–4)
- Sources scraped (URLs + timestamp)

### Security Requirements

- API keys never exposed client-side
- All enrichment via /api/enrich
- Environment variables only
- Validate URL before processing

---

# 7. Scoring System (MVP)

Score composed of:

- Signal Strength (30%)
- Market Timing (25%)
- Thesis Fit (30%)
- Team (15%)

Score must:

- Be explainable
- Show breakdown in UI
- Provide short reasoning

---

# 8. Non-Functional Requirements

- Lighthouse score ≥ 85
- No console errors
- Responsive layout
- Skeleton loading states
- Proper error handling
- Fast UI interactions
- Secure environment variables
- Deployable to Vercel

---

# 9. Data Persistence Strategy (MVP)

Storage Layer: localStorage

Persist:

- Lists
- Saved searches
- Enrichment cache
- Notes

Future version may migrate to database.

---

# 10. Constraints

- Public data only
- No scraping behind authentication
- No rate limit abuse
- No background queue system (MVP)
- Single enrichment path end-to-end is sufficient

---

# 11. Out of Scope (MVP)

- Multi-user authentication
- Real database persistence
- Vector similarity search
- Slack/CRM integrations
- Background job queue
- Multi-source enrichment engine

---

# 12. Future Roadmap

- Thesis builder UI
- Signal engine automation
- Background enrichment queue
- Multi-user support
- CRM integrations
- Vector-based discovery
- Real-time signal ingestion
- Multi-source scraping pipeline

---

# 13. Acceptance Criteria

MVP is complete when:

- User can search and filter companies
- User can open detailed profile
- Enrichment works server-side
- Scoring breakdown visible
- Lists and saved searches persist
- App deploys to production without exposing API keys
- UI feels premium and production-ready

---