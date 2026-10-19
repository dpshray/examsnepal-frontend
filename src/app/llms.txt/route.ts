import { getExamGuideCategories, getExamGuideCategory } from '@/lib/examGuideApi';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.examsnepal.com').replace(/\/+$/, '');

// /llms.txt (https://llmstxt.org) - a plain-text map of the public pages for
// AI answer engines. Built from the same exam-guide categories as the /exams
// hub so it never lists a renamed/deleted category.
export const revalidate = 3600;

export async function GET() {
    const categories = await getExamGuideCategories();
    const details = await Promise.all(
        categories.map((c) => getExamGuideCategory(c.slug).catch(() => null)),
    );

    const lines = [
        '# ExamsNepal',
        '',
        '> Online mock tests, MCQ practice and exam guides for Loksewa (PSC), entrance (IOE, CEE MBBS/BDS, MD/MS, nursing) and professional license exams in Nepal. Timed tests follow the real exam pattern, with instant results and national ranking.',
        '',
        '## Practice',
        `- [Free Quiz](${SITE_URL}/free-quiz): free MCQ quizzes, no subscription required`,
        `- [Sprint Quiz](${SITE_URL}/sprint-quiz): short timed practice sets`,
        `- [Mock Test](${SITE_URL}/mock-test): full-length exam simulations`,
        `- [Find MCQ](${SITE_URL}/find-mcq): searchable question bank with answers`,
        '',
        '## Exam guides',
        `- [All exams](${SITE_URL}/exams): pattern, syllabus and preparation guides by exam`,
        ...categories.flatMap((c, i) => [
            `- [${c.name}](${SITE_URL}/exams/${c.slug})${c.description ? `: ${c.description}` : ''}`,
            ...(details[i]?.guides ?? []).map(
                (g) => `  - [${g.name}](${SITE_URL}/exams/${c.slug}/${g.slug})`,
            ),
        ]),
        '',
        '## Notices',
        `- [Exam notices](${SITE_URL}/notices): latest Loksewa, entrance and license exam notices`,
        '',
        '## About',
        `- [About ExamsNepal](${SITE_URL}/about)`,
        `- [Contact](${SITE_URL}/contact-us)`,
        `- [Blog](${SITE_URL}/blog)`,
        `- [Institutes](${SITE_URL}/institutes): coaching centres offering classes, notes and exams on ExamsNepal`,
        '',
    ];

    return new Response(lines.join('\n'), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
