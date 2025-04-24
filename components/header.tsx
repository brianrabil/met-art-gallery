"use client";

import { Container } from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/components/search-input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Store, useStore } from "@tanstack/react-store";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Separator } from "./ui/separator";

const store = new Store({
	isScrolled: false,
	isMobileMenuOpen: false,
});

const navItems = [{ name: "Explore collection", href: "/search" }];

export function Header() {
	const isScrolled = useStore(store, (state) => state.isScrolled);
	const pathname = usePathname();
	const isHomePage = pathname === "/";
	const isSearchPage = pathname === "/search";

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				store.setState((state) => ({
					...state,
					isScrolled: true,
				}));
			} else {
				store.setState((state) => ({
					...state,
					isSCrolled: false,
				}));
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				isScrolled || (!isHomePage && !isSearchPage)
					? "bg-background/95 backdrop-blur-sm border-b"
					: "bg-transparent border-transparent",
			)}
		>
			<Container className="py-3 md:py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<span
							className={cn(
								"font-serif text-2xl font-bold tracking-tight transition-colors",
								isScrolled || !isHomePage ? "text-foreground" : "text-white",
							)}
						>
							Meet the Met
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6">
						<nav>
							<ul className="flex space-x-6">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											prefetch
											className={cn(
												"text-sm font-medium transition-colors hover:text-primary",
												isScrolled || !isHomePage
													? "text-foreground"
													: "text-white hover:text-white/80",
												pathname === item.href ? "font-semibold" : "",
											)}
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Desktop Search */}
						<div className="gap-x-2 hidden md:flex">
							<SearchInput isTransparent={!isScrolled && isHomePage} />
							<div className="opacity-75">
								<ModeToggle
									className={cn(
										isScrolled || !isHomePage
											? "text-foreground"
											: "text-white",
										"hover:text-primary",
									)}
								/>
							</div>
						</div>
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
	const isScrolled = useStore(store, (state) => state.isScrolled);
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					"ml-2",
					isScrolled || !isHomePage
						? "text-foreground"
						: "text-white hover:text-white/80 hover:bg-white/10",
				)}
			>
				<MenuIcon className="h-5 w-5" />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<Link href="/" className="flex items-center">
						<span
							className={cn(
								"font-serif text-2xl font-bold tracking-tight transition-colors text-foreground",
							)}
						>
							Meet the Met
						</span>
					</Link>
				</SheetHeader>
				<Container>
					<div className="flex flex-col">
						<div className="flex items-center gap-x-2 flex-nowrap">
							<SearchInput isTransparent={!isScrolled && isHomePage} />
							<div className="opacity-75">
								<ModeToggle
									className={cn(
										isScrolled || !isHomePage
											? "text-foreground"
											: "text-white",
										"hover:text-primary",
									)}
								/>
							</div>
						</div>
						<Separator className="mb-4 mt-8" />
						<nav className="container mx-auto px-4 py-4">
							<ul className="space-y-4">
								<li>
									<Link
										href="/"
										prefetch
										className={cn(
											"block font-medium",
											pathname === "/" ? "font-semibold" : "",
										)}
									>
										Home
									</Link>
								</li>
								{navItems.map((item) => (
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
