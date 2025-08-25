import Footer from "@/components/common/Footer";
import NavBar from "@/components/header/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";


export default function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // <ProtectedRoute>

            <div className="flex flex-col overflow-x-clip min-h-screen">
                <NavBar/>
                <main className="flex flex-grow flex-col">
                    {children}
                </main>
                <Footer/>
            </div>
        // </ProtectedRoute>
    );
}
