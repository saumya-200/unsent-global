export type KnotSessionState =
    | 'idle'           // Not in session
    | 'connecting'     // Socket connecting
    | 'waiting'        // Waiting for partner
    | 'active'         // In session with partner
    | 'ending'         // Session ending
    | 'ended';         // Session ended

export interface KnotSession {
    roomId: string;
    starId: string;
    state: KnotSessionState;
    partnerCount: number;
    remainingSeconds: number;
    startedAt?: number;
    endedAt?: number;
    endReason?: 'time_expired' | 'partner_left' | 'user_left' | 'error';
}

export interface ChatMessage {
    id: string;
    message: string;
    senderId: string;
    timestamp: number;
    isOwn: boolean;
}

export interface DrawingPoint {
    x: number;
    y: number;
    type: 'start' | 'draw' | 'end';
    color?: string;
    width?: number;
}
