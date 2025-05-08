import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const containerVariants = cva("mx-auto", {
	variants: {
		variant: {
			// Full-width on mobile, constrained with padded content above
			default: "max-w-7xl sm:px-6 lg:px-8",
			// Constrained with padded content
			constrained: "max-w-7xl px-4 sm:px-6 lg:px-8",
			// Full-width on mobile, constrained to breakpoint with padded content above mobile
			breakpoint: "container sm:px-6 lg:px-8",
			// Constrained to breakpoint with padded content
			breakpointPadded: "container px-4 sm:px-6 lg:px-8",
			fluid: "px-4 sm:px-6 lg:px-8 w-full",
		},
		width: {
			default: "",
			narrow: "",
		},
	},
	defaultVariants: {
		variant: "fluid",
		width: "default",
	},
});

interface ContainerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof containerVariants> {
	children?: React.ReactNode;
}

export function Container({
	children,
	className,
	variant,
	width,
	...props
}: ContainerProps) {
	return (
		<div
			className={cn(containerVariants({ variant, width }), className)}
			{...props}
		>
			{width === "narrow" ? (
				<div className="mx-auto max-w-3xl">{children}</div>
			) : (
				children
			)}
		</div>
	);
}
