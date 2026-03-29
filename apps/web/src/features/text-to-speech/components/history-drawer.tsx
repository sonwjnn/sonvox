import { Button } from "@sonvox/ui/components/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@sonvox/ui/components/drawer";
import { History } from "lucide-react";

import { SettingsPanelHistory } from "./settings-panel-history";

export function HistoryDrawer() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button size="sm" variant="outline">
					<History className="size-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>History</DrawerTitle>
				</DrawerHeader>
				<div className="overflow-y-auto">
					<SettingsPanelHistory />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
