```markdown
# API & Enrichment Specification Document
## SignalPath — Server-Side Intelligence & Live Enrichment

---

# 1. Overview

This document defines:

- API route specifications
- Server-side enrichment flow
- AI extraction contract
- Security rules
- Error handling strategy
- Rate limiting strategy
- Caching strategy

This document is authoritative for all backend and AI-related logic.

All enrichment must occur server-side. API keys must never be exposed to the client.

---

# 2. API Architecture

MVP contains a single production API route:

```

POST /api/enrich

```

Future endpoints may include:

- POST /api/score
- GET /api/company/:id
- POST /api/signal

But for MVP, only enrichment is required.

---

# 3. Enrichment API — Contract

---

## 3.1 Endpoint

```

POST /api/enrich

````

---

## 3.2 Request Body

```ts
{
  companyId: string,
  url: string
}
````

---

## 3.3 Request Validation Rules

Before processing:

* companyId must exist
* url must be valid URL
* Must begin with http or https
* Must not be localhost
* Must not be internal IP
* Must not contain file:// or ftp://

Reject invalid input with 400.

---

## 3.4 Successful Response

```ts
{
  success: true,
  data: {
    companyId: string,
    summary: string,
    whatTheyDo: string[],
    keywords: string[],
    derivedSignals: string[],
    sources: {
      url: string,
      title?: string,
      scrapedAt: string
    }[],
    scrapedAt: string
  }
}
```

---

## 3.5 Error Response

```ts
{
  success: false,
  error: string
}
```

Status Codes:

* 400 — Invalid input
* 429 — Rate limited
* 500 — Internal error
* 504 — Upstream timeout

No stack traces in production.

---

# 4. Enrichment Processing Pipeline

---

## Step 1 — URL Validation

* Validate protocol
* Block private IP ranges
* Sanitize input
* Enforce timeout limits

---

## Step 2 — Website Fetch

Server-side fetch:

Constraints:

* Timeout: 10 seconds
* Max response size limit
* Only fetch HTML
* No redirect chains > 3

Headers:

* Standard user-agent
* No spoofing

---

## Step 3 — HTML Parsing

Extract:

* Main content
* About section
* Blog headlines
* Careers page presence
* Changelog presence
* Metadata tags

Remove:

* Script tags
* Style tags
* Navigation clutter
* Footer boilerplate

Limit text to safe token size before sending to LLM.

---

## Step 4 — AI Extraction

The LLM must return strict JSON.

### LLM Prompt Template

System Instruction:

You are an intelligence extraction engine. Extract structured venture-relevant information from the provided website text. Return only valid JSON.

User Input:

Website content:

{cleaned_text}

Return strictly in this format:

{
"summary": "1–2 sentence summary",
"whatTheyDo": ["bullet1", "bullet2"],
"keywords": ["keyword1", "keyword2"],
"derivedSignals": ["signal1", "signal2"]
}

No commentary. No markdown.

---

## Step 5 — Derived Signal Augmentation

In addition to LLM extraction, system must detect:

* If /careers exists → Add “Hiring activity detected”
* If blog updated in last 30 days → Add “Active content publishing”
* If changelog present → Add “Product iteration visible”
* If press page exists → Add “PR presence detected”

These signals must be appended to derivedSignals array.

---

## Step 6 — Source Attribution

Must include:

* Base website URL
* Any additional pages scraped
* scrapedAt timestamp (ISO string)

---

## Step 7 — Response Construction

Return structured response with:

* success: true
* data object
* scrapedAt timestamp

---

# 5. Rate Limiting Strategy

To prevent abuse:

* Max 5 enrichments per minute per user session
* Use simple in-memory limiter (MVP)
* Return 429 if exceeded

Future:

* Use Redis-based limiter

---

# 6. Caching Strategy

Client-side cache:

* Save enrichment in localStorage
* Keyed by companyId
* Include scrapedAt timestamp

Server-side cache (optional MVP):

* In-memory Map cache
* TTL: 10 minutes

If cache exists and is recent:

Return cached result instead of re-fetching.

---

# 7. Security Architecture

---

## 7.1 API Key Handling

Environment Variables:

```
OPENAI_API_KEY=
```

Rules:

* Never reference in client code
* Never send to browser
* Never log in production
* Access only inside server route

---

## 7.2 SSRF Protection

Block:

* 127.0.0.1
* 0.0.0.0
* 10.x.x.x
* 172.16.x.x
* 192.168.x.x

Validate DNS resolution before fetch.

---

## 7.3 Payload Protection

* Limit request body size
* Limit response size
* Limit token size sent to LLM

---

# 8. Error Handling Strategy

---

## 8.1 Network Errors

If website fetch fails:

Return:
{
success: false,
error: "Unable to fetch website."
}

---

## 8.2 LLM Failure

If model returns invalid JSON:

* Retry once
* If still invalid, return structured error

---

## 8.3 Timeout

If enrichment exceeds 20 seconds:

Return 504.

---

# 9. Observability (MVP-Level)

Log:

* Enrichment started
* Enrichment completed
* Duration
* Errors (without sensitive data)

Avoid:

* Logging full website content
* Logging API keys
* Logging user secrets

---

# 10. Testing Requirements

---

## 10.1 Unit Tests

* URL validation
* SSRF blocking
* Signal detection
* JSON parsing

---

## 10.2 Integration Tests

* Valid enrichment flow
* Invalid URL rejection
* Rate limiting

---

## 10.3 Manual Tests

* Enrich known startup website
* Test careers detection
* Test blog detection
* Test timeout behavior

---

# 11. Performance Constraints

* Enrichment under 8 seconds ideal
* Text truncation before LLM
* Avoid sending entire website if too large

---

# 12. Production Deployment Checklist

Before production:

* All API keys set in Vercel
* No API keys in frontend bundle
* URL validation tested
* SSRF protection tested
* Rate limit tested
* Error messages sanitized

---

# 13. Future Enhancements

* Background job queue
* Multi-source enrichment (RSS, GitHub)
* Vector storage
* Retry queue
* Distributed caching
* Audit logging
* Webhook triggers

---

# 14. Acceptance Criteria

Enrichment system is complete when:

* User clicks Enrich
* Server securely fetches data
* AI extracts structured fields
* Sources + timestamp displayed
* Errors handled cleanly
* No API keys exposed
* Rate limiting works
* SSRF blocked

---

```
```
