"use client"

import {useParams} from "next/navigation"
import ExamQuizEngine from "@/components/Exams/ExamQuizEngine"
import mockTestService from "@/services/ExamService/MockTest"
import {EXAMS_TERMS_CONDITION_ROUTES, SPRINT_QUIZ_DURATION} from "@/config/app-constant"
import sprintQuizServices from "@/services/ExamService/SprintQuiz";

export default function MockTestPage() {
    const params = useParams<{ id: string }>()
    const examId = Number(params.id)

    return (
        <ExamQuizEngine
            examId={examId}
            title="Sprint Test"
            subtitle="Real exam experience"
            duration={SPRINT_QUIZ_DURATION}
            termsRoute={EXAMS_TERMS_CONDITION_ROUTES}
            onFetchQuestionsAction={(id, page) =>
                sprintQuizServices.getSprintQuizById(id, {page}).then(res => res.data)
            }
            onSubmitAction={mockTestService.submitExam}
        />
    )
}
