"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { type ObjectResponse, getObject, search } from "@/lib/api-legacy";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface HeaderSearchProps {
	isTransparent?: boolean;
}

export default function HeaderSearch({
	isTransparent = false,
}: HeaderSearchProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [searchType, setSearchType] = useState<"title" | "id">("title");
	const [results, setResults] = useState<ObjectResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const debouncedQuery = useDebounce(query, 300);
	const searchRef = useRef<HTMLDivElement>(null);

	// useOnClickOutside(searchRef, () => {
	//   setIsOpen(false)
	// })

	useEffect(() => {
		if (!debouncedQuery.trim()) {
			setResults([]);
			return;
		}

		const fetchResults = async () => {
			setLoading(true);
			try {
				if (searchType === "id") {
					const objectId = Number.parseInt(debouncedQuery);
					if (!Number.isNaN(objectId)) {
						const object = await getObject(objectId);
						setResults(object ? [object] : []);
					} else {
						setResults([]);
					}
				} else {
					const result = await search({
						q: debouncedQuery,
					});

					const objects = await Promise.all(
						result.objectIDs.slice(0, 5).map(async (id) => {
							const object = await getObject(id);
							return object;
						}),
					);

					setResults(objects.filter(Boolean) as ObjectResponse[]);
				}
			} catch (error) {
				console.error("Error fetching search results:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [debouncedQuery, searchType]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		router.push(
			`/search?q=${encodeURIComponent(query)}&isId=${searchType === "id"}`,
		);
		setIsOpen(false);
		setQuery("");
	};

	const handleResultClick = () => {
		setIsOpen(false);
		setQuery("");
	};

	return (
		<div ref={searchRef} className="relative">
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"md:hidden",
						isTransparent
							? "text-white hover:text-white/80 hover:bg-white/10"
							: "",
					)}
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Toggle search"
				>
					<Search className="h-5 w-5" />
				</Button>

				<div
					className={cn(
						"absolute top-full right-0 mt-2 w-screen max-w-sm overflow-hidden transition-all duration-200 origin-top-right z-50 md:relative md:top-0 md:right-0 md:mt-0 md:w-auto md:min-w-[300px] md:border-0 md:shadow-none md:overflow-visible",
						isOpen
							? "scale-100 opacity-100"
							: "scale-95 opacity-0 pointer-events-none md:scale-100 md:opacity-100 md:pointer-events-auto",
					)}
				>
					<form
						onSubmit={handleSearch}
						className="flex items-center p-2 md:p-0"
					>
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search by title or ID..."
								className={cn(
									"pl-9 pr-4 py-2 w-full",
									isTransparent && !isOpen
										? "bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white focus:text-foreground focus:placeholder:text-muted-foreground"
										: "",
								)}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onFocus={() => setIsOpen(true)}
							/>
							{query && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-1 top-1 h-7 w-7"
									onClick={() => setQuery("")}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
						<Button
							type="submit"
							variant="outline"
							size="sm"
							className={cn("ml-2")}
						>
							Search
						</Button>
					</form>

					{isOpen && query.trim() && (
						<div className="max-h-[70vh] overflow-y-auto border-t">
							{loading ? (
								<div className="flex items-center justify-center p-4">
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
									<span className="ml-2 text-sm text-muted-foreground">
										Searching...
									</span>
								</div>
							) : results.length > 0 ? (
								<div className="p-2">
									<h3 className="text-sm font-medium px-2 py-1">Results</h3>
									<ul>
										{results.map((result) => (
											<li key={result.objectID}>
												<Link
													href={`/object/${result.objectID}`}
													className="flex items-center p-2 hover:bg-muted rounded-md"
													onClick={handleResultClick}
												>
													<div className="relative h-12 w-12 bg-muted rounded overflow-hidden mr-3 flex-shrink-0">
														{result.primaryImageSmall ? (
															<Image
																src={
																	result.primaryImageSmall || "/placeholder.svg"
																}
																alt={result.title || "Artwork"}
																fill
																className="object-cover"
																sizes="48px"
															/>
														) : (
															<div className="flex h-full items-center justify-center">
																<span className="text-xs text-muted-foreground">
																	No img
																</span>
															</div>
														)}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium truncate">
															{result.title || "Untitled"}
														</p>
														<p className="text-xs text-muted-foreground truncate">
															{result.artistDisplayName ||
																result.department ||
																`ID: ${result.objectID}`}
														</p>
													</div>
												</Link>
											</li>
										))}
										<li className="px-2 py-1 mt-1 border-t">
											<Button
												variant="link"
												className="w-full justify-center text-sm p-1 h-auto"
												onClick={() => {
													router.push(
														`/search?q=${encodeURIComponent(query)}&isId=${searchType === "id"}`,
													);
													handleResultClick();
												}}
											>
												View all results
											</Button>
										</li>
									</ul>
								</div>
							) : query.trim() ? (
								<div className="p-4 text-center">
									<p className="text-sm text-muted-foreground">
										No results found
									</p>
								</div>
							) : null}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
