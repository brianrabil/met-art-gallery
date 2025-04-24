import { Container } from "@/components/container";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import Link from "next/link";
import type { SearchParams } from "nuqs";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { FilterSidebar, FilterSidebarSkeleton } from "./_filter-sidebar";
import { searchParamsParsers } from "./_search-params";
import { SearchResults, SearchResultsSkeleton } from "./_search-results";
import { Searchbar } from "./_searchbar";

const loadSearchParams = createLoader(searchParamsParsers);

export const metadata = {
	title: "Search Results",
	description: "Browse and filter search results on our site",
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const queryParams = await loadSearchParams(searchParams);
	const queryClient = new QueryClient();
	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="space-y-6">
				<section className="bg-muted pt-20 pb-8">
					<Container>
						<div className="flex items-center mb-4 gap-2">
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink asChild>
											<Link href="/">Home</Link>
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbLink>
											Search Results{" "}
											{queryParams.q ? ` for ${queryParams.q}` : ""}
										</BreadcrumbLink>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<Searchbar />
					</Container>
				</section>
				<Container className="flex gap-6">
					<div className="hidden md:block w-72 flex-shrink-0">
						<div className="sticky top-24">
							<Suspense fallback={<FilterSidebarSkeleton />}>
								<FilterSidebar />
							</Suspense>
						</div>
					</div>
					<div className="flex-1">
						<Suspense fallback={<SearchResultsSkeleton />}>
							<SearchResults />
						</Suspense>
					</div>
				</Container>
			</div>
		</HydrationBoundary>
	);
}
