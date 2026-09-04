import type { Metadata } from 'next';
import { BookOpenCheck } from 'lucide-react';
import { getExamGuideCategories, getExamGuideCategory, type ExamGuideCategoryDetail } from '@/lib/examGuideApi';
import { ExamsDirectoryClient } from './ExamsDirectoryClient';

export const revalidate = 3600;

const SITE_URL = 'https://examsnepal.com';

export const metadata: Metadata = {
    title: 'Exams in Nepal - License, Loksewa & Entrance Exams by Category | ExamsNepal',
    description:
        'Browse license, Loksewa, and entrance exams in Nepal by category - Medical, Engineering, Management, Law, and more - with free mock tests.',
    alternates: { canonical: '/exams' },
};

const FAQS = [
    {
        question: 'What exams does the Public Service Commission (Lok Sewa Aayog) conduct?',
        answer:
            'The PSC conducts Loksewa exams for non-gazetted and gazetted civil service positions - including Kharidar, Nayab Subba, and Section Officer under Others, and field-specific Loksewa exams such as Engineering Service, Agriculture Service, and Nepal Health Service Staff Nurse under their respective categories.',
    },
    {
        question: 'What license exams are mandatory to practice a profession in Nepal?',
        answer:
            'Nepal requires council-administered license exams for most regulated professions: NMCLE for doctors (Nepal Medical Council), NEC Licensing for engineers, NLEN for nurses, NHPC Licensing for allied health programs, the Nepal Pharmacy Council exam for pharmacists, NLEV for veterinarians, and the Nepal Bar Council exam for advocates, among others.',
    },
    {
        question: 'What entrance exams do I need for medical, engineering, or law admission in Nepal?',
        answer:
            'Common entrance exams include MECEE-BL for MBBS/BDS and MECEE-PG for MD/MS (Medical), IOE Entrance and BSc CSIT for engineering and IT programs, and BALLB/LLM/KULSAT for law admission - each administered by a different authority and covered in its own exam guide here.',
    },
];

export default async function ExamsHubPage() {
    const summaries = await getExamGuideCategories();

    // Fetched sequentially rather than via Promise.all: concurrent fetches to
    // these structurally-similar URLs were hitting a Next.js dev-mode fetch
    // cache collision, silently returning one category's data for another.
    const categories: ExamGuideCategoryDetail[] = [];
    for (const summary of summaries) {
        const detail = await getExamGuideCategory(summary.slug);
        if (detail) categories.push(detail);
    }

    const totalGuides = summaries.reduce((sum, c) => sum + c.guide_count, 0);

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Exams', item: `${SITE_URL}/exams` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
        },
    ];

    return (
        <section className="min-h-screen bg-gray-50">
            {/* eslint-disable-next-line react/no-danger */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="bg-gradient-to-br from-green-700 to-green-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold font-montserrat mb-3">
                        Exams in Nepal - License, Loksewa & Entrance Exams by Category
                    </h1>
                    <p className="text-green-50 max-w-2xl mx-auto mb-5">
                        Syllabus, eligibility, exam pattern, and free mock tests for Nepal&apos;s license, Loksewa,
                        and entrance exams, organized by professional field.
                    </p>
                    {totalGuides > 0 && (
                        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
                            <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
                            {totalGuides} exam guide{totalGuides === 1 ? '' : 's'} across {categories.length}{' '}
                            categor{categories.length === 1 ? 'y' : 'ies'}
                        </div>
                    )}
                </div>
            </div>

            <ExamsDirectoryClient categories={categories} />
        </section>
    );
}
