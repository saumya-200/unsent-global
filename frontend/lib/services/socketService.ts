import { io, Socket } from 'socket.io-client';

// Event payload interfaces
interface KnotStartedPayload {
    room_id: string;
    star_id: string;
    partner_count: number;
    duration: number;
    message: string;
}

interface WaitingForPartnerPayload {
    room_id: string;
    star_id: string;
    message: string;
}

interface TimerUpdatePayload {
    room_id: string;
    remaining_seconds: number;
    remaining_formatted: string;
}

interface TimerWarningPayload {
    room_id: string;
    message: string;
    remaining_seconds: number;
}

interface SessionEndedPayload {
    room_id: string;
    reason: string;
    message: string;
}

interface PartnerLeftPayload {
    message: string;
    can_continue: boolean;
}

interface ChatMessagePayload {
    room_id: string;
    message: string;
    sender_id: string;
    timestamp: number;
}

interface DrawEventPayload {
    room_id: string;
    drawing_data: {
        type: 'start' | 'draw' | 'end';
        x: number;
        y: number;
        color?: string;
        width?: number;
    };
    sender_id: string;
}

// Socket service class
class SocketService {
    private socket: Socket | null = null;
    private readonly SOCKET_URL: string;

    constructor() {
        this.SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5002';
    }

    // Initialize connection
    connect(): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(this.SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
        });

        this.setupBaseListeners();
        return this.socket;
    }

    // Setup base connection listeners
    private setupBaseListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket.IO connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
        });

        this.socket.on('error', (error) => {
            console.error('Socket.IO error:', error);
        });
    }

    // Request to enter a Knot session
    requestKnot(starId: string): void {
        if (!this.socket?.connected) {
            console.error('Socket not connected');
            // Attempt to connect if not
            this.connect();
        }
        // Small delay to ensure connection or retry immediately if connected
        if (this.socket?.connected) {
            this.socket.emit('request_knot', { star_id: starId });
        } else {
            // Wait for connection then emit (basic handling)
            this.socket?.once('connect', () => {
                this.socket?.emit('request_knot', { star_id: starId });
            });
        }
    }

    // Leave current Knot session
    leaveKnot(roomId: string): void {
        if (!this.socket?.connected) return;
        this.socket.emit('leave_knot', { room_id: roomId });
    }

    // Send chat message
    sendChatMessage(roomId: string, message: string): void {
        if (!this.socket?.connected) return;
        this.socket.emit('chat_message', { room_id: roomId, message });
    }

    // Send drawing event
    sendDrawEvent(roomId: string, drawingData: DrawEventPayload['drawing_data']): void {
        if (!this.socket?.connected) return;
        this.socket.emit('draw_event', { room_id: roomId, drawing_data: drawingData });
    }

    // Get session info
    getSessionInfo(roomId: string): void {
        if (!this.socket?.connected) return;
        this.socket.emit('get_session_info', { room_id: roomId });
    }

    // Event listeners with TypeScript typing
    onConnected(callback: (data: { socket_id: string }) => void): void {
        this.socket?.on('connected', callback);
    }

    onWaitingForPartner(callback: (data: WaitingForPartnerPayload) => void): void {
        this.socket?.on('waiting_for_partner', callback);
    }

    onKnotStarted(callback: (data: KnotStartedPayload) => void): void {
        this.socket?.on('knot_started', callback);
    }

    onTimerUpdate(callback: (data: TimerUpdatePayload) => void): void {
        this.socket?.on('timer_update', callback);
    }

    onTimerWarning(callback: (data: TimerWarningPayload) => void): void {
        this.socket?.on('timer_warning', callback);
    }

    onSessionEnded(callback: (data: SessionEndedPayload) => void): void {
        this.socket?.on('session_ended', callback);
    }

    onPartnerLeft(callback: (data: PartnerLeftPayload) => void): void {
        this.socket?.on('partner_left', callback);
    }

    onChatMessage(callback: (data: ChatMessagePayload) => void): void {
        this.socket?.on('chat_message', callback);
    }

    onDrawEvent(callback: (data: DrawEventPayload) => void): void {
        this.socket?.on('draw_event', callback);
    }

    onSessionInfo(callback: (data: any) => void): void {
        this.socket?.on('session_info', callback);
    }

    onError(callback: (data: { message: string }) => void): void {
        this.socket?.on('error', callback);
    }

    // Remove event listeners
    off(event: string, callback?: Function): void {
        this.socket?.off(event, callback as any);
    }

    // Disconnect socket
    disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
    }

    // Check connection status
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Get socket ID
    getSocketId(): string | undefined {
        return this.socket?.id;
    }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
