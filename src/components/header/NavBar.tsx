'use client';

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {AlignJustify} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";

const NAV_ITEMS = [
    {label: "Home", link: "/"},
    {label: "About Us", link: "/about"},
    {label: "Find MCQs", link: "/find-mcq"},
    {label: "Create Exams", link: "#"},
    {label: "Blogs", link: "/blog"},
    {label: "Contact Us", link: "/contact-us"},
];

export default function NavBar() {
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

                            <SheetContent side="right" className="w-64">
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

                                <nav className="flex flex-col gap-4 px-4" aria-label="Mobile Navigation">
                                    {NAV_ITEMS.map(({label, link}) => (
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
                        {NAV_ITEMS.map(({label, link}) => (
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
