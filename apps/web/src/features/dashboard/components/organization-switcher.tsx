import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@sonvox/ui/components/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@sonvox/ui/components/sidebar";
import { Skeleton } from "@sonvox/ui/components/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function OrganizationSwitcher() {
	const navigate = useNavigate();
	const { data: organizations, isPending } = authClient.useListOrganizations();
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const [switching, setSwitching] = useState<string | null>(null);

	const handleSwitch = async (orgId: string) => {
		setSwitching(orgId);
		try {
			await authClient.organization.setActive({ organizationId: orgId });
		} finally {
			setSwitching(null);
		}
	};

	if (isPending) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<Skeleton className="h-8.5 w-full rounded-md border bg-white group-data-[collapsible=icon]:size-8" />
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger className="w-full">
						<SidebarMenuButton
							className="w-full items-center gap-3 rounded-md border border-border bg-white px-1.5 py-1 shadow-[0px_1px_1.5px_0px_rgba(44,54,53,0.03)] hover:bg-white group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1"
							size="lg"
							tooltip={activeOrganization?.name ?? "Select org"}
						>
							<div className="flex items-center gap-2 overflow-hidden">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-muted">
									<Building2 className="size-4 text-muted-foreground" />
								</div>
								<span className="truncate font-medium text-[13px] text-foreground tracking-tight group-data-[collapsible=icon]:hidden">
									{activeOrganization?.name ?? "Select org"}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-[--anchor-width]">
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								Organizations
							</DropdownMenuLabel>
							{organizations?.map((org) => (
								<DropdownMenuItem
									className="flex items-center justify-between"
									key={org.id}
									onClick={() => {
										handleSwitch(org.id);
									}}
								>
									<span className="truncate">{org.name}</span>
									{switching === org.id ? (
										<Loader2 className="ml-2 size-4 animate-spin" />
									) : (
										activeOrganization?.id === org.id && (
											<Check className="ml-2 size-4 shrink-0 text-primary" />
										)
									)}
								</DropdownMenuItem>
							))}
							{(!organizations || organizations.length === 0) && (
								<DropdownMenuItem disabled>No organizations</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								navigate({ to: "/org-selection" });
							}}
						>
							<Plus className="mr-2 size-4" />
							Create organization
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
