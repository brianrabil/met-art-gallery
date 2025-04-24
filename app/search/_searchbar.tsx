"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useDebouncer } from "@tanstack/react-pacer";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { createSerializer, useQueryStates } from "nuqs";
import { searchParamsParsers } from "./_search-params";

const serialize = createSerializer(searchParamsParsers);

export function Searchbar() {
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
		<div>
			<div className="max-w-3xl mb-4">
				<h2 className="text-3xl md:text-4xl font-serif mb-4">
					Explore the Collection
				</h2>
				<p className="text-muted-foreground">
					Discover thousands of artworks spanning over 5,000 years of world
					culture
				</p>
			</div>

			<div className="max-w-2xl relative">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex"
				>
					<form.Field name="query">
						{(field) => (
							<div className="relative flex-grow">
								<SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/75 size-4" />
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									placeholder="Search artworks, artists, or exhibitions..."
									className="pl-10 pr-4 py-3 bg-background h-auto rounded-l-lg rounded-r-none text-xl border-r-0"
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
										size="icon"
										variant="ghost"
										className="absolute size-5 right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
										onClick={() => form.reset()}
									>
										<XIcon className="h-5 w-5" />
									</Button>
								)}
							</div>
						)}
					</form.Field>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit}
								className="rounded-l-none rounded-r-lg px-6 h-auto"
							>
								{isSubmitting ? (
									<Loader2Icon className="h-5 w-5 animate-spin" />
								) : (
									"Search"
								)}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</div>
		</div>
	);
}
