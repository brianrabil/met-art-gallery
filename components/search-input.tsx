import { searchParamsParsers } from "@/app/search/_search-params";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useDebouncer } from "@tanstack/react-pacer";
import { useRouter } from "next/navigation";
import { createSerializer, useQueryStates } from "nuqs";

const serialize = createSerializer(searchParamsParsers);

export function SearchInput({ isTransparent }: { isTransparent?: boolean }) {
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

	return (
		<div className="space-y-2 min-w-[300px]">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="relative">
					<form.Field name="query">
						{(field) => (
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}
								}}
								className={cn(
									"pe-11 ",
									isTransparent
										? "text-white selection:bg-white/10 placeholder:text-white/75"
										: "text-muted-foreground border-border placeholder:text-muted-foreground",
								)}
								placeholder="Search..."
								type="search"
							/>
						)}
					</form.Field>

					<div
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
					</div>
				</div>
			</form>
		</div>
	);
}
