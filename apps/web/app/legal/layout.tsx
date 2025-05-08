import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto max-w-4xl py-12 space-y-10">
			{children}
		</div>
	);
}
