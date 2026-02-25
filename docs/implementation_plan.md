# Implementation Roadmap & AI Agent Task Execution Plan
## ScoutVC — End-to-End Build Blueprint

---

# 1. Overview

This document defines:

- Exact build phases
- Step-by-step execution plan
- File-level implementation guidance
- AI agent coding order
- Validation checklist per phase
- Production readiness gates

This is the authoritative execution roadmap for the AI coding agent.

The AI agent must follow phases sequentially and complete validation before moving forward.

---

# 2. Development Phases Overview

Phase 0 — Project Setup  
Phase 1 — Core Layout & Design System  
Phase 2 — Companies Discovery System  
Phase 3 — Company Profile System  
Phase 4 — Lists & Saved Searches  
Phase 5 — Scoring Engine  
Phase 6 — Live Enrichment (Server-Side)  
Phase 7 — Caching & State Management  
Phase 8 — UI Polish & Motion  
Phase 9 — Testing & Hardening  
Phase 10 — Production Deployment  

---

# 3. Phase 0 — Project Setup

## Objectives

- Initialize project
- Install dependencies
- Configure TypeScript
- Setup Tailwind & Shadcn
- Enable dark theme
- Create folder structure

## Tasks

1. Create Next.js app (App Router)
2. Enable TypeScript
3. Install:
   - TailwindCSS
   - Shadcn UI
   - Lucide icons
   - Zustand
   - React Query
4. Configure global styles
5. Setup layout.tsx with dark background
6. Create base folder structure per architecture doc

## Validation

- App runs locally
- No TypeScript errors
- Tailwind working
- Dark theme applied
- Folder structure matches architecture spec

---

# 4. Phase 1 — Core Layout & Design System

## Objectives

- Build app shell
- Implement sidebar
- Implement top navigation
- Establish spacing + typography system

## Tasks

1. Build Sidebar component
2. Add navigation links:
   - Companies
   - Lists
   - Saved
3. Build TopBar:
   - Global search input
   - User avatar
   - Notification icon
4. Apply design tokens (colors, spacing)
5. Create reusable Button component
6. Create Card component
7. Create Badge component

## Validation

- Navigation functional
- Active route highlight working
- Layout responsive
- Components reusable and consistent

---

# 5. Phase 2 — Companies Discovery System

## Objectives

- Implement searchable, filterable table
- Implement pagination
- Implement sorting
- Persist filters in state

## Tasks

1. Create mock company dataset
2. Define Company interface
3. Build Companies table component
4. Add filter sidebar or dropdown filters:
   - Stage
   - Sector
   - Country
5. Implement sorting:
   - Score
   - Raised
   - Latest signal
6. Implement pagination
7. Create Save Search modal
8. Persist saved searches in localStorage

## Validation

- Filters correctly narrow results
- Sorting works both directions
- Pagination updates correctly
- Saved search persists after refresh
- No unnecessary re-renders

---

# 6. Phase 3 — Company Profile System

## Objectives

- Implement dynamic company route
- Build intelligence-focused layout
- Add signals timeline
- Add score breakdown panel

## Tasks

1. Create dynamic route `/companies/[id]`
2. Fetch company from dataset
3. Build profile header:
   - Name
   - Stage badge
   - Score badge
   - Website link
4. Implement signal timeline component
5. Create score breakdown visualization
6. Add notes panel
7. Add save-to-list button
8. Integrate list store

## Validation

- Profile loads correctly
- Timeline renders signals
- Score breakdown visible
- Notes persist in localStorage
- Add/remove from list works

---

# 7. Phase 4 — Lists & Saved Searches

## Objectives

- Implement list management system
- Enable export functionality

## Tasks

1. Create `/lists` page
2. Implement create list modal
3. Add remove company from list
4. Implement CSV export
5. Implement JSON export
6. Display saved searches page
7. Add re-run saved search functionality

## Validation

- Lists persist after refresh
- Export produces valid files
- Saved search re-runs correctly
- No duplicate company IDs in list

---

# 8. Phase 5 — Scoring Engine

## Objectives

- Implement weighted scoring system
- Generate explainable breakdown
- Connect scoring to UI

## Tasks

1. Create `/lib/scoring.ts`
2. Implement weighted formula
3. Generate explanation bullets
4. Attach score to company
5. Display breakdown in profile
6. Display total score in companies table

## Validation

- Score deterministic
- Breakdown sums correctly
- Explanation visible
- Sorting by score works

---

# 9. Phase 6 — Live Enrichment (Server-Side)

## Objectives

- Build secure API route
- Implement HTML fetch + parsing
- Integrate LLM
- Return structured JSON

## Tasks

1. Create `/api/enrich/route.ts`
2. Add URL validation
3. Add SSRF protection
4. Implement website fetch with timeout
5. Extract readable text
6. Call LLM with structured prompt
7. Parse JSON response
8. Return enrichment object
9. Add rate limiting
10. Add error handling

## Validation

- Enrichment works for real site
- Keys not exposed in frontend
- Invalid URLs rejected
- Timeout handled gracefully
- Derived signals appended

---

# 10. Phase 7 — Caching & State Optimization

## Objectives

- Implement enrichment cache
- Prevent duplicate API calls
- Optimize state

## Tasks

1. Store enrichment in localStorage
2. Check cache before fetch
3. Add timestamp label in UI
4. Use React Query for caching
5. Avoid redundant renders

## Validation

- Enrichment persists after refresh
- No duplicate API calls
- Cache timestamp visible
- UI loads instantly after cached enrichment

---

# 11. Phase 8 — UI Polish & Motion

## Objectives

- Add skeleton loaders
- Add subtle animations
- Improve spacing
- Add toast notifications

## Tasks

1. Add loading skeleton to enrichment
2. Add shimmer effect
3. Add hover animations
4. Add success toast
5. Add error toast
6. Improve spacing consistency
7. Refine typography hierarchy

## Validation

- No layout shifts
- Smooth interactions
- Consistent spacing
- Premium feel achieved

---

# 12. Phase 9 — Testing & Hardening

## Objectives

- Ensure security
- Remove console errors
- Validate edge cases

## Tasks

1. Test invalid URLs
2. Test rate limiting
3. Test long content websites
4. Test empty enrichment response
5. Test mobile responsiveness
6. Remove unused logs
7. Check Lighthouse score

## Validation

- Lighthouse ≥ 85
- No exposed API keys
- No runtime errors
- All features working

---

# 13. Phase 10 — Production Deployment

## Objectives

- Deploy to Vercel
- Configure environment variables
- Validate production behavior

## Tasks

1. Push to GitHub
2. Import project into Vercel
3. Add environment variables:
   - OPENAI_API_KEY
4. Build production version
5. Test live enrichment in production
6. Validate network tab (no key leaks)

## Validation

- App accessible via URL
- Enrichment works in production
- No server errors
- Production logs clean

---

# 14. AI Agent Execution Rules

The AI agent must:

- Follow document order strictly
- Not skip validation steps
- Not expose API keys
- Use strict typing
- Avoid any usage of `any`
- Ensure all state is typed
- Maintain folder structure
- Maintain naming consistency

---

# 15. Completion Criteria

The implementation is complete when:

- All phases executed
- All validations passed
- UI matches design system
- Enrichment fully functional
- Scoring explainable
- Lists and saved searches persistent
- Production deployment successful
- No security vulnerabilities present

---

# 16. Final Deliverables

- Production URL
- GitHub repository
- README with setup instructions
- Environment variable documentation
- Working live enrichment
- Premium UI
- Explainable scoring

---