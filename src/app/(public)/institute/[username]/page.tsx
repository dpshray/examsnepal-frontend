import type { Metadata } from "next";
import InstituteProfileClient from "@/app/(public)/institute/[username]/InstituteProfileClient";

type Params = Promise<{ username: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { username } = await params;

    return {
        title: `${username} | Institute Profile | ExamsNepal`,
        description: `View ${username}'s institute profile on ExamsNepal — classes, reviews, and stats.`,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `/institute/${username}`,
        },
    };
}

export default function InstituteProfile() {
    return <InstituteProfileClient />;
}
