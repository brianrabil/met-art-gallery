import DepartmentFilters from "@/components/department-filters";
import DepartmentsGrid from "@/components/departments-grid";
import DepartmentsHero from "@/components/departments-hero";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const metadata = {
	title: "Departments - Meet the Met",
	description:
		"Explore the various departments of the Metropolitan Museum of Art",
};

export default function DepartmentsPage() {
	return (
		<main>
			<DepartmentsHero />

			<div className="container mx-auto px-4 py-12">
				<div className="space-y-8">
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-serif font-bold tracking-tight">
							Museum Departments
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Explore the Metropolitan Museum of Art's diverse collection
							departments, each specializing in different periods, regions, and
							art forms.
						</p>
					</div>

					<Suspense
						fallback={
							<Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-lg" />
						}
					>
						<DepartmentFilters />
					</Suspense>

					<Suspense fallback={<DepartmentsGridSkeleton />}>
						<DepartmentsGrid />
					</Suspense>
				</div>
			</div>
		</main>
	);
}

function DepartmentsGridSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array(9)
				.fill(0)
				.map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="aspect-[4/3] bg-muted animate-pulse rounded-xl"
					/>
				))}
		</div>
	);
}
