import { Container } from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/components/search-input";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { FilterIcon, MenuIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "nuqs";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { FilterSidebar, FilterSidebarSkeleton } from "./_filter-sidebar";
import { searchParamsParsers } from "./_search-params";
import { SearchResults, SearchResultsSkeleton } from "./_search-results";
import { Searchbar } from "./_searchbar";

export const metadata: Metadata = {
	title: "Search the Collection - Met Art Gallery",
	description:
		"Search and filter through thousands of artworks from the Metropolitan Museum of Art's collection. Discover art by department, medium, time period, and more.",
	// openGraph: {
	// 	title: "Explore the Met Art Gallery Collection",
	// 	description:
	// 		"Dive into the vast collection of the Metropolitan Museum of Art. Search, filter, and discover artworks from different cultures and eras.",
	// 	images: ["https://your-site.com/search-featured.jpg"],
	// },
	robots: "index, follow",
	alternates: {
		canonical: "https://met-art-gallery.vercel.app/search",
	},
};

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
						<div className="flex items-end gap-2">
							<Searchbar />
							<div className="lg:hidden">
								<MobileFilters />
							</div>
						</div>
					</Container>
				</section>
				<Container className="flex gap-6">
					<div className="hidden lg:block w-72 flex-shrink-0">
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
					<FilterSidebar />
				</Container>
			</SheetContent>
		</Sheet>
	);
}
