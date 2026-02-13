# AI Research Roadmap - Frontend Design Document

## 1. Project Overview
The **AI Research Roadmap** is a specialized frontend application designed to visualize the technical evolution of AI research. It focuses on presenting research papers, model series (e.g., Qwen, Llama), and benchmark tasks (e.g., SWE-Bench) on an interactive timeline.

### Core Goals
1.  **Timeline Visualization**: clearly show the chronological progression of papers.
2.  **Evolution Analysis**: Integrate LLM-generated reports (`README.md`) that analyze technical trends.
3.  **Deep Dive**: Provide access to full paper contents (Markdown) and summaries.
4.  **Data-Driven**: Fully dynamic, driven by JSON configurations and S3-hosted content.

---

## 2. Technical Architecture

### Tech Stack
*   **Framework**: React 18 (Vite Build)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Library**: shadcn/ui (Radix UI based)
*   **Routing**: React Router v6
*   **Icons**: Lucide React
*   **Animations**: Framer Motion (Crucial for timeline interactions)
*   **Markdown Rendering**: 
    *   `react-markdown`
    *   `rehype-highlight` (Code highlighting)
    *   `rehype-mathjax` / `remark-math` (Math formula support)
    *   `rehype-raw` (For complex HTML embedded in markdown if needed)
*   **State Management**: React Query (TanStack Query) - *Recommended for caching API and S3 requests.*

### Data Sources
1.  **Semantic Scholar API**:
    *   Used to fetch real-time metadata for papers (Title, Authors, Abstract, Citations, Year).
    *   Key: `paper_id` (ArXiv ID or DOI).
2.  **Hugging Face API**:
    *   Used to fetch model statistics (Downloads, Likes) for models linked to papers.
3.  **AWS S3 (Object Storage)**:
    *   Stores the static assets (JSON configs, Markdown papers, Reports).

---

## 3. Data Schema & Storage Convention

To ensure scalability and clean separation, we define the following S3 storage structure. 
**Base URL**: `https://pub-f31a5865021b44d0a2c4003b3da37f04.r2.dev/ai_research_roadmap/`

### 3.1. Directory Structure
```
/
├── index.json                  # Global registry of available series and benchmarks
├── series/
│   ├── Qwen.json               # The source JSON provided by user
│   └── Llama.json
├── benchmarks/
│   └── SWE-Bench.json
├── reports/
│   ├── series/
│   │   └── Qwen.md             # The comprehensive evolution report (README)
│   └── benchmarks/
│       └── SWE-Bench.md
└── papers/
    ├── 2309.00071/             # ArXiv ID
    │   ├── content.md          # Full paper converted via PaddleOCR
    │   └── summary.md          # LLM generated summary
    └── ...
```

### 3.2. JSON Schema Definition

**`index.json` (Global Config)**
```json
{
  "series": [
    { "id": "Qwen", "name": "Qwen Series", "description": "Evolution of Qwen LLMs", "cover": "url..." }
  ],
  "benchmarks": [
    { "id": "SWE-Bench", "name": "SWE-Bench", "description": "Software Engineering Agents", "cover": "url..." }
  ]
}
```

**`series/{id}.json` (e.g., Qwen.json)**
*Based on the provided example, extended for frontend needs.*
```json
{
  "repo_name": "Qwen",
  "total_models_scanned": 111,
  "unique_papers": [
    "https://arxiv.org/abs/2009.03300",
    "..."
  ],
  "details": [
    {
      "model_id": "Qwen/Qwen3-ASR-1.7B",
      "papers": ["https://arxiv.org/abs/2601.21337"]
    }
  ]
}
```

---

## 4. UI/UX Design

### 4.1. Page Structure

#### A. Home Page (`/`)
*   **Hero Section**: Title, Subtitle, and Search Bar.
*   **Cards Grid**: Two sections - "Model Series" and "Benchmarks".
*   **Card Design**: 
    *   Cover image (optional).
    *   Title & Description.
    *   Stats (e.g., "29 Papers", "111 Models").
    *   Link to Detail Page.

#### B. Evolution Dashboard (`/series/:id` or `/benchmark/:id`)
This is the core view. It consists of a Split View or Tabbed View:

**Layout**:
*   **Left Panel (Analysis)**: Renders the `reports/series/{id}.md`.
    *   This is the high-level "Story".
    *   **Interaction**: Clicking a citation link `[2309.00071]` in the markdown should scroll the Timeline to that paper.
*   **Right Panel (Timeline)**:
    *   **Visualization**: A vertical line with nodes.
    *   **Grouping**: Group nodes by Year/Month.
    *   **Node Content**: 
        *   Paper Title (fetched from Semantic Scholar).
        *   ArXiv ID.
        *   Badges for "Key Milestone" (derived from report or manual config).
        *   Associated Models count.
    *   **Interaction**: Clicking a node opens the **Paper Drawer/Modal**.

#### C. Paper Detail (Drawer/Modal)
*   **Header**: Title, Authors, Year, Venue.
*   **Tabs**:
    1.  **Summary**: LLM generated `summary.md`.
    2.  **Full Paper**: The converted `content.md` (PaddleOCR result).
    3.  **Models**: List of Hugging Face models linked to this paper (from `details` array).
        *   Show model card with Downloads/Likes stats.

### 4.2. Key Interactions
1.  **Metadata Hydration**:
    *   The frontend loads `Qwen.json`.
    *   It extracts ArXiv IDs.
    *   It **asynchronously** calls Semantic Scholar API to fetch titles and dates.
    *   It updates the Timeline nodes with real titles (replacing IDs).
2.  **Report Linking**:
    *   The `react-markdown` renderer for the Report panel will intercept links.
    *   If a link matches an ArXiv ID pattern, it triggers a UI action (highlight/scroll) instead of navigating away.

---

## 5. Development Roadmap

### Phase 1: Setup & Infrastructure
1.  Initialize project with `web-artifacts-builder` (Vite + React + TS).
2.  Install dependencies (`shadcn-ui`, `framer-motion`, `react-router-dom`, `tanstack-query`, `lucide-react`, `react-markdown`).
3.  Configure Tailwind theme (Modern Clean & Bold).

### Phase 2: Data Layer
1.  Implement `S3Service`: Fetch JSONs and Markdowns.
2.  Implement `SemanticScholarService`: Batch fetch paper details.
3.  Implement `HuggingFaceService`: Fetch model stats.

### Phase 3: Core Components
1.  **TimelineComponent**: The vertical visualization engine.
2.  **MarkdownRenderer**: robust component with plugins for code, math, and custom link handling.
3.  **ModelCard**: Display HF model info.

### Phase 4: Page Assembly
1.  **Dashboard Page**: Implement the Split View (Report + Timeline).
2.  **Paper Drawer**: The detail viewer.
3.  **Home Page**: Navigation hub.

### Phase 5: Polish
1.  Add loading skeletons (Skeleton UI).
2.  Implement Framer Motion transitions (Fade in, Slide up).
3.  Responsive adaptation (Mobile: Stack Report and Timeline vertically).

---

## 6. Implementation Details for Trae

*   **File Structure**:
    *   `src/services/api.ts`: API clients.
    *   `src/components/timeline/`: Timeline specific components.
    *   `src/components/markdown/`: Markdown viewers.
    *   `src/pages/Dashboard.tsx`: Main logic for Series/Benchmark view.
    *   `src/types/index.ts`: TypeScript definitions for the JSON schemas.

*   **Mocking**:
    *   Since S3 might not be populated, create a `public/mock` folder mimicking the S3 structure for local dev.
