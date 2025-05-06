import { client } from "@/lib/api/client.server";

export default async function Page() {
	const user = await client.users.getAuthedUser();

	return (
		<div>
			<h1>Welcome back {user?.name}</h1>
		</div>
	);
}
