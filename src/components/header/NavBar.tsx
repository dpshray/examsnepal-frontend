"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlignJustify,
  ArrowRight,
  Briefcase,
  HardHat,
  HeartPulse,
  Layers,
  Scale,
  Stethoscope,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { ExamGuideCategoryDetail, ExamGuideType } from "@/lib/examGuideApi";
import useAuth from "@/hooks/useAuth";

const NAV_ITEMS_BEFORE_EXAMS = [
  { label: "Home", link: "/" },
  { label: "About Us", link: "/about" },
];

const NAV_ITEMS_AFTER_EXAMS = [
  { label: "Find MCQs", link: "/find-mcq" },
  { label: "Classes", link: "/institutes" },
  { label: "Contact Us", link: "/contact-us" },
];

// Display label + icon for the mega menu, keyed by the exam_categories slug.
const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
  medical: { label: "Medical", icon: Stethoscope },
  paramedical: { label: "Paramedical", icon: HeartPulse },
  engineering: { label: "Engineering", icon: HardHat },
  management: { label: "Management", icon: Briefcase },
  agriculture: { label: "Agriculture", icon: Wheat },
  law: { label: "Law", icon: Scale },
  others: { label: "Others", icon: Layers },
};

// Sub-groups within each category's dropdown - links to the anchored section
// on that category's hub page (/exams/{category}#{id}) rather than listing
// every individual exam (55 exams across 7 categories doesn't fit in a hover
// menu; the hub page itself lists them, grouped the same way).
const TYPE_META: Record<ExamGuideType, { id: string; label: string }> = {
  license: { id: "license", label: "License Exams" },
  loksewa: { id: "loksewa", label: "Loksewa Exams" },
  entrance: { id: "entrance", label: "Entrance Exams" },
  job: { id: "job", label: "Job Exams" },
};
const TYPE_ORDER: ExamGuideType[] = ["license", "loksewa", "entrance", "job"];

interface NavBarProps {
  examCategories?: ExamGuideCategoryDetail[];
}

export default function NavBar({ examCategories = [] }: NavBarProps) {
  const { isAuthenticated } = useAuth();
  console.log("user");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Which category's exam list shows in the right pane of the desktop mega
  // menu; null falls back to the first category (see render below).
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isExamsActive = pathname === "/exams" || pathname.startsWith("/exams/");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white backdrop-blur-md transition-all",
        isScrolled ? "shadow-md" : "shadow-none",
      )}
    >
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
                  <AlignJustify />
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

                <nav
                  className="flex flex-col gap-2 px-4"
                  aria-label="Mobile Navigation"
                >
                  {NAV_ITEMS_BEFORE_EXAMS.map(({ label, link }) => (
                    <Link
                      key={label}
                      href={link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-base font-medium transition-colors",
                        pathname === link
                          ? "!bg-green-600 !text-white hover:bg-green-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-black",
                      )}
                    >
                      {label}
                    </Link>
                  ))}

                  {/* Exams in Nepal — mobile accordion */}
                  {examCategories.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value="exams-in-nepal"
                        className="border-none"
                      >
                        <AccordionTrigger
                          className={cn(
                            "rounded-md px-3 py-2 text-base font-medium no-underline hover:no-underline",
                            isExamsActive
                              ? "!bg-green-600 !text-white hover:bg-green-700"
                              : "text-gray-700 hover:bg-gray-100 hover:text-black",
                          )}
                        >
                          Exams in Nepal
                        </AccordionTrigger>
                        <AccordionContent className="pl-2">
                          <div className="flex flex-col gap-4">
                            {examCategories.map((category) => {
                              const meta = CATEGORY_META[category.slug];
                              return (
                                <div key={category.id}>
                                  <Link
                                    href={`/exams/${category.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-1 text-sm font-semibold text-gray-900 hover:text-green-700"
                                  >
                                    {meta?.label ?? category.name}
                                  </Link>
                                  <div className="flex flex-col">
                                    {TYPE_ORDER.map((type) => {
                                      const guides = category.guides.filter(
                                        (guide) => guide.type === type,
                                      );
                                      if (guides.length === 0) return null;
                                      return (
                                        <div key={type} className="mt-1">
                                          <span className="block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            {TYPE_META[type].label}
                                          </span>
                                          {guides.map((guide) => (
                                            <Link
                                              key={guide.id}
                                              href={`/exams/${category.slug}/${guide.slug}`}
                                              onClick={() =>
                                                setIsMobileMenuOpen(false)
                                              }
                                              className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                                            >
                                              {guide.name}
                                            </Link>
                                          ))}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                            <Link
                              href="/exams"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 hover:underline"
                            >
                              View All Exam Categories
                              <ArrowRight
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
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
                          : "text-gray-700 hover:bg-gray-100 hover:text-black",
                      )}
                    >
                      Exams in Nepal
                    </Link>
                  )}

                  {NAV_ITEMS_AFTER_EXAMS.map(({ label, link }) => (
                    <Link
                      key={label}
                      href={link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-base font-medium transition-colors",
                        pathname === link
                          ? "!bg-green-600 !text-white hover:bg-green-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-black",
                      )}
                    >
                      {label}
                    </Link>
                  ))}

                  {/* <Button
                    asChild={true}
                    id="login-signup-mobile"
                    className="mt-4 bg-green-600 text-white hover:bg-green-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/login">Login | Signup</Link>
                  </Button> */}
                  {/* Desktop Login/Signup Button */}
                  <div className="hidden md:block">
                    <Button
                      asChild
                      id={
                        isAuthenticated
                          ? "dashboard-desktop"
                          : "login-signup-desktop"
                      }
                      className="ml-4 bg-green-600 text-white hover:bg-green-700"
                    >
                      <Link href={isAuthenticated ? "/student" : "/login"}>
                        {isAuthenticated ? "Dashboard" : "Login | Signup"}
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu
          className="hidden md:flex"
          aria-label="Desktop Navigation"
        >
          <NavigationMenuList>
            {NAV_ITEMS_BEFORE_EXAMS.map(({ label, link }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "font-poppins rounded-md text-center  px-4 py-2  text-sm  font-normal transition-colors",
                    pathname === link
                      ? "!bg-green-600 !text-white hover:bg-green-700"
                      : "text-muted-foreground hover:bg-gray-100 hover:text-black",
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
                      : "text-muted-foreground hover:bg-gray-100 hover:text-black",
                  )}
                >
                  Exams in Nepal
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[min(94vw,760px)] p-3">
                    <div className="flex max-h-[70vh]">
                      {/* Category list - hover switches which category's exams show on the right */}
                      <ul className="flex w-[210px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-border pr-2">
                        {examCategories.map((category) => {
                          const meta = CATEGORY_META[category.slug];
                          const Icon = meta?.icon;
                          return (
                            <li key={category.id}>
                              <Link
                                href={`/exams/${category.slug}`}
                                onMouseEnter={() => setHoveredCategorySlug(category.slug)}
                                onFocus={() => setHoveredCategorySlug(category.slug)}
                                className={cn(
                                  "flex items-center gap-2 rounded px-2.5 py-2 text-sm font-medium transition-colors",
                                  (hoveredCategorySlug ?? examCategories[0]?.slug) === category.slug
                                    ? "bg-green-50 text-green-800"
                                    : "text-gray-700 hover:bg-gray-100",
                                )}
                              >
                                {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
                                <span className="flex-1">{meta?.label ?? category.name}</span>
                                <span className="text-xs text-gray-400">{category.guides.length}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Exam list for the active category, grouped by type */}
                      <div className="flex-1 overflow-y-auto pl-4">
                        {(() => {
                          const activeCategory =
                            examCategories.find(
                              (c) => c.slug === (hoveredCategorySlug ?? examCategories[0]?.slug),
                            ) ?? examCategories[0];
                          if (!activeCategory) return null;

                          return (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                              {TYPE_ORDER.map((type) => {
                                const guides = activeCategory.guides.filter((guide) => guide.type === type);
                                if (guides.length === 0) return null;
                                return (
                                  <div key={type} className="col-span-2 sm:col-span-1">
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                      {TYPE_META[type].label}
                                    </div>
                                    <ul className="flex flex-col gap-0.5">
                                      {guides.map((guide) => (
                                        <li key={guide.id}>
                                          <NavigationMenuLink asChild>
                                            <Link
                                              href={`/exams/${activeCategory.slug}/${guide.slug}`}
                                              className="block rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                                            >
                                              {guide.name}
                                            </Link>
                                          </NavigationMenuLink>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="mt-3 border-t pt-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/exams"
                          className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
                        >
                          View All Exam Categories
                          <ArrowRight
                            className="w-3.5 h-3.5"
                            aria-hidden="true"
                          />
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
                      : "text-muted-foreground hover:bg-gray-100 hover:text-black",
                  )}
                >
                  <Link href="/exams">Exams in Nepal</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {NAV_ITEMS_AFTER_EXAMS.map(({ label, link }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "font-poppins rounded-md text-center  px-4 py-2  text-sm  font-normal transition-colors",
                    pathname === link
                      ? "!bg-green-600 !text-white hover:bg-green-700"
                      : "text-muted-foreground hover:bg-gray-100 hover:text-black",
                  )}
                >
                  <Link href={link}>{label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Login/Signup Button */}
        {/* <div className="hidden md:block">
          <Button
            asChild
            id="login-signup-desktop"
            className="ml-4 bg-green-600 text-white hover:bg-green-700"
          >
            <Link href="/login">Login | Signup</Link>
          </Button>
        </div> */}
        {/* Desktop Login/Signup Button */}
        <div className="hidden md:block">
          <Button
            asChild
            id={isAuthenticated ? "dashboard-desktop" : "login-signup-desktop"}
            className="ml-4 bg-green-600 text-white hover:bg-green-700"
          >
            <Link href={isAuthenticated ? "/student" : "/login"}>
              {isAuthenticated ? "Dashboard" : "Login | Signup"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
