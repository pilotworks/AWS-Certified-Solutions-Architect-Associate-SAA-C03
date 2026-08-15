# 🎨 AWS Learning Hub - UI Architecture & Technical Specification

> **Version**: 1.0.0  
> **Target**: Web UI for AWS Certified Solutions Architect - Associate (SAA-C03) Learning & Exam Platform  
> **Status**: Ready for Implementation  

---

## 🏗️ 1. System Architecture Overview

```mermaid
graph TD
    subgraph Client ["Client Layer (Single Page Application / SSR)"]
        UI[UI Components & Layout]
        State[Global & Local State Store]
        Parsers[Markdown & Data Parsers]
        Storage[LocalStorage & IndexedDB]
    end

    subgraph Data ["Content & Assets"]
        MDDocs["Markdown Content (/docs/**/*.md)"]
        Mermaid["Mermaid Architecture Diagrams"]
        StaticAssets["AWS Icons & Badges"]
    end

    subgraph Modules ["Feature Modules"]
        M1[Dashboard & Roadmaps]
        M2[Module Explorer & Notes Viewer]
        M3[Interactive Quiz & Exam Simulator]
        M4[Interactive 3D Flashcards]
        M5[Decision Matrices & Cheat Sheets]
        M6[Command Palette Search (Cmd+K)]
    end

    MDDocs --> Parsers
    Parsers --> State
    State --> UI
    UI --> Modules
    Modules <--> Storage
```

---

## 💻 2. Technology Stack Selection

| Layer | Recommended Technology | Alternatives | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework & SSG** | **React + Vite + SSG (Vike / vite-ssg)** | Next.js SSG / Astro | Pre-rendered static HTML for 100% SEO indexability & Core Web Vitals, combined with rich React client hydration for interactive quizzes & 3D flashcards |
| **SEO & Head** | `react-helmet-async` + Schema.org JSON-LD | Static `<head>` injection | Automated canonical URLs, Open Graph previews, Twitter cards, and structured data (Course, TechArticle, Quiz) |
| **Styling** | **Tailwind CSS + CSS Variables** | Vanilla CSS Modules | Clean design tokens, responsive utilities, seamless dark/light mode switching |
| **Markdown Engine** | `react-markdown` + `remark-gfm` + `rehype-raw` | `marked` / `mdx` | High extensibility, support for GitHub-flavored tables, task lists, and raw HTML |
| **Code Highlighting** | `shiki` or `prismjs` | `highlight.js` | Accurate AWS CLI, JSON, and YAML syntax highlighting |
| **Diagram Engine** | `mermaid.js` | `react-flow` | Native rendering of Mermaid code blocks embedded in docs (loaded on-demand) |
| **Iconography** | `lucide-react` + AWS Architecture Icons | `heroicons` | Modern, consistent stroke icons with AWS service representations |
| **State & Storage** | Zustand + LocalStorage | Redux Toolkit | Lightweight, minimal boilerplate for tracking study progress and quiz history |

---

## 🎨 3. Design System & Theme Tokens

### Color Palette (AWS Cloud & Modern Dark Vibe)
```css
:root {
  /* Brand Accents */
  --color-aws-orange: #FF9900;
  --color-aws-orange-hover: #EC7211;
  --color-aws-squid-ink: #232F3E;
  --color-aws-smile-blue: #0073BB;

  /* Dark Theme (Default) */
  --bg-primary: #0F172A;      /* Slate 900 */
  --bg-secondary: #1E293B;    /* Slate 800 */
  --bg-tertiary: #334155;     /* Slate 700 */
  --bg-card: rgba(30, 41, 59, 0.7);
  --border-subtle: #334155;
  --text-primary: #F8FAFC;    /* Slate 50 */
  --text-secondary: #94A3B8;  /* Slate 400 */
  --text-accent: #38BDF8;     /* Sky 400 */

  /* Status Colors */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-info: #3B82F6;
}
```

---

## 🧭 4. Application Routes & Navigation

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | `DashboardPage` | Overall progress, study mode selector (Speed Run, Fast Track, 8-Week), metric widgets |
| `/modules` | `ModuleListPage` | List of 14 AWS service modules grouped by domain |
| `/modules/:id` | `ModuleDetailPage` | Detailed view of a module with 4 tabs: Overview, Fast-Learn, Diagrams, Practice |
| `/exam-simulator` | `ExamSimulatorPage` | Full mock exam mode: 65 randomized questions in 130 minutes with a live countdown timer |
| `/flashcards` | `FlashcardsPage` | Interactive flashcard study mode categorized by domain or randomized |
| `/cheatsheets` | `CheatsheetPage` | Quick reference tables, cheat sheets, and Decision Matrices |
| `/architecture` | `ArchitectureViewerPage` | Visual diagram explorer (Visual Guide & Mermaid Diagrams) |

---

## ⚡ 5. Client State & Local Persistence Model

All study progress and test records are saved locally in the browser (no backend required):

```typescript
export interface UserStudyState {
  // Topic completion tracking
  completedTopics: string[]; // List of topic IDs, e.g., ["01-fundamentals", "02-iam"]
  
  // Flashcard spaced-repetition progress
  flashcardProgress: {
    [cardId: string]: {
      mastered: boolean;
      lastReviewed: number; // timestamp
      reviewCount: number;
    }
  };

  // Quiz & Exam history
  quizHistory: {
    id: string;
    moduleId?: string;
    totalQuestions: number;
    score: number;
    completedAt: number;
    answers: { questionId: string; selectedOption: string; isCorrect: boolean }[];
  }[];

  // Bookmarks & Personal notes
  bookmarks: string[];
  userNotes: { [topicId: string]: string };
}
```

---

## 📑 6. Related UI Specification Documents
1. [STATIC-GENERATION-SPEC.md](./STATIC-GENERATION-SPEC.md) - React + Vite Static Site Generation (SSG), pre-rendering & performance blueprint.
2. [COMPONENT-SPEC.md](./COMPONENT-SPEC.md) - Detailed component specifications.
3. [DATA-CONTRACTS.md](./DATA-CONTRACTS.md) - TypeScript interfaces and JSON data models.
4. [PARSER-IMPLEMENTATION-GUIDE.md](./PARSER-IMPLEMENTATION-GUIDE.md) - Technical guide for extracting Markdown content into structured UI data.
