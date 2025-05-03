"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useDebouncer } from "@tanstack/react-pacer";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { createSerializer, useQueryStates } from "nuqs";
import { searchParamsParsers } from "./_search-params";

const serialize = createSerializer(searchParamsParsers);

export function Searchbar({
	className,
}: {
	readonly className?: string;
}) {
	const [searchParams, setSearchParams] = useQueryStates(searchParamsParsers);

	const setSearchDebouncer = useDebouncer(
		async (q) => {
			await setSearchParams(
				{ q },
				{
					history: "replace",
				},
			);
			const route = serialize("/search", { q, offset: 0 });
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

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={cn("flex w-full max-w-2xl relative", className)}
		>
			<form.Field name="query">
				{(field) => (
					<div className="relative flex-grow">
						<SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/75 size-5" />
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							placeholder="Search artworks, artists, or exhibitions..."
							className="pl-11 pr-4 placeholder:text-base text-base lg:text-base sm:text-base md:text-base bg-background h-12 rounded-full"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}
							}}
						/>
						{field.state.value?.length > 0 && (
							<Button
								type="button"
								size="sm"
								variant="ghost"
								className="absolute right-16 z-20 top-1/2 -translate-1/2 bottom-1 text-muted-foreground"
								onClick={() => form.reset()}
							>
								<XIcon className="size-4" />
								Clear
							</Button>
						)}
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit}
									className="absolute rounded-full right-1 top-1 bottom-1 px-5 h-auto"
								>
									{isSubmitting ? (
										<Loader2Icon className="h-5 w-5 animate-spin" />
									) : (
										"Search"
									)}
								</Button>
							)}
						</form.Subscribe>
					</div>
				)}
			</form.Field>
		</form>
	);
}
