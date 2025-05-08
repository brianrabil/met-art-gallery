"use client";

import {
	AudioWaveform,
	Blocks,
	Calendar,
	Command,
	Home,
	Inbox,
	MessageCircleQuestion,
	Search,
	Settings2,
	Sparkles,
	Trash2,
} from "lucide-react";
import type * as React from "react";

// import { NavFavorites } from "@/components/nav-favorites";
// import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
// import { NavWorkspaces } from "@/components/nav-workspaces";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

export function SidebarLeft({
	children,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar side="left" className="border-r-0" {...props}>
			{/* <SidebarHeader> */}
			{/* <TeamSwitcher teams={data.teams} />
				<NavMain items={data.navMain} /> */}
			{/* </SidebarHeader> */}
			<SidebarContent>
				{/* <NavFavorites favorites={data.favorites} />
				<NavWorkspaces workspaces={data.workspaces} />
				<NavSecondary items={data.navSecondary} className="mt-auto" /> */}
				{children}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
