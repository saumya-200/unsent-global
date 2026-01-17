'use client';

import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            <div className="relative">
                {/* Animated Constellation Dots */}
                <div className="absolute -inset-10 opacity-30">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.4}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Title / Spinner */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-full animate-spin mb-8" />
                    <h2 className="text-white text-xs tracking-[1em] uppercase opacity-50 animate-pulse">
                        Loading Constellation
                    </h2>
                    <p className="text-white/20 text-[8px] tracking-[0.4em] uppercase mt-4">
                        Fetching unspoken messages...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;
