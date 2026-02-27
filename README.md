# SignalPath 🚀

**SignalPath** is a premium, thesis-first venture intelligence platform designed for modern VCs to discover, track, and analyze startups. It combines deep data visualization with AI-powered enrichment to provide a competitive edge in deal sourcing.

---

## ✨ Features

- **Companies Discovery System**: High-performance, filterable and sortable data table for exploring 24 curated mock startups.
- **AI-Powered Live Enrichment**: Extract structured insights (team, mission, signals) directly from company websites using LLMs.
- **Heuristic Scoring Engine**: A weighted scoring formula that evaluates startups across Signal Strength, Market Timing, Thesis Fit, and Team quality.
- **Dynamic Company Profiles**: Interactive timelines of signals, score breakdowns, and integrated note-taking.
- **Global Search**: Instant company search from anywhere in the app — type in the top bar and press Enter to filter across all 24 startups.
- **Personal Lists & Saved Searches**: Organize your deal flow with custom lists and one-click access to filtered searches.
- **Premium UI/UX**: A state-of-the-art dark theme built with glassmorphism, smooth micro-animations, and a focus on data density.

---

## 🌐 Live Demo

**Production URL**: [https://signalpath-ai.vercel.app](https://signalpath-ai.vercel.app)

> [!NOTE]
> Live enrichment requires API keys. The demo includes a built-in Demo Mode for evaluation without keys.

---

## 🛠️ Tech Stack

- **Core**: [Next.js 16](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI**: OpenAI + Google Gemini (Multi-LLM with model switching)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VipulMadavi/signal-path.git
   cd signal-path
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   
   ```env
   # Required: At least one AI provider key for Live Enrichment
   OPENAI_API_KEY=your_openai_key_here

   # Optional: Add for multi-LLM model switching
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here
   ```
   > [!IMPORTANT]
   > At least one API key is required for Live Enrichment. Without any key, enrichment runs in **Demo Mode** with sample data. All other features work regardless.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (Routes & API)
├── components/     # UI components (Layout, Tables, UI kits)
├── lib/            # Utilities (Scoring engine, enrichment helpers)
│   └── __tests__/  # Unit tests (Vitest)
├── store/          # Zustand state management
├── types/          # TypeScript interfaces/types
└── public/         # Static assets
```

---

## 🗺️ Roadmap

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
- [x] **Phase 11**: Production Hardening (Final Audit).
- [x] **Phase 12**: Final QA — Global search wired, TopBar dropdowns (Workspace, Notifications, Profile) made interactive.

---

## 🧪 Testing

```bash
npm run test       # Vitest – 59 unit tests
npm run lint       # ESLint – 0 errors, 0 warnings
npm run build      # Next.js production build
```

| Suite            | Tests | Status |
|------------------|-------|--------|
| `scoring.test.ts`    | 16    | ✅ Pass |
| `enrichment.test.ts` | 43    | ✅ Pass |
| **Total**            | **59**| **✅ All Pass** |

---

## 🔒 Security

- API keys are **never exposed** to the browser — all enrichment runs server-side via `/api/enrich`
- SSRF protection blocks requests to localhost, private IPs, and internal ranges
- Rate limiting: 5 requests/minute per IP
- URL validation rejects non-HTTPS and malformed URLs

---

## 🧠 Key Engineering Decisions

- **Multi-LLM Support**: Switch between OpenAI and Gemini at runtime — global default or per-enrichment override
- **Demo Mode**: App fully functional without API keys using intelligent mock data
- **Server-Side Enrichment**: All LLM/scraping happens in Next.js API routes, zero client-side key exposure
- **Intelligent Caching**: Both server-side (10-min TTL) and client-side (localStorage) caching with cache indicators
- **SSRF Protection**: URL validation + private IP blocking before any fetch
- **Accessibility**: All icon-only buttons have `aria-label` attributes, semantic HTML throughout
- **Global Search**: TopBar search wires directly into Zustand store — navigates to `/companies` and live-filters results; syncs bidirectionally with the page-level search bar
- **Automated Testing**: Vitest unit tests covering scoring engine and enrichment/SSRF validation

---

## 📄 License

This project is currently private. All rights reserved.
