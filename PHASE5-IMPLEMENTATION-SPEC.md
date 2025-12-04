# Phase 5 Implementation Specification

**Project:** True Valence Mapper (BMAD Edition)
**Date:** 2025-12-04
**Prepared By:** Claude Code (Sonnet 4.5) - Meta-Orchestration Team
**Status:** APPROVED FOR IMPLEMENTATION

---

## Executive Summary

Phase 5 implements a **fundamental paradigm shift** from 5-dimension valence scoring to simplified Strong/Moderate/Weak trust assessment, while preserving extensibility for future enhancements. Additionally implements critical pilot-readiness features: Import functionality, Error boundaries, Keyboard navigation, and UX polish.

**Total Estimated Time:** 15-22 hours
**Priority Level:** CRITICAL (blocks pilot deployment)
**Risk Level:** MEDIUM (requires careful data migration)

---

## Human Decisions (2025-12-04)

### Decision 1: Phase 5 Scope
**Approved:** Option A (Full Scope)
- Import functionality
- Error boundaries
- Keyboard navigation
- UX polish

### Decision 2: Trust Scoring Paradigm
**Approved:** Strong / Moderate / Weak (replacing High / Medium / Low)
**Future Enhancement:** Retain 5-dimension valence architecture for Phase 6+

### Decision 3: Pilot Context
**Users:** 2 ProActive Coaches + ~20 clients (10 per coach)
**Workflows:**
- Client maps independently (asynchronous)
- Coach and client map together (synchronous)
**Devices:** Desktop/laptop

### Decision 4: Bidirectional Trust Visualization
**Approved:** Option A (Two separate arrows with different colors)

### Decision 5: Data Preservation
**Approved:** Option A (Preserve 5D data in `valenceDetail` field for future)

### Decision 6: Client Self-Mapping Features
**Approved:** Options A, B, C
- A) Simplified UI for client workflow
- B) Save draft and return later (already implemented via localStorage)
- C) Share map with coach before session (via export/import)
- D) Coach comments on draft (DEFERRED to Phase 6+)

---

## Phase 5A: Trust Scoring Redesign (6-8 hours)

### 1. Update Type Definitions (30 min)

**File:** `app/src/types/index.ts`

**Current Structure:**
```typescript
export interface Valence {
    trust: number;           // -5 to +5
    communication: number;    // -5 to +5
    support: number;          // -5 to +5
    respect: number;          // -5 to +5
    alignment: number;        // -5 to +5
    notes?: string;
}
```

**New Structure:**
```typescript
// Trust score levels
export type TrustLevel = 'strong' | 'moderate' | 'weak' | 'unscored';

// Trust direction
export type TrustDirection = 'outward' | 'inward' | 'bidirectional';

// Simple trust assessment (Phase 5)
export interface TrustScore {
    level: TrustLevel;
    direction: TrustDirection;
}

// Detailed valence assessment (Phase 6+ future enhancement)
export interface ValenceDetail {
    trust: number;           // -5 to +5
    communication: number;    // -5 to +5
    support: number;          // -5 to +5
    respect: number;          // -5 to +5
    alignment: number;        // -5 to +5
}

// Combined structure for extensibility
export interface Valence {
    trustScore: TrustScore;         // Current: Strong/Moderate/Weak
    valenceDetail?: ValenceDetail;  // Future: 5-dimension assessment
    notes?: string;
}

// Legacy format for migration
export interface LegacyValence {
    trust: number;
    communication: number;
    support: number;
    respect: number;
    alignment: number;
    notes?: string;
}
```

**Update GraphState interface:**
```typescript
export interface GraphState {
    nodes: Node[];
    links: Link[];
    selectedNodeId: string | null;
    selectedLinkId: string | null;
    valence: Record<string, Valence>;
    addNode: (node: Node) => void;
    addLink: (link: Link) => void;
    selectNode: (id: string | null) => void;
    selectLink: (id: string | null) => void;
    updateValence: (linkId: string, valence: Valence) => void;
    loadSession: (data: { nodes: Node[]; links: Link[]; valence?: Record<string, Valence> }) => void;
    clearSession: () => void;
}
```

---

### 2. Create Migration Utility (1 hour)

**File:** `app/src/utils/migrate.ts` (NEW FILE)

```typescript
import type { LegacyValence, Valence, TrustLevel } from '../types';

/**
 * Migrates legacy 5-dimension valence data to new trust score format
 * Preserves original data in valenceDetail for future enhancement
 */
export function migrateLegacyValence(legacy: LegacyValence): Valence {
    // Calculate average of 5 dimensions
    const avg = (
        legacy.trust +
        legacy.communication +
        legacy.support +
        legacy.respect +
        legacy.alignment
    ) / 5;

    // Map average to trust level
    let level: TrustLevel;
    if (avg > 2) {
        level = 'strong';
    } else if (avg > -2) {
        level = 'moderate';
    } else {
        level = 'weak';
    }

    return {
        trustScore: {
            level,
            direction: 'bidirectional', // Default assumption
        },
        valenceDetail: {
            trust: legacy.trust,
            communication: legacy.communication,
            support: legacy.support,
            respect: legacy.respect,
            alignment: legacy.alignment,
        },
        notes: legacy.notes,
    };
}

/**
 * Migrates entire valence record from legacy to new format
 */
export function migrateValenceData(
    legacyValence: Record<string, LegacyValence>
): Record<string, Valence> {
    return Object.fromEntries(
        Object.entries(legacyValence).map(([linkId, v]) => [
            linkId,
            migrateLegacyValence(v),
        ])
    );
}

/**
 * Detects if data is in legacy format
 */
export function isLegacyFormat(valence: any): boolean {
    if (!valence || typeof valence !== 'object') return false;

    // Legacy format has numeric trust/communication/support/respect/alignment
    return (
        typeof valence.trust === 'number' &&
        typeof valence.communication === 'number' &&
        typeof valence.support === 'number' &&
        typeof valence.respect === 'number' &&
        typeof valence.alignment === 'number' &&
        !valence.trustScore // New format has trustScore
    );
}
```

---

### 3. Update Store with Migration (1 hour)

**File:** `app/src/lib/store.ts`

**Changes:**
1. Bump localStorage version from 1 to 2
2. Add migration logic on load
3. Update clearSession to use new format

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, GraphState, Valence } from '../types';
import { isLegacyFormat, migrateValenceData } from '../utils/migrate';

// --- Auth Store (unchanged) ---
const ALLOWED_EMAILS = ['coach@proactive.com', 'pilot@proactive.com'];

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async (email: string) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (ALLOWED_EMAILS.includes(email.toLowerCase())) {
            const user: User = {
                id: '1',
                email,
                name: 'ProActive Coach',
                role: 'coach',
            };
            set({ user, isAuthenticated: true, isLoading: false });
        } else {
            set({
                error: 'Access Denied: This email is not authorized for the Pilot MVP.',
                isLoading: false,
            });
        }
    },
    logout: () => {
        set({ user: null, isAuthenticated: false });
        useStore.getState().clearSession();
    },
}));

// --- Graph Store with Migration ---
export const useStore = create<GraphState>()(
    persist(
        (set) => ({
            nodes: [
                { id: 'me', name: 'Me', role: 'Self', fx: 0, fy: 0 },
            ],
            links: [],
            selectedNodeId: null,
            selectedLinkId: null,
            valence: {},
            addNode: (node) =>
                set((state) => ({ nodes: [...state.nodes, node] })),
            addLink: (link) =>
                set((state) => ({ links: [...state.links, link] })),
            selectNode: (id) =>
                set({ selectedNodeId: id, selectedLinkId: null }),
            selectLink: (id) =>
                set({ selectedLinkId: id, selectedNodeId: null }),
            updateValence: (linkId, valence) =>
                set((state) => ({ valence: { ...state.valence, [linkId]: valence } })),
            loadSession: (data) =>
                set({ nodes: data.nodes, links: data.links, valence: data.valence || {} }),
            clearSession: () =>
                set({
                    nodes: [{ id: 'me', name: 'Me', role: 'Self', fx: 0, fy: 0 }],
                    links: [],
                    selectedNodeId: null,
                    selectedLinkId: null,
                    valence: {}
                }),
        }),
        {
            name: 'valence-graph-storage',
            version: 2, // Bumped from 1 to 2
            migrate: (persistedState: any, version: number) => {
                if (version === 1) {
                    // Migrate from v1 (legacy valence) to v2 (trust score)
                    const state = persistedState as any;
                    if (state.valence) {
                        // Check if any valence entries are in legacy format
                        const sampleEntry = Object.values(state.valence)[0];
                        if (sampleEntry && isLegacyFormat(sampleEntry)) {
                            state.valence = migrateValenceData(state.valence);
                        }
                    }
                }
                return persistedState;
            },
            partialize: (state) => ({
                nodes: state.nodes,
                links: state.links,
                valence: state.valence
            })
        }
    )
);
```

---

### 4. Redesign Valence Editor (2-3 hours)

**File:** `app/src/components/ValenceEditor.tsx`

**Replace existing component with:**

```typescript
import { useStore } from '../lib/store'
import type { TrustLevel, TrustDirection } from '../types'
import { sanitizeNotes } from '../utils/sanitize'

export function ValenceEditor() {
  const { selectedLinkId, valence, updateValence } = useStore()

  if (!selectedLinkId) return null

  const currentValence = valence[selectedLinkId] || {
    trustScore: { level: 'unscored' as TrustLevel, direction: 'bidirectional' as TrustDirection },
    notes: ''
  }

  const handleTrustLevelChange = (level: TrustLevel) => {
    updateValence(selectedLinkId, {
      ...currentValence,
      trustScore: {
        ...currentValence.trustScore,
        level
      }
    })
  }

  const handleDirectionChange = (direction: TrustDirection) => {
    updateValence(selectedLinkId, {
      ...currentValence,
      trustScore: {
        ...currentValence.trustScore,
        direction
      }
    })
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = sanitizeNotes(e.target.value, 5000)
    updateValence(selectedLinkId, {
      ...currentValence,
      notes: sanitized
    })
  }

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Trust Assessment</h3>

      {/* Trust Level */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Trust Level
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trustLevel"
              value="strong"
              checked={currentValence.trustScore.level === 'strong'}
              onChange={() => handleTrustLevelChange('strong')}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              <span className="text-sm">Strong</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trustLevel"
              value="moderate"
              checked={currentValence.trustScore.level === 'moderate'}
              onChange={() => handleTrustLevelChange('moderate')}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-600 rounded-full"></span>
              <span className="text-sm">Moderate</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trustLevel"
              value="weak"
              checked={currentValence.trustScore.level === 'weak'}
              onChange={() => handleTrustLevelChange('weak')}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full"></span>
              <span className="text-sm">Weak</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trustLevel"
              value="unscored"
              checked={currentValence.trustScore.level === 'unscored'}
              onChange={() => handleTrustLevelChange('unscored')}
              className="text-gray-600 focus:ring-gray-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className="text-sm">Unscored</span>
            </span>
          </label>
        </div>
      </div>

      {/* Direction */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Direction
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="direction"
              value="outward"
              checked={currentValence.trustScore.direction === 'outward'}
              onChange={() => handleDirectionChange('outward')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">My trust in them (Outward →)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="direction"
              value="inward"
              checked={currentValence.trustScore.direction === 'inward'}
              onChange={() => handleDirectionChange('inward')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">Their trust in me (← Inward)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="direction"
              value="bidirectional"
              checked={currentValence.trustScore.direction === 'bidirectional'}
              onChange={() => handleDirectionChange('bidirectional')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">Mutual (↔ Bidirectional)</span>
          </label>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={currentValence.notes || ''}
          onChange={handleNotesChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Add any observations or context..."
          maxLength={5000}
        />
        <p className="text-xs text-slate-500 mt-1">
          {(currentValence.notes || '').length} / 5000 characters
        </p>
      </div>
    </div>
  )
}
```

---

### 5. Update Graph Visualization (1-2 hours)

**File:** `app/src/components/GraphCanvas.tsx`

**Update `getValenceColor` function:**

```typescript
// Calculate valence color based on trust score
const getValenceColor = (linkId: string) => {
    const linkValence = valence[linkId]
    if (!linkValence || linkValence.trustScore.level === 'unscored') {
        return '#999' // Unscored (gray)
    }

    switch (linkValence.trustScore.level) {
        case 'strong':
            return '#22c55e' // Strong trust (green)
        case 'moderate':
            return '#f59e0b' // Moderate trust (yellow/orange)
        case 'weak':
            return '#ef4444' // Weak trust (red)
        default:
            return '#999' // Default gray
    }
}
```

**Add arrow markers for directionality (if not already present):**

```typescript
// In SVG defs section
<defs>
    <marker
        id="arrow-strong"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
    >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
    </marker>
    <marker
        id="arrow-moderate"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
    >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
    </marker>
    <marker
        id="arrow-weak"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
    >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
    </marker>
    <marker
        id="arrow-unscored"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
    >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
    </marker>
</defs>
```

---

### 6. Update Export/Import (1 hour)

**File:** `app/src/App.tsx`

**Update `handleExport` to use new format:**

```typescript
const handleExport = () => {
  try {
    const { nodes, links, valence } = useStore.getState()

    // Sanitize exported data
    const sanitizedNodes = nodes.map(node => ({
      id: node.id,
      name: sanitizeInput(node.name, 100),
      role: node.role,
    }))

    const sanitizedLinks = links.map(link => ({
      source: typeof link.source === 'string' ? link.source : link.source.id,
      target: typeof link.target === 'string' ? link.target : link.target.id,
      type: link.type
    }))

    // Sanitize valence data (new format)
    const sanitizedValence = Object.fromEntries(
      Object.entries(valence).map(([linkId, v]) => [
        linkId,
        {
          trustScore: v.trustScore,
          valenceDetail: v.valenceDetail, // Preserve if present
          notes: sanitizeNotes(v.notes, 5000)
        }
      ])
    )

    const data = {
      version: '2.0', // Bumped from 1.0 to 2.0
      exportDate: new Date().toISOString(),
      nodes: sanitizedNodes,
      links: sanitizedLinks,
      valence: sanitizedValence
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valence-map-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export session. Please try again.')
  }
}
```

---

## Phase 5B: Core Features (9-14 hours)

### 1. Import Functionality (1-2 hours) - PRIORITY #1

**File:** `app/src/App.tsx`

**Add `handleImport` function:**

```typescript
const handleImport = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate schema
      if (!data.nodes || !data.links) {
        alert('Invalid file format: Missing nodes or links');
        return;
      }

      // Check version and migrate if needed
      let migratedValence = data.valence || {};

      if (data.version === '1.0' || !data.version) {
        // Old format detected - check if valence needs migration
        const sampleEntry = Object.values(migratedValence)[0];
        if (sampleEntry && isLegacyFormat(sampleEntry)) {
          migratedValence = migrateValenceData(migratedValence);
        }
      }

      // Sanitize imported data
      const sanitizedNodes = data.nodes.map((node: any) => ({
        id: node.id,
        name: sanitizeInput(node.name, 100),
        role: node.role
      }));

      const sanitizedLinks = data.links.map((link: any) => ({
        source: link.source,
        target: link.target,
        type: link.type
      }));

      // Sanitize valence data
      const sanitizedValence = Object.fromEntries(
        Object.entries(migratedValence).map(([linkId, v]: [string, any]) => [
          linkId,
          {
            trustScore: v.trustScore,
            valenceDetail: v.valenceDetail,
            notes: sanitizeNotes(v.notes, 5000)
          }
        ])
      );

      // Load into state
      loadSession({
        nodes: sanitizedNodes,
        links: sanitizedLinks,
        valence: sanitizedValence
      });

      alert('Session imported successfully');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import session. Please check the file.');
    }
  };
  input.click();
};
```

**Add import button in sidebar:**

```typescript
<button
  onClick={handleImport}
  className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
>
  📥 Import Session
</button>
```

---

### 2. Error Boundaries (1-2 hours)

**File:** `app/src/components/ErrorBoundary.tsx` (NEW FILE)

```typescript
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // In production, send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-8 bg-slate-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-slate-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reload Application
              </button>
              <button
                onClick={() => {
                  // Clear localStorage and reload
                  localStorage.removeItem('valence-graph-storage');
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear Data & Reload
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Update `app/src/main.tsx` to wrap app:**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
```

---

### 3. Keyboard Navigation (3-4 hours)

**Requirements:**
- Tab through all interactive elements
- Arrow keys for node selection
- Enter to open valence editor for selected link
- Escape to close/cancel
- Focus indicators visible

**Implementation locations:**
- `app/src/components/GraphCanvas.tsx` - Add keyboard event listeners
- `app/src/App.tsx` - Add keyboard shortcuts
- `app/src/index.css` - Add focus styles

**Key bindings:**
- Tab/Shift+Tab: Navigate UI elements
- Arrow keys: Navigate graph nodes
- Enter: Edit selected relationship
- Escape: Close editor/cancel
- Delete: Remove selected node (with confirmation)

---

### 4. UX Polish (4-6 hours)

#### A. Replace prompt() with Modal Dialog

**File:** `app/src/components/AddPersonModal.tsx` (NEW FILE)

Create proper modal for adding people instead of browser `prompt()`

#### B. Confirmation Dialogs

**File:** `app/src/components/ConfirmDialog.tsx` (NEW FILE)

For destructive actions:
- Clear session
- Delete node
- Logout with unsaved changes

#### C. Status Indicators

**File:** `app/src/App.tsx`

Add:
- "Last saved" timestamp
- "Unsaved changes" warning on logout
- Success/error toasts for actions

---

## Testing Requirements (2-3 hours)

### Real Browser Testing Checklist

Using chrome-devtools MCP:

1. **Trust Scoring**
   - Add person
   - Click relationship line
   - Select Strong trust level → verify green color
   - Select Moderate trust level → verify yellow color
   - Select Weak trust level → verify red color
   - Select Unscored → verify gray color
   - Change direction → verify arrows update

2. **Import/Export**
   - Export current session
   - Clear session
   - Import saved file
   - Verify all data restored
   - Test with legacy v1.0 file (migration)

3. **Keyboard Navigation**
   - Tab through all UI elements
   - Arrow keys select nodes
   - Enter opens valence editor
   - Escape closes editor

4. **Error Boundaries**
   - Trigger intentional error
   - Verify error boundary catches
   - Verify reload works

5. **localStorage Persistence**
   - Add data
   - Refresh browser
   - Verify data persists with new format

---

## Success Criteria

### Must Pass:
- ✅ Trust scoring uses Strong/Moderate/Weak terminology
- ✅ Valence editor shows radio buttons (not sliders)
- ✅ Graph colors match trust levels (green/yellow/red/gray)
- ✅ Import loads both v1.0 (legacy) and v2.0 (new) files correctly
- ✅ Migration preserves 5D data in `valenceDetail` field
- ✅ localStorage auto-migrates on version bump
- ✅ Error boundaries catch and display errors gracefully
- ✅ Keyboard navigation works through entire UI
- ✅ No console errors in real browser testing
- ✅ TypeScript compiles without errors

### Should Pass:
- All UI actions have confirmation dialogs
- "Last saved" indicator visible
- Focus indicators clearly visible
- Modal dialogs replace prompt/alert

---

## Risk Assessment

### HIGH RISK: Data Migration
**Risk:** Existing test data could be lost or corrupted during migration
**Mitigation:**
- localStorage version bump triggers migration automatically
- Migration preserves original 5D data in `valenceDetail`
- Test with both legacy and new data formats
- Document rollback procedure

### MEDIUM RISK: UI Paradigm Shift
**Risk:** Users familiar with sliders might be confused by radio buttons
**Mitigation:**
- Clear labels and color indicators
- Visual feedback for selections
- Help text explaining trust levels

### LOW RISK: Breaking Changes
**Risk:** Import of old exports might fail
**Mitigation:**
- Import function detects version and migrates
- Handles both v1.0 and v2.0 formats
- Clear error messages if format unrecognized

---

## Rollback Plan

If Phase 5 implementation causes critical issues:

1. **Revert commits** to Phase 4.5 (commit f4c8818)
2. **Clear localStorage** (version 2 incompatible with version 1)
3. **Notify users** to export data before upgrading

---

## Next Phase Preparation

**Phase 6 (Post-Pilot):**
- Re-enable 5-dimension valence assessment as "Advanced Mode"
- Add coach commenting on client drafts
- Implement Supabase backend for multi-device sync
- Add historical tracking

---

**Document Version:** 1.0
**Last Updated:** 2025-12-04
**Approved By:** Richard Hart (Human in Loop)
**Prepared By:** Claude Code Sonnet 4.5 Meta-Orchestration Team
