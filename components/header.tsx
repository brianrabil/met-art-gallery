"use client";

import { Container } from "@/components/container";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	// Handle scroll effect for transparent header
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				isScrolled || !isHomePage
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
								{[
									{ name: "Collection", href: "/search" },
									{ name: "Departments", href: "/departments" },
									{ name: "About", href: "/about" },
								].map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
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
						<SearchInput isTransparent={!isScrolled && isHomePage} />
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center md:hidden">
						<SearchInput isTransparent={!isScrolled && isHomePage} />
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"ml-2",
								isScrolled || !isHomePage
									? "text-foreground"
									: "text-white hover:text-white/80 hover:bg-white/10",
							)}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle menu"
						>
							{isMobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>
			</Container>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-background border-b">
					<nav className="container mx-auto px-4 py-4">
						<ul className="space-y-4">
							{[
								{ name: "Collection", href: "/collection" },
								{ name: "Departments", href: "/departments" },
								{ name: "About", href: "/about" },
							].map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className={cn(
											"block text-lg font-medium",
											pathname === item.href ? "font-semibold" : "",
										)}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			)}
		</header>
	);
}
