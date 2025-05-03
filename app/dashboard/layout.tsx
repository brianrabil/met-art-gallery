export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="my-16">
			<h1>Dashboard</h1>
			{children}
		</div>
	);
}
