'use client'

import {useParams, useRouter} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import {AlertCircle, Award, Medal, TrendingUp, Trophy} from 'lucide-react'
import scoreService from '@/services/score.service'
import ExamScoreCard from '@/app/student/profile/ScoreCard'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import CustomPagination from "@/components/Pagination"
import {useCallback, useMemo, useState} from "react"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {SOLUTIONS_ROUTE} from "@/config/app-constant";

type PlayerScore = {
    id: number
    name: string
    image?: string
    solutions?: {
        marks?: number
        full_marks?: number
    }
}

type OwnScore = {
    exam_id: number
    exam_name: string
    type: string
    is_negative_marking: boolean
    negative_marking_point: number
    total_question_count: number
    correct_answer_count: number
    incorrect_answer_count: number
    missed_answer_count: number
    total_point_reduction_based_on_negative_marking_point: number
    final_exam_marks_after_reduction_of_negative_marking_point: number
    submitted_at: string
    correct_marking_point?: number
    full_marks?: number
}

const getRankIcon = (rank: number) => {
    const icons = {
        1: <Trophy className="w-5 h-5 text-yellow-500" aria-label="First place"/>,
        2: <Medal className="w-5 h-5 text-gray-400" aria-label="Second place"/>,
        3: <Award className="w-5 h-5 text-amber-600" aria-label="Third place"/>
    }
    return icons[rank as keyof typeof icons] || null
}

const PlayerScoreCard = ({player, rank}: { player: PlayerScore; rank: number }) => {
    const marks = player.solutions?.marks ?? 0
    const fullMarks = player.solutions?.full_marks ?? 100

    return (
        <article
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all duration-200"
            aria-label={`${player.name} - Rank ${rank}`}
        >
            <div
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted font-semibold text-sm sm:text-base shrink-0"
                aria-label={`Rank ${rank}`}
            >
                {rank <= 3 ? getRankIcon(rank) : rank}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Avatar className="w-9 h-9 sm:w-11 sm:h-11">
                    <AvatarImage src={player.image} alt={`${player.name}'s avatar`}/>
                    <AvatarFallback
                        className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold"
                        aria-label={player.name}
                    >
                        {player.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {player.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {marks}/{fullMarks} marks
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
                <span className="text-lg sm:text-xl font-bold text-primary" aria-label={`Score: ${marks}`}>
                    {marks}
                </span>
                {rank <= 3 && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                        Top {rank}
                    </span>
                )}
            </div>
        </article>
    )
}

const LoadingSkeleton = () => (
    <div className="space-y-3 sm:space-y-4" role="status" aria-label="Loading leaderboard">
        {[1, 2, 3, 4, 5].map((i) => (
            <div
                key={i}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 animate-pulse"
            >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 shrink-0"/>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-200 shrink-0"/>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3"/>
                    <div className="h-3 bg-gray-200 rounded w-1/3"/>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12 sm:w-16 shrink-0"/>
            </div>
        ))}
        <span className="sr-only">Loading scores...</span>
    </div>
)

export default function ScorePage() {
    const router = useRouter()
    const {quizId} = useParams<{ quizId: string }>()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    const {data: allScore, isLoading: leaderboardLoading} = useQuery<PlayerScore[]>({
        queryKey: ['quizScores', quizId, currentPage],
        queryFn: async () => {
            const res = await scoreService.getAllScore(Number(quizId), {page: currentPage})
            setCurrentPage(res?.data?.players?.page ?? 1)
            setTotalPages(res?.data?.players?.total_pages ?? 1)
            return res?.data?.players?.data ?? []
        },
        enabled: Boolean(quizId),
    })

    const {
        data: ownScore,
        isLoading: ownScoreLoading,
        isError: ownScoreError,
        error: ownScoreErrorData
    } = useQuery<OwnScore>({
        queryKey: ['ownScore', quizId],
        queryFn: async () => {
            const res = await scoreService.getOwnScore(Number(quizId))
            return res?.data ?? null
        },
        enabled: Boolean(quizId),
    })

    const errorData = ownScoreErrorData as any

    const sortedScores = useMemo(() => {
        if (!Array.isArray(allScore)) return []
        return [...allScore].sort((a, b) => {
            const marksA = a.solutions?.marks ?? 0
            const marksB = b.solutions?.marks ?? 0
            return marksB - marksA
        })
    }, [allScore])

    const handleViewSolution = useCallback((examId: number) => {
        router.push(`${SOLUTIONS_ROUTE}/${examId}`)
    }, [])

    const scoreData = useMemo(() => {
        if (!ownScore) return null
        return {
            exam_id: ownScore.exam_id,
            exam_name: ownScore.exam_name,
            type: ownScore.type,
            is_negative_marking: ownScore.is_negative_marking,
            negative_marking_point: ownScore.negative_marking_point,
            total_question_count: ownScore.total_question_count,
            correct_answer_count: ownScore.correct_answer_count,
            incorrect_answer_count: ownScore.incorrect_answer_count,
            missed_answer_count: ownScore.missed_answer_count,
            total_point_reduction_based_on_negative_marking_point:
            ownScore.total_point_reduction_based_on_negative_marking_point,
            final_exam_marks_after_reduction_of_negative_marking_point:
            ownScore.final_exam_marks_after_reduction_of_negative_marking_point,
            submitted_at: ownScore.submitted_at,
            correct_marking_point: ownScore.correct_marking_point,
            full_marks: ownScore.full_marks,
        }
    }, [ownScore])

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <section
                        className="space-y-6 sm:space-y-8 lg:col-span-1 order-1 lg:order-2"
                        aria-labelledby="score-heading"
                    >
                        <header className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
                                aria-hidden="true"
                            >
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                            </div>
                            <div>
                                <h1
                                    id="score-heading"
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900"
                                >
                                    Your Score
                                </h1>
                                <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
                                    Performance analysis and insights
                                </p>
                            </div>
                        </header>

                        {ownScoreLoading ? (
                            <div
                                className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 animate-pulse"
                                role="status"
                                aria-label="Loading your score"
                            >
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"/>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"/>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="h-20 bg-gray-200 rounded"/>
                                        <div className="h-20 bg-gray-200 rounded"/>
                                    </div>
                                </div>
                                <span className="sr-only">Loading score...</span>
                            </div>
                        ) : ownScoreError ? (
                            <Alert variant="destructive" className="bg-white">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle className="text-base font-semibold">Error Loading Score</AlertTitle>
                                <AlertDescription className="text-sm">
                                    {errorData?.data?.message || "You haven't submitted this exam yet or an error occurred while fetching your score."}
                                </AlertDescription>
                            </Alert>
                        ) : scoreData ? (
                            <ExamScoreCard data={scoreData}
                                           onViewSolutionAction={() => handleViewSolution(scoreData.exam_id)}
                            />
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center">
                                <p className="text-muted-foreground">No score data available</p>
                            </div>
                        )}
                    </section>

                    <section
                        className="space-y-4 sm:space-y-6 lg:col-span-2 order-2 lg:order-1"
                        aria-labelledby="leaderboard-heading"
                    >
                        <header className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
                                aria-hidden="true"
                            >
                                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                            </div>
                            <div>
                                <h2 id="leaderboard-heading" className="text-xl sm:text-2xl font-bold text-gray-900">
                                    Leaderboard
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                    Top performers
                                </p>
                            </div>
                        </header>

                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                            {leaderboardLoading ? (
                                <LoadingSkeleton/>
                            ) : sortedScores.length > 0 ? (
                                <>
                                    <div className="space-y-3 sm:space-y-4" role="list">
                                        {sortedScores.map((player, index) => (
                                            <PlayerScoreCard key={player.id} player={player} rank={index + 1}/>
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <nav className="mt-6" aria-label="Leaderboard pagination">
                                            <CustomPagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChangeAction={handlePageChange}
                                            />
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <Trophy
                                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4"
                                        aria-hidden="true"
                                    />
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        No scores available yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}