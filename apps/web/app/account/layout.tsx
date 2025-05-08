import { client } from "@/lib/api.server";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const queryClient = new QueryClient();
	const user = await client.users.getAuthedUser();

	return (
		<div className="my-16">
			<h1>Dashboard</h1>
			<ul>
				{user?.role === "admin" && (
					<li>
						<Link href="/admin">Admin</Link>
					</li>
				)}
			</ul>
			{children}
		</div>
	);
}
