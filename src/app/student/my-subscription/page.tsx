"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Clock, CreditCard, Calendar, User, BookOpen } from "lucide-react"
import subscriptionService from "@/services/SubscriptionService"

export default function SubscriptionStatus() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await subscriptionService.getUserSubscriptionStatus()
        setData(res)
      } catch (err: any) {
        setError(err.message ?? "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  console.log("loading", loading)

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-1/3" />

          {/* Card skeletons */}
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        </div>
      </div>
    )
  }


  if (error) return <p className="p-6 text-destructive">{error}</p>

  // if no subscription
  if (!data?.data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-semibold">No Active Subscription</h2>
        <p className="text-muted-foreground">
          You currently don&apos;t have any active subscription. Get started below.
        </p>
        <Button
          onClick={() => router.push("/student/subscription")}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition"
        >
          Get Subscription
        </Button>
      </div>
    )
  }

  const sub = data.data
  const isActive = sub.subscription?.status === 1

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Subscription Status</h1>
            <p className="text-muted-foreground mt-1">
              Manage your exam preparation subscription
            </p>
          </div>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={`px-3 py-1 text-sm font-medium ${
              isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {isActive ? (
              <Badge variant={"green"}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant={"destructive"}>
                <Clock className="w-4 h-4 mr-1" />
                Inactive
              </Badge>
            )}
          </Badge>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Subscription Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subscription Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Subscription Period</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">
                    {formatDate(sub.starts_at)} – {formatDate(sub.ends_at)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Subscribed On</p>
                <p className="text-sm">{formatDateTime(sub.subscribed_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold">Rs. {sub.price}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-xl font-semibold text-success">Rs. {sub.paid}</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Student Profile ID</p>
                <p className="font-mono text-lg font-semibold">#{sub.student_profile_id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Subscription ID</p>
                <p className="font-mono text-sm">#{sub.subscription?.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {data.message && (
          <Card className="border-l-4 border-l-primary">
            <CardContent>
              <p className="text-sm text-muted-foreground">{data.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
