```markdown
# Technical Architecture Document
## ScoutVC — Full Production Architecture

---

# 1. System Overview

ScoutVC is a full-stack web application built using a modern server-first architecture. It consists of:

- Client-side UI (Next.js App Router)
- Server-side API routes (secure enrichment)
- Local persistence layer (MVP)
- AI-powered enrichment pipeline
- Scoring engine
- Production deployment via Vercel

The system is designed for:

- Security (no exposed keys)
- Scalability (future DB support)
- Maintainability (clear separation of concerns)
- Extensibility (future vector search, queue systems)

---

# 2. Technology Stack

## 2.1 Frontend

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI
- Lucide Icons
- Zustand (client state)
- React Query (server state + caching)

---

## 2.2 Backend

- Next.js API Routes
- Node.js runtime
- Server-only enrichment logic
- LLM integration via API
- HTML parsing via server libraries

---

## 2.3 Deployment

- Vercel (preferred)
- Environment variables configured in dashboard
- Edge-ready architecture (future upgrade possible)

---

# 3. High-Level Architecture Diagram

```

User
↓
Next.js Frontend
↓
API Route (/api/enrich)
↓
Public Website Fetch
↓
Text Extraction
↓
LLM Processing
↓
Structured JSON Response
↓
Client UI Render + Cache

```

---

# 4. Application Folder Structure

```

/app
/layout.tsx
/page.tsx
/companies
/page.tsx
/[id]
/page.tsx
/lists
/page.tsx
/saved
/page.tsx
/api
/enrich
/route.ts

/components
/layout
/tables
/cards
/timeline
/score
/enrichment
/lists
/search
/ui

/lib
scoring.ts
enrichment.ts
storage.ts
filters.ts
utils.ts

/types
company.ts
enrichment.ts
list.ts
search.ts

/store
useCompanyStore.ts
useListStore.ts
useSearchStore.ts

```

---

# 5. Routing Architecture

Routes:

- `/companies`
- `/companies/[id]`
- `/lists`
- `/saved`
- `/api/enrich`

Dynamic routing used for company profiles.

App Router server components used for layout and page composition.

Client components used for:
- Interactive tables
- Filters
- Enrichment button
- State updates

---

# 6. State Management

## 6.1 Client State (Zustand)

Used for:

- Selected filters
- Active company
- UI toggles
- Modal states

## 6.2 Server State (React Query)

Used for:

- Enrichment API calls
- Cached enrichment results
- Retry logic

---

# 7. Data Flow Architecture

---

## 7.1 Companies Page

1. Load mock dataset
2. Apply filters (client-side)
3. Sort results
4. Paginate
5. Render table

All logic handled client-side for MVP.

---

## 7.2 Profile Page

1. Fetch company by ID
2. Load enrichment cache
3. Display profile sections
4. If enrichment exists → render structured data
5. If not → show CTA

---

## 7.3 Enrichment Flow

### Step 1: Client Request

POST to `/api/enrich` with:

```

{
url: string
}

```

---

### Step 2: Server Processing

1. Validate URL
2. Fetch website HTML
3. Extract readable text
4. Send text to LLM with structured extraction prompt
5. Parse structured JSON
6. Return formatted result

---

### Step 3: Client Render

1. Show loading skeleton
2. Display structured enrichment fields
3. Store result in localStorage cache
4. Show timestamp + sources

---

# 8. Enrichment Pipeline Design

---

## 8.1 Public Web Fetch

- Only fetch public URLs
- No auth bypass
- No scraping behind login
- Use server fetch with timeout

---

## 8.2 HTML Parsing

Extract:

- Main content
- About section
- Blog titles
- Careers page existence
- Changelog presence

Strip:
- Scripts
- Styles
- Navigation noise

---

## 8.3 LLM Structured Extraction

Prompt instructs model to return strict JSON format:

Fields required:

- summary
- whatTheyDo[]
- keywords[]
- derivedSignals[]
- sources[]

Validation step:
Ensure valid JSON before returning.

---

# 9. Security Architecture

---

## 9.1 API Key Protection

- Use process.env
- Never expose in client bundle
- Server-only execution
- No API keys in network response

---

## 9.2 Input Validation

- Validate URL format
- Reject non-http(s)
- Timeout protection
- Prevent SSRF

---

## 9.3 Error Handling

- Catch fetch errors
- Return safe error messages
- No stack traces in production

---

# 10. Scoring Engine Architecture

---

## 10.1 Score Composition

Score = Weighted Sum

Components:

- Signal Strength
- Market Timing
- Thesis Fit
- Team

---

## 10.2 Scoring Logic Location

Implemented in:

```

/lib/scoring.ts

```

Scoring must:

- Be deterministic
- Be explainable
- Output breakdown values

---

# 11. Storage Architecture (MVP)

---

## 11.1 localStorage Keys

- `scoutvc_lists`
- `scoutvc_saved_searches`
- `scoutvc_enrichment_cache`
- `scoutvc_notes`

---

## 11.2 Cache Strategy

When enrichment is successful:

1. Save under company ID
2. Store timestamp
3. On profile load → check cache
4. If cache exists → display instantly

---

# 12. Performance Considerations

- Use server components where possible
- Lazy load heavy sections
- Avoid unnecessary re-renders
- Memoize expensive computations
- Limit enrichment payload size

---

# 13. Logging Strategy

Development:
- Console logs allowed

Production:
- Minimal logs
- No sensitive data logged

Future:
- Integrate structured logging service

---

# 14. Deployment Architecture

---

## 14.1 Environment Variables

```

OPENAI_API_KEY=
SCRAPER_API_KEY=
NODE_ENV=production

```

---

## 14.2 Vercel Configuration

- Connect GitHub repo
- Add environment variables
- Enable production build
- Validate serverless API routes

---

# 15. Future Scalability Plan

Post-MVP upgrades:

- Replace localStorage with Postgres
- Add Prisma ORM
- Add background job queue
- Add Redis caching
- Add vector database
- Add multi-user authentication

---

# 16. System Boundaries

MVP intentionally excludes:

- Multi-tenant architecture
- Real-time signal ingestion
- Background enrichment workers
- CRM sync
- Slack notifications

---

# 17. Architecture Validation Checklist

Before production release:

- API keys secure
- No SSRF vulnerabilities
- Enrichment returns valid JSON
- Local cache working
- Scoring consistent
- Pages responsive
- Build passes without warnings
- Lighthouse ≥ 85

---
```
