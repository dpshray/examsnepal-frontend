'use client';

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {AlignJustify, ArrowRight, GraduationCap, HardHat, Landmark, type LucideIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import type {ExamGuideCategoryDetail} from "@/lib/examGuideApi";

const NAV_ITEMS_BEFORE_EXAMS = [
    {label: "Home", link: "/"},
    {label: "About Us", link: "/about"},
];

const NAV_ITEMS_AFTER_EXAMS = [
    {label: "Find MCQs", link: "/find-mcq"},
    {label: "Classes", link: "/institutes"},
    {label: "Contact Us", link: "/contact-us"},
];

// Display label + icon for the mega menu, keyed by the existing exam_categories slug.
const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
    loksewa: {label: "Lok Sewa Exams", icon: Landmark},
    "nec-license": {label: "License Exams", icon: HardHat},
    entrance: {label: "Entrance Exams", icon: GraduationCap},
};

// Cap the per-category guide list so the mega menu stays scannable — the
// full list is one click away via the category's own /exams/[slug] page.
const MAX_VISIBLE_GUIDES = 6;

interface NavBarProps {
    examCategories?: ExamGuideCategoryDetail[];
}

export default function NavBar({examCategories = []}: NavBarProps) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isExamsActive = pathname === "/exams" || pathname.startsWith("/exams/");

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full bg-white backdrop-blur-md transition-all",
            isScrolled ? "shadow-md" : "shadow-none"
        )}>
            <div className="mx-auto flex max-w-7xl items-center justify-between py-3 md:py-4">
                {/* Logo and Mobile Menu */}
                <div className="flex w-full items-center justify-between md:w-auto">
                    <Link href="/" aria-label="Go to homepage">
                        <Image
                            src="/logo.svg"
                            alt="D.Work Logo"
                            width={150}
                            height={40}
                            priority
                            className="h-10 w-32 object-contain md:h-12 md:w-40"
                        />
                    </Link>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-muted-foreground"
                                    aria-label="Toggle mobile menu"
                                >
                                    <AlignJustify/>
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-72 overflow-y-auto">
                                <SheetHeader className="mb-6">
                                    <SheetTitle asChild>
                                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Image
                                                src="/logo.svg"
                                                alt="D.Work Logo"
                                                width={100}
                                                height={40}
                                                priority
                                                className="object-contain"
                                            />
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>

                                <nav className="flex flex-col gap-2 px-4" aria-label="Mobile Navigation">
                                    {NAV_ITEMS_BEFORE_EXAMS.map(({label, link}) => (
                                        <Link
                                            key={label}
                                            href={link}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "rounded-md px-3 py-2 text-base font-medium transition-colors",
                                                pathname === link
                                                    ? "!bg-green-600 !text-white hover:bg-green-700"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                            )}
                                        >
                                            {label}
                                        </Link>
                                    ))}

                                    {/* Exams in Nepal — mobile accordion */}
                                    {examCategories.length > 0 ? (
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="exams-in-nepal" className="border-none">
                                                <AccordionTrigger
                                                    className={cn(
                                                        "rounded-md px-3 py-2 text-base font-medium no-underline hover:no-underline",
                                                        isExamsActive
                                                            ? "!bg-green-600 !text-white hover:bg-green-700"
                                                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                                    )}
                                                >
                                                    Exams in Nepal
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="flex flex-col gap-5 border-l-2 border-gray-100 pl-3">
                                                        {examCategories.map((category) => {
                                                            const meta = CATEGORY_META[category.slug];
                                                            const Icon = meta?.icon;
                                                            const visibleGuides = category.guides.slice(0, MAX_VISIBLE_GUIDES);
                                                            const remaining = category.guides.length - visibleGuides.length;
                                                            return (
                                                                <div key={category.id}>
                                                                    <Link
                                                                        href={`/exams/${category.slug}`}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-gray-900 hover:text-green-700"
                                                                    >
                                                                        {Icon && <Icon className="w-4 h-4 text-green-700" aria-hidden="true"/>}
                                                                        {meta?.label ?? category.name}
                                                                    </Link>
                                                                    <div className="flex flex-col">
                                                                        {visibleGuides.map((guide) => (
                                                                            <Link
                                                                                key={guide.id}
                                                                                href={`/exams/${category.slug}/${guide.slug}`}
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                                                                            >
                                                                                {guide.name}
                                                                            </Link>
                                                                        ))}
                                                                        {remaining > 0 && (
                                                                            <Link
                                                                                href={`/exams/${category.slug}`}
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                className="rounded-md px-3 py-1.5 text-sm font-medium text-green-700 hover:underline"
                                                                            >
                                                                                +{remaining} more
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        <Link
                                                            href="/exams"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-green-700 hover:underline"
                                                        >
                                                            View All Exam Categories
                                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true"/>
                                                        </Link>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ) : (
                                        <Link
                                            href="/exams"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "rounded-md px-3 py-2 text-base font-medium transition-colors",
                                                isExamsActive
                                                    ? "!bg-green-600 !text-white hover:bg-green-700"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                            )}
                                        >
                                            Exams in Nepal
                                        </Link>
                                    )}

                                    {NAV_ITEMS_AFTER_EXAMS.map(({label, link}) => (
                                        <Link
                                            key={label}
                                            href={link}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "rounded-md px-3 py-2 text-base font-medium transition-colors",
                                                pathname === link
                                                    ? "!bg-green-600 !text-white hover:bg-green-700"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                            )}
                                        >
                                            {label}
                                        </Link>
                                    ))}

                                    <Button
                                        asChild={true}
                                        id="login-signup-mobile"
                                        className="mt-4 bg-green-600 text-white hover:bg-green-700"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Link href="/login">Login | Signup</Link>
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden md:flex" aria-label="Desktop Navigation">
                    <NavigationMenuList>
                        {NAV_ITEMS_BEFORE_EXAMS.map(({label, link}) => (
                            <NavigationMenuItem key={label}>
                                <NavigationMenuLink
                                    asChild
                                    className={cn(
                                        "font-poppins rounded-md text-center  px-4 py-2  text-sm  font-normal transition-colors",
                                        pathname === link
                                            ? "!bg-green-600 !text-white hover:bg-green-700"
                                            : "text-muted-foreground hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    <Link href={link}>{label}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}

                        {/* Exams in Nepal — desktop mega menu */}
                        {examCategories.length > 0 ? (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    className={cn(
                                        "font-poppins bg-transparent text-sm font-normal",
                                        isExamsActive
                                            ? "!bg-green-600 !text-white hover:!bg-green-700 hover:!text-white focus:!bg-green-600 focus:!text-white data-[state=open]:!bg-green-600 data-[state=open]:!text-white"
                                            : "text-muted-foreground hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    Exams in Nepal
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-[min(92vw,760px)] max-h-[80vh] overflow-y-auto">
                                        <div className="grid grid-cols-3 divide-x divide-gray-100">
                                            {examCategories.map((category) => {
                                                const meta = CATEGORY_META[category.slug];
                                                const Icon = meta?.icon;
                                                const visibleGuides = category.guides.slice(0, MAX_VISIBLE_GUIDES);
                                                const remaining = category.guides.length - visibleGuides.length;
                                                return (
                                                    <div key={category.id} className="p-5">
                                                        <Link
                                                            href={`/exams/${category.slug}`}
                                                            className="group flex items-center gap-2.5"
                                                        >
                                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                                                                {Icon && <Icon className="w-4 h-4 text-green-700" aria-hidden="true"/>}
                                                            </span>
                                                            <span className="text-sm font-semibold text-gray-900 group-hover:text-green-700">
                                                                {meta?.label ?? category.name}
                                                            </span>
                                                        </Link>
                                                        <ul className="mt-3 flex flex-col">
                                                            {visibleGuides.map((guide) => (
                                                                <li key={guide.id}>
                                                                    <NavigationMenuLink asChild>
                                                                        <Link
                                                                            href={`/exams/${category.slug}/${guide.slug}`}
                                                                            className="block truncate rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-700"
                                                                        >
                                                                            {guide.name}
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {remaining > 0 && (
                                                            <NavigationMenuLink asChild>
                                                                <Link
                                                                    href={`/exams/${category.slug}`}
                                                                    className="mt-1 inline-block px-2 py-1.5 text-sm font-medium text-green-700 hover:underline"
                                                                >
                                                                    +{remaining} more
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/exams"
                                                    className="flex items-center justify-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800"
                                                >
                                                    View All Exam Categories
                                                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true"/>
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ) : (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={cn(
                                        "font-poppins rounded-md text-center  px-4 py-2  text-sm  font-normal transition-colors",
                                        isExamsActive
                                            ? "!bg-green-600 !text-white hover:bg-green-700"
                                            : "text-muted-foreground hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    <Link href="/exams">Exams in Nepal</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}

                        {NAV_ITEMS_AFTER_EXAMS.map(({label, link}) => (
                            <NavigationMenuItem key={label}>
                                <NavigationMenuLink
                                    asChild
                                    className={cn(
                                        "font-poppins rounded-md text-center  px-4 py-2  text-sm  font-normal transition-colors",
                                        pathname === link
                                            ? "!bg-green-600 !text-white hover:bg-green-700"
                                            : "text-muted-foreground hover:bg-gray-100 hover:text-black"
                                    )}
                                >
                                    <Link href={link}>{label}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Desktop Login/Signup Button */}
                <div className="hidden md:block">
                    <Button
                        asChild
                        id="login-signup-desktop"
                        className="ml-4 bg-green-600 text-white hover:bg-green-700"
                    >
                        <Link href="/login">Login | Signup</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
