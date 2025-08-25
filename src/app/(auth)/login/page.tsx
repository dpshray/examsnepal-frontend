'use client'

import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginSchema} from "@/schema/authSchema";
import {authService} from "@/app/(auth)/authService";
import {toast} from "react-hot-toast";
import {ArrowLeft, Loader2} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {FcGoogle} from "react-icons/fc";

import {Button} from "@/components/ui/button";
import TextInputField from "@/components/fields/TextInputField";
import PasswordInputField from "@/components/fields/PasswordInput";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import LogoLoading from "@/lib/LogoLoading";

interface LoginFormInputs {
    email: string;
    password: string;
}

export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginSchema),
    });

    const [loading, setLoading] = useState(false);

    const handleStudentLogin = async (data: LoginFormInputs) => {
        setLoading(true);
        try {
            const response = await authService.studentLogin(data);
            console.log(response);
            if (response) {
                toast.success("Login successful");
                localStorage.setItem("_id", response?.student?.id || "");
                localStorage.setItem("_at", response?.access_token || "");
                router.push("/student/dashboard");
            }

        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LogoLoading/>}
            <section
                aria-labelledby="login-heading"
                className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
            >
                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row-reverse min-h-[600px]">
                        {/* Right Side Image */}
                        <div className="hidden md:block md:w-1/2 relative">
                            <Image
                                src="/registerPage.png"
                                alt="Illustration representing secure user login"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Left Side Form */}
                        <div className="w-full md:w-1/2 p-8 sm:p-8 lg:p-8 flex flex-col justify-center">
                            <div className="mb-6">
                                <Link href="/" passHref>
                                    <Button
                                        variant="outline"
                                        className="gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                                        aria-label="Go back to home page"
                                    >
                                        <ArrowLeft className="h-4 w-4"/>
                                        Go Home
                                    </Button>
                                </Link>
                            </div>

                            <h1
                                id="login-heading"
                                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
                            >
                                Welcome Back
                            </h1>

                            <form
                                className="space-y-5"
                                aria-label="Login form"
                                onSubmit={handleSubmit(handleStudentLogin)}
                            >
                                <TextInputField
                                    type="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                    required
                                />

                                <PasswordInputField
                                    label="Password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    error={errors.password?.message}
                                    required
                                />
                                <div className={' flex items-center justify-end py-0'}>
                                    <Link href="/forgot-password"
                                          className={' text-black font-poppins text-base hover:text-red-600 hover:underline font-stretch-normal hover:underline-offset-2 hover:decoration-2 hover:decoration-red-600'}
                                    >
                                        Forgot Password ?</Link>
                                </div>
                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full text-white  font-medium rounded-md",
                                        loading ? "bg-green-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                    )}
                                    aria-label="Login to your account"
                                    disabled={loading}
                                >
                                    {
                                        loading ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className={'animate-spin'}/>
                                                <span className="ml-2">Logging in...</span>
                                            </div>
                                        ) : (
                                            "Login to your account"
                                        )
                                    }
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                    aria-label="Login using Google account"
                                    disabled={loading}
                                    onClick={() => toast("Google login not yet implemented")}
                                >
                                    <FcGoogle className="text-xl"/>
                                    Login with Google
                                </Button>


                                <div className="mt-4 text-center text-sm text-gray-600">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/register"
                                        className="underline underline-offset-4 font-medium text-green-600 hover:text-green-700"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
