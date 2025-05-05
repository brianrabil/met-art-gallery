"use client";

import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { orpc } from "@/lib/api/client.server";
import { router } from "@/lib/api/router";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { ChevronDown, FilterIcon, Github, Twitter } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "nuqs";
import { createLoader } from "nuqs/server";
import { Suspense, useState } from "react";
import { FilterSidebar, FilterSidebarSkeleton } from "./_filter-sidebar";
import { searchParamsParsers } from "./_search-params";
import { SearchResults, SearchResultsSkeleton } from "./_search-results";

// export const metadata: Metadata = {
// 	title: "Search Art Collection - Met Art Gallery",
// 	description:
// 		"Search and filter through thousands of artworks from the Metropolitan Museum of Art's collection. Discover art by department, medium, time period, and more.",
// 	robots: "index, follow",
// 	alternates: {
// 		canonical: "https://met-art-gallery.vercel.app/search",
// 	},
// };

const loadSearchParams = createLoader(searchParamsParsers);

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const queryParams = await loadSearchParams(searchParams);
	const queryClient = new QueryClient();

	// The results of this query will be cached like a normal query
	void queryClient.prefetchInfiniteQuery(
		orpc.met.searchArtworks.infiniteOptions({
			input: (pageParam) => ({
				pagination: {
					limit: queryParams.limit,
					offset: pageParam * queryParams.limit,
				},
				sort: {
					direction: queryParams.direction ?? undefined,
					field: queryParams.field ?? undefined,
				},
				artistOrCulture: queryParams.artistOrCulture ?? undefined,
				dateBegin: queryParams.dateBegin ?? undefined,
				dateEnd: queryParams.dateEnd ?? undefined,
				geoLocation: queryParams.geoLocation ?? undefined,
				departmentId: queryParams.departmentId ?? undefined,
				hasImages: queryParams.hasImages ?? undefined,
				isHighlight: queryParams.isHighlight ?? undefined,
				isOnView: queryParams.isOnView ?? undefined,
				medium: queryParams.medium ?? undefined,
				q: queryParams.q ?? undefined,
				tags: queryParams.tags ?? undefined,
				title: queryParams.title ?? undefined,
			}),
			initialPageParam: queryParams.offset ?? 0,
			getNextPageParam: (lastPage) => lastPage.nextPage,
			pages: 3,
		}),
	);

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="flex min-h-screen flex-col">
				{/* Main Content */}
				<Container className="flex-1 pb-12">
					<div className="flex flex-col gap-6 lg:flex-row">
						{/* Sidebar */}
						<div className="hidden lg:block w-64 shrink-0">
							<div className="sticky top-24">
								<Suspense fallback={<FilterSidebarSkeleton />}>
									<FilterSidebar />
								</Suspense>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							<Container variant="fluid">
								<Suspense
									fallback={<SearchResultsSkeleton limit={queryParams.limit} />}
								>
									<SearchResults />
								</Suspense>
							</Container>
						</div>
					</div>
				</Container>
			</div>
		</HydrationBoundary>
	);
}

function MobileFilters() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon">
					<FilterIcon className="size-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-h-screen overflow-y-auto pt-8">
				<Container>
					<FilterSidebar isSheet={true} />
				</Container>
			</SheetContent>
		</Sheet>
	);
}
