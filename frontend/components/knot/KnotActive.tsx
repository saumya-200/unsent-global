import React from 'react';
import { KnotSession } from '../../lib/types/knot.types';
import { ChatInterface } from './chat/ChatInterface';
import { DrawingCanvas } from './canvas/DrawingCanvas';

interface KnotActiveProps {
    session: KnotSession;
    onLeave: () => void;
}

export const KnotActive: React.FC<KnotActiveProps> = ({ session, onLeave }) => {
    return (
        <div className="h-full flex flex-col">
            {/* Timer header (placeholder - phase 7E) */}
            <div className="p-4 text-center">
                <div className="text-2xl font-mono text-white">
                    {Math.floor(session.remainingSeconds / 60)}:{String(session.remainingSeconds % 60).padStart(2, '0')}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-4 px-2 gap-2">
                {/* Drawing Canvas - Takes priority on mobile too if we want drawing */}
                <div className="flex-1 flex flex-col m-2 h-[45vh] md:h-auto min-h-[300px]">
                    <DrawingCanvas
                        roomId={session.roomId}
                        isActive={session.state === 'active'}
                    />
                </div>

                {/* Chat Interface */}
                <div className="flex-1 md:max-w-md h-[40vh] md:h-auto min-h-[300px]">
                    <ChatInterface
                        roomId={session.roomId}
                        isActive={session.state === 'active'}
                    />
                </div>
            </div>
        </div>
    );
};
