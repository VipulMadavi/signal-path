    ````markdown
# Data Model & Schema Document
## ScoutVC — Data Structures and Storage Specification

---

# 1. Overview

This document defines all data models, interfaces, schemas, and storage structures required for the ScoutVC MVP.

The goal is to ensure:

- Strict typing (TypeScript-first)
- Clear separation between domain models
- Predictable storage structure
- Clean future migration to database

All models below must be implemented in `/types` and used consistently across frontend and backend.

---

# 2. Core Domain Models

---

# 2.1 Company Model

Represents a startup surfaced in the discovery system.

```ts
export interface Company {
  id: string
  name: string
  website: string
  sector: string
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B+"
  country: string
  city?: string
  foundedYear?: number
  raisedAmount?: number
  lastFundingDate?: string
  employeesEstimate?: string
  score: number
  signalVelocity?: number
  tags?: string[]
  createdAt: string
}
````

---

## Field Definitions

| Field             | Description                        |
| ----------------- | ---------------------------------- |
| id                | Unique identifier (UUID or string) |
| name              | Company name                       |
| website           | Primary website URL                |
| sector            | Market category                    |
| stage             | Funding stage                      |
| country           | Primary operating country          |
| city              | Optional                           |
| foundedYear       | Optional                           |
| raisedAmount      | Total capital raised               |
| lastFundingDate   | ISO date                           |
| employeesEstimate | Range string                       |
| score             | Computed score (0–100)             |
| signalVelocity    | Calculated signal intensity        |
| tags              | Optional classification tags       |
| createdAt         | ISO timestamp                      |

---

# 3. Enrichment Model

Represents structured AI extraction result.

```ts
export interface Enrichment {
  companyId: string
  summary: string
  whatTheyDo: string[]
  keywords: string[]
  derivedSignals: string[]
  sources: EnrichmentSource[]
  scrapedAt: string
}
```

---

## 3.1 EnrichmentSource

```ts
export interface EnrichmentSource {
  url: string
  title?: string
  scrapedAt: string
}
```

---

## Enrichment Rules

* Must always return structured JSON
* Must include at least one source
* scrapedAt must be ISO string
* companyId required for caching

---

# 4. Scoring Model

Represents explainable scoring breakdown.

```ts
export interface ScoreBreakdown {
  signalStrength: number
  marketTiming: number
  thesisFit: number
  team: number
  total: number
  explanation: string[]
}
```

---

## Scoring Constraints

* Each sub-score: 0–100
* Total must be weighted combination
* Explanation array must contain 2–5 bullet reasons

---

# 5. Signal Model

Signals represent events or derived activities.

```ts
export interface Signal {
  id: string
  companyId: string
  type: "Funding" | "Hiring" | "Product" | "Press" | "Patent" | "Other"
  title: string
  description: string
  sourceUrl?: string
  date: string
  createdAt: string
}
```

---

## Signal Types

Funding
Hiring
Product
Press
Patent
Other

---

# 6. List Model

Represents a curated group of companies.

```ts
export interface VCList {
  id: string
  name: string
  description?: string
  companyIds: string[]
  createdAt: string
  updatedAt: string
}
```

---

## List Constraints

* name required
* companyIds must be unique
* updatedAt must update on change

---

# 7. Saved Search Model

Represents stored filter configurations.

```ts
export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: string
  lastRunAt?: string
}
```

---

# 8. Search Filters Model

```ts
export interface SearchFilters {
  query?: string
  sector?: string[]
  stage?: string[]
  country?: string[]
  minScore?: number
  maxScore?: number
  minRaised?: number
  sortBy?: "score" | "raisedAmount" | "latestSignal"
  sortDirection?: "asc" | "desc"
}
```

---

# 9. Notes Model

Represents user-added notes per company.

```ts
export interface CompanyNote {
  id: string
  companyId: string
  content: string
  createdAt: string
  updatedAt?: string
}
```

---

# 10. Local Storage Schema (MVP)

All persisted under structured keys.

---

## 10.1 Lists Storage

Key:
`scoutvc_lists`

Value:

```ts
VCList[]
```

---

## 10.2 Saved Searches Storage

Key:
`scoutvc_saved_searches`

Value:

```ts
SavedSearch[]
```

---

## 10.3 Enrichment Cache

Key:
`scoutvc_enrichment_cache`

Value:

```ts
Record<string, Enrichment>
```

Structure:
{
[companyId]: Enrichment
}

---

## 10.4 Notes Storage

Key:
`scoutvc_notes`

Value:

```ts
CompanyNote[]
```

---

# 11. API Request/Response Schemas

---

## 11.1 Enrichment API Request

```ts
export interface EnrichmentRequest {
  url: string
  companyId: string
}
```

---

## 11.2 Enrichment API Response

```ts
export interface EnrichmentResponse {
  success: boolean
  data?: Enrichment
  error?: string
}
```

---

# 12. Validation Rules

Before processing enrichment:

* URL must start with http or https
* URL must not be localhost
* URL must not be private IP range
* Timeout must be enforced

Before saving list:

* name must not be empty
* no duplicate company IDs

Before saving search:

* filters must not be empty object

---

# 13. Future Database Migration Schema (Preview)

When migrating to DB:

Tables:

companies
enrichments
signals
lists
list_companies
saved_searches
notes

Each table will mirror TypeScript interfaces.

Primary keys:
UUID

Foreign keys:
companyId references companies.id

Indexes:

* company score
* sector
* stage
* country

---

# 14. Data Integrity Rules

* companyId must always reference valid company
* enrichment.companyId must match existing company
* signals must not exist without company
* deleting company must remove related notes and cache

---

# 15. Data Lifecycle

Company:
Seeded → Enriched → Scored → Saved

Enrichment:
Created → Cached → Replaced if re-run

List:
Created → Modified → Exported → Persisted

Saved Search:
Created → Run → Re-run → Deleted

---

# 16. Acceptance Criteria

Data model is complete when:

* All interfaces defined
* Types shared between frontend and backend
* No any types used
* All storage keys standardized
* API schemas strictly typed
* Validation rules enforced

---

```
```
