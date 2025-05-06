import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";

export function Logo({
	className,
}: {
	className?: string;
}) {
	return (
		<span
			className={cn(
				"block whitespace-nowrap font-serif text-2xl text-foreground font-bold tracking-tight transition-colors",
				// isScrolled || !isHomePage ? "text-foreground" : "text-white",
				className,
			)}
		>
			{meta.siteName}
		</span>
	);
}
