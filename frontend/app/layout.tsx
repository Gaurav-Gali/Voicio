import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Voicio",
    description: "An AI voice assistant to query your DB",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${workSans.className}`}>{children}</body>
            </html>
        </ClerkProvider>
    );
}
