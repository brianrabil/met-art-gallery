import { ArtObjectCard } from "@/components/art-object-card";
import { Container } from "@/components/container";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import {
	getObjectById,
	getRandomFeaturedArtwork,
	search,
} from "@/lib/api/router";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const ARTWORK_COUNT = 16;

export const metadata = {
	title: "Met Art Gallery",
	description:
		"Browse through thousands of artworks from the Metropolitan Museum of Art's vast collection.",
};

export default async function Home() {
	const featuredArtwork = await getRandomFeaturedArtwork();

	const { objectIDs } = await search({
		q: "",
		isHighlight: true,
		hasImages: true,
		isOnView: true,
		limit: ARTWORK_COUNT,
	});

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
							{objectIDs.map(async (objectID) => {
								const artwork = await getObjectById({ objectID });
								// TODO: Handle error
								return (
									<ArtObjectCard key={artwork.objectID} object={artwork} />
								);
							})}
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
