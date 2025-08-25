import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import "./custom.css";
import {Toaster} from "react-hot-toast";
import React from "react";
import StoreProvider from "@/redux/StoreProvider";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    display: "swap",
    weight: [
        "100", "200", "300", "400", "500", "600", "700", "800", "900"
    ],
});

export const metadata: Metadata = {
    title: "Exams Nepal",
    description: "Exams Nepal is a platform for online exams and practice questions.",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} antialiased`}>
        <StoreProvider>
            <Toaster position="top-right" containerClassName={' font-poppins text-sm'}/>
            {children}
        </StoreProvider>
        </body>
        </html>
    );
}
