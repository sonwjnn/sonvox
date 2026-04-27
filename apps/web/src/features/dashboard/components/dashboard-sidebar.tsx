import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarTrigger,
} from "@sonvox/ui/components/sidebar";
import { Skeleton } from "@sonvox/ui/components/skeleton";
import { Link, useLocation } from "@tanstack/react-router";
import {
	AudioLines,
	Headphones,
	Home,
	LayoutGrid,
	type LucideIcon,
	Settings,
	Volume2,
} from "lucide-react";
import { useState } from "react";
import { UsageContainer } from "@/features/billing/components/usage-container";
import { VoiceCreateDialog } from "@/features/voices/components/voice-create-dialog";

type MenuItem = {
	icon: LucideIcon;
	onClick?: () => void;
	title: string;
	url?: string;
};

type NavSectionProps = {
	items: MenuItem[];
	label?: string;
	pathname: string;
};

function getIsActive(item: MenuItem, pathname: string): boolean {
	if (!item.url) {
		return false;
	}
	if (item.url === "/") {
		return pathname === "/";
	}
	return pathname.startsWith(item.url);
}

function NavSection({ label, items, pathname }: NavSectionProps) {
	return (
		<SidebarGroup>
			{label && (
				<SidebarGroupLabel className="text-[13px] text-muted-foreground uppercase">
					{label}
				</SidebarGroupLabel>
			)}
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild={!!item.url}
								className="h-9 border border-transparent px-3 py-2 font-medium text-[13px] tracking-tight data-[active=true]:border-border data-[active=true]:shadow-[0px_1px_1px_0px_rgba(44,54,53,0.03),inset_0px_0px_0px_2px_white]"
								isActive={getIsActive(item, pathname)}
								onClick={item.onClick}
								tooltip={item.title}
							>
								{item.url ? (
									<Link to={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								) : (
									<>
										<item.icon />
										<span>{item.title}</span>
									</>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

export function DashboardSidebar() {
	const { pathname } = useLocation();
	const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

	const mainMenuItems: MenuItem[] = [
		{
			title: "Dashboard",
			url: "/",
			icon: Home,
		},
		{
			title: "Explore voices",
			url: "/voices",
			icon: LayoutGrid,
		},
		{
			title: "Text to speech",
			url: "/text-to-speech",
			icon: AudioLines,
		},
		{
			title: "Voice cloning",
			icon: Volume2,
			onClick: () => setVoiceDialogOpen(true),
		},
	];

	const othersMenuItems: MenuItem[] = [
		{
			title: "Settings",
			icon: Settings,
			url: "/settings",
		},
		{
			title: "Help and support",
			url: "mailto:business@codewithantonio.com",
			icon: Headphones,
		},
	];

	return (
		<>
			<VoiceCreateDialog
				onOpenChange={setVoiceDialogOpen}
				open={voiceDialogOpen}
			/>
			<Sidebar collapsible="icon">
				<SidebarHeader className="flex flex-col gap-4 pt-4">
					<div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
						<img
							alt="Sonvox"
							className="size-6 rounded-sm"
							height={24}
							src="/logo.svg"
							width={24}
						/>
						<span className="font-semibold text-foreground text-lg tracking-tighter group-data-[collapsible=icon]:hidden">
							Sonvox
						</span>
						<SidebarTrigger className="ml-auto lg:hidden" />
					</div>
					<SidebarMenu>
						<SidebarMenuItem>
							{/* TODO: Replace with app organization switcher */}
							<Skeleton className="h-8.5 w-full rounded-md border bg-white group-data-[collapsible=icon]:size-8" />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<div className="border-border border-b border-dashed" />
				<SidebarContent>
					<NavSection items={mainMenuItems} pathname={pathname} />
					<NavSection
						items={othersMenuItems}
						label="Others"
						pathname={pathname}
					/>
				</SidebarContent>
				<div className="border-border border-b border-dashed" />
				<SidebarFooter className="gap-3 py-3">
					<UsageContainer />
					<SidebarMenu>
						<SidebarMenuItem>
							{/* TODO: Replace with app user button */}
							<Skeleton className="h-8.5 w-full rounded-md border border-border bg-white group-data-[collapsible=icon]:size-8" />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</>
	);
}
