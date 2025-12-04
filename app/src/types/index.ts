export interface User {
    id: string;
    email: string;
    name: string;
    role: 'coach' | 'client';
}

export interface CoachProfile extends User {
    role: 'coach';
    certificationStatus: 'active' | 'inactive';
    specialization?: string[];
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

export interface Node {
    id: string;
    name: string;
    role: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface Link {
    source: string | Node;
    target: string | Node;
    type: string;
}

export interface Valence {
    trust: number;
    communication: number;
    support: number;
    respect: number;
    alignment: number;
    notes?: string;
}

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
