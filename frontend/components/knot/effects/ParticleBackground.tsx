import React from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground: React.FC = () => {
    // Use fixed particles to avoid hydration mismatch
    const particles = [
        { id: 0, left: '10%', top: '20%', size: 3, duration: 15, delay: 0 },
        { id: 1, left: '30%', top: '50%', size: 2, duration: 18, delay: 2 },
        { id: 2, left: '70%', top: '30%', size: 4, duration: 20, delay: 1 },
        { id: 3, left: '80%', top: '80%', size: 2, duration: 16, delay: 3 },
        { id: 4, left: '40%', top: '90%', size: 3, duration: 19, delay: 4 },
        { id: 5, left: '20%', top: '70%', size: 2, duration: 14, delay: 2 },
        { id: 6, left: '60%', top: '10%', size: 4, duration: 21, delay: 0 },
        { id: 7, left: '90%', top: '40%', size: 2, duration: 17, delay: 5 },
        { id: 8, left: '50%', top: '50%', size: 3, duration: 18, delay: 1 },
        { id: 9, left: '15%', top: '85%', size: 2, duration: 16, delay: 3 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/40"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}
        </div>
    );
};
