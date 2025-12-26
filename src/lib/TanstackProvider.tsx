"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";

const TanstackProvider = ({children}: { children: React.ReactNode }) => {
    // Create queryClient only once per app
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: true,
                    refetchOnReconnect: true,
                    retry: 2,
                },
            },
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default TanstackProvider;
