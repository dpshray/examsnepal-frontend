export const QUIZ_TYPES = {
    PENDING: 'pending' as const,
    COMPLETED: 'completed' as const,
};

export type QuizType = typeof QUIZ_TYPES[keyof typeof QUIZ_TYPES];


export const DOUBT_TYPES = {
    SOLVED: 'solved' as const,
    UNSOLVED: 'unsolved' as const,
};
export type DoubtType = typeof DOUBT_TYPES[keyof typeof DOUBT_TYPES];



 export const TEST_TYPES = {
    FREE: 'Free',
    SPRINT: 'Sprint',
    MOCK: 'Mock'
}
export type TestType = typeof TEST_TYPES[keyof typeof TEST_TYPES];

export const EXAM_TYPES = {
  MOCK: "MOCK_TEST",
  SPRINT: "SPRINT_TEST",
  FREE: "FREE_TEST",
} as const;