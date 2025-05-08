import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResultsSkeleton() {
	const limit = 12;
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{new Array(limit).fill(0).map((_, i) => (
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
