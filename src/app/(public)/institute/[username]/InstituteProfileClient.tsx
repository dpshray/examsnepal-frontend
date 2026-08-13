'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Facebook, Linkedin, LogIn, Mail, Phone, Twitter, UserPlus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
