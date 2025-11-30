# Technology Stack: True Valence Mapper (MVP)
*BMAD Phase 3: Solutioning*

## Core Stack
-   **Framework:** React 18+ (Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (for rapid UI development)
-   **State Management:** Zustand
-   **Backend/Auth:** Supabase (Free Tier)

## Key Libraries
-   **Visualization:** `d3` (specifically `d3-force`, `d3-selection`, `d3-drag`)
-   **Icons:** `lucide-react`
-   **UI Components:** `shadcn/ui` (Radix Primitives + Tailwind) - *Optional, or plain Tailwind for speed.*
-   **Routing:** `wouter` or `react-router-dom` (minimal need for MVP)

## Development Tools
-   **Package Manager:** `npm`
-   **Linting:** `eslint`
-   **Formatting:** `prettier`

## Rationale
-   **React + Vite:** Standard, fast, reliable.
-   **D3.js:** Necessary for the custom "force-directed" layout.
-   **Supabase:**
    -   **Auth:** Solves the "allowlist" problem securely out of the box.
    -   **Database:** Prevents data loss (critical for professional coaching).
    -   **Free Tier:** Perfect fit for < 50 users.
