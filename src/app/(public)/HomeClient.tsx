"use client";

import Image from "next/image";
import { HeroSection } from "@/components/common/HeroSection";
import { AppShowcaseSection } from "@/components/common/AppShowcaseSection";
import { FeaturedCard, PricingCard } from "@/components/card/card";
import {
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  FileText,
  HardHat,
  HeartPulse,
  Layers,
  PieChart,
  Scale,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { questionBank } from "../../../public/assest";
import { useEffect, useState } from "react";
import subscriptionService from "@/services/SubscriptionService";
import { redirectToConnectIPS } from "@/lib/connectIps";
import { toast } from "sonner";
import Link from "next/link";
import {
  CREATE_EXAM_LOGIN_ROUTE,
  CREATE_EXAM_REGISTER_ROUTE,
} from "@/config/app-constant";
import type { ExamGuideCategorySummary } from "@/lib/examGuideApi";

// Matches the mega menu's CATEGORY_META (components/header/NavBar.tsx) so the
// same 7 hub categories read consistently across nav and homepage.
const CATEGORY_META: Record<string, { label: string; icon: typeof HardHat }> = {
  medical: { label: "Medical", icon: Stethoscope },
  paramedical: { label: "Paramedical", icon: HeartPulse },
  engineering: { label: "Engineering", icon: HardHat },
  management: { label: "Management", icon: Briefcase },
  agriculture: { label: "Agriculture", icon: Wheat },
  law: { label: "Law", icon: Scale },
  others: { label: "Others", icon: Layers },
};

// Replaces the old featuredSteps (lib/data.ts, now removed) which pointed at
// three images that don't exist in /public (download-app.png, online-test.png,
// boost-prep.png - all 404) and two dead "#" links.
const howItWorks = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Pick Your Exam",
    description:
      "Browse Loksewa, PSC, entrance, and NEC license exams built for Nepal's real exam patterns.",
    linkHref: "/exams",
    linkText: "Browse Exams",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "Take a Mock Test",
    description:
      "Practice with free MCQs modeled on the real syllabus and exam pattern for your post.",
    linkHref: "/find-mcq",
    linkText: "Start Practicing",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Track Your Rank",
    description:
      "See where you stand in real time against other candidates preparing for the same post.",
    linkHref: "/register",
    linkText: "Create Free Account",
  },
];

const data = [
  {
    icon: <BarChart3 className="w-10 h-10" />,
    title: "A Valuable Preparation",
    desc: "Preparation is all about how you react in real scenarios. Taking exams can help you feel the real heat.",
  },
  {
    icon: <PieChart className="w-10 h-10" />,
    title: "Expert Analysis",
    desc: "We have a team of experts who have cracked each exams in their categories to guide you better.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Online Sprint",
    desc: "Daily sprint tests to evaluate your preparation and identify weaknesses — first time in Nepal.",
  },
  {
    icon: <FileText className="w-10 h-10" />,
    title: "Huge Question Collection",
    desc: "Access a rich bank of questions curated by expert exams crackers.",
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Doubt Discussion",
    desc: "Get help from experienced mentors to clarify your doubts.",
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "Get the Rank",
    desc: "Compete and rank nationally among your peers.",
  },
];

interface HomeClientProps {
  examCategories?: ExamGuideCategorySummary[];
}

export default function HomeClient({ examCategories = [] }: HomeClientProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promoLoadingId, setPromoLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("_at")) {
      setLoading(false);
      return;
    }

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

  const onAddSubscription = async (
    subscription_type_id: number,
    promo_code: string,
  ) => {
    try {
      setPromoLoadingId(subscription_type_id);
      const response = await subscriptionService.addSubscription({
        subscription_type_id,
        promo_code,
      });

      if (response.status) {
        toast.success("Transaction generated. Redirecting to payment...");
        redirectToConnectIPS(response.data);
        console.log("try", response.data);
      } else {
        toast.error("Failed to generate transaction.");
      }
    } catch (err) {
      toast.error("Failed to add subscription.");
      console.error(err);
    } finally {
      setPromoLoadingId(null);
    }
  };

  return (
    <main className="font-montserrat bg-white overflow-x-hidden scroll-smooth">
      <HeroSection />

      {/* Intro paragraph + real, crawlable links to the 3 exam-category hubs.
          Previously the only path to /exams/{category} was the nav mega menu,
          which doesn't render into the server HTML crawlers see (it only
          mounts on hover/click) - this is the primary internal-linking fix. */}
      {/* Full-bleed dark green section (the logo's exact green, #069C56) -
          the section itself has no side padding/max-width so the background
          runs edge to edge; the container inside keeps content aligned with
          the rest of the page. Text switches to white/light green for
          contrast against the dark background. */}
      <section className="mt-16 w-full bg-[#069C56] py-12 sm:mt-24 sm:py-16">
        <div className="container mx-auto px-6 sm:px-10 lg:px-20">
          {/* Left-aligned and full width (matches the category cards below),
              not centered: a 90-word paragraph set centered produces a
              ragged, hard-to-scan block - this reads like a normal lead
              paragraph instead. */}
          <p className="text-left text-base leading-relaxed text-green-50 sm:text-lg">
            ExamsNepal is an online exam-preparation platform built for Nepal&rsquo;s
            exam landscape: Loksewa (Nepal Public Service Commission) positions
            from Kharidar to Section Officer, license exams like NMC, NEC, and
            the Nepal Bar Council, and entrance exams for IOE, CEE MBBS/BDS,
            nursing, management, and law programs &mdash; organized by field,
            from Medical and Engineering to Agriculture and Law. Every exam
            page comes with a syllabus breakdown, eligibility criteria, and free
            mock tests modeled on the real exam pattern, so you can practice
            questions the way they&rsquo;ll actually appear and track your rank
            in real time against other candidates preparing for the same post.
          </p>

          {examCategories.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {examCategories.map((category) => {
                const meta = CATEGORY_META[category.slug];
                const Icon = meta?.icon;
                return (
                  <Link
                    key={category.id}
                    href={`/exams/${category.slug}`}
                    className="flex flex-col items-center gap-2 rounded-xl border border-transparent bg-white p-5 text-center shadow-sm transition hover:border-white/60 hover:shadow-md sm:p-6"
                  >
                    {Icon && <Icon className="w-7 h-7 text-green-600 sm:w-8 sm:h-8" aria-hidden="true" />}
                    <span className="text-base font-semibold text-gray-900 sm:text-lg">
                      {meta?.label ?? category.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.guide_count} exams covered
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/exams"
              className="inline-flex items-center gap-1 font-medium text-white hover:text-green-50 hover:underline"
            >
              View All Exam Categories
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-10 px-6 text-center sm:mt-20 sm:px-10 lg:px-20">
        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
          How It All Comes Together
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Discover the Advantages of Seamless Online Exam Solutions
        </p>
        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {howItWorks.map((step, index) => (
            <div key={index} className="flex justify-center">
              <FeaturedCard
                icon={step.icon}
                title={step.title}
                description={step.description}
                linkHref={step.linkHref}
                linkText={step.linkText}
              />
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
            Exams Nepal is one platform for conducting online examinations for
            various levels of exams in Nepal. It provides opportunities for
            students and organizations who want to conduct exams online.
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

      <AppShowcaseSection />

      <section className="container mx-auto mt-16 px-6 text-center sm:mt-20 sm:px-10 lg:px-20">
        <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
          Offered Packages
        </h2>
        <p className="mt-4 text-sm font-light text-gray-600 sm:text-base md:font-normal">
          Browse through our carefully curated packages designed to meet your
          specific needs
        </p>
        <PricingCard
          subscription={subscription}
          loading={loading}
          // promoLoadingId={promoLoadingId} onAddSubscription={onAddSubscription}
        />
      </section>
      <section className="relative flex flex-col-reverse items-center justify-between px-6 mt-20 mb-10 sm:px-10 md:flex-row lg:px-20">
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
        <div className="flex flex-col items-center text-center mb-8 max-w-3xl container mx-auto">
          <h2 className="text-3xl font-bold font-montserrat sm:text-4xl lg:text-5xl">
            Conduct Your Own Test
          </h2>
          <span className="font-montserrat text-gray-600 mt-4 text-sm font-light sm:text-base md:font-normal">
            Register as a teacher and create your own online exams with ease.
          </span>
          <p className="text-sm font-light text-muted-foreground sm:text-base md:font-normal">
            Manage questions, set time limits, and invite students to take your
            tests — all from one platform. Perfect for teachers, institutions,
            and coaching centers who want to assess and guide their learners
            effectively.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={CREATE_EXAM_REGISTER_ROUTE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Register as Teacher (opens in new tab)"
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Register as Teacher
              </Button>
            </Link>
            <Link
              href={CREATE_EXAM_LOGIN_ROUTE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Already a teacher? Login (opens in new tab)"
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Already a teacher? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
