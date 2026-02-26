# SignalPath 🚀

**SignalPath** is a premium, thesis-first venture intelligence platform designed for modern VCs to discover, track, and analyze startups. It combines deep data visualization with AI-powered enrichment to provide a competitive edge in deal sourcing.

---

## ✨ Features

- **Companies Discovery System**: High-performance, filterable and sortable data table for exploring 20+ curated mock startups.
- **AI-Powered Live Enrichment**: Extract structured insights (team, mission, signals) directly from company websites using LLMs.
- **Heuristic Scoring Engine**: A weighted scoring formula that evaluates startups across Signal Strength, Market Timing, Thesis Fit, and Team quality.
- **Dynamic Company Profiles**: Interactive timelines of signals, score breakdowns, and integrated note-taking.
- **Personal Lists & Saved Searches**: Organize your deal flow with custom lists and one-click access to filtered searches.
- **Premium UI/UX**: A state-of-the-art dark theme built with glassmorphism, smooth micro-animations, and a focus on data density.

---

## 🛠️ Tech Stack

- **Core**: [Next.js 16](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI**: OpenAI API (for Enrichment)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd signalpath
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```
   > [!IMPORTANT]
   > The `OPENAI_API_KEY` is required for Live Enrichment. Other features work with mock data.

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
- [x] **Phase 6**: Live AI Enrichment.
- [ ] **Phase 7**: Caching & State Management.
- [ ] **Phase 8**: UI Polish & Motion system.
- [ ] **Phase 9**: Testing & Hardening.
- [ ] **Phase 10**: Production Deployment.

---

## 📄 License

This project is currently private. All rights reserved.
