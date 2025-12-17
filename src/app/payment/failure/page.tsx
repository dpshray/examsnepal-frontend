"use client"

import { XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import subscriptionService from "@/services/SubscriptionService"

export default function PaymentFailurePage() {
    const searchParams = useSearchParams();
    const txnId = searchParams.get("TXNID");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!txnId) return;

        setLoading(true);
        subscriptionService.transactionStatus(txnId)
            .then((res) => console.log("Transaction confirmed:", res))
            .catch((err) => console.error("Error confirming transaction", err))
            .finally(() => setLoading(false));
    }, [txnId]);


    // const handleRetryPayment = () => {
    //     // Redirect to payment page or retry logic
    //     window.location.href = "/payment"
    // }

    return (
        <div className="h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <XCircle
                                className="w-16 h-16 text-red-500 animate-bounce"
                                aria-hidden="true"
                            />
                            <div className="absolute inset-0 w-16 h-16 bg-red-500/20 rounded-full animate-ping" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
                        <p className="text-gray-600">
                            {loading ? "Verifying payment status…" : "Oops! Something went wrong while processing your payment. Please try again."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
