import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "UNSENT | The Anonymous Map of Human Emotion",
    description: "Share your unspoken feelings with the universe. A global, anonymous emotion-sharing platform.",
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
