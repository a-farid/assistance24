"use client";

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function TanStackProvider({ children }: { children: ReactNode }) {
  // Configured inside a stable React state instance to safeguard isolation per user thread
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes global cache freshness threshold
            refetchOnWindowFocus: false, // Prevents aggressive network spam on tab switching
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}