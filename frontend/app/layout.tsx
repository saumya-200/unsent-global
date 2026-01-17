import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "UNSENT | The Anonymous Map of Unspoken Human Emotion",
    description: "Share your unspoken feelings with the universe. A global, anonymous, and encrypted emotion-sharing platform where your messages become stars.",
    keywords: ["anonymous", "emotion", "mental health", "confessions", "unspoken", "messages", "constellation"],
    openGraph: {
        title: "UNSENT | Anonymous Map of Human Emotion",
        description: "What if your unspoken words became stars? Experience the global constellation of human feelings.",
        url: "https://unsent.global",
        siteName: "UNSENT",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "UNSENT | Anonymous Map of Human Emotion",
        description: "What if your unspoken words became stars?",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-black text-white antialiased overflow-hidden`}>
                {children}
            </body>
        </html>
    );
}
