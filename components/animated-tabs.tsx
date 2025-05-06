"use client";

import { Store, useStore } from "@tanstack/react-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TABS = [
	{ label: "Home", href: "/" },
	{ label: "Artworks", href: "/search" },
	{ label: "Blog", href: "/blog" },
];

export const tabStore = new Store({
	activeTab: TABS[0].label,
});

export function AnimatedTabs() {
	const router = useRouter();
	const activeTab = useStore(tabStore, (state) => state.activeTab);
	const containerRef = useRef<HTMLDivElement>(null);
	const activeTabRef = useRef<HTMLButtonElement>(null);
	const pathname = usePathname();

	// tabStore.subscribe((state) => {
	// 	const route = TABS.find(
	// 		({ label }) => label === state.currentVal.activeTab,
	// 	);
	// 	if (route) {
	// 		router.push(`${route.href}`);
	// 	}
	// });

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const container = containerRef.current;

		if (container && activeTab) {
			const activeTabElement = activeTabRef.current;

			if (activeTabElement) {
				const { offsetLeft, offsetWidth } = activeTabElement;

				const clipLeft = offsetLeft;
				const clipRight = offsetLeft + offsetWidth;

				container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 17px)`;
			}
		}
	}, [activeTab, activeTabRef, containerRef]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (pathname) {
			const initialTab = TABS.find(({ href }) => href === pathname);
			if (initialTab) {
				tabStore.setState((state) => ({
					...state,
					activeTab: initialTab?.label,
				}));
			}
		}
	}, []);

	return (
		<div className="relative mx-auto flex w-fit flex-col items-center rounded-full">
			<div
				ref={containerRef}
				className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
			>
				<div className="relative flex w-full justify-center bg-black dark:bg-white">
					{TABS.map((tab, index) => (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							onClick={() => {
								tabStore.setState((state) => ({
									...state,
									activeTab: tab.label,
								}));
								router.push(`${tab.href}`);
							}}
							className="flex h-8 items-center rounded-full p-3 text-sm font-medium text-white dark:text-black"
							tabIndex={-1}
							type="button"
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>
			<div className="relative flex w-full justify-center">
				{TABS.map(({ label, href }, index) => {
					const isActive = activeTab === label;

					return (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							ref={isActive ? activeTabRef : null}
							onClick={() => {
								tabStore.setState((state) => ({
									...state,
									activeTab: label,
								}));

								router.push(`${href}`);
							}}
							className="flex h-8 items-center rounded-full p-3 text-sm font-medium text-neutral-500 dark:text-neutral-300"
							type="button"
						>
							{label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
