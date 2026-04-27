import { Button } from "@sonvox/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@sonvox/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@sonvox/ui/components/dialog";
import { Input } from "@sonvox/ui/components/input";
import { Label } from "@sonvox/ui/components/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Check, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/org-selection")({
	component: OrgSelectionPage,
});

function OrgSelectionPage() {
	const navigate = useNavigate();
	const { data: organizations, isPending } = authClient.useListOrganizations();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const handleSelectOrg = async (orgId: string) => {
		await authClient.organization.setActive({
			organizationId: orgId,
		});
		navigate({ to: "/" });
	};

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="font-semibold text-lg tracking-tight">
						Select an organization
					</CardTitle>
					<CardDescription>
						Choose an organization to continue, or create a new one.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					{organizations && organizations.length > 0 ? (
						organizations.map((org) => (
							<button
								className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
								key={org.id}
								onClick={() => handleSelectOrg(org.id)}
								type="button"
							>
								<div className="flex size-9 items-center justify-center rounded-lg bg-muted">
									<Building2 className="size-4 text-muted-foreground" />
								</div>
								<div className="flex-1">
									<p className="font-medium text-sm">{org.name}</p>
									<p className="text-muted-foreground text-xs">
										<Users className="mr-1 inline size-3" />
										{org.slug ?? org.id}
									</p>
								</div>
								{activeOrganization?.id === org.id && (
									<Check className="size-4 text-primary" />
								)}
							</button>
						))
					) : (
						<p className="py-4 text-center text-muted-foreground text-sm">
							No organizations yet. Create one to get started.
						</p>
					)}

					<CreateOrgDialog onSuccess={handleSelectOrg} />
				</CardContent>
			</Card>
		</div>
	);
}

function CreateOrgDialog({
	onSuccess,
}: {
	onSuccess: (orgId: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	function nameToSlug(name: string): string {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_]+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "");
	}

	const handleCreate = async () => {
		if (!name.trim()) {
			return;
		}

		setIsCreating(true);
		try {
			const orgSlug =
				slug.trim() ||
				nameToSlug(name) ||
				name.trim().toLowerCase().replace(/\s+/g, "-");
			const result = await authClient.organization.create({
				name: name.trim(),
				slug: orgSlug,
			});

			if (result.error) {
				toast.error(result.error.message ?? "Failed to create organization");
				return;
			}

			if (result.data?.id) {
				toast.success("Organization created");
				setOpen(false);
				setName("");
				setSlug("");
				onSuccess(result.data.id);
			}
		} catch {
			toast.error("Failed to create organization");
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="w-full" variant="outline">
					<Plus className="mr-2 size-4" />
					Create Organization
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
					<DialogDescription>
						Add a new organization to collaborate with your team.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="org-name">Name</Label>
						<Input
							id="org-name"
							onChange={(e) => setName(e.target.value)}
							placeholder="My Organization"
							value={name}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="org-slug">Slug</Label>
						<Input
							id="org-slug"
							onChange={(e) => setSlug(e.target.value)}
							placeholder="my-organization"
							value={slug}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button disabled={isCreating || !name.trim()} onClick={handleCreate}>
						{isCreating ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Creating...
							</>
						) : (
							"Create"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
