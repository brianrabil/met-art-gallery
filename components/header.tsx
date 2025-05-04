"use client";

import { Searchbar } from "@/app/search/_searchbar";
import {
	ButtonBackgroundShine,
	ButtonRotateBorder,
} from "@/components/buttons";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/components/search-input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import { Store, useStore } from "@tanstack/react-store";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface State {
	isScrolled: boolean;
	computedHeight: DOMRect["height"];
}

export const headerStore = new Store<State>({
	isScrolled: false,
	computedHeight: 80,
});

export function Header() {
	const ref = useRef<HTMLHeadingElement>(null);
	const isScrolled = useStore(headerStore, (state) => state.isScrolled);
	const pathname = usePathname();
	const isHomePage = pathname === "/";
	const isSearchPage = pathname === "/search";

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				headerStore.setState((state) => ({
					...state,
					isScrolled: true,
				}));
			} else {
				headerStore.setState((state) => ({
					...state,
					isScrolled: false,
				}));
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect();
			headerStore.setState((state) => ({
				...state,
				computedHeight: rect.height,
			}));
		}
	}, []);

	return (
		<header
			ref={ref}
			className={cn(
				"w-full z-50 transition-all duration-200",
				isScrolled || (!isHomePage && !isSearchPage)
					? "bg-background"
					: "bg-transparent",
			)}
		>
			<Container variant="fluid" className="py-3 md:py-4">
				<div className="flex items-center w-full h-full gap-6">
					<div className="w-1/3 flex flex-row flex-nowrap">
						{/* Logo */}
						<div>
							<Link href="/" className="flex items-center space-x-2">
								<Logo
									className={cn(
										"transition-colors",
										isScrolled || !isHomePage
											? "text-foreground"
											: "text-white",
									)}
								/>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-6">
							<nav>
								<ul className="flex space-x-6">
									{meta.navItems.left.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												prefetch
												data-active={pathname === item.href}
												className={cn(
													"text-sm font-medium transition-colors hover:text-primary",
													isScrolled || !isHomePage
														? "text-foreground"
														: "text-white/90",
												)}
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</div>

					{/* Desktop Search */}
					<div className="w-1/3 flex justify-center items-center">
						<SearchInput
							className="lg:min-w-[520px]"
							isTransparent={!isScrolled && isHomePage}
						/>
					</div>
					<div className="w-1/3 gap-x-2 hidden md:flex justify-end">
						<div className="hidden md:flex items-center space-x-6">
							<nav>
								<ul className="flex space-x-6">
									{meta.navItems.right.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												prefetch
												data-active={pathname === item.href}
												className={cn(
													"text-sm font-medium transition-colors hover:text-primary",
													isScrolled || !isHomePage
														? "text-foreground"
														: "text-white/90",
												)}
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</div>
						<ModeToggle
							variant="ghost"
							className={cn(
								isScrolled || !isHomePage
									? "text-foreground"
									: "text-white hover:bg-white/10",
								"h-9 w-9",
							)}
						/>
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<Link passHref href="/auth/sign-in">
								<ButtonBackgroundShine>Account</ButtonBackgroundShine>
							</Link>
						</SignedOut>
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center md:hidden">
						<MobileMenu />
					</div>
				</div>
			</Container>
		</header>
	);
}

function MobileMenu() {
	const isScrolled = useStore(headerStore, (state) => state.isScrolled);
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					"ml-2 rounded-md p-2 transition-colors hover:bg-border/20",
					isScrolled || !isHomePage ? "text-foreground" : "text-white",
				)}
			>
				<MenuIcon className="h-5 w-5" />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<Link href="/" className="flex items-center">
						<Logo />
					</Link>
				</SheetHeader>
				<Container>
					<div className="flex flex-col">
						<nav className="container mx-auto px-4 py-4">
							<ul className="space-y-4">
								{meta.navItems.left.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											prefetch
											className={cn(
												"block font-medium",
												pathname === item.href ? "font-semibold" : "",
											)}
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</Container>
			</SheetContent>
		</Sheet>
	);
}
