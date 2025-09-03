'use client'

import BannerHeader from "@/components/banner/header";
import {motion} from 'framer-motion';
import {Award, BookOpen, Clock, Star, Target, Users} from 'lucide-react';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

interface StatCardProps {
    icon: React.ElementType;
    value: string;
    label: string;
}

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay?: number;
}

interface TeamMemberProps {
    name: string;
    role: string;
    image: string;
    description: string;
}

const StatCard = ({icon: Icon, value, label}: StatCardProps) => (
    <div className="text-center p-4 sm:p-6">
        <Icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-primaryGreen mb-2"/>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm sm:text-base text-gray-600">{label}</div>
    </div>
);

const FeatureCard = ({icon: Icon, title, description, delay = 0}: FeatureCardProps) => (
    <motion.div
        initial={{opacity: 0, y: 40}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: false}}
        transition={{duration: 0.6, delay}}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
    >
        <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-primaryGreen mb-4"/>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

const TeamMember = ({name, role, image, description}: TeamMemberProps) => (
    <motion.div
        initial={{opacity: 0, y: 40}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: false}}
        transition={{duration: 0.6}}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
        <div
            className="h-48 sm:h-56 bg-gradient-to-br from-primaryGreen/20 to-primaryGreen/40 flex items-center justify-center">
            <div
                className="w-20 h-20 sm:w-24 sm:h-24 bg-primaryGreen rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                {name.charAt(0)}
            </div>
        </div>
        <div className="p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{name}</h3>
            <p className="text-primaryGreen font-medium mb-3 text-sm sm:text-base">{role}</p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

export default function AboutPage() {
    const stats = [
        {icon: Users, value: "50K+", label: "Students Served"},
        {icon: BookOpen, value: "500+", label: "Practice Tests"},
        {icon: Award, value: "95%", label: "Success Rate"},
        {icon: Clock, value: "24/7", label: "Support"}
    ];

    const features = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To provide comprehensive and accessible exam preparation resources for students across Nepal, helping them achieve their academic goals and unlock their full potential."
        },
        {
            icon: Star,
            title: "Our Vision",
            description: "To become the leading educational platform in Nepal, empowering students with quality learning materials and innovative teaching methodologies."
        },
        {
            icon: Award,
            title: "Our Values",
            description: "We believe in excellence, integrity, and accessibility. Every student deserves quality education, and we're committed to making it available to all."
        }
    ];

    const teamMembers = [
        {
            name: "Raj Kumar Sharma",
            role: "Founder & CEO",
            image: "/team1.jpg",
            description: "Educational technology enthusiast with 15+ years of experience in developing innovative learning solutions."
        },
        {
            name: "Sita Devi Poudel",
            role: "Head of Academics",
            image: "/team2.jpg",
            description: "Former university professor with expertise in curriculum development and educational assessment methodologies."
        },
        {
            name: "Amit Thapa",
            role: "Technology Lead",
            image: "/team3.jpg",
            description: "Full-stack developer passionate about creating user-friendly educational platforms and learning management systems."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <BannerHeader
                title="About Us"
                subtitle="Empowering Students Across Nepal"
                imageSrc="/banner.png"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="py-12 sm:py-16 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{opacity: 0, x: -40}}
                            whileInView={{opacity: 1, x: 0}}
                            viewport={{once: false}}
                            transition={{duration: 0.6}}
                        >
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                                Who We Are
                            </h2>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                                We are a team of passionate individuals dedicated to providing the best educational
                                services to students across Nepal. Our platform combines cutting-edge technology
                                with proven educational methodologies to deliver exceptional learning experiences.
                            </p>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
                                Our mission is to deliver high-quality educational products and services that exceed
                                our students&#39; expectations, helping them achieve academic success and career
                                advancement.
                            </p>
                            <Link href="/contact">
                                <Button
                                    className="bg-primaryGreen hover:bg-primaryGreen/90 text-white px-6 py-3 text-sm sm:text-base">
                                    Get In Touch
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, x: 40}}
                            whileInView={{opacity: 1, x: 0}}
                            viewport={{once: false}}
                            transition={{duration: 0.6}}
                            className="relative"
                        >
                            <div
                                className="bg-gradient-to-br from-primaryGreen/10 to-primaryGreen/30 rounded-2xl p-8 sm:p-12 text-center">
                                <BookOpen className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-primaryGreen mb-6"/>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                    Excellence in Education
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Committed to transforming education in Nepal through innovative technology
                                    and personalized learning experiences.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="py-12 sm:py-16 bg-white rounded-2xl shadow-sm mb-12 sm:mb-16">
                    <div className="px-6 sm:px-8 lg:px-12">
                        <motion.div
                            initial={{opacity: 0, y: 40}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: false}}
                            transition={{duration: 0.6}}
                            className="text-center mb-12"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Our Impact in Numbers
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                                These numbers reflect our commitment to educational excellence and student success
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 40}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: false}}
                                    transition={{duration: 0.6, delay: index * 0.1}}
                                >
                                    <StatCard {...stat} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false}}
                        transition={{duration: 0.6}}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} delay={index * 0.1}/>
                        ))}
                    </div>
                </section>

                <section className="py-12 sm:py-16 lg:py-20">
                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false}}
                        transition={{duration: 0.6}}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            The passionate individuals behind ExamsNepal&#39;s success
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {teamMembers.map((member, index) => (
                            <TeamMember key={index} {...member} />
                        ))}
                    </div>
                </section>

                <section className="py-12 sm:py-16 text-center">
                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false}}
                        transition={{duration: 0.6}}
                        className="bg-gradient-to-r from-primaryGreen/10 to-primaryGreen/20 rounded-2xl p-8 sm:p-12"
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            Join thousands of students who have achieved their academic goals with ExamsNepal.
                            Start your preparation journey today!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button
                                    className="bg-primaryGreen hover:bg-primaryGreen/90 text-white px-8 py-3 text-sm sm:text-base">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline"
                                        className="border-primaryGreen text-primaryGreen hover:bg-primaryGreen hover:text-white px-8 py-3 text-sm sm:text-base">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
}