import { create } from 'zustand'
import { supabase } from './supabase'

export interface Node {
    id: string
    name: string
    role: "Direct Report" | "Manager" | "Peer" | "Stakeholder" | "Mentor"
    group?: string
    x?: number
    y?: number
}

export interface Link {
    source: string
    target: string
    type: "Reporting" | "Collaboration" | "Advisory"
}

export interface Valence {
    trust: number
    communication: number
    support: number
    respect: number
    alignment: number
    notes?: string
}

interface SessionState {
    nodes: Node[]
    links: Link[]
    valence: Record<string, Valence> // Keyed by link ID (source-target)
    selectedNodeId: string | null
    selectedLinkId: string | null

    addNode: (node: Node) => void
    addLink: (link: Link) => void
    updateValence: (linkId: string, valence: Valence) => void
    selectNode: (id: string | null) => void
    selectLink: (id: string | null) => void
    loadSession: (data: any) => void
    saveSession: () => Promise<void>
}

export const useStore = create<SessionState>((set, get) => ({
    nodes: [
        { id: 'me', name: 'Me', role: 'Peer', x: 0, y: 0 } // Center node
    ],
    links: [],
    valence: {},
    selectedNodeId: null,
    selectedLinkId: null,

    addNode: (node) => {
        set((state) => ({ nodes: [...state.nodes, node] }))
        get().saveSession()
    },
    addLink: (link) => {
        set((state) => ({ links: [...state.links, link] }))
        get().saveSession()
    },
    updateValence: (linkId, valence) => {
        set((state) => ({
            valence: { ...state.valence, [linkId]: valence }
        }))
        get().saveSession()
    },
    selectNode: (id) => set({ selectedNodeId: id, selectedLinkId: null }),
    selectLink: (id) => set({ selectedLinkId: id, selectedNodeId: null }),
    loadSession: (data) => set(data),

    saveSession: async () => {
        const state = get()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return

        // Simple JSON blob storage for MVP
        // In a real app, this would be normalized tables
        const snapshot = {
            nodes: state.nodes,
            links: state.links,
            valence: state.valence,
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('sessions')
            .upsert({
                user_id: session.user.id,
                data: snapshot
            }, { onConflict: 'user_id' })

        if (error) console.error('Error saving session:', error)
    }
}))
