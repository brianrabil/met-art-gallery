import { searchParamsParsers } from "@/app/gallery/_search-params";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useDebouncer } from "@tanstack/react-pacer";
import { MicIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSerializer, useQueryStates } from "nuqs";
import React from "react";
import { useState } from "react";
import { InputFocusBlur } from "./input-focus-blur";

const serialize = createSerializer(searchParamsParsers);

export function SearchInput({
	isTransparent,
	className,
}: { isTransparent?: boolean; className?: string }) {
	const router = useRouter();
	const [searchParams, setSearchParams] = useQueryStates(searchParamsParsers);

	const setSearchDebouncer = useDebouncer(
		async (q) => {
			await setSearchParams({ q });
			const route = serialize("/search", { q, offset: 0 });
			router.push(route);
		},
		{
			wait: 500,
		},
	);
	const form = useForm({
		defaultValues: {
			query: searchParams.q ?? "",
		},
		onSubmit: async ({ value }) => setSearchDebouncer.maybeExecute(value.query),
	});

	const [isLoading, setIsLoading] = useState(false);

	// Update loading state when the debouncer is running
	// React.useEffect(() => {
	// 	setIsLoading(setSearchDebouncer.isWaiting);
	// }, [setSearchDebouncer.isWaiting]);

	return (
		<div className={cn("space-y-2 min-w-[420px]", className)}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="relative">
					{/* <div
						className={cn(
							"pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3",
							isTransparent ? "text-white" : "text-muted-foreground",
						)}
					>
						{isLoading ? (
							<div className="animate-spin h-4 w-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M21 12a9 9 0 1 1-6.219-8.56" />
								</svg>
							</div>
						) : (
							<SearchIcon />
						)}
					</div> */}
					<div className="z-30 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						{isLoading ? (
							<Spinner aria-label="Loading..." />
						) : (
							<SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
						)}
					</div>
					<form.Field name="query">
						{(field) => (
							<InputFocusBlur
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								placeholder="Search..."
								onChange={(e) => field.handleChange(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}
								}}
								// className={cn(
								// 	"ps-10 pe-11 ",
								// 	// isTransparent
								// 	// ? "text-white selection:bg-white/10 placeholder:text-white/75"
								// 	// : "text-muted-foreground border-border placeholder:text-muted-foreground",
								// )}
								// placeholder="Search..."
								type="search"
							/>
						)}
					</form.Field>
					<button
						className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Press to speak"
						type="submit"
					>
						<MicIcon size={16} strokeWidth={2} aria-hidden="true" />
					</button>
					{/* <div
						className={cn(
							"pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2",
							isTransparent ? "text-white" : "text-muted-foreground",
						)}
					>
						<kbd
							className={cn(
								"inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] text-[0.625rem] font-medium",
								isTransparent ? "text-white" : "text-muted-foreground",
							)}
						>
							⌘K
						</kbd>
					</div> */}
				</div>
			</form>
		</div>
	);
}
