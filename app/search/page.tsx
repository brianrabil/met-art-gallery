import { Container } from "@/components/container";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { orpc } from "@/lib/api/client.server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { FilterIcon } from "lucide-react";
import type { SearchParams } from "nuqs";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { FilterSidebar, FilterSidebarSkeleton } from "./_filter-sidebar";
import { searchParamsParsers } from "./_search-params";
import { SearchResults, SearchResultsSkeleton } from "./_search-results";

const loadSearchParams = createLoader(searchParamsParsers);

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const queryParams = await loadSearchParams(searchParams);
	const queryClient = new QueryClient();

	// // The results of this query will be cached like a normal query
	// void queryClient.prefetchInfiniteQuery(
	// 	orpc.met.searchArtworks.infiniteOptions({
	// 		input: (pageParam) => ({
	// 			pagination: {
	// 				limit: queryParams.limit,
	// 				offset: pageParam * queryParams.limit,
	// 			},
	// 			sort: {
	// 				direction: queryParams.direction ?? undefined,
	// 				field: queryParams.field ?? undefined,
	// 			},
	// 			artistOrCulture: queryParams.artistOrCulture ?? undefined,
	// 			dateBegin: queryParams.dateBegin ?? undefined,
	// 			dateEnd: queryParams.dateEnd ?? undefined,
	// 			geoLocation: queryParams.geoLocation ?? undefined,
	// 			departmentId: queryParams.departmentId ?? undefined,
	// 			hasImages: queryParams.hasImages ?? undefined,
	// 			isHighlight: queryParams.isHighlight ?? undefined,
	// 			isOnView: queryParams.isOnView ?? undefined,
	// 			medium: queryParams.medium ?? undefined,
	// 			q: queryParams.q ?? undefined,
	// 			tags: queryParams.tags ?? undefined,
	// 			title: queryParams.title ?? undefined,
	// 		}),
	// 		initialPageParam: queryParams.offset ?? 0,
	// 		getNextPageParam: (lastPage) => lastPage.nextPage,
	// 		pages: 3,
	// 	}),
	// );

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<Container className="flex-1 pb-12">
				<Container variant="fluid">
					<Suspense
						fallback={<SearchResultsSkeleton limit={queryParams.limit} />}
					>
						<SearchResults />
					</Suspense>
				</Container>
			</Container>
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
