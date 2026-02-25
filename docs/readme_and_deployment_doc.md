```markdown id="k4z8qp"
# README & Deployment Guide
## ScoutVC — VC Intelligence Interface + Live Enrichment

---

# 1. Project Overview

ScoutVC is a thesis-first venture intelligence platform that enables:

Discover → Evaluate → Enrich → Score → Save → Export

This application provides:

- Searchable company discovery interface
- Explainable scoring system
- Live server-side enrichment from public websites
- Lists and saved searches
- Export functionality
- Secure API key handling
- Production deployment ready

This repository contains the MVP implementation aligned with the VC Intelligence Interface + Live Enrichment assignment.

---

# 2. Tech Stack

Frontend:
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI
- Lucide Icons
- Zustand
- React Query

Backend:
- Next.js API Routes
- Server-side enrichment pipeline
- LLM integration

Deployment:
- Vercel

Storage:
- localStorage (MVP)

---

# 3. Features

## Discovery Interface

- Search
- Filters (Stage, Sector, Country)
- Sort by score, raised, signals
- Pagination
- Save search

## Company Profile

- Overview
- Signal timeline
- Score breakdown
- Notes
- Save to list

## Lists

- Create list
- Add/remove companies
- Export CSV
- Export JSON

## Live Enrichment

Server-side endpoint:
```

POST /api/enrich

```

Displays:

- AI-generated summary
- What they do (bullets)
- Keywords
- Derived signals
- Sources + timestamp

All enrichment runs server-side to protect API keys.

---

# 4. Local Development Setup

---

## 4.1 Clone Repository

```

git clone <your-repo-url>
cd scoutvc

```

---

## 4.2 Install Dependencies

```

npm install

```

or

```

yarn install

```

---

## 4.3 Environment Variables

Create `.env.local` in root:

```

OPENAI_API_KEY=your_key_here

```

Do not commit this file.

---

## 4.4 Run Development Server

```

npm run dev

```

Visit:

```

[http://localhost:3000](http://localhost:3000)

```

---

# 5. Environment Variables

Required:

```

OPENAI_API_KEY=

```

Rules:

- Must only be accessed inside server API route
- Must never be exposed to frontend
- Must not be logged

---

# 6. Project Structure

```

/app
/companies
/companies/[id]
/lists
/saved
/api/enrich

/components
/lib
/types
/store

```

Core logic:

- Scoring: `/lib/scoring.ts`
- Enrichment: `/api/enrich/route.ts`
- Storage helpers: `/lib/storage.ts`

---

# 7. Enrichment Flow

1. User clicks “Enrich”
2. Client sends POST to `/api/enrich`
3. Server:
   - Validates URL
   - Blocks internal/private IPs
   - Fetches public HTML
   - Extracts text
   - Sends to LLM
   - Parses structured JSON
4. Response returned to client
5. Result cached in localStorage
6. UI displays summary + signals + sources

---

# 8. Security Considerations

- API keys never exposed
- URL validation prevents SSRF
- Private IP ranges blocked
- Timeout protection implemented
- Rate limiting enabled
- No stack traces exposed in production

---

# 9. Caching Strategy

Client-side:

- Enrichment stored in localStorage
- Keyed by companyId
- Includes scrapedAt timestamp

If cached data exists:
- UI loads instantly
- API not called again unless refreshed

---

# 10. Export Functionality

Lists can be exported as:

- CSV
- JSON

Export includes:

- Company name
- Stage
- Sector
- Score
- Website

---

# 11. Production Deployment (Vercel)

---

## 11.1 Push to GitHub

```

git add .
git commit -m "Initial production build"
git push

```

---

## 11.2 Deploy to Vercel

1. Go to vercel.com
2. Import GitHub repository
3. Add environment variables:
   - OPENAI_API_KEY
4. Click Deploy

---

## 11.3 Validate Production

After deployment:

- Visit production URL
- Test enrichment
- Inspect network tab
- Confirm no API key exposure
- Confirm rate limiting works
- Confirm caching works

---

# 12. Production Checklist

Before submission:

- No console errors
- Lighthouse score ≥ 85
- No exposed API keys
- Enrichment works
- Lists persist
- Saved searches persist
- Score breakdown visible
- Responsive layout functional

---

# 13. Known Limitations (MVP)

- Data stored in localStorage only
- No authentication
- No real database
- Single enrichment path
- No background job queue
- No vector search

---

# 14. Future Improvements

- Database persistence (Postgres)
- Background enrichment queue
- Multi-source scraping
- Vector similarity search
- CRM integration
- Multi-user authentication
- Signal ingestion automation
- Thesis builder UI

---

# 15. License

Internal assignment project.

---

# 16. Final Deliverables

- Deployed production URL
- GitHub repository
- README
- Secure environment variables
- Working live enrichment
- Explainable scoring
- Premium UI experience

---
```
