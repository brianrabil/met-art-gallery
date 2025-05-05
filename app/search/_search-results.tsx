"use client";

import { ArtObjectCardSkeleton, ArtworkCard } from "@/components/artwork-card";
import { Container } from "@/components/container";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/api/client";
import { router } from "@/lib/api/router";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	type VirtualizerOptions,
	useVirtualizer,
} from "@tanstack/react-virtual";
import { BoxIcon, ChevronDownIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import type React from "react";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { searchParamsParsers } from "./_search-params";

const filters = {
	price: [
		{ value: "0", label: "$0 - $25", checked: false },
		{ value: "25", label: "$25 - $50", checked: false },
		{ value: "50", label: "$50 - $75", checked: false },
		{ value: "75", label: "$75+", checked: false },
	],
	color: [
		{ value: "white", label: "White", checked: false },
		{ value: "beige", label: "Beige", checked: false },
		{ value: "blue", label: "Blue", checked: true },
		{ value: "brown", label: "Brown", checked: false },
		{ value: "green", label: "Green", checked: false },
		{ value: "purple", label: "Purple", checked: false },
	],
	size: [
		{ value: "xs", label: "XS", checked: false },
		{ value: "s", label: "S", checked: true },
		{ value: "m", label: "M", checked: false },
		{ value: "l", label: "L", checked: false },
		{ value: "xl", label: "XL", checked: false },
		{ value: "2xl", label: "2XL", checked: false },
	],
	category: [
		{ value: "all-new-arrivals", label: "All New Arrivals", checked: false },
		{ value: "tees", label: "Tees", checked: false },
		{ value: "objects", label: "Objects", checked: false },
		{ value: "sweatshirts", label: "Sweatshirts", checked: false },
		{ value: "pants-and-shorts", label: "Pants & Shorts", checked: false },
	],
};
const sortOptions = [
	{ name: "Most Popular", href: "#", current: true },
	{ name: "Best Rating", href: "#", current: false },
	{ name: "Newest", href: "#", current: false },
];

export function SearchResults() {
	const [{ limit, offset, ...searchParams }] =
		useQueryStates(searchParamsParsers);
	// The scrollable element for your list

	const parentRef = useRef<HTMLDivElement>(null);
	const scrollingRef = useRef<number>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
		isLoading,
		status,
		isPending,
		error,
	} = useSuspenseInfiniteQuery(
		orpc.met.searchArtworks.infiniteOptions({
			input: (pageParam) => ({
				pagination: {
					limit,
					offset: pageParam * limit,
				},
				sort: {
					direction: searchParams.direction ?? undefined,
					field: searchParams.field ?? undefined,
				},
				artistOrCulture: searchParams.artistOrCulture ?? undefined,
				dateBegin: searchParams.dateBegin ?? undefined,
				dateEnd: searchParams.dateEnd ?? undefined,
				geoLocation: searchParams.geoLocation ?? undefined,
				departmentId: searchParams.departmentId ?? undefined,
				hasImages: searchParams.hasImages ?? undefined,
				isHighlight: searchParams.isHighlight ?? undefined,
				isOnView: searchParams.isOnView ?? undefined,
				medium: searchParams.medium ?? undefined,
				q: searchParams.q ?? undefined,
				tags: searchParams.tags ?? undefined,
				title: searchParams.title ?? undefined,
			}),
			initialPageParam: offset ?? 0,
			getNextPageParam: (lastPage) => lastPage.nextPage,
		}),
	);

	const allRows: number[] = data
		? (data.pages
				.flatMap(({ objectIDs }) => objectIDs)
				.filter((objectId) => !!objectId) as number[])
		: [];

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 320,
		overscan: 5,
		lanes: 3,
	});

	const scrollToFn: VirtualizerOptions<any, any>["scrollToFn"] = useCallback(
		(offset, canSmooth, instance) => {
			const duration = 1000;
			const start = parentRef.current?.scrollTop || 0;
			const startTime = (scrollingRef.current = Date.now());

			const run = () => {
				if (scrollingRef.current !== startTime) return;
				const now = Date.now();
				const elapsed = now - startTime;
				const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
				const interpolated = start + (offset - start) * progress;

				if (elapsed < duration) {
					elementScroll(interpolated, canSmooth, instance);
					requestAnimationFrame(run);
				} else {
					elementScroll(interpolated, canSmooth, instance);
				}
			};

			requestAnimationFrame(run);
		},
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

		if (!lastItem) {
			return;
		}

		if (
			lastItem.index >= allRows.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [
		hasNextPage,
		fetchNextPage,
		allRows.length,
		isFetchingNextPage,
		rowVirtualizer.getVirtualItems(),
	]);

	if (data?.pages.length === 0) {
		return <EmptyState />;
	}

	return (
		<div
			ref={parentRef}
			className="max-w-screen w-full overflow-y-auto h-screen max-h-screen min-h-screen"
		>
			{isPending ? (
				<p>Loading...</p>
			) : status === "error" ? (
				<span>Error: {error?.message}</span>
			) : (
				<div>
					<SearchResultsHeader total={allRows.length} />
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const index = virtualRow.index;
							const isLoaderRow = virtualRow.index > allRows.length - 1;
							if (isLoaderRow) {
								return (
									<div
										key={virtualRow.key}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: `${virtualRow.size}px`,
											transform: `translateY(${virtualRow.start}px)`,
										}}
										className="flex justify-center items-center"
									>
										{hasNextPage ? "Loading more..." : "No more items to load"}
									</div>
								);
							}

							// Set gutter (spacing) between cards
							const GUTTER = 24; // px
							const LANES = rowVirtualizer.options.lanes ?? 3;
							const laneWidth = `calc(${100 / LANES}% - ${(GUTTER * (LANES - 1)) / LANES}px)`;
							const left = `calc(${virtualRow.lane * (100 / LANES)}% + ${virtualRow.lane * GUTTER}px)`;

							return (
								<div
									key={virtualRow.key}
									className="transition-shadow"
									style={{
										position: "absolute",
										top: 0,
										left,
										width: laneWidth,
										height: `${virtualRow.size - GUTTER}px`,
										transform: `translateY(${virtualRow.start}px)`,
										padding: `0 0 ${GUTTER}px 0`,
										boxSizing: "border-box",
									}}
								>
									<Suspense
										key={`${index}-${allRows[virtualRow.index]}`}
										fallback={<ArtObjectCardSkeleton />}
									>
										<SuspensedArtObjectCard
											key={`${index}-${allRows[virtualRow.index]}`}
											style={{
												height: "100%",
												display: "flex",
												flexDirection: "column",
											}}
											objectID={allRows[virtualRow.index]}
										/>
									</Suspense>

									<button
										type="button"
										onClick={() => {
											rowVirtualizer.scrollToIndex(0);
										}}
									>
										scroll to the top
									</button>
								</div>
							);
						})}
					</div>
				</div>
			)}
			<div>
				{isFetching && !isFetchingNextPage ? "Background Updating..." : null}
			</div>
			{/* <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{data?.pages.map(({ objectIDs, page }) => (
					<React.Fragment key={page}>
						{page > 0 ? (
							<div className="flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-3">
								<div className="flex items-center w-full my-8">
									<Separator className="flex-1" />
									<span className="mx-4 text-xs text-muted-foreground uppercase tracking-widest">
										Page {page + 1}
									</span>
									<Separator className="flex-1" />
								</div>
							</div>
						) : null}
						{objectIDs.map((objectID) => (
							<Suspense key={objectID} fallback={<ArtObjectCardSkeleton />}>
								<SuspensedArtObjectCard objectID={objectID} />
							</Suspense>
						))}
					</React.Fragment>
				))}
				<Button onClick={() => fetchNextPage()}>Load More</Button>
			</div> */}
		</div>
	);
}

export function SearchResultsHeader({
	total,
}: {
	total: number;
}) {
	return (
		<div className="bg-muted mb-8 pb-2 border-b border-border">
			{/* <Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/" asChild>
							<Link href="/">
								<HomeIcon strokeWidth={2} className="h-4 w-4" />
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/search" asChild>
							<Link href="/search">Search</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
					<BreadcrumbPage>
						Results{queryParams.q ? ` for ${queryParams.q}` : ""}
					</BreadcrumbPage>
				</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb> */}
			<div className="py-12 text-center">
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
			<div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
				<span className="text-muted-foreground text-sm">
					<NumberFlow value={total} /> artworks found
				</span>

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

					{/* <div className="lg:hidden">
								<MobileFilters />
							</div> */}
				</div>
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center text-neutral-600 dark:text-neutral-400">
			<BoxIcon size={48} className="opacity-50" />
			<h2 className="text-2xl font-semibold">No items to display</h2>
			<p className="max-w-xs">
				We couldn’t find any artworks in this collection. Try adjusting your
				filters or search term.
			</p>
			<Button onClick={() => window.location.reload()}>Reload Page</Button>
		</div>
	);
}

function SuspensedArtObjectCard({
	objectID,
	style,
}: { style?: React.CSSProperties; objectID: number }) {
	const { data: object } = useSuspenseQuery({
		queryKey: ["object", objectID],
		staleTime: Number.POSITIVE_INFINITY,
		queryFn: () => router.met.getArtworkById(objectID),
	});
	return <ArtworkCard style={style} object={object} />;
}

export function SearchResultsSkeleton({
	limit = 12,
}: {
	limit?: number;
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array(limit)
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
