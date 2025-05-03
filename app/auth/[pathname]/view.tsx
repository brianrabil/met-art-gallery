"use client";

import { headerStore } from "@/components/header";
import { cn } from "@/lib/utils";
import { AuthCard } from "@daveyplate/better-auth-ui";
import { useStore } from "@tanstack/react-store";

export function AuthView({ pathname }: { pathname: string }) {
	const offsetTop = useStore(headerStore, (state) => state.computedHeight);
	return (
		<div
			style={{ marginTop: offsetTop }}
			className={cn("flex py-16 flex-col grow items-center justify-center")}
		>
			<AuthCard pathname={pathname} />
		</div>
	);
}
