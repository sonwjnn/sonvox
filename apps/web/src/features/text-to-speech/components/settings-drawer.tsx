import { Button } from "@sonvox/ui/components/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@sonvox/ui/components/drawer";
import { Settings } from "lucide-react";

import { SettingsPanelSettings } from "./settings-panel-settings";

type SettingsDrawerProps = {
	children?: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
};

export function SettingsDrawer({
	open,
	onOpenChange,
	children,
}: SettingsDrawerProps) {
	return (
		<Drawer onOpenChange={onOpenChange} open={open}>
			{children ?? (
				<DrawerTrigger asChild>
					<Button size="sm" variant="outline">
						<Settings className="size-4" />
					</Button>
				</DrawerTrigger>
			)}
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Settings</DrawerTitle>
				</DrawerHeader>
				<div className="overflow-y-auto">
					<SettingsPanelSettings />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
