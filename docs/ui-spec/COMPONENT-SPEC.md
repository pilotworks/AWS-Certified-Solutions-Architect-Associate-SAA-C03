# 🧩 AWS Learning Hub - UI Component Specification

> **Parent Spec**: [UI-ARCHITECTURE-SPEC.md](file:///Users/tienpham/Work/entj-pham/aws-learning/docs/ui-spec/UI-ARCHITECTURE-SPEC.md)  
> **Status**: Ready for Implementation  

---

## 1. Layout Component System

### 1.1 `AppLayout`
* **Placement**: Global application wrapper.
* **Sub-components**:
  - `Header`: AWS Hub logo, global search trigger (`Cmd+K`), fast study mode switcher, dark/light mode toggle, overall progress badge (%).
  - `Sidebar` (Collapsible): List of 14 modules (color-coded by domain: Compute = Orange, Storage = Cyan, Security = Red, etc.), practice tests, flashcards, architecture diagrams.
  - `MainContent`: Core content viewport.
  - `TableOfContents` (Right sidebar on desktop): Automatically extracted table of contents from markdown `H2` and `H3` headings.

---

## 2. Module & Content Components

### 2.1 `ModuleViewTabs`
Enables seamless switching across 4 module perspectives without losing scroll position:
* **Tab 1: Deep Dive (`README.md`)**: Comprehensive theory and in-depth explanations.
* **Tab 2: Fast Track (`FAST-LEARN.md` / `ULTRA-FAST-LEARN.md`)**: Toggle between 1-hour fast notes and 15-minute ultra-fast review cards.
* **Tab 3: Architecture Diagrams (`DIAGRAMS.md`)**: Interactive list of Mermaid diagrams with zoom and full-screen view.
* **Tab 4: Practice Questions (`PRACTICE-QUESTIONS.md`)**: Interactive quiz mode with instant scoring and explanations.

### 2.2 `MermaidDiagramViewer`
* **Description**: Renders Mermaid string definitions into interactive vector SVGs.
* **Key Features**:
  - `Zoom & Pan Toolbar`: Pan and zoom with mouse drag or pinch gestures.
  - `Export Button`: Download diagram as PNG or SVG image.
  - `Fullscreen Mode`: Expand diagram to full screen to inspect complex VPC topologies or multi-tier architectures.

### 2.3 `KeywordHighlighter`
* **Description**: Automatically detects and highlights key **Exam Clues** (decision drivers) in question scenarios:
  - *Cost*: `most cost-effective`, `lowest cost`, `zero maintenance` -> Amber badge.
  - *Performance*: `sub-millisecond latency`, `high throughput` -> Purple badge.
  - *Resilience*: `high availability`, `disaster recovery`, `RPO < 5 min` -> Emerald badge.
  - *Decoupling*: `asynchronous`, `loose coupling`, `buffer requests` -> Blue badge.

---

## 3. Practice & Assessment Components

### 3.1 `QuizCard` & `QuizEngine`
* **Props**:
  - `question`: Question scenario text (supports code blocks and Markdown).
  - `options`: List of choices (A, B, C, D) or multi-select options.
  - `correctAnswers`: Array of correct choice keys.
  - `explanation`: Detailed explanation breaking down why correct options are right and incorrect options are wrong.
  - `keywords`: Key decision clues extracted from the question.
* **States**:
  - `Unanswered`: User selects single or multiple choices.
  - `Submitted`: Highlights correct options in green and incorrect selections in red. Displays breakdown explanation box and keyword badges.
  - `Flagged`: Marks question for review before final submission.

### 3.2 `Flashcard3D`
* **Description**: Interactive 3D flip card with smooth CSS perspective animations.
* **Front (Question/Scenario)**: Problem context (e.g., *"Need shared file storage using NFS for hundreds of Linux EC2 instances"*).
* **Back (Solution & Key Points)**: Recommended AWS service (`Amazon EFS`) plus 3 critical bullet points.
* **Actions**:
  - `Mastered`: Moves card to completed deck.
  - `Need Review`: Re-queues card for subsequent rounds (Spaced Repetition).

### 3.3 `ExamTimer`
* 130-minute live countdown timer.
* Warning alert when fewer than 15 minutes remain.
* Auto-submits exam when time expires and saves score into local exam history.

---

## 4. Search & Reference Components

### 4.1 `CommandPalette` (`Cmd + K` / `Ctrl + K`)
* Instant fuzzy search across:
  - AWS Services (e.g., typing `Aurora` jumps directly to Database module).
  - Architecture concepts (e.g., typing `S3 Glacier Deep Archive` opens retrieval time matrix).
  - Practice questions and exam keywords.

### 4.2 `DecisionMatrixTable`
* Multi-dimensional interactive comparison tables with filtering:
  - S3 Storage Classes (Standard, Infrequent Access, Glacier Instant, Glacier Deep Archive).
  - Elastic Load Balancers (ALB vs NLB vs GWLB).
  - RDS vs Aurora failover times and replication limits.
