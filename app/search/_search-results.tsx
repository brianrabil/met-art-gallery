"use client";

import { ArtObjectCardSkeleton, ArtworkCard } from "@/components/artwork-card";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Store, useStore } from "@tanstack/react-store";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BoxIcon, FilterIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import type React from "react";
import { Suspense, useEffect, useRef } from "react";
import { searchParamsParsers } from "./_search-params";

const sortOptions = [
	{ name: "Most Popular", href: "#", current: true },
	{ name: "Best Rating", href: "#", current: false },
	{ name: "Newest", href: "#", current: false },
];

export const store = new Store({
	total: 0,
	loaded: 0,
});

export function SearchResults() {
	const [{ limit, offset, ...searchParams }] =
		useQueryStates(searchParamsParsers);

	const parentRef = useRef<HTMLDivElement>(null);
	const scrollingRef = useRef<number>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
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


	useEffect(() => {
		store.setState((state) => ({
			...state,
			total: data.pages[0]?.total,
			loaded: allRows.length,
		}));
	}, [allRows.length, data.pages[0]?.total]);

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 520,
		overscan: 8,
		lanes: 3,
	});

	// const scrollToFn: VirtualizerOptions<any, any>["scrollToFn"] = useCallback(
	// 	(offset, canSmooth, instance) => {
	// 		const duration = 1000;
	// 		const start = parentRef.current?.scrollTop || 0;
	// 		const startTime = (scrollingRef.current = Date.now());

	// 		const run = () => {
	// 			if (scrollingRef.current !== startTime) return;
	// 			const now = Date.now();
	// 			const elapsed = now - startTime;
	// 			const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
	// 			const interpolated = start + (offset - start) * progress;

	// 			if (elapsed < duration) {
	// 				elementScroll(interpolated, canSmooth, instance);
	// 				requestAnimationFrame(run);
	// 			} else {
	// 				elementScroll(interpolated, canSmooth, instance);
	// 			}
	// 		};

	// 		requestAnimationFrame(run);
	// 	},
	// 	[],
	// );

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
				<p className="flex items-center gap-2">
					<Spinner />
					Loading...
				</p>
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
										{hasNextPage ? (
											<div className="flex items-center gap-2">
												<Spinner />
												Loading...
											</div>
										) : (
											"No more items to load"
										)}
									</div>
								);
							}

							const LANES = rowVirtualizer.options.lanes ?? 3;
							const laneWidth = `${100 / LANES}%`;
							const left = `calc(${virtualRow.lane * (100 / LANES)}%)`;
							return (
								<div
									key={virtualRow.key}
									style={{
										position: "absolute",
										top: 0,
										left,
										width: laneWidth,
										height: `${virtualRow.size}px`,
										transform: `translateY(${virtualRow.start}px)`,
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
		</div>
	);
}

export function SearchResultsHeader({
	total,
}: {
	total: number;
}) {
	return (
		<div className="mb-6 pb-2">
			<div className="py-12 text-center">
				<h1 className="mb-4 text-4xl font-bold">Art Collection Search</h1>
				<p className="mx-auto max-w-3xl px-4 text-muted-foreground">
					Browse through thousands of artworks from the Metropolitan Museum of
					Art's vast collection spanning over 5,000 years of world cultures.
				</p>
			</div>
			<div className="pb-6 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
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
			<Separator />
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
	const { data: object } = useSuspenseQuery(
		orpc.met.getArtworkById.queryOptions({
			input: objectID,
		}),
	);
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

export function SidebarTrigger({
	className,
	onClick,
	...props
}: React.ComponentProps<typeof Button>) {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			data-sidebar="trigger"
			data-slot="sidebar-trigger"
			variant="ghost"
			size="icon"
			className={cn("size-7", className)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			<FilterIcon />
			<span className="sr-only">Toggle Filters</span>
		</Button>
	);
}

export function ResultsCount() {
	const total = useStore(store, (state) => state.total);
	const loaded = useStore(store, (state) => state.loaded);
	return (
		<div>
			<span>
				<NumberFlow value={total} /> artworks found
			</span>
			<span className="ml-2 text-muted-foreground">
				Fetched <NumberFlow value={loaded} />
			</span>
		</div>
	);
}
