"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
    // Create queryClient only once per app
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: true,
                    retry: 3, 
                    staleTime: 1000 * 60 * 5, // 5 minutes
                    gcTime: 1000 * 60 * 10, // 10 minutes
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
