'use client';
import Image from "next/image";
import {cn} from "@/lib/utils";
import {SearchBar} from "@/components/search/Searchbar";
import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef} from "react";

interface BannerHeaderProps {
    title: string;
    subtitle?: string;
    imageSrc: string;
    placeholder?: string;
    className?: string;
    showSearch?: boolean;
    onSearchAction?: (query: string) => void;
}


export default function BannerHeader({
                                         title,
                                         subtitle,
                                         imageSrc,
                                         placeholder = "Search...",
                                         className,
                                         showSearch = true,
                                         onSearchAction,
                                     }: BannerHeaderProps) {
    return (
        <div className={cn("relative w-full h-72", className)}>
            <Image
                src={imageSrc}
                alt="Banner background"
                fill
                sizes="100vw"
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 opacity-40"/>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full flex flex-col items-center text-center px-4">
                    {subtitle && (
                        <p className="text-lg font-montserrat text-white mb-2">
                            {subtitle}
                        </p>
                    )}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-bold text-white">
                        {title}
                    </h1>
                    {showSearch && onSearchAction && (
                        <SearchBar
                            onSearchAction={onSearchAction}
                            placeholder={placeholder}
                            loading={false}
                            disabled={false}
                            ariaLabel="Search input"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

type StudentBannerHeaderProps = {
    title?: string;
    subtitle?: string;
    imageSrc?: string;
    className?: string;
    textClassName?: string;
};

export function StudentBannerHeader({
                                        title = 'Master Every Exam – Start Practicing Today',
                                        subtitle = 'Trusted by 20,000+ students',
                                        imageSrc = '/images/exams.png',
                                        className,
                                        textClassName = 'text-white',
                                    }: StudentBannerHeaderProps) {
    const ref = useRef(null);
    const inView = useInView(ref, {amount: 0.4});
    const textControls = useAnimation();
    const starControls = useAnimation();
    const imageControls = useAnimation();

    useEffect(() => {
        if (!inView) return;

        textControls.start("visible");
        imageControls.start("visible");

        const animateStar = async () => {
            await starControls.start("fall");
            await starControls.start("reset");
        };

        animateStar();
    }, [inView, textControls, imageControls, starControls]);

    const textVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
    };

    const starVariants = {
        initial: {x: 0, y: 0, rotate: 0, opacity: 0},
        fall: {
            x: -60,
            y: 100,
            rotate: 120,
            opacity: 1,
            transition: {duration: 1.2, ease: "easeOut"},
        },
        reset: {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
            transition: {duration: 0.5, delay: 0.3},
        },
    };

    const imageVariants = {
        hidden: {opacity: 0, x: 50},
        visible: {opacity: 1, x: 0, transition: {duration: 0.6}},
    };

    return (
        <section
            ref={ref}
            className={cn(
                "w-full flex flex-col md:flex-row bg-[#D9C2E6] h-44 overflow-hidden",
                className
            )}
            aria-label="Student banner section"
            role="region"
        >
            <div className="relative flex-1" aria-hidden="true">
                <motion.div
                    className="absolute top-12 left-16 w-16 h-auto"
                    initial="initial"
                    animate={starControls}
                    variants={starVariants}
                >
                    <Image
                        src="/images/star.svg"
                        alt="Star icon"
                        width={60}
                        height={60}
                        loading="lazy"
                    />
                </motion.div>

                <Image
                    src="/images/books.png"
                    alt="Books representing study material"
                    width={100}
                    height={100}
                    className="w-28 h-auto max-h-28 absolute bottom-0 left-8"
                    loading="lazy"
                />
            </div>

            <motion.div
                className={cn('flex-1 flex flex-col justify-center items-start text-muted-foreground text-left md:text-left px-4', textClassName)}
                initial="hidden"
                animate={textControls}
                variants={textVariants}
            >
                <h1 className="text-3xl font-montserrat font-bold">{title}</h1>
                <p className="text-lg font-montserrat mt-1">{subtitle}</p>
            </motion.div>

            <motion.div
                className="relative flex-1"
                initial="hidden"
                animate={imageControls}
                variants={imageVariants}
            >
                <Image
                    src={imageSrc}
                    alt={`${title} illustration`}
                    width={400}
                    height={300}
                    className="w-40 aspect-square h-full absolute bottom-0 right-8"
                    loading="lazy"
                />
            </motion.div>
        </section>
    );
}