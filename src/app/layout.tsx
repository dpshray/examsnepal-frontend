import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import "./custom.css";
import React from "react";
import StoreProvider from "@/redux/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/lib/TanstackProvider";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    display: "swap",
    weight: [
        "100", "200", "300", "400", "500", "600", "700", "800", "900"
    ],
});

export const metadata: Metadata = {
    // Required for every relative URL in `alternates.canonical` / `openGraph.images`
    // across the app to resolve to an absolute URL - without this, Next emits
    // `<link rel="canonical" href="/">` verbatim (invalid per spec; Google can
    // ignore or misresolve relative canonicals) instead of the full https:// URL.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.examsnepal.com"),
    title: "Exams Nepal",
    description: "Exams Nepal is a platform for online exams and practice questions.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} antialiased`}>
                <TanstackProvider>
                    <StoreProvider>
                        <Toaster position="top-right" richColors/>
                        {children}
                    </StoreProvider>
                </TanstackProvider>
            </body>
        </html>
    );
}
