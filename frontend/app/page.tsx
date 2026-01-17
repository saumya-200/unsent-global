import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative bg-black px-4 text-center">
            {/* Background Starfield Placeholder */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />

            <div className="z-10 animate-fade-in flex flex-col items-center gap-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-400 to-gray-600 font-display">
                    UNSENT
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-lg tracking-wide">
                    The Anonymous Map of Unspoken Human Emotion
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Loading constellation...</span>
                </div>
            </div>
        </main>
    );
}
