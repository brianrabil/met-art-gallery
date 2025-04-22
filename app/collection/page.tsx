import CollectionFilters from "@/components/collection/collection-filters";
import CollectionGrid from "@/components/collection/collection-grid";
import CollectionHero from "@/components/collection/collection-hero";
import FeaturedArtworks from "@/components/collection/featured-artworks";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	getArtMediums,
	getArtPeriods,
	getArtStyles,
	getCollectionHighlight,
	getFeaturedCollection,
	getFilteredCollection,
} from "@/lib/api";
import { queryKeys } from "@/lib/queries";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";

export const metadata = {
	title: "Collection - Meet the Met",
	description:
		"Explore our curated collection of artworks from the Metropolitan Museum of Art",
};

export default async function CollectionPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	// Extract search params
	const page = Number(searchParams.page || "1");
	const period = searchParams.period?.toString() || "";
	const style = searchParams.style?.toString() || "";
	const medium = searchParams.medium?.toString() || "";
	const sort = searchParams.sort?.toString() || "relevance";
	const highlight = searchParams.highlight === "true";
	const publicDomain = searchParams.publicDomain === "true";

	// Create a new QueryClient for server-side prefetching
	const queryClient = new QueryClient();

	// Prefetch data for the page
	await Promise.all([
		// Prefetch collection highlight for hero
		queryClient.prefetchQuery({
			queryKey: queryKeys.collectionHighlight,
			queryFn: getCollectionHighlight,
		}),

		// Prefetch featured collection
		queryClient.prefetchQuery({
			queryKey: queryKeys.featuredCollection(3),
			queryFn: () => getFeaturedCollection(3),
		}),

		// Prefetch filtered collection based on search params
		queryClient.prefetchQuery({
			queryKey: queryKeys.filteredCollection({
				page,
				period,
				style,
				medium,
				sort,
				highlight,
				publicDomain,
				limit: 12,
			}),
			queryFn: () =>
				getFilteredCollection({
					page,
					period,
					style,
					medium,
					sort,
					highlight,
					publicDomain,
					limit: 12,
				}),
		}),

		// Prefetch filter options
		queryClient.prefetchQuery({
			queryKey: queryKeys.artPeriods,
			queryFn: getArtPeriods,
		}),
		queryClient.prefetchQuery({
			queryKey: queryKeys.artStyles,
			queryFn: getArtStyles,
		}),
		queryClient.prefetchQuery({
			queryKey: queryKeys.artMediums,
			queryFn: getArtMediums,
		}),
	]);

	// Dehydrate the query client
	const dehydratedState = dehydrate(queryClient);

	return (
		<>
			<HydrationBoundary state={dehydratedState}>
				<CollectionHero />
				<Tabs
					defaultValue="collection"
					className="w-[90%] mx-auto flex flex-col"
				>
					<TabsList>
						<TabsTrigger value="collection">Collection</TabsTrigger>
						<TabsTrigger value="featured">Featured</TabsTrigger>
					</TabsList>
					<TabsContent value="collection" className="outline-none">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<aside className="md:col-span-1">
								<Suspense fallback={<Skeleton className="w-full h-40" />}>
									<CollectionFilters />
								</Suspense>
							</aside>
							<main className="md:col-span-3">
								<Suspense
									fallback={
										<div className="grid grid-cols-3 gap-4">
											<Skeleton className="w-full h-40" />
											<Skeleton className="w-full h-40" />
											<Skeleton className="w-full h-40" />
										</div>
									}
								>
									<CollectionGrid viewType="masonry" />
								</Suspense>
							</main>
						</div>
					</TabsContent>
					<TabsContent value="featured" className="outline-none">
						<Suspense
							fallback={
								<div className="grid grid-cols-3 gap-4">
									<Skeleton className="w-full h-40" />
									<Skeleton className="w-full h-40" />
									<Skeleton className="w-full h-40" />
								</div>
							}
						>
							<FeaturedArtworks />
						</Suspense>
					</TabsContent>
				</Tabs>
			</HydrationBoundary>
		</>
	);
}
