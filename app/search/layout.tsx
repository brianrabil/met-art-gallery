import { Container } from "@/components/container";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { FilterIcon, PanelLeftIcon } from "lucide-react";
import { Suspense } from "react";
import { FilterSidebar, FilterSidebarSkeleton } from "./_filter-sidebar";
import { ResultsCount, SidebarTrigger } from "./_search-results";

export default async function Layout({
	children,
}: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<SidebarLeft className="bg-background">
				<Suspense fallback={<FilterSidebarSkeleton />}>
					<FilterSidebar />
				</Suspense>
			</SidebarLeft>
			<SidebarInset>
				<header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="line-clamp-1">
										<ResultsCount />
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					{/* <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
					<div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" /> */}
					{children}
				</div>
			</SidebarInset>
			{/* <SidebarRight /> */}
		</SidebarProvider>
	);
}
