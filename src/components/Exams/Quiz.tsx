// 'use client';
//
// import { FC } from 'react';
// import { QuizType } from '@/lib/Constan';
// import { QuizCompletedCard, QuizPendingCard } from "@/components/Exams/exam-card";
// import { QuizResponse } from "@/types/types";
//
// interface QuizListProps {
//     quizType: QuizType;
//     fetchQuizzes: (type: QuizType, page: number) => Promise<QuizResponse>;
//     onTakeTestAction: (id: number) => void;
// }
//
// interface QuizCardListProps {
//     quizzes: any[];
//     selectedTab: string;
//     onViewAllScoresAction: (quizId: number | any) => void;
//     onTakeTestAction: (quizId: number) => void;
//     onViewSolutionAction: (quizId: number) => void;
// }
//
// const QuizCardList: FC<QuizCardListProps> = ({
//     quizzes,
//     selectedTab,
//     onViewAllScoresAction,
//     onTakeTestAction,
//     onViewSolutionAction,
// }) => {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//             {quizzes.map((quiz) =>
//                 selectedTab === "pending" ? (
//                     <QuizPendingCard
//                         key={quiz.id}
//                         title={quiz.exam_name}
//                         provider={quiz.user?.fullname || "Unknown"}
//                         questionCount={quiz.questions_count}
//                         onViewAllScoresAction={() => onViewAllScoresAction(quiz.id)}
//                         onTakeTestAction={() => onTakeTestAction(quiz.id)}
//                     />
//                 ) : (
//                     <QuizCompletedCard
//                         key={quiz.id}
//                         title={quiz.exam_name}
//                         provider={quiz.user?.fullname || "Unknown"}
//                         questionCount={quiz.questions_count}
//                         onViewAllScoresAction={() => onViewAllScoresAction(quiz.id)}
//                         onViewSolutionAction={() => onViewSolutionAction(quiz.id)}
//                     />
//                 )
//             )}
//         </div>
//     );
// };
//
// export default QuizCardList;
