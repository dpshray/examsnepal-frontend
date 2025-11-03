'use client';

import React from 'react';
import BannerHeader from "@/components/banner/header";
import TextInputField from "@/components/fields/TextInputField";
import SelectInputField from "@/components/fields/SelectInput";
import { Button } from "@/components/ui/button";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { IoIosMailOpen } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import contactService from '@/services/contactServices';
import { toast } from 'sonner';

export function ContactCard({
                                icon: Icon,
                                title,
                                details,
                                href,
                                className,
                            }: {
    icon: React.ElementType;
    title: string;
    details?: string;
    href: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 rounded-lg shadow-md transition-all duration-300 w-full",
                className
            )}
        >
            <Icon className="text-2xl text-black shrink-0 mt-1" aria-hidden="true" />
            <div className="flex flex-col min-w-0">
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-base text-primary break-words"
                    aria-label={title}
                >
                    {title}
                </a>
                {details && (
                    <p className="text-xs hover:scale-110 cursor-pointer hover:underline text-gray-700 mt-0.5 break-words">
                        {details}
                    </p>
                )}
            </div>
        </div>
    );
}

const contactSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email must be a valid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    howDidYouFindUs: yup.string().required("This field is required"),
    message: yup.string().required("Message is required"),
});

type FormData = yup.InferType<typeof contactSchema>;

export default function ContactClient() {
    const options = [
        { value: "Google", label: "Google" },
        { value: "Facebook", label: "Facebook" },
        { value: "Instagram", label: "Instagram" },
        { value: "Other", label: "Other" },
    ];

    const contactDetails = [
        {
            title: "Phone",
            icon: MdOutlinePhoneInTalk,
            details: "9802334171",
            href: "tel:9802334171",
        },
        {
            title: "Email",
            icon: IoIosMailOpen,
            details: "ExamNepal@gmail.com",
            href: "mailto:info@examsnepal.com",
        },
        {
            title: "Whatsapp",
            icon: FaWhatsapp,
            details: "9802334171",
            href: "https://wa.me/9779802334171",
        },
    ];

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(contactSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: FormData) => {
        try {
        const response = await contactService.sendContactMessage(data);

        if (response?.status) {
            toast.success("Message sent successfully!");
            reset();
        } else {
            toast.error(response?.message || "Failed to send message");
        }
        } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <section id="contact-us" className="bg-white">
            <BannerHeader
                title="Contact Us"
                subtitle="Have a Question? Let's Chat!"
                imageSrc="/contact-us.png"
            />

            <div className="container max-w-7xl mx-auto my-6 md:my-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 shadow">
                    <div className="bg-[#E0E0E066] p-6 sm:p-8">
                        <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-gray-900 mb-4">
                            Get in <span className="text-primaryGreen">Touch</span>
                        </h1>
                        <p className="text-sm text-gray-700 font-poppins mb-6">
                            Got a question, facing a problem, or have a brilliant idea to share? We&#39;re always just a message
                            away. Drop us a line, and our friendly team will get back to you as quickly as possible.
                        </p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5 w-full"
                            aria-label="Contact Form"
                            noValidate
                        >
                            <TextInputField
                                {...register("name")}
                                name="name"
                                placeholder="Your Name"
                                className="bg-white"
                                error={errors.name?.message}
                            />
                            <TextInputField
                                {...register("email")}
                                name="email"
                                type="email"
                                placeholder="Your Email"
                                className="bg-white"
                                error={errors.email?.message}
                            />
                            <TextInputField
                                {...register("phone")}
                                name="phone"
                                type="tel"
                                placeholder="Phone Number"
                                className="bg-white"
                                error={errors.phone?.message}
                            />
                            <SelectInputField
                                placeholder="How did you find us?"
                                className="bg-white"
                                options={options}
                                onChangeAction={(value: string | number) => setValue("howDidYouFindUs", String(value))}
                                error={errors.howDidYouFindUs?.message}
                            />
                            <TextInputField
                                {...register("message")}
                                name="message"
                                placeholder="Your Message"
                                className="bg-white"
                                textarea
                                error={errors.message?.message}
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primaryGreen/90 hover:bg-primaryGreen text-white"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
                            {contactDetails.map((item, idx) => (
                                <ContactCard
                                    key={idx}
                                    icon={item.icon}
                                    title={item.title}
                                    details={item.details}
                                    href={item.href}
                                    className="bg-white"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-auto relative shadow-none cursor-grab">
                        <iframe
                            title="Company Location"
                            src={process.env.NEXT_PUBLIC_GOOGLE_MAP_LOCATION}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full min-h-[400px]"
                            style={{ border: 0 }}
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
