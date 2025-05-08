"use client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";
import * as React from "react";

// Shadcn badge variant utility
const badgeVariants = cva(
	[
		"inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold ring-offset-background transition-colors",
		"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		"disabled:cursor-not-allowed disabled:opacity-50",
	],
	{
		variants: {
			variant: {
				default: [
					"border-transparent bg-primary text-primary-foreground",
					"hover:bg-primary/80",
				],
				secondary: [
					"border-transparent bg-secondary text-secondary-foreground",
					"hover:bg-secondary/80",
				],
				destructive: [
					"border-transparent bg-destructive text-destructive-foreground",
					"hover:bg-destructive/80",
				],
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type TagProps = {
	children: React.ReactNode;
	className?: string;
	onRemove?: () => void;
	removable?: boolean;
	variant?: "default" | "secondary" | "destructive" | "outline";
	disabled?: boolean;
};

function Tag({
	children,
	className,
	onRemove,
	removable = false,
	variant = "default",
	disabled = false,
	...props
}: TagProps) {
	return (
		<span
			className={cn(badgeVariants({ variant }), removable && "pr-1", className)}
			aria-disabled={disabled}
			{...props}
		>
			{children}
			{removable && (
				<button
					type="button"
					onClick={onRemove}
					disabled={disabled}
					className={cn(
						"ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity focus-visible:outline-none hover:opacity-100",
					)}
					aria-label="Remove tag"
				>
					<XIcon aria-hidden className="size-3" />
				</button>
			)}
		</span>
	);
}

type TagListProps<T = unknown> = {
	items?: T[];
	renderEmptyState?: React.ReactNode;
	children?: (item: T, idx: number) => React.ReactNode;
	className?: string;
};

function TagList<T = unknown>({
	items,
	renderEmptyState,
	children,
	className,
	...props
}: TagListProps<T>) {
	if (!items || items.length === 0) {
		return (
			<div
				className={cn(
					"flex flex-wrap gap-2 text-sm text-muted-foreground",
					className,
				)}
				{...props}
			>
				{renderEmptyState}
			</div>
		);
	}
	return (
		<div className={cn("flex flex-wrap gap-2", className)} {...props}>
			{items.map((item, idx) => (children ? children(item, idx) : null))}
		</div>
	);
}

type TagGroupProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
};

const TagGroup = React.forwardRef<HTMLDivElement, TagGroupProps>(
	({ children, className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
			{children}
		</div>
	),
);
TagGroup.displayName = "TagGroup";

export { TagGroup, TagList, Tag, badgeVariants };
