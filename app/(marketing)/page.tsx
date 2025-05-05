import { ArtworkCard } from "@/components/artwork-card";
import { Container } from "@/components/container";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { router } from "@/lib/api/router";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const ARTWORK_COUNT = 16;

export const metadata: Metadata = {
	title: "Met Art Gallery",
	description:
		"Discover a curated selection of artworks from the Metropolitan Museum of Art. Explore featured pieces and browse the vast collection.",
	// openGraph: {
	// 	title: "Discover the Met Art Gallery",
	// 	description:
	// 		"Experience the Metropolitan Museum of Art’s collection with a stunning featured artwork and more to explore.",
	// 	images: ["https://your-site.com/featured-artwork.jpg"],
	// },
	robots: "index, follow",
	alternates: {
		canonical: "https://met-art-gallery.vercel.app/",
	},
};

export default async function Home() {
	// await router.met.sync();

	const featuredArtwork = await router.met.getFeaturedArtwork();

	const { objectIDs } = await router.met.searchArtworks({
		q: "",
		isHighlight: true,
		hasImages: true,
		isOnView: true,
		pagination: {
			limit: ARTWORK_COUNT,
		},
	});

	const artworks = await Promise.all(
		objectIDs
			.filter((objectID) => objectID !== null && objectID !== undefined)
			.map(async (objectID) => {
				const obj = await router.met.getArtworkById(objectID);
				if (obj?.objectID) return obj;
				return null;
			}),
	);

	return (
		<div>
			<HeroSection object={featuredArtwork} />
			<Container className="py-12 z-10">
				<div className="space-y-8">
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-serif font-bold tracking-tight">
							Explore the Collection
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Browse through thousands of artworks from the Metropolitan Museum
							of Art's vast collection.
						</p>
					</div>
					<div defaultValue="browse" className="w-full">
						<div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
							{artworks.map(async (artwork) => (
								<ArtworkCard key={artwork?.objectID} object={artwork} />
							))}
						</div>
					</div>
					<div className="flex justify-center py-12">
						<Button variant="outline" asChild>
							<Link href="/search" prefetch>
								Explore the full collection
								<ArrowRightIcon />
							</Link>
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
}
