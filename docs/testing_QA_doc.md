# Testing, QA & Production Hardening Document
## SignalPath — Quality Assurance & Release Readiness Specification

---

# 1. Overview

This document defines:

- Testing strategy (unit, integration, E2E)
- Manual QA checklist
- Security validation
- Performance benchmarks
- Lighthouse requirements
- Production readiness gates
- Regression checklist
- Post-deployment monitoring plan

This document must be completed before production deployment.

---

# 2. Testing Strategy Overview

Testing layers:

1. Unit Testing
2. Integration Testing
3. End-to-End Testing
4. Manual QA
5. Security Testing
6. Performance Testing

MVP does not require 100% coverage, but critical logic must be validated.

---

# 3. Unit Testing Specification

## 3.1 Scoring Engine Tests

File: `/lib/scoring.ts`

Test Cases:

- Weighted score calculation correct
- Breakdown values sum correctly
- Explanation array generated
- Deterministic output for same input
- Edge case: missing signals
- Edge case: zero values

Expected Outcome:
- No floating point inconsistencies
- No NaN outputs

---

## 3.2 Filter Logic Tests

File: `/lib/filters.ts`

Test Cases:

- Single filter works
- Multiple filters combine correctly
- Empty filter returns full dataset
- Sorting ascending/descending
- Score range filtering
- Invalid filter input handled gracefully

---

## 3.3 URL Validation Tests

File: `/lib/enrichment.ts`

Test Cases:

- Valid https URL passes
- Invalid protocol rejected
- Localhost rejected
- 127.0.0.1 rejected
- 192.168.x.x rejected
- file:// rejected
- Empty string rejected

---

## 3.4 SSRF Protection Tests

Test:

- Attempt to resolve internal IP
- Attempt to fetch private range
- Ensure request is blocked

---

## 3.5 JSON Parsing Tests

Test:

- LLM returns valid JSON → parsed
- LLM returns invalid JSON → retry
- LLM returns malformed JSON → handled safely

---

# 4. Integration Testing

## 4.1 Enrichment Flow

Test:

1. Click Enrich
2. Server receives request
3. Fetch succeeds
4. LLM returns structured data
5. UI renders enrichment
6. Cache stored

Validation:

- Response under 8 seconds
- No console errors
- Timestamp displayed
- Sources listed

---

## 4.2 Rate Limiting

Test:

- Trigger 6 rapid enrich calls
- 6th should return 429
- UI shows rate limit error

---

## 4.3 Caching

Test:

- Enrich company
- Refresh page
- Confirm enrichment loaded instantly
- Confirm no duplicate API call

---

# 5. End-to-End Testing (User Journey)

---

## Test 1 — Discovery to Save

1. Open Companies page
2. Apply filters
3. Open company
4. Add note
5. Save to list
6. Confirm in Lists page

Expected:
- No broken links
- No state loss
- No reload glitches

---

## Test 2 — Enrich to Export

1. Open profile
2. Enrich company
3. Save to list
4. Export CSV
5. Validate CSV structure

Expected:
- Correct data exported
- No missing fields

---

## Test 3 — Saved Search Re-run

1. Apply filters
2. Save search
3. Refresh
4. Open saved
5. Re-run
6. Confirm correct results

---

# 6. Manual QA Checklist

---

## UI Validation

- Sidebar active state correct
- No overlapping elements
- Hover states visible
- Buttons consistent
- Cards consistent
- Timeline aligned
- Score badge centered
- Typography hierarchy correct

---

## Responsiveness

- Sidebar collapses on mobile
- Table scrolls horizontally
- Cards stack vertically
- Timeline readable
- Buttons accessible

---

## Accessibility

- Keyboard navigation works
- Focus outlines visible
- Contrast ratio adequate
- Buttons accessible via Enter/Space
- No inaccessible modals

---

# 7. Security Testing

---

## 7.1 API Key Validation

- Inspect browser network tab
- Confirm no API keys exposed
- Confirm enrichment call hits /api/enrich
- Confirm no external API directly called from client

---

## 7.2 SSRF Attempt

Attempt:
- http://localhost
- http://127.0.0.1
- http://192.168.1.1

Expected:
- Blocked with 400

---

## 7.3 Error Exposure

Force error in enrichment:

Expected:
- Clean error message
- No stack trace
- No internal file path leak

---

# 8. Performance Testing

---

## 8.1 Lighthouse

Run Lighthouse on:

- Companies page
- Profile page

Minimum:

- Performance ≥ 85
- Accessibility ≥ 85
- Best Practices ≥ 85
- SEO ≥ 80

---

## 8.2 Enrichment Latency

Measure:

- Fetch time
- LLM processing time
- Total response time

Target:
- Under 8 seconds average

---

## 8.3 Bundle Size

Check:

- No large unused libraries
- No heavy images
- Avoid unnecessary polyfills

---

# 9. Edge Case Testing

---

## 9.1 Long Website Content

Test:

- Website with extremely large content

Expected:

- Text truncated safely
- No memory crash
- LLM still returns valid JSON

---

## 9.2 Website With No Content

Test:

- Minimal landing page

Expected:

- Graceful fallback
- Summary may be generic but structured

---

## 9.3 Slow Network

Simulate throttled network.

Expected:

- Loading skeleton visible
- No frozen UI
- Proper timeout handling

---

# 10. Production Hardening

---

## 10.1 Environment Variables

Verify:

- OPENAI_API_KEY set in Vercel
- Not hardcoded anywhere
- No .env committed to repo

---

## 10.2 Build Validation

Run:

- Production build
- Type check
- Lint check

Ensure:

- No warnings
- No unused variables
- No console logs in production

---

## 10.3 Network Inspection

In production:

- Enrichment call hits only /api/enrich
- No direct LLM calls from browser
- No exposed secrets in response

---

# 11. Logging & Monitoring

---

## MVP Logging

Log:

- Enrichment started
- Enrichment completed
- Duration
- Errors

Do not log:

- API keys
- Full website content
- User secrets

---

## Future Monitoring

Potential integration:

- Vercel logs
- Sentry
- Structured logging service

---

# 12. Regression Checklist

Before each new deployment:

- Test enrichment
- Test filtering
- Test list creation
- Test export
- Test scoring
- Test mobile view
- Test rate limiting

---

# 13. Release Gate Criteria

Application is production-ready only if:

- All unit tests pass
- All integration tests pass
- No security vulnerabilities detected
- No exposed API keys
- Lighthouse ≥ 85
- No console errors
- Enrichment working reliably
- Lists and saved searches persistent
- Scoring explainable
- UI polished and consistent

---

# 14. Post-Deployment Verification

After deployment:

1. Visit production URL
2. Test enrichment on real startup
3. Inspect network calls
4. Confirm environment variables active
5. Confirm no SSRF vulnerability
6. Confirm rate limiting
7. Confirm caching behavior

Only after these checks is release considered complete.

---