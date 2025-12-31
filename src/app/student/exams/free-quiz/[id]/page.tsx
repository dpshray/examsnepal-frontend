"use client"

import {useParams} from "next/navigation"
import {EXAMS_TERMS_CONDITION_ROUTES, FREE_QUIZ_DURATION} from "@/config/app-constant"
import ExamQuizEngine from "@/components/Exams/ExamQuizEngine"
import freeQuizServices from "@/services/ExamService/FreeQuiz";

export default function MockTestPage() {
    const params = useParams<{ id: string }>()
    const examId = Number(params.id)

    return (
        <ExamQuizEngine
            examId={examId}
            title="Free Quiz"
            subtitle="Free Quiz Experience"
            duration={FREE_QUIZ_DURATION}
            termsRoute={EXAMS_TERMS_CONDITION_ROUTES}
            onFetchQuestionsAction={(id, page) =>
                freeQuizServices
                    .getFreeQuizById(id, {page})
                    .then(res => res.data)
            }
        />
    )
}
