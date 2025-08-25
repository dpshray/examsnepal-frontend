"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import TextInputField from "@/components/fields/TextInputField"
import { forgotPasswordSchema } from "@/schema/authSchema"
import { authService } from "@/app/(auth)/authService"

type ForgotPasswordFormValues = {
    email: string
}

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: yupResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setLoading(true)
        try {
            const response = await authService.forgotPassword(data)

            if (
                response?.status === "success" ||
                response?.message?.toLowerCase().includes("mail has been sent")
            ) {
                toast.success(response.message || "OTP sent to your email")
                router.push(`/forgot-password/otp?email=${encodeURIComponent(data.email)}`)
            } else {
                throw new Error(response?.message || "Unknown error")
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-zinc-200 dark:bg-transparent px-4">
            <div className="w-full max-w-sm overflow-hidden rounded-lg bg-muted shadow-2xl">
                <div className="flex flex-col items-center gap-4 p-6">
                    <Link href="/" aria-label="Home">
                        <Image src="/logo.svg" alt="EduApp Logo" width={120} height={40} priority />
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">Recover Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to receive a reset OTP.
                        </p>
                    </div>

                    <TextInputField
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        We&apos;ll send you a one-time code to reset your password.
                    </div>

                    <div className="text-center text-sm text-accent-foreground">
                        Remembered your password?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
