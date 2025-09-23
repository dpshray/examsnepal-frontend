'use client';

import Image from 'next/image';
import {HeroSection} from '@/components/common/HeroSection';
import {FeaturedCard, PricingCard} from '@/components/card/card';
import {Award, BarChart3, FileText, PieChart, Users} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {questionBank} from "../../../public/assest";
import { useEffect, useState } from 'react';
import subscriptionService from '@/services/SubscriptionService';

const data = [
    {
        icon: <BarChart3 className="w-10 h-10"/>,
        title: 'A Valuable Preparation',
        desc: 'Preparation is all about how you react in real scenarios. Taking exams can help you feel the real heat.',
    },
    {
        icon: <PieChart className="w-10 h-10"/>,
        title: 'Expert Analysis',
        desc: 'We have a team of experts who have cracked each exams in their categories to guide you better.',
    },
    {
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        title: 'Online Sprint',
        desc: 'Daily sprint tests to evaluate your preparation and identify weaknesses — first time in Nepal.',
    },
    {
        icon: <FileText className="w-10 h-10"/>,
        title: 'Huge Question Collection',
        desc: 'Access a rich bank of questions curated by expert exams crackers.',
    },
    {
        icon: <Users className="w-10 h-10"/>,
        title: 'Doubt Discussion',
        desc: 'Get help from experienced mentors to clarify your doubts.',
    },
    {
        icon: <Award className="w-10 h-10"/>,
        title: 'Get the Rank',
        desc: 'Compete and rank nationally among your peers.',
    },
];

export default function Home() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserSubscription = async () => {
            try {
                const data = await subscriptionService.getSubscriptionTypes();
                setSubscription(data ?? null);
            } catch (err) {
                console.error("Failed to fetch subscription status:", err);
                setSubscription(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserSubscription();
    }, []);

    console.log("parent state", subscription, loading);

    return (
        <main className="font-montserrat bg-white overflow-x-hidden scroll-smooth">
            <HeroSection/>
            <section className="container mx-auto mt-10 px-6 text-center sm:mt-20 sm:px-10 lg:px-20">
                <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                    How It All Comes Together
                </h1>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                    Discover the Advantages of Seamless Online Exam Solutions
                </p>
                <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index}>
                            <FeaturedCard/>
                        </div>
                    ))}
                </div>
            </section>
            <section className="px-4 py-20 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-800">
                        Why Exams Nepal
                    </h2>
                    <p className="mx-auto text-lg text-gray-600 max-w-3xl">
                        Exams Nepal is one platform for conducting online examinations for various levels of exams in
                        Nepal. It provides opportunities for students and organizations who want to conduct exams
                        online.
                    </p>
                    <div className="grid gap-10 mt-14 text-left md:grid-cols-2 lg:grid-cols-3">
                        {data.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="shrink-0 text-green-600">{item.icon}</div>
                                <div>
                                    <h3 className="mb-1 text-xl font-semibold text-gray-800">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="container mx-auto mt-16 px-6 text-center sm:mt-20 sm:px-10 lg:px-20">
                <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                    Offered Packages
                </h2>
                <p className="mt-4 text-sm font-light text-gray-600 sm:text-base md:font-normal">
                    Browse through our carefully curated packages designed to meet your specific needs
                </p>
                <PricingCard subscription={subscription} loading={loading}/>
            </section>
            <section
                className="relative flex flex-col-reverse items-center justify-between px-6 mt-20 mb-10 sm:px-10 md:flex-row lg:px-20">
                <div className="w-full text-center md:w-[60%] md:text-left">
                    <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Get the Latest Question Bank and Special Offers
                    </h2>
                    <p className="mt-4 text-sm text-gray-600 sm:text-base">
                        Enter your email to subscribe
                    </p>
                    <form className="flex flex-col sm:flex-row border-2 border-gray-200 rounded-md mt-4">
                        <div className="flex-1">
                            <Input
                                type="email"
                                placeholder="e.g. pradikshagmail.com"

                                className="h-14 px-6 bg-white border-none text-gray-700 text-lg outline-none focus:outline-none rounded-l-md  w-full"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="h-14 px-8 text-lg font-medium bg-green-600 hover:bg-green-700 text-white rounded-none rounded-r-md"
                        >
                            Subscribe
                        </Button>
                    </form>
                </div>
                <div className="flex justify-center w-full md:w-1/2">
                    <Image
                        src={questionBank}
                        alt="Illustration showing a bank of questions"
                        className="object-cover w-full max-w-md rounded-xl"
                        priority
                    />
                </div>
            </section>

            <section className="w-full">
                <div className={' flex flex-col items-center text-center mb-8 max-w-3xl container mx-auto'}>
                    <h2 className="text-3xl font-bold text-black  font-montserrat sm:text-4xl lg:text-5xl">
                        Become an Instructor
                    </h2>
                    <span
                        className={'font-montserrat text-gray-600 mt-4 text-sm font-light sm:text-base md:font-normal'}>
                    Share Your Expertise with Aspiring Students
                </span>
                    <p className=" text-sm font-light text-muted-foreground sm:text-base md:font-normal">
                        Join our platform to reach a vast audience of learners. Share your knowledge and contribute to
                        shaping the future of education in Nepal.
                    </p>
                    <Button className={'mt-4 text-white bg-green-600 hover:bg-green-700'}>Apply For Instructor</Button>
                </div>


            </section>
        </main>
    );
}
