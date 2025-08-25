"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Progress} from "@/components/ui/progress"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Award} from "lucide-react"

interface StudentScoreCardProps {
    id: number
    student_id: number
    score: number
    student: {
        id: number
        name: string
    }
    isTopThree?: boolean
}

export default function StudentScoreCard({id, student_id, score, student, isTopThree}: StudentScoreCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600"
        if (score >= 60) return "text-blue-600"
        if (score >= 40) return "text-amber-600"
        return "text-rose-600"
    }

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-emerald-600"
        if (score >= 60) return "bg-blue-600"
        if (score >= 40) return "bg-amber-600"
        return "bg-rose-600"
    }

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-xl font-semibold">Student Scores</h2>
            </div>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg py-2 gap-2">
                <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-gray-100">
                                <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={student.name}/>
                                <AvatarFallback className="bg-gray-100 text-gray-800">
                                    {getInitials(student.name)}
                                </AvatarFallback>
                            </Avatar>
                            {isTopThree && (
                                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                                    <Award className="h-4 w-4 text-white"/>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold truncate max-w-[150px]">{student.name}</h3>
                                <Badge
                                    variant={score >= 60 ? "default" : "outline"}
                                    className={`${
                                        score >= 60
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : "border-rose-200 text-rose-800 hover:bg-rose-100"
                                    }`}
                                >
                                    {score}/100
                                </Badge>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Performance</span>
                                    <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
                                </div>
                                <Progress
                                    value={score}
                                    max={100}
                                    className={`h-2 bg-gray-100`}
                                    style={{backgroundColor: getProgressColor(score)}}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
