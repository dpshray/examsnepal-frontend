'use client'

import BannerHeader from "@/components/banner/header";
import TextInputField from "@/components/fields/TextInputField";
import SelectInputField from "@/components/fields/SelectInput";
import { Button } from "@/components/ui/button";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { IoIosMailOpen } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import React from "react";



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
                    className="font-semibold text-base text-primary  break-words"
                    aria-label={title}
                >
                    {title}
                </a>
                {details && (
                    <p className="text-xs hover:scale-110 cursor-pointer  hover:underline text-gray-700 mt-0.5 break-words">{details}</p>
                )}
            </div>
        </div>
    );
}



export default function ContactPage() {
    const options = [
        { value: "Google", label: "Google" },
        { value: "Facebook", label: "Facebook" },
        { value: "Instagram", label: "Instagram" },
        { value: "Other", label: "Other" }
    ];

    const contactDetails = [
        {
            title: "Phone",
            icon: MdOutlinePhoneInTalk,
            details: "9802334171",
            href: "tel:9802334171"
        },
        {
            title: "Email",
            icon: IoIosMailOpen,
            details: "ExamNepal@gmail.com",
            href: "mailto:info@examsnepal.com"
        },
        {
            title: "Whatsapp",
            icon: FaWhatsapp,
            details: "9802334171",
            href: "https://wa.me/9779802334171"
        }
    ];

    return (
        <section id="contact-us" className="bg-white">
            {/* SEO-friendly Banner */}
            <BannerHeader
                title="Contact Us"
                subtitle="Have a Question? Let's Chat!"
                imageSrc="/contact-us.png"
            />

            <div className="container max-w-7xl mx-auto my-6 md:my-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 shadow ">
                    {/* Contact Form */}
                    <div className="bg-[#E0E0E066] p-6 sm:p-8 ">
                        <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-gray-900 mb-4">
                            Get in <span className="text-primaryGreen">Touch</span>
                        </h1>
                        <p className="text-sm text-gray-700 font-poppins mb-6">
                            Got a question, facing a problem, or have a brilliant idea to share? We&#39;re always just a
                            message away. Drop us a line, and our friendly team will get back to you as quickly as
                            possible.
                        </p>

                        <form className="space-y-5 w-full" aria-label="Contact Form">
                            <TextInputField
                                name="name"
                                placeholder="Your Name"
                                className="bg-white"
                            />
                            <TextInputField
                                name="email"
                                type="email"
                                placeholder="Your Email"
                                className="bg-white"
                            />
                            <TextInputField
                                name="phone"
                                type="tel"
                                placeholder="Phone Number"
                                className="bg-white"
                            />
                            <SelectInputField
                                placeholder="How did you find us?"
                                className="bg-white"
                                options={options}
                                onChangeAction={() => {}}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-primaryGreen/90 hover:bg-primaryGreen text-white"
                            >
                                Send Message
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
                                    className={'bg-white'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Google Maps */}
                    <div className="w-full h-auto relative shadow-none cursor-grab">
                        <iframe
                            title="Company Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0710843557645!2d85.32929367518048!3d27.684197776195838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198f4a438ac1%3A0x8e8381151404aa9!2sZillicom%20Real%20Estate!5e0!3m2!1sen!2snp!4v1745575352126!5m2!1sen!2snp"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full  "
                            style={{ border: 0 }}
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
