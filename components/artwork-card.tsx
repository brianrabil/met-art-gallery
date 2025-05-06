"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { router } from "@/lib/api/root";
import type { InferRouterOutputs } from "@orpc/server";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function ArtworkCard({
	object,
	style,
}: {
	style?: React.CSSProperties;
	object: Partial<InferRouterOutputs<typeof router.met.getArtworkById>>;
}) {
	return (
		<Link passHref href={`/object/${object?.objectID}`}>
			<Card
				style={style}
				className="bg-transparent border-none group relative h-[500] w-full p-4 overflow-hidden rounded-none shadow-none"
			>
				<div className="relative  w-full h-full overflow-hidden p-0 duration-700">
					{object?.primaryImageSmall ? (
						<img
							src={object.primaryImageSmall}
							alt={object.title || "Untitled"}
							// fill
							className="object-cover absolute inset-0"
							// sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							// priority
						/>
					) : (
						<div className="p-6 flex h-full w-full items-center justify-center">
							<p className="text-sm text-muted-foreground">
								No image available
							</p>
						</div>
					)}
				</div>
				<CardHeader className="px-0">
					{/* Top tagline */}
					{/* {object?.isHighlight && (
						<div className="text-xs tracking-wide">Featured Artwork</div>
					)} */}
					<CardTitle className="tracking-tight leading-snug line-clamp-2">
						{object?.title || "Untitled"}
					</CardTitle>

					<CardDescription>
						{object?.artistDisplayName || "Unknown Artist"}
					</CardDescription>

					{/* <p className="text-sm font-light line-clamp-2">{object?.medium}</p> */}
					{/* Bottom tags */}
					{/* <div className="flex flex-wrap gap-2">
						{object?.department && (
							<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">
								{object.department}
							</span>
						)}
						{object?.objectDate && (
							<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">
								<CalendarIcon className="mr-1 h-3 w-3 inline-block text-muted-foreground" />
								{object.objectDate}
							</span>
						)}
					</div> */}
				</CardHeader>
			</Card>
		</Link>
	);
}

export function ArtObjectCardSkeleton() {
	return (
		<div className="overflow-hidden w-full h-[520px]  bg-neutral-100 shadow-md dark:bg-neutral-900">
			<div className="relative w-full h-full">
				<Skeleton className="absolute inset-0 h-full w-full" />
			</div>
			<div className="p-6 space-y-3">
				<Skeleton className="h-8 w-4/5" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
				<div className="flex justify-between items-center pt-2">
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-8 w-24 rounded-md" />
				</div>
			</div>
		</div>
	);
}
