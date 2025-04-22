import ArtObjectCard from "@/components/art-object-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDetailedDepartment, getObjectsByDepartment } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
	params,
}: { params: { departmentId: string } }) {
	const departmentId = Number.parseInt(params.departmentId);

	if (Number.isNaN(departmentId)) {
		return {
			title: "Department Not Found - Meet the Met",
			description: "The requested department could not be found",
		};
	}

	const department = await getDetailedDepartment(departmentId);

	if (!department) {
		return {
			title: "Department Not Found - Meet the Met",
			description: "The requested department could not be found",
		};
	}

	return {
		title: `${department.displayName} - Meet the Met`,
		description: department.description,
	};
}

export default async function DepartmentPage({
	params,
}: { params: { departmentId: string } }) {
	const departmentId = Number.parseInt(params.departmentId);

	if (Number.isNaN(departmentId)) {
		notFound();
	}

	const department = await getDetailedDepartment(departmentId);

	if (!department) {
		notFound();
	}

	return (
		<main>
			{/* Department Hero */}
			<section className="relative w-full h-[50vh] min-h-[400px] flex items-center">
				<div className="absolute inset-0 z-0">
					<Image
						src={department.image || "/placeholder.svg"}
						alt={department.displayName}
						fill
						className="object-cover"
						priority
						sizes="100vw"
					/>
					<div className="absolute inset-0 bg-black/50" />
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-3xl">
						<h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white mb-4">
							{department.displayName}
						</h1>
						<p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
							{department.description}
						</p>
						<div className="flex flex-wrap gap-2">
							{department.regions.map((region) => (
								<Badge
									key={region}
									variant="outline"
									className="border-white/40 text-white/90"
								>
									{region}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</section>

			<div className="container mx-auto px-4 py-8">
				<Button asChild variant="ghost" className="pl-0 mb-6">
					<Link href="/departments">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Departments
					</Link>
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
					<div className="lg:col-span-2 space-y-6">
						<div>
							<h2 className="text-2xl font-serif font-bold mb-4">
								About the Department
							</h2>
							<div className="prose max-w-none">
								<p>{department.longDescription}</p>
							</div>
						</div>

						{department.highlights.length > 0 && (
							<div>
								<h2 className="text-2xl font-serif font-bold mb-4">
									Department Highlights
								</h2>
								<ul className="list-disc pl-5 space-y-2">
									{department.highlights.map((highlight, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<li key={index}>{highlight}</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<div className="space-y-6">
						<div className="bg-muted/30 p-6 rounded-lg">
							<h3 className="text-lg font-medium mb-4">
								Department Information
							</h3>

							<div className="space-y-4">
								<div>
									<h4 className="text-sm font-medium text-muted-foreground">
										Time Periods
									</h4>
									<div className="flex flex-wrap gap-2 mt-1">
										{department.periods.map((period) => (
											<Badge key={period} variant="secondary">
												{period}
											</Badge>
										))}
									</div>
								</div>

								<div>
									<h4 className="text-sm font-medium text-muted-foreground">
										Collection Size
									</h4>
									<p>{department.collectionSize.toLocaleString()} objects</p>
								</div>

								{department.location && (
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">
											Location in Museum
										</h4>
										<p>{department.location}</p>
									</div>
								)}

								{department.curator && (
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">
											Department Curator
										</h4>
										<p>{department.curator}</p>
									</div>
								)}
							</div>
						</div>

						<Button className="w-full" asChild>
							<Link href={`/?department=${departmentId}`}>
								Browse Department Collection
							</Link>
						</Button>
					</div>
				</div>

				<div className="space-y-6">
					<h2 className="text-2xl font-serif font-bold">Featured Artworks</h2>
					<Suspense fallback={<FeaturedArtworksSkeleton />}>
						<FeaturedArtworks departmentId={departmentId} />
					</Suspense>
				</div>
			</div>
		</main>
	);
}

async function FeaturedArtworks({ departmentId }: { departmentId: number }) {
	const result = await getObjectsByDepartment(departmentId);
	const featuredIds = result.objectIDs.slice(0, 6);

	if (featuredIds.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">
					No featured artworks available for this department
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{featuredIds.map((objectId) => (
				<ArtObjectCard key={objectId} objectId={objectId} />
			))}
		</div>
	);
}

function FeaturedArtworksSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array(6)
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
