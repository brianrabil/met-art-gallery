import { client } from "@/lib/api/client.server";
import { RedirectType, redirect } from "next/navigation";
import type * as React from "react";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await client.users.getAuthedUser();

	if (user?.role !== "admin") {
		redirect("/", RedirectType.replace);
	}

	return <div>{children}</div>;
}
