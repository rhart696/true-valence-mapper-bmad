# True Valence Mapper

React 18 + TypeScript visualization tool for mapping relationship patterns and assessing valence dimensions.

## Features

- **Interactive Force-Directed Graph**: D3.js visualization with drag-and-drop nodes
- **5-Dimension Valence Assessment**: Evaluate relationships across Trust, Communication, Support, Respect, and Goal Alignment
- **Valence-Based Link Styling**: Visual feedback with color-coded connections based on relationship health
- **Session Export**: Download your relationship maps as JSON for backup or sharing
- **ProActive Branding**: Custom styling for ProActive Resolutions coaching context

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/true-valence-mapper-bmad/`

## Usage

1. **Login**: Use `coach@proactive.com` or `pilot@proactive.com`
2. **Add People**: Click "+ Add Person" to add nodes to your network
3. **Assess Relationships**: Click on any connection line to open the Valence Editor
4. **Adjust Dimensions**: Use sliders to rate each relationship dimension from -5 (Toxic) to +5 (Vital)
5. **Export**: Click "📥 Export Session" to download your map as JSON

## Link Colors

- **Green** (#22c55e, #78BE20): Strong positive (avg > 0)
- **Gray** (#999): Neutral (avg = 0)
- **Orange** (#f59e0b): Negative (avg > -2)
- **Red** (#ef4444): Strong negative (avg ≤ -2)

## Tech Stack

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- D3.js 7.9.0 (force simulation)
- Zustand 5.0.8 (state management)
- Tailwind CSS 3.4.17
- Supabase 2.86.0 (declared, not integrated)

## Development

```bash
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── GraphCanvas.tsx       # D3 force-directed graph
│   ├── ValenceEditor.tsx     # 5-dimension assessment UI
│   └── auth/LoginPage.tsx    # Authentication
├── lib/
│   ├── store.ts              # Zustand state management
│   └── supabase.ts           # Supabase client (not integrated)
├── types/
│   └── index.ts              # TypeScript type definitions
└── App.tsx                   # Main application component
```

## BMAD Edition

This edition integrates BMAD-METHOD v6-alpha.10 for requirements modeling and validation workflows.

For governance and development guidelines, see:
- [AGENTS.md](../AGENTS.md) - Global governance
- [AGENTS.local.md](../AGENTS.local.md) - Edition-specific guidance
