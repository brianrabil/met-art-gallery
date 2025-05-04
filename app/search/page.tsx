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
import { Searchbar } from "./_searchbar";

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
	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="flex min-h-screen flex-col">
				{/* Breadcrumb Navigation */}

				{/* Header */}
				<div className="bg-background py-12 text-center">
					<h1 className="mb-4 text-4xl font-bold">Art Collection Search</h1>
					<p className="mx-auto max-w-3xl px-4 text-muted-foreground">
						Browse through thousands of artworks from the Metropolitan Museum of
						Art's vast collection spanning over 5,000 years of world cultures.
					</p>

					{/* <div className="mt-6 flex justify-center space-x-4">
						<Link
							href="#"
							className="text-muted-foreground hover:text-foreground"
						>
							<Github className="h-6 w-6" />
						</Link>
						<Link
							href="#"
							className="text-muted-foreground hover:text-foreground"
						>
							<Twitter className="h-6 w-6" />
						</Link>
					</div> */}
				</div>

				{/* Stats and Actions */}
				<Container variant="fluid" className="mb-6">
					<div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
						<div className="mb-4 flex items-center md:mb-0">
							<span className="text-muted-foreground">
								4,172 artworks found. Last updated 2023-07-15
							</span>
							<span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
						</div>

						<div className="flex flex-col gap-2 sm:flex-row">
							<Button variant="outline" className="border-border bg-background">
								<span className="mr-2 rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
									New
								</span>
								Advanced Search
							</Button>

							<Select defaultValue="relevance">
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="relevance">Search Relevance</SelectItem>
									<SelectItem value="newest">Newest</SelectItem>
									<SelectItem value="oldest">Oldest</SelectItem>
									<SelectItem value="popular">Most Popular</SelectItem>
								</SelectContent>
							</Select>

							<div className="lg:hidden">
								<MobileFilters />
							</div>
						</div>
					</div>
				</Container>

				{/* Main Content */}
				<div className="container flex-1 pb-12">
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
								<Suspense fallback={<SearchResultsSkeleton />}>
									<SearchResults />
								</Suspense>
							</Container>
						</div>
					</div>
				</div>
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
