import ArtObjectCard from "@/components/art-object-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { searchObjects } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function SearchPage({
	searchParams,
}: {
	searchParams: { q: string; isId?: string };
}) {
	const query = searchParams.q;
	const isId = searchParams.isId === "true";

	if (!query) {
		notFound();
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="space-y-6">
				<div>
					<Button asChild variant="ghost" className="pl-0 mb-4">
						<Link href="/">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to collection
						</Link>
					</Button>

					<h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
					<p className="text-muted-foreground">
						{isId
							? `Results for object ID: ${query}`
							: `Results for: "${query}"`}
					</p>
				</div>

				<Suspense fallback={<SearchResultsSkeleton />}>
					<SearchResults query={query} isId={isId} />
				</Suspense>
			</div>
		</main>
	);
}

async function SearchResults({
	query,
	isId,
}: { query: string; isId: boolean }) {
	const results = await searchObjects(query, isId);

	if (!results || results.length === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold">No results found</h2>
				<p className="text-muted-foreground mt-2">
					Try a different search term or browse the collection
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{results.map((objectId) => (
				<ArtObjectCard key={objectId} objectId={objectId} />
			))}
		</div>
	);
}

function SearchResultsSkeleton() {
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
