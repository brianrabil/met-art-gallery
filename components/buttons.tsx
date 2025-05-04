import type { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ButtonBackgroundShineProps
	extends React.ComponentProps<typeof Button> {
	children?: React.ReactNode;
	className?: string;
}

export function ButtonBackgroundShine({
	className,
	children,
	...props
}: ButtonBackgroundShineProps) {
	return (
		<button
			className={cn(
				"animate-shine items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(110deg,#000000,45%,#303030,55%,#000000)]",
				"bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-neutral-200 transition-colors dark:border-neutral-800",
				"dark:bg-[linear-gradient(110deg,#000103,45%,#303030,55%,#000103)] dark:text-neutral-400",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export function ButtonRotateBorder({
	className,
	children,
	...props
}: ButtonBackgroundShineProps) {
	return (
		<button
			className={cn(
				"relative inline-flex overflow-hidden rounded-xl p-px",
				className,
			)}
			{...props}
		>
			<span
				className={cn(
					"absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4e4e4e_0%,#d4d4d4_50%,#414141_100%)]",
					"dark:bg-[conic-gradient(from_90deg_at_50%_50%,#c2c2c2_0%,#505050_50%,#bebebe_100%)]",
				)}
			/>
			<span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-500 backdrop-blur-3xl dark:bg-neutral-950 dark:text-neutral-100">
				Button
			</span>
		</button>
	);
}
