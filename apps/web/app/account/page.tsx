import { client } from "@/lib/api.server";
import { headers } from "next/headers";

export default async function Page() {
	const user = await client.users.getAuthedUser(
		{},
		{
			context: {
				headers: await headers(),
			},
		},
	);

	return (
		<div>
			<h1>Welcome back {user?.name}</h1>
		</div>
	);
}
