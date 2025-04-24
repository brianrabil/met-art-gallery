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
		<Button onClick={() => router.back()} variant="ghost" className="pl-0">
			<ArrowLeftIcon className="mr-2 h-4 w-4" />
			{children}
		</Button>
	);
}
