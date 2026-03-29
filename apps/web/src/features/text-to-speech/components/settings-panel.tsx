import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@sonvox/ui/components/tabs";
import { History, Settings } from "lucide-react";

import { SettingsPanelHistory } from "./settings-panel-history";
import { SettingsPanelSettings } from "./settings-panel-settings";

const tabTriggerClassName =
	"flex-1 h-full gap-2 bg-transparent rounded-none border-x-0 border-t-0 border-b-px border-b-transparent shadow-none data-[state=active]:border-b-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none";

export function SettingsPanel() {
	return (
		<div className="hidden min-h-0 w-105 flex-col border-l lg:flex">
			<Tabs
				className="flex h-full min-h-0 flex-col gap-y-0"
				defaultValue="settings"
			>
				<TabsList className="h-12 w-full rounded-none border-b bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-12">
					<TabsTrigger className={tabTriggerClassName} value="settings">
						<Settings className="size-4" />
						Settings
					</TabsTrigger>
					<TabsTrigger className={tabTriggerClassName} value="history">
						<History className="size-4" />
						History
					</TabsTrigger>
				</TabsList>
				<TabsContent
					className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto"
					value="settings"
				>
					<SettingsPanelSettings />
				</TabsContent>
				<TabsContent
					className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto"
					value="history"
				>
					<SettingsPanelHistory />
				</TabsContent>
			</Tabs>
		</div>
	);
}
