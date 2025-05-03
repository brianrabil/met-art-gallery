"use client";

import { Searchbar } from "@/app/search/_searchbar";
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
import { ThemeProvider } from "./theme-provider";
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
				height: rect.height,
			}));
		}
	}, []);

	return (
		<header
			ref={ref}
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				isScrolled || (!isHomePage && !isSearchPage)
					? "bg-background border-b"
					: "bg-transparent border-transparent",
			)}
		>
			<Container className="py-3 md:py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Logo
							className={cn(
								"transition-colors",
								isScrolled || !isHomePage ? "text-foreground" : "text-white",
							)}
						/>
					</Link>
					<div className="w-full">
						<Searchbar />
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6">
						{/* <nav>
							<ul className="flex space-x-6">
								{meta.navItems.map((item) => (
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
						</nav> */}

						{/* Desktop Search */}
						<div className="gap-x-2 hidden md:flex">
							{/* <ModeToggle
								variant="outline"
								className={cn(
									isScrolled || !isHomePage
										? "text-foreground"
										: "text-white  bg-transparent hover:bg-background/25",
									"hover:text-primary-foreground",
								)}
							/> */}
							{/* <SearchInput isTransparent={!isScrolled && isHomePage} /> */}
							<SignedIn>
								<UserButton />
							</SignedIn>
							<SignedOut>
								<Link passHref href="/auth/sign-in">
									<Button
										className={cn(
											isScrolled &&
												isHomePage &&
												"text-white bg-transparent hover:bg-background/25",
											"hover:text-primary-foreground",
										)}
									>
										Account
									</Button>
								</Link>
							</SignedOut>
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
	const isScrolled = useStore(headerStore, (state) => state.isScrolled);
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
						<Logo />
					</Link>
				</SheetHeader>
				<Container>
					<div className="flex flex-col">
						<nav className="container mx-auto px-4 py-4">
							<ul className="space-y-4">
								{meta.navItems.map((item) => (
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
