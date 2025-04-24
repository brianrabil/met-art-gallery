import { Container } from "@/components/container";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { loadSearchParams } from "@/lib/search-params";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { PAGE_SIZE } from "./_config";
import { FilterSidebar } from "./filter-sidebar";
import { SearchResults } from "./search-results";

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
							<Suspense fallback={<SearchResultsSkeleton />}>
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

function SearchResultsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array(PAGE_SIZE)
				.fill(0)
				.map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={i} className="space-y-3">
						<Skeleton className="h-[200px] w-full rounded-lg" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				))}
		</div>
	);
}
