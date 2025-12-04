import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, GraphState } from '../types';

// --- Auth Store ---
const ALLOWED_EMAILS = ['coach@proactive.com', 'pilot@proactive.com'];

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async (email: string) => {
        set({ isLoading: true, error: null });
        // Simulate API delay
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
        // Clear all data on logout for security
        set({ user: null, isAuthenticated: false });
        // Also clear graph data
        useStore.getState().clearSession();
    },
}));

// --- Graph Store with Persistence ---
export const useStore = create<GraphState>()(
    persist(
        (set) => ({
            nodes: [
                { id: 'me', name: 'Me', role: 'Self', fx: 0, fy: 0 }, // Central node
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
            version: 1,
            // Only persist graph data, not selection state
            partialize: (state) => ({
                nodes: state.nodes,
                links: state.links,
                valence: state.valence
            })
        }
    )
);
