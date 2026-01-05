"use client"

import {useParams} from "next/navigation"

import mockTestService from "@/services/ExamService/MockTest"
import {EXAMS_TERMS_CONDITION_ROUTES, MOCK_TEST_DURATION} from "@/config/app-constant"
import ExamQuizEngine from "@/components/Exams/ExamQuizEngine"

export default function MockTestPage() {
    const params = useParams<{ id: string }>()
    const examId = Number(params.id)

    return (
        <ExamQuizEngine
            examId={examId}
            title="Mock Test"
            subtitle="Real exam experience"
            duration={MOCK_TEST_DURATION}
            termsRoute={EXAMS_TERMS_CONDITION_ROUTES}
            onFetchQuestionsAction={(id, page) =>
                mockTestService
                    .getMockTestById(id, {page})
                    .then(res => res.data)
            }
        />
    )
}
