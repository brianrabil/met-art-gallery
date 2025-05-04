import { Container } from "@/components/container";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className={cn("")}>
			<div className="bg-background">
				<Container variant="fluid" className="py-4">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/" asChild>
									<Link href="/">
										<HomeIcon className="h-4 w-4" />
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/search" asChild>
									<Link href="/search">Search</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							{/* <BreadcrumbSeparator /> */}
							{/* <BreadcrumbItem>
								<BreadcrumbPage>
									Results{queryParams.q ? ` for ${queryParams.q}` : ""}
								</BreadcrumbPage>
							</BreadcrumbItem> */}
						</BreadcrumbList>
					</Breadcrumb>
				</Container>
			</div>
			{children}
		</div>
	);
}
