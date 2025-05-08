"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const themes = [
	{
		key: "system",
		icon: Monitor,
		label: "System theme",
	},
	{
		key: "light",
		icon: Sun,
		label: "Light theme",
	},
	{
		key: "dark",
		icon: Moon,
		label: "Dark theme",
	},
];

export type ThemeSwitcherProps = {
	value?: "light" | "dark" | "system";
	onChange?: (theme: "light" | "dark" | "system") => void;
	defaultValue?: "light" | "dark" | "system";
	className?: string;
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
	const { setTheme, resolvedTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	// Use the actual theme value, not the resolved theme for the UI state
	const currentTheme = theme as "light" | "dark" | "system";

	return (
		<div
			className={cn(
				"relative transition isolate flex items-center h-8 rounded-full bg-background p-0.5 ring-1 ring-border w-24 justify-between",
				className,
			)}
		>
			{themes.map(({ key, icon: Icon, label }) => {
				const isActive = currentTheme === key;

				return (
					<button
						type="button"
						key={key}
						className="relative h-7 w-7 rounded-full flex items-center justify-center"
						onClick={() => setTheme(key)}
						aria-label={label}
					>
						{isActive && (
							<motion.div
								layoutId="activeTheme"
								className="absolute inset-0 rounded-full bg-muted/80"
								transition={{ type: "spring", duration: 0.5 }}
							/>
						)}
						<Icon
							className={cn(
								"relative z-10 size-4",
								isActive ? "text-foreground" : "text-muted-foreground",
							)}
						/>
					</button>
				);
			})}
		</div>
	);
}
