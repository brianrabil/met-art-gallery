"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/api/client";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { searchParamsParsers } from "./_search-params";

const TIME_PERIODS = [
	{ label: "Ancient (before 500 CE)", startDate: 0, endDate: 500 },
	{ label: "Medieval (500-1400)", startDate: 500, endDate: 1400 },
	{ label: "Renaissance (1400-1600)", startDate: 1400, endDate: 1600 },
	{ label: "Baroque (1600-1750)", startDate: 1600, endDate: 1750 },
	{ label: "Modern (1750-1900)", startDate: 1750, endDate: 1900 },
	{
		label: "Contemporary (1900-present)",
		startDate: 1900,
		endDate: new Date().getFullYear(),
	},
];

// TODO: We can build this dynamically
const MEDIUMS = [
	"Oil on canvas",
	"Watercolor",
	"Marble",
	"Bronze",
	"Wood",
	"Ceramic",
	"Textile",
	"Photography",
	"Mixed media",
	"Works on paper",
];

export function FilterSidebar({ isSheet = false }) {
	const [searchParams, setSearchParams] = useQueryStates(searchParamsParsers);

	const { data: departments } = useSuspenseQuery(
		orpc.met.getDepartments.queryOptions(),
	);

	const form = useForm({
		defaultValues: {
			department: "",
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value);
		},
	});

	const clearAllFilters = () => {
		setSearchParams({
			artistOrCulture: null,
			departmentId: null,
			dateBegin: null,
			dateEnd: null,
			medium: null,
			geoLocation: null,
		});
	};

	function getPeriodValue(dateBegin: number | null, dateEnd: number | null) {
		return (
			TIME_PERIODS.find(
				(d) => d.startDate === dateBegin && d.endDate === dateEnd,
			)?.label ?? "all"
		);
	}

	function getDepartmentValue(departmentId: number | null) {
		if (departmentId) {
			return `${departmentId}`;
		}
		return "all";
	}

	function getMediumValue(medium: string | null) {
		if (medium) {
			return medium;
		}
		return "all";
	}

	function getTotalActiveFilters() {
		let count = 0;
		const filters = [
			getPeriodValue(searchParams.dateBegin, searchParams.dateEnd),
			getDepartmentValue(searchParams.departmentId),
			getMediumValue(searchParams.medium),
		];

		for (const filter of filters) {
			if (filter.toLocaleLowerCase().trim() !== "all") {
				count++;
			}
		}

		return count;
	}

	return (
		<div className={`${isSheet ? "" : "w-full"}`}>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold font-serif">Filters</h2>
				{getTotalActiveFilters() > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="text-sm text-muted-foreground"
					>
						Clear all
					</Button>
				)}
			</div>

			<div className="mb-4">
				<div className="flex flex-wrap gap-2 mb-2">
					{!!searchParams.dateBegin && !!searchParams.dateEnd && (
						<Badge variant="secondary" className="flex items-center gap-1">
							{
								TIME_PERIODS.find(
									(d) =>
										d.startDate === searchParams.dateBegin &&
										d.endDate === searchParams.dateEnd,
								)?.label
							}
							<Button
								variant="ghost"
								className="size-4 cursor-pointer"
								onClick={() => {
									setSearchParams({
										dateEnd: null,
										dateBegin: null,
									});
								}}
								size="icon"
							>
								<XIcon className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{!!searchParams.departmentId && (
						<Badge variant="secondary" className="flex items-center gap-1">
							{
								departments?.departments.find((d) => {
									return d?.departmentId === searchParams.departmentId;
								})?.displayName
							}
							<Button
								variant="ghost"
								className="size-4 cursor-pointer"
								onClick={() => {
									setSearchParams({
										departmentId: null,
									});
								}}
								size="icon"
							>
								<XIcon className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{!!searchParams.medium && (
						<Badge variant="secondary" className="flex items-center gap-1">
							{searchParams.medium}
							<Button
								variant="ghost"
								className="size-4 cursor-pointer"
								onClick={() => {
									setSearchParams({
										medium: null,
									});
								}}
								size="icon"
							>
								<XIcon className="h-3 w-3" />
							</Button>
						</Badge>
					)}
				</div>
				<Separator className="my-4" />
			</div>

			<Accordion
				type="multiple"
				defaultValue={["time-period", "department", "medium"]}
			>
				<AccordionItem value="time-period">
					<AccordionTrigger>Time Period</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-2">
							<RadioGroup
								id="period"
								name="period"
								value={getPeriodValue(
									searchParams.dateBegin,
									searchParams.dateEnd,
								)}
								onValueChange={(value) => {
									if (value === "all") {
										setSearchParams({
											dateBegin: null,
											dateEnd: null,
										});
									} else {
										const period = TIME_PERIODS.find((p) => p.label === value);
										setSearchParams({
											dateBegin: period?.startDate,
											dateEnd: period?.endDate,
										});
									}
								}}
							>
								<Label
									htmlFor="period-all"
									className="text-sm font-normal cursor-pointer flex items-center space-x-2"
								>
									<RadioGroupItem id="period-all" value="all" />
									All
								</Label>
								{TIME_PERIODS.map((period) => (
									<Label
										htmlFor={`period-${period.label}`}
										key={period?.label}
										className="text-sm font-normal cursor-pointer flex items-center space-x-2"
									>
										<RadioGroupItem
											id={`period-${period.label}`}
											value={`${period?.label}`}
										/>
										{period?.label}
									</Label>
								))}
							</RadioGroup>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="department">
					<AccordionTrigger>Department</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-2">
							<RadioGroup
								id="department"
								name="departmentId"
								value={getDepartmentValue(searchParams.departmentId)}
								onValueChange={(value) => {
									if (value === "all") {
										setSearchParams({
											departmentId: null,
										});
									} else {
										setSearchParams({
											departmentId: Number.parseInt(value),
										});
									}
								}}
							>
								<Label
									htmlFor="department-all"
									key="all"
									className="text-sm font-normal cursor-pointer flex items-center space-x-2"
								>
									<RadioGroupItem id="department-all" value="all" />
									All
								</Label>
								{departments?.departments.map((department) => (
									<Label
										htmlFor={`department-${department?.departmentId}`}
										key={department?.departmentId}
										className="text-sm font-normal cursor-pointer flex items-center space-x-2"
									>
										<RadioGroupItem
											id={`department-${department?.departmentId}`}
											value={`${department?.departmentId}`}
										/>
										{department?.displayName}
									</Label>
								))}
							</RadioGroup>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="medium">
					<AccordionTrigger>Medium</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-2">
							<RadioGroup
								id="period"
								name="period"
								value={getMediumValue(searchParams.medium)}
								onValueChange={(value) => {
									if (value === "all") {
										setSearchParams({
											medium: null,
										});
									} else {
										setSearchParams({
											medium: value,
										});
									}
								}}
							>
								<Label
									htmlFor="medium-all"
									className="text-sm font-normal cursor-pointer flex items-center space-x-2"
								>
									<RadioGroupItem id="medium-all" value="all" />
									All
								</Label>
								{MEDIUMS.map((medium) => (
									<Label
										htmlFor={`medium-${medium}`}
										key={medium}
										className="text-sm font-normal cursor-pointer flex items-center space-x-2"
									>
										<RadioGroupItem
											id={`department-${medium}`}
											value={`${medium}`}
										/>
										{medium}
									</Label>
								))}
							</RadioGroup>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export function FilterSidebarSkeleton({ isSheet = false }) {
	return (
		<div className={`${isSheet ? "" : "w-full lg:w-72 shrink-0"}`}>
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
		</div>
	);
}
