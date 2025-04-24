import { Header } from "@/components/header";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-serif",
});

export const metadata = {
	title: "Meet the Met - Art Collection Explorer",
	description: "Explore the Metropolitan Museum of Art's vast collection",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} ${playfair.variable} antialiased`}>
				<NuqsAdapter>
					<Providers>
						<div className="min-h-screen bg-background">
							<Suspense>
								<Header />
							</Suspense>
							{children}
							<footer className="border-t mt-12">
								<div className="container mx-auto px-4 py-6">
									<p className="text-center text-sm text-muted-foreground">
										Data provided by the Metropolitan Museum of Art Collection
										API
									</p>
								</div>
							</footer>
						</div>
					</Providers>
				</NuqsAdapter>
			</body>
		</html>
	);
}
