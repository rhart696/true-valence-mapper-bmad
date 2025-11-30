# Epic: ProActive MVP Pilot (Brownfield)
*BMAD Phase 2: Planning*
*Status: Draft*

## Executive Summary
This epic focuses on delivering a "Pilot MVP" for the **2 existing ProActive Certified Coaches**. Given the nascent stage, we will prioritize **manual onboarding** and **core relationship mapping** over complex automated integrations (like certification APIs). The goal is to get the tool in the hands of these 2 coaches immediately to validate the ProActive methodology in a digital format.

## Strategic Goals
1.  **Validate Methodology:** Ensure the digital "valence" scoring aligns with how coaches actually think.
2.  **Zero Friction Onboarding:** Manually onboard the 2 pilot coaches (white-glove service).
3.  **Session Utility:** Ensure the tool adds value *during* a coaching session (not just after).

## Scope: Pilot MVP (Weeks 1-4)

### In Scope
-   **Manual Authentication:** Allowlist for the 2 specific coach emails (no complex DB yet).
-   **Core Mapping:** Create nodes, assign ProActive categories.
-   **Valence Scoring:** 5-dimension sliders with ProActive guidance.
-   **Visual Output:** Basic force-directed graph.
-   **Local/Cloud Save:** Simple persistence for session continuity.

### Out of Scope (Deferred)
-   Automated Certification Verification (API).
-   Client Self-Service Portal.
-   Complex Reporting/PDF Generation.
-   Historical Trend Analysis (Time-series).

## Success Criteria (Pilot)
-   Both coaches successfully map 1 real client network.
-   Coaches confirm the "Valence Score" reflects reality.
-   No critical bugs during a live session.

## Key Stories (Linked)
-   `US1.1` (Modified): Manual Coach Verification.
-   `US2.1`: Create Relationship Map.
-   `US2.3`: Assess Relationship Valence.
