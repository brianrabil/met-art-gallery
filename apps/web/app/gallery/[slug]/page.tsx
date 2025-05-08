"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Globe, Tag, User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Page() {
	const { slug } = useParams<{ slug: string }>();

	const { data: artwork } = useSuspenseQuery(
		api.met.getArtworkById.queryOptions({
			input: Number.parseInt(slug),
		}),
	);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="flex flex-col space-y-4">
				<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
					{artwork?.primaryImage ? (
						<Image
							src={artwork.primaryImage || "/placeholder.svg"}
							alt={artwork.title || "Artwork image"}
							fill
							className="object-contain"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					) : (
						<div className="flex h-full items-center justify-center bg-muted">
							<p className="text-muted-foreground">No image available</p>
						</div>
					)}
				</div>

				{artwork?.additionalImages && artwork?.additionalImages.length > 0 && (
					<div className="grid grid-cols-4 gap-2">
						{/* {object.additionalImages.slice(0, 4).map((image, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="relative aspect-square overflow-hidden rounded-md bg-muted"
							>
								<Image
									src={image || "/placeholder.svg"}
									alt={`Additional view ${index + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 25vw, 12vw"
								/>
							</div>
						))} */}
					</div>
				)}
			</div>

			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{artwork?.title || "Untitled"}
					</h1>
					{artwork?.artistDisplayName && (
						<p className="text-xl text-muted-foreground mt-1">
							{artwork?.artistDisplayName}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{artwork?.objectDate && (
						<div className="flex items-center space-x-2">
							<Calendar className="h-5 w-5 text-muted-foreground" />
							<span>{artwork?.objectDate}</span>
						</div>
					)}

					{artwork?.culture && (
						<div className="flex items-center space-x-2">
							<Globe className="h-5 w-5 text-muted-foreground" />
							<span>{artwork?.culture}</span>
						</div>
					)}

					{artwork?.department && (
						<div className="flex items-center space-x-2">
							<Tag className="h-5 w-5 text-muted-foreground" />
							<span>{artwork?.department}</span>
						</div>
					)}

					{artwork?.artistDisplayName && (
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-muted-foreground" />
							<span>{artwork?.artistDisplayName}</span>
						</div>
					)}
				</div>

				{/* {object.objectDescription && (
					<div className="space-y-2">
						<h2 className="text-xl font-semibold">Description</h2>
						<p className="text-muted-foreground">{object.objectDescription}</p>
					</div>
				)} */}

				{artwork?.creditLine && (
					<div className="space-y-2">
						<h2 className="text-xl font-semibold">Credit</h2>
						<p className="text-muted-foreground">{artwork?.creditLine}</p>
					</div>
				)}

				{artwork?.objectURL && (
					<div className="pt-4">
						<Button asChild>
							<a
								href={artwork?.objectURL}
								target="_blank"
								rel="noopener noreferrer"
							>
								View on Met Museum Website
							</a>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
