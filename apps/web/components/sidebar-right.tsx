import { Plus } from "lucide-react";
import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "./ui/sidebar";

// import { Calendars } from "@/components/calendars";
// import { DatePicker } from "@/components/date-picker";
// import { NavUser } from "@/components/nav-user";
// import {
// 	Sidebar,
// 	SidebarContent,
// 	SidebarFooter,
// 	SidebarHeader,
// 	SidebarMenu,
// 	SidebarMenuButton,
// 	SidebarMenuItem,
// 	SidebarRail,
// 	SidebarSeparator,
// } from "@/components/ui/sidebar";

export function SidebarRight({
	children,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="offcanvas"
			variant="inset"
			side="right"
			className="hidden lg:flex top-0 h-svh border-l"
			{...props}
		>
			<SidebarContent>{children}</SidebarContent>
		</Sidebar>
	);
}
