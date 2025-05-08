import { BackButton } from "@/components/back-button";
import { Container } from "@/components/container";

export default async function ObjectPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className="py-8">
			{/* <Breadcrumb className="mb-4">
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink>Search Results</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb> */}
			<div className="mb-6">
				<BackButton />
			</div>
			{children}
		</Container>
	);
}
