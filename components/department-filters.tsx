"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { getAllRegions, getAllPeriods } from "@/lib/api"

export default function DepartmentFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [query, setQuery] = useState(searchParams.get("filter") || "");
	const [region, setRegion] = useState(searchParams.get("region") || "");
	const [period, setPeriod] = useState(searchParams.get("period") || "");
	const [regions, setRegions] = useState<string[]>([]);
	const [periods, setPeriods] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchFilterOptions() {
			try {
				// const [allRegions, allPeriods] = await Promise.all([getAllRegions(), getAllPeriods()])
				// setRegions(allRegions)
				// setPeriods(allPeriods)
			} catch (error) {
				// console.error("Error fetching filter options:", error);
			} finally {
				// setLoading(false);
			}
		}

		fetchFilterOptions();
	}, []);

	const updateFilters = () => {
		const params = new URLSearchParams();

		if (query) params.set("filter", query);
		if (region) params.set("region", region);
		if (period) params.set("period", period);

		router.push(`/departments?${params.toString()}`);
	};

	const clearFilters = () => {
		setQuery("");
		setRegion("");
		setPeriod("");
		router.push("/departments");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateFilters();
	};

	return (
		<div className="bg-muted/30 rounded-lg p-4 max-w-4xl mx-auto">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search departments..."
							className="pl-9"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>

					<Select value={region} onValueChange={setRegion}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by region" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Regions</SelectItem>
							{regions.map((r) => (
								<SelectItem key={r} value={r}>
									{r}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={period} onValueChange={setPeriod}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by period" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Periods</SelectItem>
							{periods.map((p) => (
								<SelectItem key={p} value={p}>
									{p}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex justify-between">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						disabled={!query && !region && !period}
					>
						<X className="mr-2 h-4 w-4" />
						Clear filters
					</Button>

					<Button type="submit">Apply Filters</Button>
				</div>
			</form>
		</div>
	);
}
