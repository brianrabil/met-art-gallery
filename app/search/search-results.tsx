"use client";
import {
	ArtObjectCard,
	ArtObjectCardSkeleton,
} from "@/components/art-object-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { serialize, useSearchParams } from "@/hooks/use-search-params";
import { client, orpc } from "@/lib/api/client";
import { context } from "@/lib/api/context";
import { getObjectById } from "@/lib/api/router";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BoxIcon } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import { PAGE_SIZE } from "./_config";

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
			<div
				ref={parentRef}
				className="List"
				style={{
					height: "200px",
					width: "400px",
					overflow: "auto",
				}}
			>
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
export function SearchResults() {
	const [{ limit, offset, ...searchParams }] = useSearchParams();

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
		orpc.search.infiniteOptions({
			input: (pageParam) => ({
				artistOrCulture: searchParams.artistOrCulture ?? undefined,
				dateBegin: searchParams.dateBegin ?? undefined,
				dateEnd: searchParams.dateEnd ?? undefined,
				direction: searchParams.direction ?? undefined,
				field: searchParams.field ?? undefined,
				geoLocation: searchParams.geoLocation ?? undefined,
				departmentId: searchParams.departmentId ?? undefined,
				hasImages: searchParams.hasImages ?? undefined,
				isHighlight: searchParams.isHighlight ?? undefined,
				isOnView: searchParams.isOnView ?? undefined,
				limit: PAGE_SIZE,
				medium: searchParams.medium ?? undefined,
				offset: pageParam * PAGE_SIZE,
				q: searchParams.q ?? undefined,
				tags: searchParams.tags ?? undefined,
				title: searchParams.title ?? undefined,
			}),
			context,
			initialPageParam: offset ?? 0,
			getNextPageParam: (lastPage) => lastPage.nextPage,
		}),
	);

	const allRows = data ? data.pages.flatMap(({ objectIDs }) => objectIDs) : [];

	// The scrollable element for your list
	const parentRef = useRef<HTMLDivElement>(null);

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 520,
		overscan: 2,
		lanes: 3,
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
		<div>
			{isPending ? (
				<p>Loading...</p>
			) : status === "error" ? (
				<span>Error: {error?.message}</span>
			) : (
				<div
					ref={parentRef}
					className="w-full overflow-y-scroll"
					style={{
						height: "90vh",
						overflow: "auto",
					}}
				>
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							console.log(allRows);
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
										className="flex justify-center"
									>
										{hasNextPage ? "Loading more..." : "No more items to load"}
									</div>
								);
							}

							return (
								<div
									key={virtualRow.key}
									className="p-4"
									style={{
										position: "absolute",
										top: 0,
										left: `${virtualRow.lane * 33}%`,
										width: "33%",
										height: `${allRows[virtualRow.index]}px`,
										transform: `translateY(${virtualRow.start}px)`,
									}}
								>
									{isLoaderRow ? (
										hasNextPage ? (
											"Loading more..."
										) : (
											"Nothing more to load"
										)
									) : (
										<Suspense
											key={`${index}-${allRows[virtualRow.index]}`}
											fallback={<ArtObjectCardSkeleton />}
										>
											<SuspensedArtObjectCard
												key={`${index}-${allRows[virtualRow.index]}`}
												style={
													{
														// position: "absolute",
														// top: 0,
														// left: `${virtualRow.lane * 25}%`,
														// width: "25vw",
														// height: `${allRows[virtualRow.index]}px`,
														// transform: `translateY(${virtualRow.start}px)`,
													}
												}
												objectID={allRows[virtualRow.index]}
											/>
										</Suspense>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
			<div>
				{isFetching && !isFetchingNextPage ? "Background Updating..." : null}
			</div>
			{/* <div
				ref={parentRef}
				className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-scroll"
			>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{data?.pages.map(({ objectIDs, page }) => (
						<>
							<div
								key={page}
								className="flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-3"
							>
								<div className="flex items-center w-full my-8">
									<Separator className="flex-1" />
									<span className="mx-4 text-xs text-muted-foreground uppercase tracking-widest">
										Page {page + 1}
									</span>
									<Separator className="flex-1" />
								</div>
							</div>
							{objectIDs.map((objectID) => (
								<Suspense key={objectID} fallback={<ArtObjectCardSkeleton />}>
									<SuspensedArtObjectCard key={objectID} objectID={objectID} />
								</Suspense>
							))}
						</>
					))}
					<Button onClick={() => fetchNextPage()}>Load More</Button>
				</div>
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
		queryFn: () =>
			getObjectById({
				objectID,
			}),
	});
	return <ArtObjectCard style={style} object={object} />;
}
