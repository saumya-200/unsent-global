import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import socketService from '../../../lib/services/socketService';
import { ChatMessage } from '../../../lib/types/knot.types';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
    roomId: string;
    isActive: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ roomId, isActive }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new message arrives
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Listen for incoming messages
    useEffect(() => {
        const handleChatMessage = (data: any) => {
            const newMessage: ChatMessage = {
                id: `${data.sender_id}-${data.timestamp}`,
                message: data.message,
                senderId: data.sender_id,
                timestamp: data.timestamp,
                isOwn: data.sender_id === socketService.getSocketId(),
            };

            setMessages(prev => [...prev, newMessage]);
        };

        socketService.onChatMessage(handleChatMessage);

        return () => {
            socketService.off('chat_message', handleChatMessage);
        };
    }, []);

    // Send message handler
    const handleSendMessage = (message: string) => {
        if (!message.trim() || !isActive || isSending) return;

        setIsSending(true);

        // Optimistically add own message to UI
        const ownMessage: ChatMessage = {
            id: `${socketService.getSocketId()}-${Date.now()}`,
            message: message.trim(),
            senderId: socketService.getSocketId() || 'me',
            timestamp: Date.now(),
            isOwn: true,
        };

        setMessages(prev => [...prev, ownMessage]);

        // Send to server
        socketService.sendChatMessage(roomId, message.trim());

        // Reset sending state
        setTimeout(() => setIsSending(false), 300);
    };

    return (
        <div className="flex flex-col h-full bg-white/5 backdrop-blur-md rounded-lg overflow-hidden border border-white/5">
            {/* Header */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <h3 className="text-sm font-medium text-gray-300">Chat</h3>
            </div>

            {/* Messages container */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center h-full"
                        >
                            <p className="text-gray-500 text-sm text-center">
                                Say hello to start the conversation
                            </p>
                        </motion.div>
                    ) : (
                        messages.map((message) => (
                            <ChatMessageBubble
                                key={message.id}
                                message={message}
                            />
                        ))
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
                onSend={handleSendMessage}
                disabled={!isActive || isSending}
                placeholder={isActive ? "Type a message..." : "Session ended"}
            />
        </div>
    );
};
