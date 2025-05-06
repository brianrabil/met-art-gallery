"use client";

import { AnimatedTabs, tabStore } from "@/components/animated-tabs";
import {
	ButtonBackgroundShine,
	ButtonRotateBorder,
} from "@/components/buttons";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/components/search-input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { orpc } from "@/lib/api/client";
import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
	const pathname = usePathname();

	// const $sync = useMutation(orpc.met.sync.mutationOptions());

	return (
		<header
			className={cn(
				"w-full z-50 transition-all duration-200 sticky bg-background top-0 left-0 right-0",
			)}
		>
			<Container variant="fluid" className="py-3 md:py-4">
				<div className="flex items-center w-full h-full gap-6">
					<div className="w-1/3 flex flex-row items-center gap-6 flex-nowrap">
						{/* Logo */}
						<div>
							<Link href="/" className="flex items-center">
								<Logo className={"transition-colors text-foreground"} />
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-6 ml-2">
							<nav>
								<AnimatedTabs />
								{/* <ul className="flex space-x-6">
									{meta.navItems.left.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												prefetch
												data-active={pathname === item.href}
												className="text-foreground text-sm font-medium transition-colors hover:text-primary"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul> */}
							</nav>
						</div>
					</div>

					{/* Desktop Search */}
					<div className="w-1/3 flex justify-center items-center">
						<SearchInput className="lg:min-w-[520px]" />
					</div>

					{/* Right Navigation (Desktop) */}
					<div className="w-1/3 gap-x-2 hidden md:flex justify-end">
						<div className="hidden md:flex items-center space-x-6">
							{/* <nav>
								<ul className="flex space-x-6">
									{meta.navItems.right.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												data-active={pathname === item.href}
												className="text-foreground text-sm font-medium transition-colors hover:text-primary"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</nav> */}
						</div>

						<div className="flex items-center mr-6">
							<ThemeSwitcher />
						</div>

						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<Link passHref href="/auth/sign-in">
								<Button>Account</Button>
							</Link>
						</SignedOut>
						{/* <Button onClick={() => $sync.mutate({})}>Sync</Button> */}
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
	const pathname = usePathname();

	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					"ml-2 rounded-md p-2 text-foreground transition-colors hover:bg-border/20",
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
