import type { Metadata } from "next";
import Image from "next/image";
import {heroImage} from "../../../../public/assest";
import {ScrollableButton} from "@/components/Scroll/Scrollable";

// Previously had no page-level metadata at all, so it fell back to the root
// layout's generic "Exams Nepal" title/description with no canonical - on a
// page named after one of the site's core target keywords (Lok Sewa).
export const metadata: Metadata = {
    title: "Lok Sewa Notices - PSC Vacancy & Exam Updates | ExamsNepal",
    description:
        "Latest notices from the Lok Sewa Aayog (Public Service Commission): vacancy announcements, exam dates, and result updates for Nepal's PSC exams.",
    alternates: {
        canonical: "/lok-sewa-notices",
    },
    openGraph: {
        title: "Lok Sewa Notices - PSC Vacancy & Exam Updates | ExamsNepal",
        description:
            "Latest notices from the Lok Sewa Aayog (Public Service Commission): vacancy announcements, exam dates, and result updates for Nepal's PSC exams.",
        url: "/lok-sewa-notices",
    },
};

export default function LokSewaNotices() {
    return (
        <section className={'mb-4'}>
            <div className={' flex justify-between items-center px-10 '}>
                <h1 className={'w-1/2 text-6xl font-bold max-w-2xl'}>
                    Notices from Lok Sewa Central Office
                </h1>
                <div className={'flex justify-end w-1/2 '}>
                    <Image src={heroImage} alt={'Lok Sewa Aayog notices and updates'} width={500} height={500}/>
                </div>
            </div>

            {/*Button and Content Area*/}
            <div >
              <div className={'ml-20'}>
                  <ScrollableButton/>
              </div>
            </div>
        </section>
    )
}