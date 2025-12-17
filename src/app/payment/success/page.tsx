'use client';

import {CheckCircle} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import subscriptionService from "@/services/SubscriptionService";


export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const txnId = searchParams.get("TXNID");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (txnId) {
            setLoading(true);
            subscriptionService.transactionStatus(txnId)
                .then((res) => {
                    console.log("Transaction confirmed:", res.data);
                })
                .catch((err) => {
                    console.error("Error confirming transaction", err);
                })
                .finally(() => setLoading(false));
        }
    }, [txnId]);

    return (
        <div className="h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <CheckCircle
                                className="w-16 h-16 text-green-500 animate-bounce"
                                aria-hidden="true"
                            />
                            <div className="absolute inset-0 w-16 h-16 bg-green-500/20 rounded-full animate-ping"/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
                        <p className="text-gray-600">
                            {loading ? "Verifying your payment…" : "Your payment has been processed."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
