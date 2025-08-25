"use client"

import {useId, useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {toast} from "react-hot-toast"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {authService} from "@/app/(auth)/authService"

export default function VerifyForgotPasswordOtpClient() {
    const id = useId()
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const handleVerifyOtp = async () => {
        if (!email) {
            toast.error("Missing email. Please start the reset process again.")
            router.replace("/forgot-password")
            return
        }

        if (otp.length !== 5) {
            toast.error("OTP must be 5 digits.")
            return
        }

        setLoading(true)

        try {
            const response = await authService.verifyForgotPasswordOtp({token: otp})
            console.log(`Response from verifyForgotPasswordOtp:`, response)
            if (response) {
                toast.success("OTP verified. Redirecting...")
                router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&token=${otp}`)
            } else {
                throw new Error(response?.message || "Invalid OTP")
            }
        } catch (error: any) {
            console.error("Error verifying OTP:", error)
            toast.error(error?.response?.data?.message || error?.message || "OTP verification failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center px-4 py-8">
            <div className="w-full sm:max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-xl">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">Verify OTP</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the 5-digit code sent to <strong>{email}</strong>
                    </p>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                    <Label htmlFor={id}>Verification Code</Label>
                    <InputOTP id={id} value={otp} onChange={setOtp} maxLength={5}>
                        <InputOTPGroup>
                            {[0, 1, 2, 3, 4].map((index) => (
                                <InputOTPSlot
                                    key={index}
                                    index={index}
                                    className="bg-white"
                                />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <Button
                    type="button"
                    className="w-full bg-green-600 text-white"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length < 5}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <p className="text-muted-foreground text-xs text-center">
                    Built with{" "}
                    <a
                        className="underline hover:text-foreground transition-colors"
                        href="https://github.com/guilhermerodz/input-otp"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Input OTP
                    </a>
                </p>
            </div>
        </section>
    )
}
