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
import { Input } from "../ui/input";
import subscriptionService from "@/services/SubscriptionService";
import { toast } from "sonner";

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
  loading?: boolean;
  promoLoadingId?: number | null;
  onAddSubscription?: (subscription_type_id: number, promo_code: string) => void;
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


export const PricingCard = ({ subscription, loading, promoLoadingId, onAddSubscription }: PricingCardProps) => {
    const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly");
    const [promoCodes, setPromoCodes] = useState<Record<number, string>>({});
    const [activePromoId, setActivePromoId] = useState<number | null>(null);

    const [promoApplyingId, setPromoApplyingId] = useState<number | null>(null);
    const [promoData, setPromoData] = useState<Record<number, any>>({});

    const monthlyPlans = subscription?.filter(plan => plan.duration <= 6) || [];
    const yearlyPlans = subscription?.filter(plan => plan.duration > 6) || [];

    const plans = billingType === "monthly" ? monthlyPlans : yearlyPlans;
    const isLoading = loading;
    const isLoggedOut = !loading && subscription === null;

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
                {isLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex-wrap">
                            <PricingCardSkeleton />
                        </div>
                    ))
                }

                {!isLoading && isLoggedOut && (
                    <div className="flex flex-col items-center justify-center w-full max-w-md p-8 rounded-3xl bg-white border border-gray-300 shadow-lg text-center">
                        <h3 className="text-xl font-semibold mb-4">Login to View Plans</h3>
                        <p className="text-gray-600 mb-6">
                            To see available subscription plans and pricing, please log in to your account.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {!isLoading && !isLoggedOut && plans.map(plan => {
                    const promo = promoData[plan.subscription_type_id];
                    const discountedPrice = promo
                    ? (
                        Number(plan.price) -
                        (Number(plan.price) * Number(promo.discount_percent)) / 100
                        ).toFixed(2)
                    : null;

                    return (
                        <div
                            key={plan.subscription_type_id}
                            className="w-full flex flex-col justify-between rounded-3xl p-6 sm:p-8 xl:p-10 text-primary border border-slate-300 shadow-lg bg-white max-w-sm"
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
                                    {discountedPrice ? (
                                    <>
                                        <span className="text-4xl font-bold tracking-tight text-green-700">
                                        ₹{discountedPrice}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-600 tracking-wide">
                                        / {plan.duration}m
                                        </span>
                                        <span className="ml-2 line-through text-slate-400">
                                        ₹{plan.price}
                                        </span>
                                    </>
                                    ) : (
                                    <>
                                        <span className="text-5xl font-bold tracking-tight">
                                        ₹{plan.price}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-600 tracking-wide">
                                        / {plan.duration}m
                                        </span>
                                    </>
                                    )}
                                </p>

                                {promo?.detail && (
                                    <p className="mt-2 text-xs text-green-600">
                                    {promo.detail} ({promo.discount_percent}% off)
                                    </p>
                                )}

                                {activePromoId === plan.subscription_type_id && (
                                    <div className="mt-4 space-y-3">
                                        <Input
                                        type="text"
                                        placeholder="Promo Code"
                                        value={promoCodes[plan.subscription_type_id] || ""}
                                        onChange={(e) =>
                                            setPromoCodes((prev) => ({
                                            ...prev,
                                            [plan.subscription_type_id]: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:text-white transition hover:bg-green-700"
                                            disabled={promoApplyingId === plan.subscription_type_id}
                                            onClick={async () => {
                                                setPromoApplyingId(plan.subscription_type_id);
                                                try {
                                                const res = await subscriptionService.verifySubscription({
                                                    subscription_type_id: plan.subscription_type_id,
                                                    promo_code: promoCodes[plan.subscription_type_id] || "",
                                                });
                                                if (res?.status) {
                                                    setPromoData((prev) => ({
                                                    ...prev,
                                                    [plan.subscription_type_id]: res.data,
                                                    }));
                                                    toast.success("Promo code applied!");
                                                } else {
                                                    setPromoData((prev) => ({
                                                    ...prev,
                                                    [plan.subscription_type_id]: null,
                                                    }));
                                                    toast.error(res?.message || "Invalid promo code");
                                                }
                                                } catch (err) {
                                                setPromoData((prev) => ({
                                                    ...prev,
                                                    [plan.subscription_type_id]: null,
                                                }));
                                                toast.error("Invalid promo code");
                                                } finally {
                                                setPromoApplyingId(null);
                                                }
                                            }}
                                        >
                                        {promoApplyingId === plan.subscription_type_id ? "Applying..." : "Apply Coupon"}
                                        </Button>
                                    </div>
                                )}

                            </div>

                            {/* CTA Button */}
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (activePromoId === plan.subscription_type_id) {
                                        onAddSubscription?.(
                                        plan.subscription_type_id,
                                        promoCodes[plan.subscription_type_id] || ""
                                        );
                                    } else {
                                        setActivePromoId(plan.subscription_type_id);
                                    }
                                }}
                                className="mt-4 block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                {
                                    promoLoadingId === plan.subscription_type_id
                                    ? "Loading..."
                                    : activePromoId === plan.subscription_type_id
                                    ? "Confirm Purchase"
                                    : "Buy Plan"
                                }
                            </Link>
                        </div>
                    )
                })}
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