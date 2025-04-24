import { Container } from "@/components/container";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<Container className="py-8">
				<Breadcrumb className="mb-4">
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbLink>Search Results</BreadcrumbLink>
					</BreadcrumbItem>
				</Breadcrumb>
				<div className="space-y-6">
					<div>
						<Link passHref href="/">
							<Button variant="ghost" className="pl-0 my-4">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to collection
							</Button>
						</Link>
						<h1 className="text-3xl font-bold tracking-tight">
							Search Results
						</h1>
						{queryParams.q ? (
							<p className="text-muted-foreground">
								Results for: {queryParams.q}
							</p>
						) : (
							<p className="text-muted-foreground">All results:</p>
						)}
					</div>
					<div className="flex gap-6">
						<div>
							<Suspense fallback={<FilterSidebarSkeleton />}>
								<FilterSidebar />
							</Suspense>
						</div>
						<div className="flex-1">
							<Suspense fallback={<SearchResultsSkeleton />}>
								<SearchResults />
							</Suspense>
						</div>
					</div>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
