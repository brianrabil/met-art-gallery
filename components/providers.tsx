"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Set a long stale time to minimize unnecessary refetches
						staleTime: 1000 * 60 * 60, // 1 hour
						// Keep cached data for even longer
						gcTime: 1000 * 60 * 60 * 24, // 24 hours
						// Retry failed queries 3 times
						retry: 3,
						// Refetch on window focus, but not too aggressively
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<AuthUIProvider
			authClient={authClient}
			navigate={router.push}
			replace={router.replace}
			providers={["github"]}
			redirectTo="/dashboard"
			credentials={false}
			onSessionChange={() => {
				// Clear router cache (protected routes)
				router.refresh();
			}}
			Link={Link}
		>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AuthUIProvider>
	);
}
