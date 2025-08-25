"use client" // Error boundaries must be Client Components

import {useEffect} from "react"
import {AlertCircle} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4 sm:p-6 md:p-8">
            <Card className="max-w-md w-full border-zinc-200 dark:border-zinc-800 shadow-xl">
                <CardHeader className="pb-2">
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-red-50 dark:bg-red-950/50 p-3">
                            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" aria-hidden="true"/>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Something went wrong
                        </h1>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                        We encountered an unexpected error while processing your request. Our team has been notified of
                        this issue.
                    </p>
                    <div
                        className="rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 mt-4">
                        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 text-center">
                            Error ID: <span className="font-medium">{error.digest || "Unknown"}</span>
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-2">
                    <Button
                        onClick={() => reset()}
                        className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-sm"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => (window.location.href = "/")}
                    >
                        Return to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
