import {heroImage} from "../../../public/assest";
import {Play} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";


export const HeroSection = () => {
    return (
        <section className="py-3 my-4 flex items-center max-h-[600px]">
            <div
                className="container mx-auto flex flex-col lg:flex-row lg:justify-between items-center gap-10 px-6 md:px-12">

                {/* Left Content */}
                <div className="w-full lg:w-1/2 text-center font-montserrat lg:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 ">
                        Empowering Your&nbsp;<span className="text-green-600">Success</span>:
                        Nepal&#39;s Premier Online Exam
                        Preparation Platform
                    </h1>
                    <p className="text-gray-700 mt-4 text-base sm:text-lg leading-relaxed">
                        Comprehensive Resources and Real-Time Analytics to Ace Your Exams.
                    </p>

                    {/* Buttons with Fade-Up Animation */}
                    <div

                        className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                    >
                        <Button
                            asChild
                            variant="default"
                            className="bg-green-600 text-white hover:bg-green-700 transition duration-300 shadow-md"
                        >
                            <Link href="/blog">
                                Get Started
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition duration-300 shadow-md"
                        >
                            <Link href="/blog">
                                Explore Blog
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Illustration with Parallax and Animation */}
                <div
                    className="w-full md:w-1/2 hidden md:flex justify-center">
                    <Image src={heroImage} alt={'heroImage'}
                           className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-cover"/>
                </div>
            </div>
        </section>
    );
};