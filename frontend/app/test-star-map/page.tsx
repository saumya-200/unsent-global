'use client';

import { useEffect, useState } from 'react';
import { StarMap } from '@/components/StarMap';
import { Star, Emotion } from '@/lib/types';

// Generate mock stars for testing
function generateMockStars(count: number): Star[] {
    const emotions: Emotion[] = ['joy', 'sadness', 'anger', 'fear', 'gratitude', 'regret', 'love', 'hope', 'loneliness'];
    return Array.from({ length: count }, (_, i) => ({
        id: `star-${i}`,
        emotion: emotions[i % emotions.length],
        language: 'en',
        resonance_count: Math.floor(Math.pow(Math.random() * 5, 2)), // Weighted towards lower resonance
        created_at: new Date().toISOString(),
        message_preview: `Test message ${i} - A glimpse into an anonymous soul...`
    }));
}

export default function TestStarMapPage() {
    const [stars, setStars] = useState<Star[]>([]);
    const [hoveredStar, setHoveredStar] = useState<Star | null>(null);

    useEffect(() => {
        // Generate mock stars after mount
        setStars(generateMockStars(300));
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000' }}>
            <StarMap
                stars={stars}
                onStarClick={(star) => alert(`Clicked star: ${star.id}\nEmotion: ${star.emotion}\nMessage: ${star.message_preview}`)}
                onStarHover={(star) => setHoveredStar(star)}
            />

            {/* Absolute UI overlay for testing info */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'white',
                pointerEvents: 'none',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.5)',
                padding: '10px'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.2rem' }}>UNSENT StarMap Debug</h1>
                <p>Star Count: {stars.length}</p>
                <p>Hovered: {hoveredStar ? `${hoveredStar.id} (${hoveredStar.emotion})` : 'None'}</p>
            </div>
        </div>
    );
}
