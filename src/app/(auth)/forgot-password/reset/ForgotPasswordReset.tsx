"use client"

import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {useRouter, useSearchParams} from "next/navigation"
import * as Yup from "yup"
import { toast} from "react-hot-toast";
import {Button} from "@/components/ui/button"
import PasswordInputField from "@/components/fields/PasswordInput"
import {authService} from "@/app/(auth)/authService"

const resetPasswordSchema = Yup.object({
    password: Yup.string().required("Password is required"),
    password_confirmation: Yup.string()
        .required("Password confirmation is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
})

type ResetPasswordFormData = Yup.InferType<typeof resetPasswordSchema>

export default function ForgotPasswordReset() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema),
    })

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!email || !token) {
            toast.error("Missing email or token")
            return
        }

        try {
            const payload = {
                email,
                token,
                password: data.password,
                password_confirmation: data.password_confirmation,
            }

            console.log("Payload for password reset:", payload)


            const result = await authService.resetPassword(payload)

            router.push("/login")
            if (!result.success) {
                throw new Error(result.message || "Password reset failed")
            }

            toast.success("Password reset successful!")
            router.push("/login")
        } catch (error: any) {
            console.error("Error resetting password:", error)
            toast.error(error?.message || "Something went wrong")
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center px-4 py-8">
            <div className="w-full sm:max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-xl">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">Reset Password</h1>
                    <p className="text-sm text-muted-foreground">For {email}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <PasswordInputField
                            label="New Password"
                            placeholder="Enter new password"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                    </div>

                    <div className="space-y-1">
                        <PasswordInputField
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            {...register("password_confirmation")}
                            error={errors.password_confirmation?.message}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </section>
    )
}
