import { FREE_QUIZ_DURATION, MOCK_TEST_DURATION, SPRINT_QUIZ_DURATION } from "@/config/app-constant";

export type FormatId = "free-quiz" | "sprint-quiz" | "mock-test";

export interface FormatFaqItem {
    question: string;
    answer: string;
}

export interface FormatDefinition {
    id: FormatId;
    route: string;
    name: string;
    shortName: string;
    heroTitle: string;
    heroTagline: string;
    ctaLabel: string;
    metaTitle: string;
    metaDescription: string;
    /** [PLACEHOLDER COPY — CONFIRM WITH OWNER] 150-250 word explainer, site owner to supply/approve final copy. */
    explainer: string;
    durationMinutes: number;
    // [PLACEHOLDER — CONFIRM WITH OWNER] negative marking / subscription rules below are not
    // sourced from a backend business-rule flag; verify against actual product behavior before publishing.
    negativeMarking: string;
    subscriptionRequirement: string;
    bestFor: string;
    faqs: FormatFaqItem[];
}

export const FORMATS: Record<FormatId, FormatDefinition> = {
    "free-quiz": {
        id: "free-quiz",
        route: "/free-quiz",
        name: "Free Quiz",
        shortName: "Free Quiz",
        heroTitle: "Free Quiz Practice for Nepal's Loksewa & Entrance Exams",
        heroTagline: "Practice unlimited MCQs for free — no subscription needed to get started.",
        ctaLabel: "Start Free Quiz",
        metaTitle: "Free Quiz – Free MCQ Practice for Nepal Exams | ExamsNepal",
        metaDescription:
            "Practice free MCQ quizzes for Loksewa, license, and entrance exams in Nepal. No subscription required — start solving questions instantly.",
        explainer:
            "Free Quiz is ExamsNepal's no-cost practice mode, built for students who want to start preparing for Loksewa, license, and entrance exams in Nepal without committing to a paid plan first. " +
            "Each Free Quiz session pulls a fresh set of multiple-choice questions from your chosen exam category, so you can build the habit of daily practice at your own pace. " +
            "Unlike a formal mock test, Free Quiz is designed for low-pressure, repeatable practice — attempt it as many times as you like to reinforce topics you're weak in. " +
            "After you submit, you get an instant score along with explanations for every question, so you always know why an answer was right or wrong, not just whether you passed. " +
            "It's the easiest way to try ExamsNepal's question bank before deciding whether to upgrade to Sprint Quiz or a full Mock Test for exam-day simulation.",
        durationMinutes: FREE_QUIZ_DURATION,
        negativeMarking: "No negative marking",
        subscriptionRequirement: "Not required",
        bestFor: "Daily practice & building the habit",
        faqs: [
            {
                question: "Is Free Quiz really free?",
                answer: "Yes. Free Quiz is available at no cost — you only need a free ExamsNepal account to start.",
            },
            {
                question: "How many questions are in a Free Quiz?",
                answer: "Each Free Quiz session is a short, focused set of MCQs from your selected exam category. [PLACEHOLDER — confirm exact question count with owner]",
            },
            {
                question: "Can I retake a Free Quiz?",
                answer: "Yes, Free Quiz is designed for repeatable practice so you can attempt it as many times as you'd like.",
            },
            {
                question: "Do I get an explanation for wrong answers?",
                answer: "Yes, every question comes with an instant score and an explanation after you submit.",
            },
        ],
    },
    "sprint-quiz": {
        id: "sprint-quiz",
        route: "/sprint-quiz",
        name: "Sprint Quiz",
        shortName: "Sprint Quiz",
        heroTitle: "Sprint Quiz – Fast Timed MCQ Practice for Nepal Exams",
        heroTagline: "Sharpen your speed and accuracy with short, timed rounds of exam MCQs.",
        ctaLabel: "Try Sprint Quiz",
        metaTitle: "Sprint Quiz – Fast Timed MCQ Practice | ExamsNepal",
        metaDescription:
            "Take fast, timed MCQ sprints for Loksewa, license, and entrance exam prep in Nepal — build speed and accuracy under real exam time pressure.",
        explainer:
            "Sprint Quiz is a fast, timed practice format built to train the two things that decide exam-day performance: speed and accuracy under pressure. " +
            "Where Free Quiz is about untimed repetition, Sprint Quiz puts you on the clock so you get used to answering MCQs at the pace a real Loksewa, license, or entrance exam demands. " +
            "Each sprint is a short, focused round on a single exam category, ending automatically once the timer runs out — so you learn to manage time per question instead of over-thinking any one item. " +
            "It's a middle step between casual practice and a full-length simulation: long enough to feel real time pressure, short enough to fit into a study break. " +
            "As with every format on ExamsNepal, you get an instant score and explanations the moment you submit, so you can immediately see where the clock beat you.",
        durationMinutes: SPRINT_QUIZ_DURATION,
        negativeMarking: "No negative marking",
        subscriptionRequirement: "Not required",
        bestFor: "Quick, timed practice under pressure",
        faqs: [
            {
                question: "How is Sprint Quiz different from Free Quiz?",
                answer: "Sprint Quiz is timed and designed to build speed, while Free Quiz is untimed and meant for relaxed, repeatable practice.",
            },
            {
                question: "What happens when the timer runs out?",
                answer: "The quiz submits automatically with whatever answers you've selected so far, just like in a real exam.",
            },
            {
                question: "Is Sprint Quiz free to use?",
                answer: "Yes, Sprint Quiz is available without a subscription. [PLACEHOLDER — confirm with owner]",
            },
            {
                question: "Can I choose which exam category to sprint on?",
                answer: "Yes, pick your exam category first and the sprint pulls questions from that category only.",
            },
        ],
    },
    "mock-test": {
        id: "mock-test",
        route: "/mock-test",
        name: "Mock Test",
        shortName: "Mock Test",
        heroTitle: "Full-Length Mock Test for Loksewa, License & Entrance Exams",
        heroTagline: "Simulate the real exam — full length, real timing, and negative marking.",
        ctaLabel: "Take a Mock Test",
        metaTitle: "Mock Test – Full-Length Exam Simulation | ExamsNepal",
        metaDescription:
            "Take a full-length mock test for Nepal's Loksewa, license, and entrance exams — real exam timing and negative marking, with instant results.",
        explainer:
            "Mock Test is ExamsNepal's full-length exam simulation, built to feel as close to the real Loksewa, license, or entrance exam as possible. " +
            "Instead of a short practice round, a Mock Test runs for the full exam duration and follows the same negative-marking rules as the actual exam, so your score is a realistic signal of where you stand. " +
            "This is the format to reach for once you've built familiarity through Free Quiz and speed through Sprint Quiz — it tests stamina, time management across an entire paper, and how you perform under real exam conditions, not just isolated questions. " +
            "Every Mock Test is organized by exam category, so you're always practicing against questions relevant to the exam you're actually preparing for. " +
            "As soon as you submit, you get your score, a detailed breakdown, and explanations for every question — the same instant feedback loop as Free Quiz and Sprint Quiz, just at full exam scale.",
        durationMinutes: MOCK_TEST_DURATION,
        negativeMarking: "Negative marking applies",
        subscriptionRequirement: "Subscription required",
        bestFor: "Full exam-day simulation",
        faqs: [
            {
                question: "How long is a Mock Test?",
                answer: `A Mock Test runs for the full exam duration — around ${Math.round(MOCK_TEST_DURATION / 60)} hours — matching real exam timing.`,
            },
            {
                question: "Does Mock Test have negative marking?",
                answer: "Yes, Mock Test applies negative marking to match real exam conditions. [PLACEHOLDER — confirm exact marking scheme with owner]",
            },
            {
                question: "Do I need a subscription for Mock Test?",
                answer: "Yes, Mock Test is a subscription feature. [PLACEHOLDER — confirm pricing/plan details with owner]",
            },
            {
                question: "Will I get a detailed result after the test?",
                answer: "Yes, you get an instant score, a full breakdown, and explanations for every question immediately after submitting.",
            },
        ],
    },
};

export const FORMAT_LIST: FormatDefinition[] = [FORMATS["free-quiz"], FORMATS["sprint-quiz"], FORMATS["mock-test"]];
