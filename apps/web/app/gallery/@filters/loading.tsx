import { Container } from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function FilterSidebarSkeleton() {
	return (
		<div className={"w-full h-full bg-background pt-24"}>
			<Container>
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="h-6 w-24" /> {/* Placeholder for "Filters" */}
					<Skeleton className="h-6 w-16" /> {/* Placeholder for "Clear all" */}
				</div>

				{/* Active Filters */}
				<div className="mb-4">
					<div className="flex flex-wrap gap-2 mb-2">
						{/* Placeholder for active filter badges */}
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-6 w-24" />
						<Skeleton className="h-6 w-16" />
					</div>
					<Skeleton className="h-px w-full my-4" /> {/* Separator */}
				</div>

				{/* Accordion Skeleton */}
				<div className="space-y-4">
					{/* Time Period Accordion Item */}
					<div>
						<Skeleton className="h-6 w-32 mb-2" /> {/* Accordion Trigger */}
						<div className="space-y-2">
							{/* Radio Group Placeholders */}
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>

					{/* Department Accordion Item */}
					<div>
						<Skeleton className="h-6 w-32 mb-2" /> {/* Accordion Trigger */}
						<div className="space-y-2">
							{/* Radio Group Placeholders */}
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>

					{/* Medium Accordion Item */}
					<div>
						<Skeleton className="h-6 w-32 mb-2" /> {/* Accordion Trigger */}
						<div className="space-y-2">
							{/* Radio Group Placeholders */}
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
