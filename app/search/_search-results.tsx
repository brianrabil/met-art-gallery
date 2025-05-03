"use client";

import { ArtObjectCardSkeleton, ArtworkCard } from "@/components/artwork-card";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/api/client";
import { getObjectById } from "@/lib/api/router";
import { cn } from "@/lib/utils";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BoxIcon, ChevronDownIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import type React from "react";
import { Suspense, useEffect, useRef } from "react";
import { PAGE_SIZE } from "./_config";
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
		orpc.search.infiniteOptions({
			input: (pageParam) => ({
				pagination: {
					limit: PAGE_SIZE,
					offset: pageParam * PAGE_SIZE,
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

	// The scrollable element for your list
	const parentRef = useRef<HTMLDivElement>(null);

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 320,
		overscan: 2,
		lanes: 5,
	});

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
			<div className="bg-background w-full">
				<Container className="py-6 text-center">
					<div className="max-w-3xl flex flex-col justify-center align-center gap-4 mx-auto">
						<h2 className="text-3xl md:text-4xl font-serif">
							Browse the Collection
						</h2>
						<p className="text-muted-foreground">
							Discover thousands of artworks spanning over 5,000 years of world
							culture
						</p>
						{/* <Searchbar className="mx-auto" /> */}
					</div>
				</Container>

				{/* Filters */}
				<section
					aria-labelledby="filter-heading"
					className="grid items-center border-b border-border"
				>
					<h2 id="filter-heading" className="sr-only">
						Filters
					</h2>
					<div className="relative w-full col-start-1 row-start-1 py-4">
						<Container className="flex divide-x divide-border text-sm">
							<div className="pl-6">
								<Button variant="ghost" className="text-muted-foreground">
									Clear all
								</Button>
							</div>
						</Container>
					</div>

					<div className="col-start-1 row-start-1 py-4">
						<div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="group inline-flex justify-center text-sm font-medium text-foreground hover:text-foreground"
									>
										Sort
										<ChevronDownIcon
											aria-hidden="true"
											className="-mr-1 ml-1 size-5 shrink-0 text-muted-foreground group-hover:text-foreground"
										/>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-40">
									{sortOptions.map((option) => (
										<DropdownMenuItem key={option.name} asChild>
											<a
												href={option.href}
												className={cn(
													option.current
														? "font-medium text-foreground"
														: "text-muted-foreground",
													"block px-4 py-2 text-sm focus:bg-accent focus:outline-none",
												)}
											>
												{option.name}
											</a>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</section>
			</div>

			{isPending ? (
				<p>Loading...</p>
			) : status === "error" ? (
				<span>Error: {error?.message}</span>
			) : (
				<div>
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
		queryFn: () => getObjectById(objectID),
	});
	return <ArtworkCard style={style} object={object} />;
}

export function SearchResultsSkeleton() {
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

function MasonryVerticalVirtualizerVariable({ rows }: { rows: Array<number> }) {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: (i) => rows[i],
		overscan: 8,
		lanes: 4,
	});

	return (
		<>
			<div ref={parentRef} className="List flex flex-col min-h-[200px]">
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => (
						<div
							key={virtualRow.index}
							className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
							style={{
								position: "absolute",
								top: 0,
								left: `${virtualRow.lane * 25}%`,
								width: "25%",
								height: `${rows[virtualRow.index]}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							Row {virtualRow.index}
						</div>
					))}
				</div>
			</div>
		</>
	);
}
