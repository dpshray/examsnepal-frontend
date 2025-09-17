'use client'

import {ArrowLeft, Loader2} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import TextInputField from "@/components/fields/TextInputField"
import PasswordInputField from "@/components/fields/PasswordInput"
import SelectInputField from "@/components/fields/SelectInput"
import {registrationSchema} from "@/schema/authSchema"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {authService} from "@/app/(auth)/authService"
import {useCallback, useEffect, useState} from "react"
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation"


export default function RegistrationForm() {
    const router = useRouter()
    const [courseOptions, setCourseOptions] = useState<Array<{ value: string | number; label: string }>>([])

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setValue,
    } = useForm({
        resolver: yupResolver(registrationSchema),
    })

    const handleRegistration = async (data: any) => {
        try {
            const response = await authService.studentRegister(data)
            if (response) {
                toast.success(response.message || "Registration successful")
                localStorage.setItem("_at", response.access_token || "")
                router.push("/login")
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed")
        }
    }

    const fetchExamTypes = useCallback(async () => {
        try {
            const response = await authService.getExamTypes()
            if (response) {
                const options = response.data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                }))
                setCourseOptions(options)
            }
        } catch {

        }
    }, [])

    useEffect(() => {
        fetchExamTypes()
    }, [fetchExamTypes])

    return (

        <section
            aria-labelledby="registration-heading"
            className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
        >
            <div
                className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[650px]">
                <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    <nav className="mb-6">
                        <Link href="/" passHref>
                            <Button
                                variant="outline"
                                className="gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                                aria-label="Go back to homepage"
                            >
                                <ArrowLeft className="h-4 w-4"/>
                                Go Home
                            </Button>
                        </Link>
                    </nav>

                    <header>
                        <h1
                            id="registration-heading"
                            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
                        >
                            Create Your Account
                        </h1>
                    </header>

                    <form
                        className="space-y-5"
                        aria-label="User registration form"
                        autoComplete="off"
                        onSubmit={handleSubmit(handleRegistration)}
                    >
                        <TextInputField
                            type="text"
                            label="Full Name"
                            placeholder="Enter your full name"
                            {...register("name")}
                            error={errors.name?.message}
                        />

                        <TextInputField
                            type="tel"
                            label="Contact Number"
                            placeholder="Enter your contact number"
                            {...register("phone")}
                            error={errors.phone?.message}
                        />

                        <TextInputField
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <PasswordInputField
                            label="Password"
                            placeholder="Enter your password"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                        <PasswordInputField
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            {...register("password_confirmation")}
                            error={errors.password_confirmation?.message}
                        />

                        <SelectInputField
                            placeholder="Select Exam Type"
                            label="Exam Type"
                            options={courseOptions}
                            onChangeAction={(value: string | number) => setValue("exam_type_id", value as string)}
                            {...register("exam_type_id")}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-md"
                            aria-label="Submit registration"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Register"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-base text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 font-medium text-green-600 hover:text-green-700"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                <div className="relative hidden md:block md:w-1/2 h-full min-h-screen">
                    <Image
                        src="/registerPage.png"
                        alt="User registration illustration"
                        fill
                        priority
                        className="object-fill"
                    />
                </div>

            </div>
        </section>

    )
}
