import { Container } from "@/components/container";
import { SidebarLeft } from "@/components/sidebar-left";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { ResultsCounter } from "./_components/results-counter";

export default async function Layout({
	children,
	filters,
}: { children: React.ReactNode; filters: React.ReactNode }) {
	const queryClient = new QueryClient();
	const dehydratedState = dehydrate(queryClient);
	return (
		<HydrationBoundary state={dehydratedState}>
			<SidebarProvider>
				<SidebarLeft className="bg-background">{filters}</SidebarLeft>
				<SidebarInset>
					<header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
						<div className="flex flex-1 items-center gap-2 px-3">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbPage className="line-clamp-1">
											<ResultsCounter />
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4">
						<Container className="flex-1 pb-12">
							<Container variant="fluid">{children}</Container>
						</Container>
					</div>
				</SidebarInset>
				{/* <SidebarRight /> */}
			</SidebarProvider>
		</HydrationBoundary>
	);
}
