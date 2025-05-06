import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";

export function Logo({
	className,
}: {
	className?: string;
}) {
	return (
		<div>
			<span
				className={cn(
					"hidden md:block whitespace-nowrap font-serif text-2xl text-foreground font-bold tracking-tight transition-colors",
					// isScrolled || !isHomePage ? "text-foreground" : "text-white",
					className,
				)}
			>
				{meta.siteName}
			</span>
			<div className="flex size-8 md:hidden items-center justify-center bg-foreground">
				<span
					className={cn(
						"block whitespace-nowrap font-serif text-2xl text-background font-semibold tracking-tight transition-colors",
						// isScrolled || !isHomePage ? "text-foreground" : "text-white",
						className,
					)}
				>
					{meta.siteName.charAt(0).toUpperCase()}
				</span>
			</div>
		</div>
	);
}
