"use client";

import Link from "next/link";

export default function NotFoundPage() {
	return (
		<>
			<div className="mx-auto grid min-h-[75vh] place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="text-base font-semibold text-primary">404</p>
					<h1 className="mt-4 text-balance font-serif italic text-5xl tracking-tight text-foreground sm:text-7xl">
						Page not found
					</h1>
					<p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
						Sorry, we couldn’t find the page you’re looking for.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Go back home
						</Link>
						<Link
							href="/support"
							className="text-sm font-medium text-foreground hover:underline"
						>
							Contact support <span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
