'use client'
import Image from "next/image";

import {ArrowUp, CircleChevronDown, MessageSquare, MoveRight} from "lucide-react";
import Link from "next/link";
import {onlineTest} from "../../../public/assest";
import {Button} from "@/components/ui/button";
import {section} from "framer-motion/m";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {DeleteModal} from "@/components/modal/DeleteModal";
import EditModal from "@/components/modal/EditModal";
import {useRouter} from "next/navigation";

export const FeaturedCard = () => {
    return (
        <div className="bg-[#F8F8F8] rounded-xl  p-4 flex flex-col items-center text-center max-w-xs">
            {/* Image */}
            <Image
                src={onlineTest}
                alt="Live Test"
                className="w-28 h-28 object-contain"
            />

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900 mt-4">
                Take Live Online Tests
            </h2>

            {/* Description */}
            <p className="text-sm text-pretty text-gray-600 mt-2">
                Participate in scheduled live tests or access missed ones at your
                convenience.
            </p>

            {/* Link */}
            <Link
                href="/test-exam"
                className="text-green-600 font-medium mt-4 flex items-center gap-1 hover:underline"
            >
                View integration <MoveRight size={18}/>
            </Link>
        </div>
    );
};

type PricingCardProps = {
  subscription?: Array<{
    subscription_type_id: number;
    duration: number;
    price: string;
  }> | null;
};

function PricingCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 xl:p-10 border border-slate-300 shadow-lg bg-white w-full">
      <div>
        <div className="flex items-center justify-between gap-x-4">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="mt-6 flex items-baseline gap-x-1">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-6 w-10 rounded-md" />
        </div>
      </div>

      <Skeleton className="mt-8 h-10 w-full rounded-lg" />
    </div>
  );
}


export const PricingCard = ({ subscription }: PricingCardProps) => {
    // const plans = {
    //     monthly: [
    //         {
    //             name: "Starter",
    //             price: "$9.99",
    //             priceUnit: "/month",
    //             features: ["7-day free trial", "1,000 tokens per month", "1 chatbot", "20 stored chats"],
    //         },
    //         {
    //             name: "Pro",
    //             price: "$19.99",
    //             priceUnit: "/month",
    //             features: ["14-day free trial", "5,000 tokens per month", "5 chatbots", "Unlimited chats"],
    //         },
    //     ],
    //     yearly: [
    //         {
    //             name: "Starter",
    //             price: "$99.99",
    //             priceUnit: "/year",
    //             features: ["7-day free trial", "12,000 tokens per year", "1 chatbot", "240 stored chats"],
    //         },
    //         {
    //             name: "Pro",
    //             price: "$199.99",
    //             priceUnit: "/year",
    //             features: ["14-day free trial", "60,000 tokens per year", "5 chatbots", "Unlimited chats"],
    //         },
    //     ],
    // };
    const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly");

    const monthlyPlans = subscription?.filter(plan => plan.duration <= 6) || [];
    const yearlyPlans = subscription?.filter(plan => plan.duration > 6) || [];

    const plans = billingType === "monthly" ? monthlyPlans : yearlyPlans;
    const isLoading = !subscription;

    return (
        <section className="flex flex-col items-center mt-8">
            {/* Toggle Buttons */}
            <div className="flex overflow-hidden font-light border border-gray-300 rounded-md">
                <Button
                    type="button"
                    aria-current="page"
                    aria-selected="true"
                    aria-checked="true"

                    onClick={() => setBillingType("monthly")}
                    className={`px-4 py-2 transition text-primary focus:outline-none ${
                        billingType === "monthly" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white hover:bg-gray-100"
                    }`}
                >
                    Monthly
                </Button>
                <Button
                    type="button"
                    onClick={() => setBillingType("yearly")}
                    className={`px-4 py-2 transition text-primary focus:outline-none ${
                        billingType === "yearly" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white hover:bg-gray-100"
                    }`}
                >
                    Yearly
                </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-4 flex-wrap">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex-wrap">
                            <PricingCardSkeleton />
                        </div>
                    ))
                    : plans.map(plan => (
                        <div
                            key={plan.subscription_type_id}
                            className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 xl:p-10 text-primary border border-slate-300 shadow-lg bg-white w-full max-w-sm"
                        >
                            <div>
                            {/* Header */}
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3 className="text-lg font-semibold">
                                    {plan.duration} {plan.duration > 1 ? "Months" : "Month"}
                                    </h3>
                                    <p className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    ✨ Active
                                    </p>
                                </div>

                                {/* Pricing */}
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-5xl font-bold tracking-tight">₹{plan.price}</span>
                                    <span className="text-sm font-semibold text-slate-600 tracking-wide">
                                    / {plan.duration}m
                                    </span>
                                </p>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="#"
                                className="mt-8 block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                Buy Plan
                            </Link>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};


export function AnalyticsCard({title, total, percentage}: { title: string, total: number, percentage: number }) {
    return (
        <div className="p-2  px-4 flex flex-col justify-between gap-4 h-auto rounded-xl shadow-sm border-white">
            <h4 className="text-muted-foreground font-medium font-poppins text-sm ">Total {title} test</h4>
            <div className={'flex-1 flex items-center justify-between text-sm'}>
                <p className=" font-bold text-xs text-black/80 ">{total}</p>
                <span className="text-green-700 inline-flex text-xs items-center ml-2">
                    +{percentage}% <ArrowUp className="h-4 w-4 ml-1"/>
                </span>
            </div>
        </div>
    );
}


interface RepliesCardProps {
    name: string;
    question: string;
    replies: number;
    studentId: number
    onDeleteAction: (id: number) => void
    onEditAction: (id: number, question: string) => void
    replyId: number
    isSolved?: boolean;


}

export function RepliesCard({
                                name,
                                question,
                                replies,
                                studentId,
                                replyId,
                                onDeleteAction,
                                onEditAction,
                                isSolved
                            }: RepliesCardProps) {
    const [loggedInId, setLoggedInId] = useState<number | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("_id");
        if (storedId) {
            setLoggedInId(Number(storedId));
        }
    }, []);

    const isOwner = loggedInId === studentId;
    const router = useRouter();

    return (
        <div className="w-full">
            <div className="relative flex flex-col gap-2 p-4 rounded-xl shadow-sm overflow-hidden bg-white">
                <Image src={'/images/1.svg'} alt={' image'}
                       width={100} height={100}
                       className={' absolute top-0 left-0 w-10 h-10'}/>
                <Image src={'/images/1.svg'} alt={' image'}
                       width={100} height={100}
                       className={' absolute bottom-0 right-0 rotate-180 w-10 h-10'}/>

                {/* Header Section */}
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-semibold font-poppins text-black break-words line-clamp-3">
                        {name}
                    </h3>
                    {isOwner && (
                        <div className="flex gap-2">
                            <EditModal
                                id={replyId}
                                question={question}
                                onEditAction={onEditAction}
                            />
                            <DeleteModal onConfirm={() => onDeleteAction(replyId)}/>
                        </div>
                    )}
                </div>

                {/* Question */}
                <p className="text-base text-gray-700 font-poppins leading-snug whitespace-pre-wrap">
                    {question}
                </p>

                {/* Reply Button */}
                <div className="flex justify-start items-center">
                    <Button size="sm" variant="link" onClick={() => router.push(`/student/dashboard/${replyId}`)}>
                        <MessageSquare className="mr-1 h-4 w-4"/> {replies} replies
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function RepliesCardSkeleton() {
    return (
        <div className="w-full flex-1">
            <div
                className="relative flex flex-col gap-2 p-4 rounded-xl shadow-sm overflow-hidden border border-gray-200 bg-white">
                {/* Corner images placeholder */}
                <Skeleton className="absolute top-0 left-0 w-10 h-10"/>
                <Skeleton className="absolute bottom-0 right-0 w-10 h-10 rotate-180"/>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-1/3 rounded-md"/>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" disabled>
                            <Skeleton className="w-4 h-4"/>
                        </Button>
                        <Button size="icon" variant="ghost" disabled>
                            <Skeleton className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>

                {/* Question content */}
                <div className="flex flex-col gap-2 mt-2">
                    <Skeleton className="h-4 w-full rounded-md"/>
                    <Skeleton className="h-4 w-3/4 rounded-md"/>

                    {/* Replies */}
                    <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="w-4 h-4"/>
                        <Skeleton className="h-3 w-10 rounded-md"/>
                    </div>
                </div>
            </div>
        </div>
    );
}