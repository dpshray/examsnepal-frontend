"use client"

import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import TextInputField from "@/components/fields/TextInputField"
import PasswordInputField from "@/components/fields/PasswordInput"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import studentService from "@/services/StudentService"
import {useLoggedInStudent} from "@/hooks/useLoggedInStudent"
import {toast} from "sonner"
import ExamScoreCard from "@/app/student/profile/ScoreCard"
import scoreService from "@/services/score.service"
import {AlertCircle, Loader2} from "lucide-react"

type ProfileFormData = {
    name: string
    email: string
    phone: string
    previous_password: string
    new_password: string
    new_password_confirmation: string
}

type ExamScore = {
    exam_id: number
    exam_name: string
    type: 'FREE_QUIZ' | 'SPRINT_QUIZ' | 'MOCK_TEST' | string
    is_negative_marking: boolean
    negative_marking_point: number
    total_question_count: number
    correct_answer_count: number
    incorrect_answer_count: number
    missed_answer_count: number
    total_point_reduction_based_on_negative_marking_point: number
    final_exam_marks_after_reduction_of_negative_marking_point: number
    correct_marking_point: number
    full_marks: number
    submitted_at: string
}

const ExamScoreSkeleton = () => (
    <div className="w-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="p-4 sm:p-5 space-y-4">
            <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"/>
                <div className="h-4 bg-gray-200 rounded w-1/4"/>
            </div>
            <div className="h-24 bg-gray-200 rounded-lg"/>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="h-20 bg-gray-200 rounded-lg"/>
                <div className="h-20 bg-gray-200 rounded-lg"/>
                <div className="h-20 bg-gray-200 rounded-lg"/>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"/>
                <div className="h-2 bg-gray-200 rounded w-full"/>
            </div>
        </div>
    </div>
)

const ProfileSkeleton = () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
            <div className="mb-4 sm:mb-6 lg:mb-8 space-y-2 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3"/>
                <div className="h-4 bg-gray-200 rounded w-1/4"/>
            </div>

            <Card className="mb-6 sm:mb-8 lg:mb-10 overflow-hidden shadow-md">
                <div className="relative h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-4 sm:space-y-6 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"/>
                                    <div className="h-10 bg-gray-200 rounded"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4 sm:space-y-6">
                <div className="h-7 bg-gray-200 rounded w-1/4 animate-pulse"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                        <ExamScoreSkeleton key={i}/>
                    ))}
                </div>
            </div>
        </main>
    </div>
)

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const {student, loading, error} = useLoggedInStudent()
    const [examScores, setExamScores] = useState<ExamScore[]>([])
    const [scoreLoading, setScoreLoading] = useState(true)
    const [scoreError, setScoreError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
        setValue,
        watch
    } = useForm<ProfileFormData>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            previous_password: "",
            new_password: "",
            new_password_confirmation: ""
        }
    })

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setScoreLoading(true)
                setScoreError(null)
                const response = await scoreService.getProfileScore()
                console.log("Exam Score", response)
                setExamScores(response?.data || [])
            } catch (err: any) {
                console.error('Score fetch error:', err)
                setScoreError(err?.response?.data?.message || "Failed to load exam scores")
            } finally {
                setScoreLoading(false)
            }
        }

        fetchScores()
    }, [])

    useEffect(() => {
        if (student) {
            setValue("name", student.name)
            setValue("email", student.email)
            setValue("phone", student.phone || "")
        }
    }, [student, setValue])

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const payload: any = {
                name: data.name,
                email: data.email,
                phone: data.phone,
            }

            if (data.previous_password && data.new_password) {
                payload.previous_password = data.previous_password
                payload.new_password = data.new_password
                payload.new_password_confirmation = data.new_password_confirmation
            }

            await studentService.updateProfile(payload)
            toast.success("Profile updated successfully")

            reset({
                name: data.name,
                email: data.email,
                phone: data.phone,
                previous_password: "",
                new_password: "",
                new_password_confirmation: ""
            })

            setIsEditing(false)
        } catch (err: any) {
            console.error("Error updating profile:", err)
            toast.error(err?.response?.data?.message || "An error occurred while updating the profile")
        }
    }

    const handleCancel = () => {
        reset({
            name: student?.name || "",
            email: student?.email || "",
            phone: student?.phone || "",
            previous_password: "",
            new_password: "",
            new_password_confirmation: ""
        })
        setIsEditing(false)
    }

    if (loading) {
        return <ProfileSkeleton />
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load profile. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
                <header className="mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
                        Welcome, {student?.name || "Student"}
                    </h1>
                    {student?.email_verified_at && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                            Email Verified On: {new Date(student.email_verified_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </p>
                    )}
                </header>

                <Card className="mb-6 py-0 sm:mb-8 lg:mb-10 overflow-hidden shadow-md">
                    <div className="relative h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-r from-amber-600 to-rose-400">
                        <div className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-4 sm:bottom-6 flex items-end justify-between">
                            <div className="flex-1 min-w-0 mr-4 text-white">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
                                    {student?.name}
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base truncate opacity-90">
                                    {student?.email}
                                </p>
                            </div>
                            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-white shadow-lg shrink-0">
                                <AvatarImage
                                    src={student?.image || "https://github.com/shadcn.png"}
                                    alt={`${student?.name}'s avatar`}
                                />
                                <AvatarFallback className="text-lg sm:text-xl">
                                    {student?.name?.charAt(0)?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <TextInputField
                                    label="Enter your Name"
                                    placeholder="Enter here..."
                                    disabled={!isEditing}
                                    {...register("name", {required: "Name is required"})}
                                    error={errors.name?.message}
                                />
                                <TextInputField
                                    label="Enter your Email"
                                    placeholder="Enter here..."
                                    disabled={!isEditing}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    error={errors.email?.message}
                                />
                                <TextInputField
                                    label="Enter your Phone Number"
                                    placeholder="Enter here..."
                                    disabled={!isEditing}
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                />
                                <div className="md:col-span-2 border-t border-gray-200 pt-4 sm:pt-6">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                        Change Password
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                        <PasswordInputField
                                            label="Enter your Old Password"
                                            placeholder="Enter here..."
                                            disabled={!isEditing}
                                            {...register("previous_password")}
                                            error={errors.previous_password?.message}
                                        />
                                        <PasswordInputField
                                            label="Enter your New Password"
                                            placeholder="Enter here..."
                                            disabled={!isEditing}
                                            {...register("new_password", {
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters"
                                                },
                                                validate: (value) => {
                                                    const prevPassword = watch("previous_password")
                                                    if (prevPassword && !value) {
                                                        return "New password is required when changing password"
                                                    }
                                                    return true
                                                }
                                            })}
                                            error={errors.new_password?.message}
                                        />
                                        <PasswordInputField
                                            label="Confirm your New Password"
                                            placeholder="Enter here..."
                                            disabled={!isEditing}
                                            {...register("new_password_confirmation", {
                                                validate: (val, formValues) => {
                                                    if (formValues.new_password && !val) {
                                                        return "Please confirm your new password"
                                                    }
                                                    if (formValues.new_password && val !== formValues.new_password) {
                                                        return "Passwords do not match"
                                                    }
                                                    return true
                                                }
                                            })}
                                            error={errors.new_password_confirmation?.message}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
                                {!isEditing ? (
                                    <Button
                                        type="button"
                                        className="primary-btn w-full sm:w-auto px-6 sm:px-8"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full sm:w-auto px-6 sm:px-8"
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto px-6 sm:px-8"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <section className="w-full" aria-labelledby="exam-results-heading">
                    <h2 id="exam-results-heading" className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                        Your Exam Results
                    </h2>

                    {scoreLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[1, 2, 3].map((i) => (
                                <ExamScoreSkeleton key={i}/>
                            ))}
                        </div>
                    ) : scoreError ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{scoreError}</AlertDescription>
                        </Alert>
                    ) : examScores.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-sm sm:text-base">
                                No exam results found. Complete your first exam to see results here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {examScores.map((exam) => (
                                <ExamScoreCard key={exam.exam_id} data={exam}/>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}