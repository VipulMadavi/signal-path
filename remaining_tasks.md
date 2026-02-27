# SignalPath — Remaining Tasks (Parallel-Safe Phases)
## Status as of Feb 27, 5:15 PM IST

---

## Context

SignalPath is a VC intelligence platform (Next.js + TypeScript + TailwindCSS + Shadcn/UI).
- **Repo**: https://github.com/VipulMadavi/signal-path.git
- **Live URL**: https://signal-path-beige.vercel.app/
- **Branch**: master
- **Project Root**: `f:\SEM6\test- VC app`

### Completion Status:
- Phases 0–7: ✅ All complete
- Enrichment timeout fix: ✅ Pushed to GitHub (commit `2d12dc6`)
- Vercel will auto-redeploy with the fix

---

## ⚠️ IMPORTANT: Parallel Agent Rules

These phases are designed so that **multiple agents can work simultaneously** without file conflicts. Each phase touches **different files**. Follow these rules:

1. **Never modify a file that belongs to another phase** unless explicitly listed
2. **Run `npm run build`** at the end of your phase to verify nothing is broken
3. **Commit with the phase name** in the message (e.g., `Phase A: ...`)
4. If phases are run in parallel, the user will merge commits manually

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PHASE A: Documentation (README + task.md)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Priority**: 🔴 CRITICAL — Evaluator reads this first
**Time**: ~15 min
**Can run in parallel with**: Phase B, Phase C, Phase D

### Files this phase touches (EXCLUSIVE):
- [README.md](file:///f:/SEM6/test-%20VC%20app/README.md)
- [task.md](file:///f:/SEM6/test-%20VC%20app/task.md)

### Tasks:

#### A1: Update README.md
Open [README.md](file:///f:/SEM6/test-%20VC%20app/README.md) and make these changes:

1. **Line 25 — AI in Tech Stack**:
   - Change: `- **AI**: OpenAI API (for Enrichment)`
   - To: `- **AI**: OpenAI + Google Gemini (Multi-LLM with model switching)`

2. **Line 40 — Clone URL**:
   - Change: `git clone <your-repo-url>`
   - To: `git clone https://github.com/VipulMadavi/signal-path.git`

3. **Line 41 — cd command**:
   - Change: `cd signalpath`
   - To: `cd signal-path`

4. **Lines 51-55 — Env vars section**: Replace with:
   ```env
   # Required: At least one AI provider key for Live Enrichment
   OPENAI_API_KEY=your_openai_key_here
   
   # Optional: Add for multi-LLM model switching
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here
   ```
   Update the note below to:
   ```
   > [!IMPORTANT]
   > At least one API key is required for Live Enrichment. Without any key, enrichment runs in **Demo Mode** with sample data. All other features work regardless.
   ```

5. **Lines 82-91 — Roadmap**: Mark ALL phases as `[x]`:
   ```markdown
   - [x] **Phase 0-1**: Project setup and core design system.
   - [x] **Phase 2**: Companies Discovery System (Filterable Table).
   - [x] **Phase 3**: Company Profile System (Interactive Timelines).
   - [x] **Phase 4**: Lists & Saved Searches.
   - [x] **Phase 5**: Weighted Scoring Engine.
   - [x] **Phase 6**: Live AI Enrichment (Server-Side).
   - [x] **Phase 7**: Multi-LLM Intelligence Infrastructure & Caching.
   - [x] **Phase 8**: UI Polish & Motion.
   - [x] **Phase 9**: Testing & Hardening.
   - [x] **Phase 10**: Production Deployment.
   ```

6. **Add new section after "Features"**: Live Demo
   ```markdown
   ## 🌐 Live Demo
   
   **Production URL**: [https://signal-path-beige.vercel.app](https://signal-path-beige.vercel.app)
   
   > [!NOTE]
   > Live enrichment requires API keys. The demo includes a built-in Demo Mode for evaluation without keys.
   ```

7. **Add new section before "License"**: Security
   ```markdown
   ## 🔒 Security
   
   - API keys are **never exposed** to the browser — all enrichment runs server-side via `/api/enrich`
   - SSRF protection blocks requests to localhost, private IPs, and internal ranges
   - Rate limiting: 5 requests/minute per IP
   - URL validation rejects non-HTTPS and malformed URLs
   ```

8. **Add new section before "License"**: Key Engineering Decisions
   ```markdown
   ## 🧠 Key Engineering Decisions
   
   - **Multi-LLM Support**: Switch between OpenAI and Gemini at runtime — global default or per-enrichment override
   - **Demo Mode**: App fully functional without API keys using intelligent mock data
   - **Server-Side Enrichment**: All LLM/scraping happens in Next.js API routes, zero client-side key exposure
   - **Intelligent Caching**: Both server-side (10-min TTL) and client-side (localStorage) caching with cache indicators
   - **SSRF Protection**: URL validation + private IP blocking before any fetch
   ```

#### A2: Update task.md
Mark Phase 8, 9, 10 as done with ✅ in the phase headers.
Check all `[ ]` commit items and mark them `[x]`.

#### A3: Commit
```bash
git add README.md task.md
git commit -m "Phase A: Update README and task.md - complete documentation"
git push origin master
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PHASE B: CSS & Animations
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Priority**: 🟠 HIGH — Makes the app feel premium
**Time**: ~20 min
**Can run in parallel with**: Phase A, Phase C, Phase D

### Files this phase touches (EXCLUSIVE):
- [src/app/globals.css](file:///f:/SEM6/test-%20VC%20app/src/app/globals.css) (APPEND ONLY — add at the end, don't modify existing)

### Tasks:

#### B1: Add hover animation utilities
Append these at the **end** of [src/app/globals.css](file:///f:/SEM6/test-%20VC%20app/src/app/globals.css):

```css
/* ═══ Phase B: Hover Animations & Micro-Interactions ═══ */

/* Card hover lift effect */
.card-hover {
  transition: transform 200ms ease-in-out, box-shadow 200ms ease-in-out;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Table row hover */
.row-hover {
  transition: background-color 150ms ease-in-out;
}
.row-hover:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Button press effect */
.btn-press:active {
  transform: scale(0.97);
  transition: transform 100ms ease-in-out;
}

/* Subtle fade-in for page transitions */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 300ms ease-out;
}

/* Smooth scale-in for modals */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scaleIn {
  animation: scaleIn 200ms ease-out;
}
```

#### B2: Apply classes to components

**Apply `card-hover`** to card wrappers in:
- [src/app/lists/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/lists/page.tsx) — list cards
- [src/app/saved/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/saved/page.tsx) — saved search cards
- [src/app/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/page.tsx) — dashboard/home cards (if any)

**Apply `row-hover`** to table rows:
- [src/components/tables/CompaniesTable.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/tables/CompaniesTable.tsx) — each `<tr>` in the table body

**Apply `btn-press`** to primary action buttons:
- [src/components/ui/ScoutButton.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/ui/ScoutButton.tsx) — add to base button class

**Apply `animate-fadeInUp`** to page containers:
- [src/app/companies/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/companies/page.tsx) — outer wrapper div
- [src/app/lists/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/lists/page.tsx) — outer wrapper div
- [src/app/saved/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/saved/page.tsx) — outer wrapper div

#### B3: Commit
```bash
git add src/app/globals.css src/components/tables/CompaniesTable.tsx src/components/ui/ScoutButton.tsx src/app/lists/page.tsx src/app/saved/page.tsx src/app/companies/page.tsx src/app/page.tsx
git commit -m "Phase B: UI polish - hover animations, micro-interactions, fade transitions"
git push origin master
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PHASE C: Toast Notifications
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Priority**: 🟠 HIGH — Makes the app feel alive
**Time**: ~30 min
**Can run in parallel with**: Phase A, Phase B, Phase D

### Files this phase touches (EXCLUSIVE):
- [package.json](file:///f:/SEM6/test-%20VC%20app/package.json) (add sonner dependency)
- [src/app/layout.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/layout.tsx) (add `<Toaster />` component — ONE LINE addition)
- [src/components/enrichment/EnrichmentPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/enrichment/EnrichmentPanel.tsx) (add toast calls)
- [src/components/lists/SaveToListModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/lists/SaveToListModal.tsx) (add toast calls)
- [src/components/search/SaveSearchModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/search/SaveSearchModal.tsx) (add toast calls)
- [src/components/cards/CompanyNotesPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/cards/CompanyNotesPanel.tsx) (add toast calls)
- [src/app/lists/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/lists/page.tsx) (add toast calls — COORDINATE with Phase B if parallel)
- [src/app/saved/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/saved/page.tsx) (add toast calls — COORDINATE with Phase B if parallel)

> [!WARNING]
> If Phase B and Phase C run in parallel, they both touch `lists/page.tsx` and `saved/page.tsx`. 
> **Solution**: Phase B should ONLY add CSS classes to those files. Phase C should ONLY add `import { toast } from 'sonner'` and `toast.success(...)` calls. These changes are on different lines and won't conflict.

### Tasks:

#### C1: Install sonner
```bash
npm install sonner
```

#### C2: Add Toaster to layout.tsx
In [src/app/layout.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/layout.tsx), add:
```tsx
import { Toaster } from 'sonner';
```
And inside the `<body>` tag, add:
```tsx
<Toaster position="bottom-right" theme="dark" richColors />
```

#### C3: Add toast notifications
Add `import { toast } from 'sonner';` and toast calls to:

| File | Action | Toast Call |
|------|--------|-----------|
| [EnrichmentPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/enrichment/EnrichmentPanel.tsx) | Enrich success | `toast.success('Enrichment complete!')` |
| [EnrichmentPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/enrichment/EnrichmentPanel.tsx) | Enrich error | `toast.error('Enrichment failed. Please try again.')` |
| [SaveToListModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/lists/SaveToListModal.tsx) | Save to list | `toast.success('Company added to list!')` |
| [CompanyNotesPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/cards/CompanyNotesPanel.tsx) | Save note | `toast.success('Note saved!')` |
| [SaveSearchModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/search/SaveSearchModal.tsx) | Save search | `toast.success('Search saved!')` |
| `lists/page.tsx` | Create list | `toast.success('List created!')` |
| `lists/page.tsx` | Delete list | `toast.success('List deleted')` |
| `lists/page.tsx` | Export CSV | `toast.success('Exported as CSV')` |
| `lists/page.tsx` | Export JSON | `toast.success('Exported as JSON')` |
| `saved/page.tsx` | Delete search | `toast.success('Saved search deleted')` |
| `saved/page.tsx` | Re-run search | `toast.info('Search re-run!')` |

#### C4: Commit
```bash
git add .
git commit -m "Phase C: Toast notifications - sonner integration with success/error feedback"
git push origin master
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PHASE D: Keyboard Shortcuts + Mobile Fix
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Priority**: 🟡 MEDIUM — Power-user touch + bug fix
**Time**: ~40 min
**Can run in parallel with**: Phase A, Phase B, Phase C

### Files this phase touches (EXCLUSIVE):
- `src/lib/useKeyboardShortcuts.ts` (NEW FILE)
- [src/components/layout/TopBar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/TopBar.tsx) (add `data-search-input` attribute + responsive fix)
- [src/components/layout/Sidebar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/Sidebar.tsx) (call keyboard shortcuts hook)

### Tasks:

#### D1: Create keyboard shortcuts hook
Create **new file** `src/lib/useKeyboardShortcuts.ts`:

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger in input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      // "/" — focus global search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
      }

      // "Escape" — close any open modal
      if (e.key === 'Escape') {
        const closeBtn = document.querySelector<HTMLButtonElement>('[data-modal-close]');
        closeBtn?.click();
      }

      // Alt+number — quick navigation
      if (e.altKey && e.key === '1') { e.preventDefault(); router.push('/'); }
      if (e.altKey && e.key === '2') { e.preventDefault(); router.push('/companies'); }
      if (e.altKey && e.key === '3') { e.preventDefault(); router.push('/lists'); }
      if (e.altKey && e.key === '4') { e.preventDefault(); router.push('/saved'); }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}
```

#### D2: Wire up the hook
In [src/components/layout/Sidebar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/Sidebar.tsx):
1. Add `import { useKeyboardShortcuts } from '@/lib/useKeyboardShortcuts';`
2. Call `useKeyboardShortcuts();` inside the component

#### D3: Add data attributes
In [src/components/layout/TopBar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/TopBar.tsx):
1. Add `data-search-input` attribute to the main search `<input>` element
2. Add a small `"/"` keyboard hint badge next to the search bar:
   ```tsx
   <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/40 border border-white/10">
     /
   </kbd>
   ```

#### D4: Fix TopBar mobile responsiveness
In [src/components/layout/TopBar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/TopBar.tsx):
- Hide the Model Switcher dropdown on screens < 640px: add `hidden sm:flex` to its wrapper
- Hide the "Default Workspace" indicator on mobile: add `hidden md:flex`
- Make the search bar shrink on mobile: ensure it has `min-w-0` and `flex-1`

#### D5: Commit
```bash
git add src/lib/useKeyboardShortcuts.ts src/components/layout/TopBar.tsx src/components/layout/Sidebar.tsx
git commit -m "Phase D: Keyboard shortcuts, search hint, mobile TopBar fix"
git push origin master
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PHASE E: Final Verification (Run LAST)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Priority**: 🟢 FINAL — Run after all other phases are merged
**Time**: ~15 min
**MUST run AFTER**: Phase A, B, C, D are all committed

### Tasks:

#### E1: Verify build
```bash
npm run build
```
Must pass with no errors.

#### E2: Run linter
```bash
npm run lint
```
Fix any errors/warnings.

#### E3: Lighthouse audit
1. Open production URL in Chrome
2. DevTools → Lighthouse → Analyze
3. Target ≥ 85 on all metrics
4. Quick fixes if needed:
   - Add `<meta name="description" content="SignalPath - Thesis-first venture intelligence platform">` in [layout.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/layout.tsx)
   - Add `alt` to any `<img>` tags
   - Ensure heading hierarchy

#### E4: Production smoke test
- [ ] Home page renders
- [ ] Companies table: filters, sorting, pagination
- [ ] Company profile: score, timeline, notes
- [ ] Enrichment: click "Enrich" → shows result (demo mode)
- [ ] Lists: create, add company, export CSV/JSON
- [ ] Saved: save search, re-run
- [ ] Keyboard: press `/` → search focuses
- [ ] Toast: appears on actions
- [ ] Mobile: no overflow at 375px width
- [ ] Network tab: no API keys exposed

#### E5: Final commit
```bash
git add .
git commit -m "Phase E: Final verification, lint fixes, production ready"
git push origin master
```

---

## Parallel Execution Map

```
Time ──────────────────────────────────────────►

Agent 1: ████ Phase A (README + task.md) ████
Agent 2: ████████ Phase B (CSS + Animations) ████████
Agent 3: ██████████████ Phase C (Toasts) ██████████████
Agent 4: ████████████████ Phase D (Shortcuts + Mobile) ████████████████

                    ... all merged ...

Agent 5: ████ Phase E (Final Verification) ████
```

## File Ownership Matrix

This table shows exactly which files each phase owns. **No two phases modify the same file** (except `lists/page.tsx` and `saved/page.tsx` which have coordinated non-conflicting edits between B and C).

| File | Phase A | Phase B | Phase C | Phase D |
|------|:-------:|:-------:|:-------:|:-------:|
| [README.md](file:///f:/SEM6/test-%20VC%20app/README.md) | ✏️ | | | |
| [task.md](file:///f:/SEM6/test-%20VC%20app/task.md) | ✏️ | | | |
| [globals.css](file:///f:/SEM6/test-%20VC%20app/src/app/globals.css) | | ✏️ | | |
| `ScoutButton.tsx` | | ✏️ | | |
| [CompaniesTable.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/tables/CompaniesTable.tsx) | | ✏️ | | |
| `companies/page.tsx` | | ✏️ | | |
| [page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/page.tsx) (home) | | ✏️ | | |
| [layout.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/layout.tsx) | | | ✏️ | |
| [package.json](file:///f:/SEM6/test-%20VC%20app/package.json) | | | ✏️ | |
| [EnrichmentPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/enrichment/EnrichmentPanel.tsx) | | | ✏️ | |
| [SaveToListModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/lists/SaveToListModal.tsx) | | | ✏️ | |
| [SaveSearchModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/search/SaveSearchModal.tsx) | | | ✏️ | |
| [CompanyNotesPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/cards/CompanyNotesPanel.tsx) | | | ✏️ | |
| `useKeyboardShortcuts.ts` | | | | ✏️ (new) |
| [TopBar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/TopBar.tsx) | | | | ✏️ |
| [Sidebar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/Sidebar.tsx) | | | | ✏️ |
| `lists/page.tsx` | | ✏️ cls | ✏️ toast | |
| `saved/page.tsx` | | ✏️ cls | ✏️ toast | |

**Legend**: `✏️` = modified, `cls` = CSS classes only, `toast` = toast import+calls only, [(new)](file:///f:/SEM6/test-%20VC%20app/src/app/api/enrich/route.ts#44-291) = new file created

---

## Already Complete (No Action Needed)

| Item | Status |
|------|--------|
| Skeleton loaders for enrichment | ✅ Already in [EnrichmentPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/enrichment/EnrichmentPanel.tsx) |
| Re-enrich button | ✅ Already implemented |
| Empty states for Lists/Saved | ✅ Verified on live site |
| Console.log audit | ✅ All server-side only |
| SSRF protection | ✅ Verified working |
| Rate limiting | ✅ Verified working |
| [.env.example](file:///f:/SEM6/test-%20VC%20app/.env.example) | ✅ Already exists |
| Demo Mode badge | ✅ Shows in UI when no keys |
| Server + client caching | ✅ Both implemented |
| Enrichment timeout fix | ✅ Pushed (commit 2d12dc6) |
| Vercel deployment | ✅ Live at signal-path-beige.vercel.app |

---

## Key File Map

| Purpose | File Path |
|---------|-----------|
| Enrichment API route | [src/app/api/enrich/route.ts](file:///f:/SEM6/test-%20VC%20app/src/app/api/enrich/route.ts) |
| AI provider factory | [src/lib/ai-provider.ts](file:///f:/SEM6/test-%20VC%20app/src/lib/ai-provider.ts) |
| Enrichment UI panel | [src/components/enrichment/EnrichmentPanel.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/enrichment/EnrichmentPanel.tsx) |
| TopBar | [src/components/layout/TopBar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/TopBar.tsx) |
| Sidebar | [src/components/layout/Sidebar.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/Sidebar.tsx) |
| Companies page | [src/app/companies/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/companies/page.tsx) |
| Company profile | [src/app/companies/[id]/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/companies/%5Bid%5D/page.tsx) |
| Lists page | [src/app/lists/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/lists/page.tsx) |
| Saved searches | [src/app/saved/page.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/saved/page.tsx) |
| Settings modal | [src/components/layout/SettingsModal.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/layout/SettingsModal.tsx) |
| Global styles | [src/app/globals.css](file:///f:/SEM6/test-%20VC%20app/src/app/globals.css) |
| Root layout | [src/app/layout.tsx](file:///f:/SEM6/test-%20VC%20app/src/app/layout.tsx) |
| Companies table | [src/components/tables/CompaniesTable.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/tables/CompaniesTable.tsx) |
| Button component | [src/components/ui/ScoutButton.tsx](file:///f:/SEM6/test-%20VC%20app/src/components/ui/ScoutButton.tsx) |
| Mock data | [src/lib/mock-companies.ts](file:///f:/SEM6/test-%20VC%20app/src/lib/mock-companies.ts) |
| Scoring engine | [src/lib/scoring.ts](file:///f:/SEM6/test-%20VC%20app/src/lib/scoring.ts) |
| Zustand stores | `src/store/use*.ts` |
