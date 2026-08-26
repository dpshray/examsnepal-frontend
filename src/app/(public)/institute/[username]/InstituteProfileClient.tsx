'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
    BookOpen,
    CalendarClock,
    ChevronDown,
    ChevronUp,
    Facebook,
    FileText,
    GraduationCap,
    Linkedin,
    LogIn,
    Mail,
    Phone,
    Trophy,
    Twitter,
    UserPlus,
    Users,
    Video,
    Wallet,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import InstituteHero from "@/components/institute/InstituteHero"
import StarRating from "@/components/institute/StarRating"
import instituteService from "@/services/instituteService"
import { INSTITUTE_PROFILE_BASE_URL } from "@/config/app-constant"

interface Profile {
    slug: string
    username: string
    fullname: string
    org: string | null
    about: string | null
    logo: string | null
    banner_image: string | null
    location: string | null
    email: string | null
    phone: string | null
    facebook: string | null
    twitter: string | null
    linkedin: string | null
}

interface Insights {
    published_exams_count: number
    students_count: number
    average_rating: number
    reviews_count: number
}

interface Review {
    id: number
    rating: number
    comment: string | null
    student_name: string | null
    created_at: string
}

interface ClassItem {
    id: number
    name: string
    slug: string
    target?: string | null
    bio?: string | null
    syllabus?: string | null
    price?: number | null
    duration_days?: number | null
    exams_count?: number
    notes_count?: number
    meeting_links_count?: number
    students_count?: number
}

function ClassesSection({ classes, joinUrl }: { classes: ClassItem[]; joinUrl: string }) {
    const [expandedSyllabus, setExpandedSyllabus] = useState<Record<number, boolean>>({})

    const toggleSyllabus = (id: number) => {
        setExpandedSyllabus((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <GraduationCap size={18} />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Available Classes & Courses</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {classes.length} {classes.length === 1 ? "class" : "classes"} offered
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {classes.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-xl border border-dashed bg-slate-50/50">
                        <GraduationCap className="mx-auto text-muted-foreground/40 mb-2" size={36} />
                        <p className="text-sm font-medium text-slate-700">No classes published yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            This institute hasn&apos;t added any public classes yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {classes.map((cls) => {
                            const isSyllabusOpen = Boolean(expandedSyllabus[cls.id])
                            return (
                                <div
                                    key={cls.id}
                                    className="rounded-xl border bg-white p-4 transition-all hover:shadow-sm hover:border-green-300"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-base text-gray-900">{cls.name}</h3>
                                                {cls.target && (
                                                    <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                                                        {cls.target}
                                                    </Badge>
                                                )}
                                            </div>
                                            {cls.bio && (
                                                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                                                    {cls.bio}
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 flex items-center sm:flex-col sm:items-end gap-2">
                                            {cls.price !== undefined && cls.price !== null ? (
                                                <span className="text-base font-bold text-green-700">
                                                    {cls.price === 0 ? "Free" : `Rs. ${cls.price.toLocaleString()}`}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-medium text-muted-foreground">Free</span>
                                            )}
                                            {cls.duration_days && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <CalendarClock size={12} /> {cls.duration_days} days
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features summary row */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-3 pt-3 border-t">
                                        {(cls.exams_count ?? 0) > 0 && (
                                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium">
                                                <Trophy size={12} /> {cls.exams_count} {cls.exams_count === 1 ? "Exam" : "Exams"}
                                            </span>
                                        )}
                                        {(cls.notes_count ?? 0) > 0 && (
                                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                                                <BookOpen size={12} /> {cls.notes_count} {cls.notes_count === 1 ? "Study Note" : "Study Notes"}
                                            </span>
                                        )}
                                        {(cls.meeting_links_count ?? 0) > 0 && (
                                            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium">
                                                <Video size={12} /> {cls.meeting_links_count} Live Sessions
                                            </span>
                                        )}
                                        {(cls.students_count ?? 0) > 0 && (
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Users size={12} /> {cls.students_count} enrolled
                                            </span>
                                        )}
                                    </div>

                                    {/* Syllabus dropdown if available */}
                                    {cls.syllabus && (
                                        <div className="mt-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleSyllabus(cls.id)}
                                                className="text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1 focus:outline-none"
                                            >
                                                <FileText size={12} />
                                                {isSyllabusOpen ? "Hide Syllabus" : "View Syllabus / Curriculum"}
                                                {isSyllabusOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                            </button>
                                            {isSyllabusOpen && (
                                                <div className="mt-2 p-3 rounded-lg bg-slate-50 border text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                                                    {cls.syllabus}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action button */}
                                    <div className="mt-3 pt-2 flex items-center justify-end">
                                        <a href={joinUrl} target="_blank" rel="noreferrer">
                                            <Button size="sm" variant="green" className="flex items-center gap-1.5 text-xs h-8">
                                                <UserPlus size={13} /> Enroll in Class
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function ReviewsSection({ username }: { username: string }) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        instituteService
            .getReviews(username, page)
            .then((response) => {
                if (cancelled) return
                setReviews(response?.data?.data ?? [])
                setLastPage(response?.data?.last_page ?? 1)
            })
            .finally(() => !cancelled && setLoading(false))
        return () => {
            cancelled = true
        }
    }, [username, page])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Student Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading && (
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                )}

                {!loading && reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                )}

                {!loading &&
                    reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold shrink-0">
                                        {(review.student_name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-sm">{review.student_name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="mt-2">
                                <StarRating value={review.rating} size={14} />
                            </div>
                            {review.comment && <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>}
                        </div>
                    ))}

                {lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                            Previous
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Page {page} of {lastPage}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={page >= lastPage}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function InstituteProfileClient() {
    const { username } = useParams<{ username: string }>()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [insights, setInsights] = useState<Insights | null>(null)
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setNotFound(false)
        instituteService
            .getPublicProfile(username)
            .then((response) => {
                if (cancelled) return
                if (!response?.data?.profile) {
                    setNotFound(true)
                    return
                }
                setProfile(response.data.profile)
                setInsights(response.data.insights)
                setClasses(response.data.classes ?? [])
            })
            .catch(() => !cancelled && setNotFound(true))
            .finally(() => !cancelled && setLoading(false))
        return () => {
            cancelled = true
        }
    }, [username])

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Skeleton className="h-56 w-full rounded-none" />
                <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </main>
        )
    }

    if (notFound || !profile) {
        return (
            <div className="flex min-h-screen items-center justify-center text-center px-4">
                <div>
                    <h1 className="text-2xl font-bold">Institute not found</h1>
                    <p className="text-muted-foreground mt-2">This link may be invalid or no longer active.</p>
                </div>
            </div>
        )
    }

    const displayName = profile.org || profile.fullname
    const joinUrl = `${INSTITUTE_PROFILE_BASE_URL}/${profile.username}`

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto">
                <InstituteHero
                    bannerUrl={profile.banner_image}
                    logoUrl={profile.logo}
                    displayName={displayName}
                    location={profile.location}
                />

                <div className="grid lg:grid-cols-3 gap-6 mt-2 px-4 pb-12">
                    {/* Main column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                {profile.about && (
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{profile.about}</p>
                                )}

                                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                                    <div>
                                        <p className="text-2xl font-bold text-green-700">{insights?.students_count ?? 0}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Registered Students</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-700">{insights?.published_exams_count ?? 0}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Published Exams</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center gap-1">
                                            <p className="text-2xl font-bold text-green-700">{insights?.average_rating || "-"}</p>
                                            {!!insights?.reviews_count && (
                                                <StarRating value={Math.round(insights.average_rating)} size={14} />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{insights?.reviews_count ?? 0} Reviews</p>
                                    </div>
                                </div>

                                {(profile.email || profile.phone || profile.facebook || profile.twitter || profile.linkedin) && (
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                                        {profile.email && (
                                            <span className="flex items-center gap-1.5">
                                                <Mail size={14} /> {profile.email}
                                            </span>
                                        )}
                                        {profile.phone && (
                                            <span className="flex items-center gap-1.5">
                                                <Phone size={14} /> {profile.phone}
                                            </span>
                                        )}
                                        {profile.facebook && (
                                            <a
                                                href={profile.facebook}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 hover:text-green-700"
                                            >
                                                <Facebook size={14} />
                                            </a>
                                        )}
                                        {profile.twitter && (
                                            <a
                                                href={profile.twitter}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 hover:text-green-700"
                                            >
                                                <Twitter size={14} />
                                            </a>
                                        )}
                                        {profile.linkedin && (
                                            <a
                                                href={profile.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 hover:text-green-700"
                                            >
                                                <Linkedin size={14} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Classes Section */}
                        <ClassesSection classes={classes} joinUrl={joinUrl} />

                        {/* Reviews Section */}
                        <ReviewsSection username={username} />
                    </div>

                    {/* Sidebar: join CTA */}
                    <div className="lg:col-span-1">
                        <Card className="lg:sticky lg:top-6">
                            <CardHeader>
                                <CardTitle className="text-base">Join {displayName}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Sign up as a student to access classes, notes, and exams from {displayName}.
                                </p>
                                <a href={joinUrl} target="_blank" rel="noreferrer" className="block">
                                    <Button variant="green" className="w-full flex items-center gap-1.5">
                                        <UserPlus size={16} /> Sign Up as Student
                                    </Button>
                                </a>
                                <a href={joinUrl} target="_blank" rel="noreferrer" className="block">
                                    <Button variant="outline" className="w-full flex items-center gap-1.5">
                                        <LogIn size={16} /> Already a Student? Login
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}

