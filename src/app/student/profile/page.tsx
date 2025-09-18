"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TextInputField from "@/components/fields/TextInputField"
import PasswordInputField from "@/components/fields/PasswordInput"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import studentService from "@/services/StudentService"
import { useLoggedInStudent } from "@/hooks/useLoggedInStudent"
import { toast } from "sonner"

type ProfileFormData = {
  name: string
  email: string
  phone: string
  previous_password: string
  new_password: string
  new_password_confirmation: string
}

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)

    const { student, loading, error } = useLoggedInStudent()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm<ProfileFormData>({
        defaultValues: {
            name: student?.name || "",
            email: student?.email || "",
            phone: student?.phone || "",
            previous_password: "",
            new_password: "",
            new_password_confirmation: ""
        }
    })

    useEffect(() => {
        if (student) {
            setValue("name", student.name)
            setValue("email", student.email)
            setValue("phone", student.phone || "")
        }
    }, [student, setValue])

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                previous_password: data.previous_password || undefined,
                new_password: data.new_password || undefined,
                new_password_confirmation: data.new_password_confirmation || undefined,
            }

            const response = await studentService.updateProfile(payload)

            if (response) {
                toast.success("Profile updated successfully.")
            }
            setIsEditing(false)
        } catch (err) {
            console.error("Error updating profile:", err)
            toast.error("An error occurred while updating the profile.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 container mx-auto px-4 py-6">
                <div className="mb-4">
                    <h1 className="text-xl font-medium text-gray-700">
                        Welcome, {student?.name || "Student"}
                    </h1>
                    {student?.email_verified_at && (
                        <p className="text-sm text-gray-500">
                            Email Verified On: {new Date(student.email_verified_at).toLocaleString()}
                        </p>
                    )}
                </div>

                <Card className="mb-8 overflow-hidden py-0">
                    <div className="relative h-24 bg-gradient-to-r from-amber-600 to-rose-400 ">
                        <div className="absolute right-4 bottom-4 flex items-center gap-4 text-white">
                            <div className="text-right">
                                <h2 className="font-medium">{student?.name}</h2>
                                <p className="text-sm">{student?.email}</p>
                            </div>
                            <Avatar>
                                <AvatarImage src={student?.image || "https://github.com/shadcn.png"} />
                                <AvatarFallback>{student?.name?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                            <TextInputField
                                label="Enter your Name"
                                placeholder="Enter here..."
                                disabled={!isEditing}
                                {...register("name", { required: "Name is required" })}
                                error={errors.name?.message as string}
                            />
                            <TextInputField
                                label="Enter your Email"
                                placeholder="Enter here..."
                                disabled={!isEditing}
                                {...register("email", { required: "Email is required" })}
                                error={errors.email?.message as string}
                            />
                            <TextInputField
                                label="Enter your Phone Number"
                                placeholder="Enter here..."
                                disabled={!isEditing}
                                {...register("phone")}
                                error={errors.phone?.message as string}
                            />
                            <PasswordInputField
                                label="Enter your Old Password"
                                placeholder="Enter here..."
                                disabled={!isEditing}
                                {...register("previous_password")}
                                error={errors.previous_password?.message}
                            />
                            <PasswordInputField
                                label="Enter your New Password"
                                placeholder="Enter here..."
                                disabled={!isEditing}
                                {...register("new_password", {
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                error={errors.new_password?.message}
                            />
                            <PasswordInputField
                                label="Confirm your New Password"
                                placeholder="Enter here..."
                                disabled={!isEditing}
                                {...register("new_password_confirmation", {
                                    validate: (val, formValues) =>
                                        val === formValues.new_password || "Passwords do not match"
                                })}
                                error={errors.new_password_confirmation?.message}
                            />

                            <div className="md:col-span-2 flex justify-end gap-3 mt-8">
                                {!isEditing ? (
                                    <Button type="button" className={'primary-btn'} onClick={() => setIsEditing(true)}>
                                        Edit
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => {
                                                reset({
                                                    name: student?.name || "",
                                                    email: student?.email || "",
                                                    phone: student?.phone || "",
                                                    previous_password: "",
                                                    new_password: "",
                                                    new_password_confirmation: ""
                                                })
                                                setIsEditing(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button className="bg-green-600 hover:bg-green-700" type="submit">
                                            Save
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
