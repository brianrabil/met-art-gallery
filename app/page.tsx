import ArtCollectionGrid from "@/components/art-collection-grid";
import DepartmentFilter from "@/components/department-filters";
import HeroSection from "@/components/hero-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
	return (
		<main>
			<HeroSection />

			<div className="container mx-auto px-4 py-12">
				<div className="space-y-8">
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-serif font-bold tracking-tight">
							Explore the Collection
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Browse through thousands of artworks from the Metropolitan Museum
							of Art's vast collection.
						</p>
					</div>

					<Tabs defaultValue="browse" className="w-full">
						<TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
							<TabsTrigger value="browse">Browse Collection</TabsTrigger>
							<TabsTrigger value="departments">By Department</TabsTrigger>
						</TabsList>

						<TabsContent value="browse" className="space-y-6">
							<Suspense fallback={<ArtCollectionSkeleton />}>
								<ArtCollectionGrid />
							</Suspense>
						</TabsContent>

						<TabsContent value="departments" className="space-y-6">
							<Suspense fallback={<DepartmentFilterSkeleton />}>
								<DepartmentFilter />
							</Suspense>

							<Suspense fallback={<ArtCollectionSkeleton />}>
								<ArtCollectionGrid />
							</Suspense>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</main>
	);
}

function DepartmentFilterSkeleton() {
	return (
		<div className="w-full">
			<Skeleton className="h-10 w-full max-w-xs mx-auto" />
		</div>
	);
}

function ArtCollectionSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{Array(9)
				.fill(0)
				.map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="aspect-square bg-muted animate-pulse rounded-xl"
					/>
				))}
		</div>
	);
}
