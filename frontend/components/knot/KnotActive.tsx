import React from 'react';
import { KnotSession } from '../../lib/types/knot.types';
import { ChatInterface } from './chat/ChatInterface';

interface KnotActiveProps {
    session: KnotSession;
    onLeave: () => void;
}

export const KnotActive: React.FC<KnotActiveProps> = ({ session, onLeave }) => {
    return (
        <div className="h-full flex flex-col">
            {/* Timer header (placeholder) */}
            <div className="p-4 text-center">
                <div className="text-2xl font-mono text-white">
                    {Math.floor(session.remainingSeconds / 60)}:{String(session.remainingSeconds % 60).padStart(2, '0')}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-4 px-2 gap-2">
                {/* Drawing canvas placeholder */}
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/5">
                    <p className="text-gray-400">Drawing Canvas (Phase 7D)</p>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 md:max-w-md h-[40vh] md:h-auto">
                    <ChatInterface
                        roomId={session.roomId}
                        isActive={session.state === 'active'}
                    />
                </div>
            </div>
        </div>
    );
};
