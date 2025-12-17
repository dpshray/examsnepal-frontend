"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Lock, User, Mail, Phone } from "lucide-react";
import TextInputField from "@/components/fields/TextInputField";
import PasswordInputField from "@/components/fields/PasswordInput";
import { usePrivateExamLogin, usePublicExamLogin } from "@/hooks/usePrivateExam";
import { toast } from "sonner";

const PublicExamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
});

const PrivateExamSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


type PublicExamForm = z.infer<typeof PublicExamSchema>;
type PrivateExamForm = z.infer<typeof PrivateExamSchema>;

export default function ExamForm() {
    const searchParams = useSearchParams();
    const { examSlug } = useParams();
    const router = useRouter();
    const isPrivate = searchParams.get("auth") === "1";

    const schema = isPrivate ? PrivateExamSchema : PublicExamSchema;
    const { 
        mutate: startPublicExam, 
        isPending: isPublicPending 
    } = usePublicExamLogin(
        () => {
            toast.success("Login successful");
            router.push(`/exam/${examSlug}/instruction`);
        },
        (error: any) => {
            toast.error(error?.data?.message || "Login failed");
        }
    )
    const {
        mutate: loginPrivateExam,
        isPending: isPrivatePending,
    } = usePrivateExamLogin(
        () => {
            toast.success("Login successful");
            router.push(`/exam/${examSlug}/instruction`);
        },
            (error: any) => {
            toast.error(error?.data?.message || "Login failed");
        }
    );


    const isLoading = isPrivate ? isPrivatePending : isPublicPending;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: PublicExamForm | PrivateExamForm) => {
        if (isPrivate) {
            loginPrivateExam(data as PrivateExamForm);
        } else {
            startPublicExam(data as PublicExamForm);
        }
    };


  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 p-4">
        <section className="w-full max-w-5xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
            
            {/* Left Form Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <Image
                    src="/logo.svg"
                    alt="ExamsNepal Logo"
                    width={100}
                    height={100}
                />

                <h1 className="text-3xl md:text-4xl font-bold my-6">
                    {isPrivate ? "Private Exam Access 🔐" : "Public Exam Entry 📝"}
                </h1>

                <p className="text-sm md:text-base text-muted-foreground mb-6">
                    {isPrivate
                    ? "Sign in to access your private examination."
                    : "Fill in your details to start the exam."}
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    {/* Public Exam Fields */}
                    {!isPrivate && (
                        <>
                            <TextInputField
                                label="Full Name"
                                placeholder="Enter your full name"
                                icon={User}
                                error={errors.name?.message as string | undefined}
                                {...register("name")}
                            />

                            <TextInputField
                                label="Email"
                                placeholder="Enter your email"
                                icon={Mail}
                                type="email"
                                autoComplete="email"
                                error={errors.email?.message as string | undefined}
                                {...register("email")}
                            />

                            <TextInputField
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                icon={Phone}
                                type="tel"
                                error={errors.phone?.message as string | undefined}
                                {...register("phone")}
                            />
                        </>
                    )}

                    {/* Private Exam Fields */}
                    {isPrivate && (
                        <>
                            <TextInputField
                                label="Email"
                                placeholder="Enter your email"
                                icon={Mail}
                                type="email"
                                autoComplete="email"
                                error={errors.email?.message as string | undefined}
                                {...register("email")}
                            />

                            <PasswordInputField
                                label="Password"
                                placeholder="Enter your password"
                                icon={Lock}
                                autoComplete="current-password"
                                error={errors.password?.message as string | undefined}
                                {...register("password")}
                            />
                        </>
                    )}

                    <Button
                        type="submit"
                        variant="green"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Please wait..."
                            : isPrivate
                            ? "Enter Exam"
                            : "Start Exam"}
                    </Button>
                </form>
            </div>

            {/* Right Image Section */}
            <div className="hidden md:flex items-center justify-center bg-[#f0f2f5] dark:bg-zinc-800">
                <Image
                    src="/exam.png"
                    alt="Exam illustration"
                    width={500}
                    height={500}
                    className="object-contain `max-w-105 max-h-105"
                    priority
                />
            </div>
        </section>
    </main>
  );
}
