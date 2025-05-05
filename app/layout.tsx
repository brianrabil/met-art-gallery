import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { SpaceshipScrollbar } from "@/components/ui/spaceship-scrollbar";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: {
		default: "Met Art Gallery",
		template: "%s | Met Art Gallery",
	},
	description:
		"Explore the vast collection of the Metropolitan Museum of Art. Browse artworks by department, medium, and time period, or search for specific pieces.",
	// openGraph: {
	//   title: 'Met Art Gallery',
	//   description: 'Discover and explore the Metropolitan Museum of Art’s collection of artworks from around the world.',
	//   images: ['https://your-site.com/default-image.jpg'],
	// },
	robots: "index, follow",
	alternates: {
		canonical: "https://met-art-gallery.vercel.app/",
	},
};

export default function RootLayout({
	children,
	header,
}: Readonly<{
	children: React.ReactNode;
	header: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} ${playfair.variable} antialiased`}>
				<NuqsAdapter>
					<Providers>
						{/* <SpaceshipScrollbar /> */}
						<div className="min-h-screen flex flex-col bg-background">
							{header}
							<main className="flex-1 w-full flex flex-col">{children}</main>
							<Footer />
						</div>
					</Providers>
				</NuqsAdapter>
			</body>
		</html>
	);
}
