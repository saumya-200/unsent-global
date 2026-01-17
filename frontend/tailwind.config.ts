import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                display: ["var(--font-outfit)", "sans-serif"],
            },
            colors: {
                emotion: {
                    joy: "#FFD700", // Gold
                    sadness: "#4682B4", // SteelBlue
                    anger: "#DC143C", // Crimson
                    fear: "#8B008B", // DarkMagenta
                    gratitude: "#00FF7F", // SpringGreen
                    regret: "#708090", // SlateGray
                    love: "#FF69B4", // HotPink
                    hope: "#87CEEB", // SkyBlue
                    loneliness: "#4B0082", // Indigo
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
