'use client'

import {StudentBannerHeader} from "@/components/banner/header";
import { useEffect, useState } from "react";
import subscriptionService from "@/services/SubscriptionService";
import { PricingCard } from "@/components/card/card";

// function SubscriptionClient() {
//     return (
//         <Card
//             className="shadow-lg cursor-pointer w-full max-w-sm font-poppins border-none !py-2 px-4 gap-2 hover:drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-shadow ease-in-out duration-300 bg-gradient-to-r from-green-50 to-green-100 text-gray-800 rounded-lg"
//             aria-label="Basic Subscription Plan"

//         >
//             <CardHeader className="flex flex-col items-start justify-start">
//                 <h2 className="text-2xl font-bold">Basic</h2>
//             </CardHeader>

//             <CardContent className="p-2 text-black/70">
//                 <div>
//           <span className="text-2xl font-medium">
//             Rs <span className="text-4xl font-bold">120</span>/mth
//           </span>
//                 </div>
//                 <p className="text-gray-600 text-sm py-1">
//                     A reliable, cost-effective plan with all essentials to get started.
//                 </p>
//             </CardContent>

//             <CardFooter className="p-2">
//                 <Button
//                     className="w-full bg-green-600 hover:bg-green-700 rounded-button whitespace-nowrap focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     aria-label="Choose Basic Plan"
//                 >
//                     Choose Plan
//                 </Button>
//             </CardFooter>
//         </Card>
//     );
// }

export default function Subscription() {
    const [subscription, setSubscription] = useState<any>(null);
    
    useEffect(() => {
        const fetchUserSubscription = async () => {
        try {
            const data = await subscriptionService.getSubscriptionTypes();
            console.log("data", data);
            setSubscription(data);
        } catch (err) {
            console.error("Failed to fetch subscription status:", err);
        }
        };
        fetchUserSubscription();
    }, []);

    return (
        <>
            <div className="w-full">
                <StudentBannerHeader
                    title="Subscription"
                    subtitle="Manage your subscription and payment methods."
                />
            </div>

            <section className="px-4 py-8 max-w-7xl mx-auto">
                <div className="text-center mt-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Choose a Plan</h1>
                <p className="text-gray-600 mt-2 text-base max-w-2xl mx-auto">
                    Flexible pricing options tailored to your learning needs.
                </p>
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, index) => (
                        <SubscriptionClient key={index}/>
                    ))}
                </div> */}
                <PricingCard subscription={subscription} />
            </section>
        </>        
    );
}
