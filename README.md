# AI Resume Builder

Build a resume that gets read. An ATS-friendly resume builder with live preview, scoring, and template customization.

## Features

- **Structured resume builder** — Personal info, summary, education, experience, projects, skills, and links
- **Live preview** — Real-time resume preview as you type
- **ATS Readiness Score** — Deterministic 0–100 score with improvement suggestions
- **Templates** — Classic, Modern, and Minimal layouts
- **Color themes** — Teal, Navy, Burgundy, Forest, Charcoal
- **Skills management** — Technical, soft skills, and tools with tag-style input and suggestions
- **Export** — Print / Save as PDF, Copy as plain text
- **Auto-save** — Data persists in localStorage
- **Build Track** — Step-by-step build system (Problem → Market → Architecture → HLD → LLD → Build → Test → Ship)

## Tech Stack

- React 18
- Vite 5
- React Router 6

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — Start building |
| `/builder` | Resume builder with form + live preview |
| `/preview` | Full preview with export options |
| `/proof` | Final submission and artifact links |
| `/rb/*` | Build Track (8 steps + proof) |

## Project Structure

```
src/
├── kodnest/          # Build Track (KodNest Premium system)
├── resume/           # AI Resume Builder app
│   ├── BuilderPage.jsx
│   ├── PreviewPage.jsx
│   ├── ProofPage.jsx
│   ├── ResumePreview.jsx
│   └── resumeStore.js
├── App.jsx
└── main.jsx
```

## License

MIT
