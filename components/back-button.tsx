"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function BackButton({
	children = "Back to the previous route",
}: {
	children?: React.ReactNode;
}) {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.back()}
			variant="ghost"
			className="cursor-pointer text-muted-foreground hover:text-foreground"
		>
			<ArrowLeftIcon className="h-4 w-4" />
			{children}
		</Button>
	);
}
