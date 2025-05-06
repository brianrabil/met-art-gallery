import { BackButton } from "@/components/back-button";
import { Container } from "@/components/container";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/api/client.server";
import { ArrowLeft, Calendar, Globe, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ObjectPage({
	params,
}: {
	params: Promise<{ objectId: string }>;
}) {
	const pageParams = await params;
	const objectId = Number.parseInt(pageParams.objectId);

	if (Number.isNaN(objectId)) {
		notFound();
	}

	return (
		<Container className="container mx-auto px-4 py-8">
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
			<div className="mb-6">
				<BackButton />
			</div>

			<Suspense fallback={<ObjectDetailSkeleton />}>
				<ObjectDetail objectID={objectId} />
			</Suspense>
		</Container>
	);
}

async function ObjectDetail({ objectID }: { objectID: number }) {
	const object = await client.met.getArtworkById(objectID);

	if (!object) {
		notFound();
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="flex flex-col space-y-4">
				<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
					{object.primaryImage ? (
						<Image
							src={object.primaryImage || "/placeholder.svg"}
							alt={object.title || "Artwork image"}
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

				{object.additionalImages && object.additionalImages.length > 0 && (
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
						{object.title || "Untitled"}
					</h1>
					{object.artistDisplayName && (
						<p className="text-xl text-muted-foreground mt-1">
							{object.artistDisplayName}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{object.objectDate && (
						<div className="flex items-center space-x-2">
							<Calendar className="h-5 w-5 text-muted-foreground" />
							<span>{object.objectDate}</span>
						</div>
					)}

					{object.culture && (
						<div className="flex items-center space-x-2">
							<Globe className="h-5 w-5 text-muted-foreground" />
							<span>{object.culture}</span>
						</div>
					)}

					{object.department && (
						<div className="flex items-center space-x-2">
							<Tag className="h-5 w-5 text-muted-foreground" />
							<span>{object.department}</span>
						</div>
					)}

					{object.artistDisplayName && (
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-muted-foreground" />
							<span>{object.artistDisplayName}</span>
						</div>
					)}
				</div>

				{/* {object.objectDescription && (
					<div className="space-y-2">
						<h2 className="text-xl font-semibold">Description</h2>
						<p className="text-muted-foreground">{object.objectDescription}</p>
					</div>
				)} */}

				{object.creditLine && (
					<div className="space-y-2">
						<h2 className="text-xl font-semibold">Credit</h2>
						<p className="text-muted-foreground">{object.creditLine}</p>
					</div>
				)}

				{object.objectURL && (
					<div className="pt-4">
						<Button asChild>
							<a
								href={object.objectURL}
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

function ObjectDetailSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="space-y-4">
				<Skeleton className="aspect-square w-full rounded-lg" />
				<div className="grid grid-cols-4 gap-2">
					{Array(4)
						.fill(0)
						.map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<Skeleton key={i} className="aspect-square rounded-md" />
						))}
				</div>
			</div>

			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-10 w-3/4" />
					<Skeleton className="h-6 w-1/2" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{Array(4)
						.fill(0)
						.map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<Skeleton key={i} className="h-6 w-full" />
						))}
				</div>

				<div className="space-y-2">
					<Skeleton className="h-8 w-1/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>

				<div className="space-y-2">
					<Skeleton className="h-8 w-1/4" />
					<Skeleton className="h-4 w-full" />
				</div>

				<Skeleton className="h-10 w-1/3" />
			</div>
		</div>
	);
}
