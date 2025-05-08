import { Skeleton } from "@/components/ui/skeleton";

export default function ObjectDetailSkeleton() {
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
