import React from 'react';

const HeroOverlay: React.FC = () => {
    return (
        <div className="z-10 flex flex-col items-center gap-6 pointer-events-none select-none">
            <div className="flex flex-col items-center">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600 font-display animate-fade-in">
                    UNSENT
                </h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-500 to-transparent my-2" />
                <p className="text-sm md:text-base text-gray-400 max-w-lg tracking-[0.3em] uppercase opacity-70">
                    The Anonymous Map of Unspoken Human Emotion
                </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-gray-500 text-xs italic opacity-60 max-w-xs text-center">
                    "Every star in this sky is a secret someone didn't have the words to say out loud."
                </p>
            </div>
        </div>
    );
};

export default HeroOverlay;
