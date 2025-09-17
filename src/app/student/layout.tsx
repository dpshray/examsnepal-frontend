'use client';

import MainSidebar from "@/components/sidebar/MainSidebar";
import React from "react";
import {BadgeCheck, Bookmark, BookOpen, Clock, CreditCard, FileText, HelpCircle, Home, User, Zap} from "lucide-react";
import {useLoggedInStudent} from "@/hooks/useLoggedInStudent";
import LogoLoading from "@/lib/LogoLoading";

const navData = [
    {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: Home,
    },
    {
        title: "Doubts",
        url: "/student/doubts",
        icon: HelpCircle,
    },
    {
        title: "Questions Pool",
        url: "/student/questions-pool",
        icon: BookOpen,
    },
    {
        title: "Exams",
        url: "#",
        icon: BookOpen,
        items: [
            {
                title: "Mock Tests",
                url: "/student/exams/mock-tests",
                icon: FileText,
            },
            {
                title: "Sprint-Quiz",
                url: "/student/exams/sprint-quiz",
                icon: Zap,
            },
            {
                title: "Free-Quiz",
                url: "/student/exams/free-quiz",
                icon: Clock,
            },
        ],
    },
    {
        title: "Solutions",
        url: "/student/solutions",
        icon: FileText,
    },
    {
        title: "All Pins",
        url: "/student/pins",
        icon: Bookmark,
    },
    {
        title: "Subscriptions",
        url: "/student/subscription",
        icon: CreditCard,
    },
    {
        title: "Profile",
        url: "/student/profile",
        icon: User,
        items: [
            {
                title: "My Profile",
                url: "/student/profile",
                icon: User,
            },
            {
                title: "My Badges",
                url: "/student/badges",
                icon: BadgeCheck,
            },
            {
                title: "My Subscription",
                url: "/student/subscription",
                icon: CreditCard,
            },
        ]
    },
];

export default function StudentLayout({children}: { children: React.ReactNode }) {
    const {student, loading, error} = useLoggedInStudent();

    // if (loading) return <LogoLoading/>;
    // if (error || !student) return <div className="p-4 text-center text-red-500">Failed to load user.</div>;

    return (

        <MainSidebar
            user={{
                name: student?.name || "Student Name",
                email: student?.email || "Student Email",
                avatar: "/default-avatar.png",
            }}
            navItems={navData}
        >
            {loading ? (
                <div className="flex flex-1 items-center justify-center min-h-[300px]">
                    <LogoLoading fullscreen={false}/>
                </div>
            ) : (
                children
            )}
        </MainSidebar>
    );
}
