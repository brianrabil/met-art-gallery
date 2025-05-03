import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { ChevronDown, FilterIcon } from "lucide-react";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { FilterSidebar } from "./_filter-sidebar";
import { searchParamsParsers } from "./_search-params";
import { SearchResults, SearchResultsSkeleton } from "./_search-results";
import { Searchbar } from "./_searchbar";

export const metadata: Metadata = {
	title: "Search Artworks - Met Art Gallery",
	description:
		"Search and filter through thousands of artworks from the Metropolitan Museum of Art's collection. Discover art by department, medium, time period, and more.",
	// openGraph: {
	// 	title: "Explore the Met Art Gallery Collection",
	// 	description:
	// 		"Dive into the vast collection of the Metropolitan Museum of Art. Search, filter, and discover artworks from different cultures and eras.",
	// 	images: ["https://your-site.com/search-featured.jpg"],
	// },
	robots: "index, follow",
	alternates: {
		canonical: "https://met-art-gallery.vercel.app/search",
	},
};

const loadSearchParams = createLoader(searchParamsParsers);

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const queryParams = await loadSearchParams(searchParams);
	const queryClient = new QueryClient();
	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="space-y-6">
				<section className="bg-background border-b border-border pt-20 pb-8">
					<Container>
						<div className="flex items-center mb-4 gap-2">
							{/* <Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink asChild>
											<Link href="/">Home</Link>
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbLink>
											Search Results{" "}
											{queryParams.q ? ` for ${queryParams.q}` : ""}
										</BreadcrumbLink>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb> */}
						</div>
					</Container>
					<div className="flex justify-center text-center items-end gap-2">
						{/* <FilterPanel /> */}
						{/* <Searchbar /> */}
						<div className="lg:hidden">
							<MobileFilters />
						</div>
					</div>
				</section>
				<Container className="flex gap-6 max-w-screen">
					{/* <div className="hidden lg:block w-72 flex-shrink-0">
						<div className="sticky top-24">
							<Suspense fallback={<FilterSidebarSkeleton />}>
								<FilterSidebar />
							</Suspense>
						</div>
					</div> */}
					<div className="flex-1">
						<Suspense fallback={<SearchResultsSkeleton />}>
							<SearchResults />
						</Suspense>
					</div>
				</Container>
			</div>
		</HydrationBoundary>
	);
}

function MobileFilters() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon">
					<FilterIcon className="size-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-h-screen overflow-y-auto pt-8">
				<Container>
					<FilterSidebar />
				</Container>
			</SheetContent>
		</Sheet>
	);
}

const filters = {
	price: [
		{ value: "0", label: "$0 - $25", checked: false },
		{ value: "25", label: "$25 - $50", checked: false },
		{ value: "50", label: "$50 - $75", checked: false },
		{ value: "75", label: "$75+", checked: false },
	],
	color: [
		{ value: "white", label: "White", checked: false },
		{ value: "beige", label: "Beige", checked: false },
		{ value: "blue", label: "Blue", checked: true },
		{ value: "brown", label: "Brown", checked: false },
		{ value: "green", label: "Green", checked: false },
		{ value: "purple", label: "Purple", checked: false },
	],
	size: [
		{ value: "xs", label: "XS", checked: false },
		{ value: "s", label: "S", checked: true },
		{ value: "m", label: "M", checked: false },
		{ value: "l", label: "L", checked: false },
		{ value: "xl", label: "XL", checked: false },
		{ value: "2xl", label: "2XL", checked: false },
	],
	category: [
		{ value: "all-new-arrivals", label: "All New Arrivals", checked: false },
		{ value: "tees", label: "Tees", checked: false },
		{ value: "objects", label: "Objects", checked: false },
		{ value: "sweatshirts", label: "Sweatshirts", checked: false },
		{ value: "pants-and-shorts", label: "Pants & Shorts", checked: false },
	],
};
const sortOptions = [
	{ name: "Most Popular", href: "#", current: true },
	{ name: "Best Rating", href: "#", current: false },
	{ name: "Newest", href: "#", current: false },
];

export function FilterPanel() {
	return (
		<div className="bg-background w-full max-h-screen overflow-y-hidden">
			{/* Filters */}
			<section
				aria-labelledby="filter-heading"
				className="grid items-center border-b border-border"
			>
				<h2 id="filter-heading" className="sr-only">
					Filters
				</h2>
				<div className="relative w-full col-start-1 row-start-1 py-4">
					<Container className="flex divide-x divide-border text-sm">
						<div className="pl-6">
							<Button variant="ghost" className="text-muted-foreground">
								Clear all
							</Button>
						</div>
					</Container>
				</div>
				{/* <div className="border-t border-border py-10">
					<div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
						{/* <Accordion
							type="multiple"
							className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6"
						>
							<AccordionItem value="price">
								<AccordionTrigger className="block font-medium">
									Price
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
										{filters.price.map((option, optionIdx) => (
											<div
												key={option.value}
												className="flex gap-3 items-center"
											>
												<Checkbox
													id={`price-${optionIdx}`}
													name="price[]"
													value={option.value}
													defaultChecked={option.checked}
												/>
												<label
													htmlFor={`price-${optionIdx}`}
													className="text-base text-muted-foreground sm:text-sm"
												>
													{option.label}
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="color">
								<AccordionTrigger className="block font-medium">
									Color
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
										{filters.color.map((option, optionIdx) => (
											<div
												key={option.value}
												className="flex gap-3 items-center"
											>
												<Checkbox
													id={`color-${optionIdx}`}
													name="color[]"
													value={option.value}
													defaultChecked={option.checked}
												/>
												<label
													htmlFor={`color-${optionIdx}`}
													className="text-base text-muted-foreground sm:text-sm"
												>
													{option.label}
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="size">
								<AccordionTrigger className="block font-medium">
									Size
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
										{filters.size.map((option, optionIdx) => (
											<div
												key={option.value}
												className="flex gap-3 items-center"
											>
												<Checkbox
													id={`size-${optionIdx}`}
													name="size[]"
													value={option.value}
													defaultChecked={option.checked}
												/>
												<label
													htmlFor={`size-${optionIdx}`}
													className="text-base text-muted-foreground sm:text-sm"
												>
													{option.label}
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="category">
								<AccordionTrigger className="block font-medium">
									Category
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
										{filters.category.map((option, optionIdx) => (
											<div
												key={option.value}
												className="flex gap-3 items-center"
											>
												<Checkbox
													id={`category-${optionIdx}`}
													name="category[]"
													value={option.value}
													defaultChecked={option.checked}
												/>
												<label
													htmlFor={`category-${optionIdx}`}
													className="text-base text-muted-foreground sm:text-sm"
												>
													{option.label}
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div> */}
				<div className="col-start-1 row-start-1 py-4">
					<div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="group inline-flex justify-center text-sm font-medium text-foreground hover:text-foreground"
								>
									Sort
									<ChevronDown
										aria-hidden="true"
										className="-mr-1 ml-1 size-5 shrink-0 text-muted-foreground group-hover:text-foreground"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								{sortOptions.map((option) => (
									<DropdownMenuItem key={option.name} asChild>
										<a
											href={option.href}
											className={cn(
												option.current
													? "font-medium text-foreground"
													: "text-muted-foreground",
												"block px-4 py-2 text-sm focus:bg-accent focus:outline-none",
											)}
										>
											{option.name}
										</a>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</section>
		</div>
	);
}
