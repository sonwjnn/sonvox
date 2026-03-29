import { Button } from "@sonvox/ui/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@sonvox/ui/components/command";
import { Field, FieldError } from "@sonvox/ui/components/field";
import { Input } from "@sonvox/ui/components/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@sonvox/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@sonvox/ui/components/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@sonvox/ui/components/tabs";
import { Textarea } from "@sonvox/ui/components/textarea";

import { cn, formatFileSize } from "@sonvox/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import locales from "locale-codes";
import {
	AlignLeft,
	AudioLines,
	Check,
	ChevronsUpDown,
	FileAudio,
	FolderOpen,
	Globe,
	Layers,
	Mic,
	Pause,
	Play,
	Tag,
	Upload,
	X,
} from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";
import {
	VOICE_CATEGORIES,
	VOICE_CATEGORY_LABELS,
} from "@/features/voices/data/voice-categories";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useTRPC } from "@/utils/trpc";
import { VoiceRecorder } from "./voice-recorder";

const LANGUAGE_OPTIONS = locales.all
	.filter((l) => l.tag?.includes("-") && l.name)
	.map((l) => ({
		value: l.tag,
		label: l.location ? `${l.name} (${l.location})` : l.name,
	}));

const voiceCreateFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	file: z
		.instanceof(File, { message: "An audio file is required" })
		.nullable()
		.refine((f) => f !== null, "An audio file is required"),
	category: z.string().min(1, "A category is required"),
	language: z.string().min(1, "A language is required"),
	description: z.string(),
});

function FileDropzone({
	file,
	onFileChange,
	isInvalid,
}: {
	file: File | null;
	onFileChange: (file: File | null) => void;
	isInvalid?: boolean;
}) {
	const { isPlaying, togglePlay } = useAudioPlayback(file);

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			accept: { "audio/*": [] },
			maxSize: 20 * 1024 * 1024,
			multiple: false,
			onDrop: (acceptedFiles) => {
				if (acceptedFiles.length > 0) {
					onFileChange(acceptedFiles[0]);
				}
			},
		});

	if (file) {
		return (
			<div className="flex items-center gap-3 rounded-xl border p-4">
				<div className="flex size-10 items-center justify-center rounded-lg bg-muted">
					<FileAudio className="size-5 text-muted-foreground" />
				</div>

				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-sm">{file.name}</p>
					<p className="text-muted-foreground text-xs">
						{formatFileSize(file.size)}
					</p>
				</div>

				<Button
					onClick={togglePlay}
					size="icon-sm"
					type="button"
					variant="ghost"
				>
					{isPlaying ? (
						<Pause className="size-4" />
					) : (
						<Play className="size-4" />
					)}
				</Button>
				<Button
					onClick={() => onFileChange(null)}
					size="icon-sm"
					type="button"
					variant="ghost"
				>
					<X className="size-4" />
				</Button>
			</div>
		);
	}

	return (
		<div
			{...getRootProps()}
			className={cn(
				"flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border px-6 py-10 transition-colors",
				(isDragReject || isInvalid) && "border-destructive",
				!(isDragReject || isInvalid) && isDragActive && "border-primary"
			)}
		>
			<input {...getInputProps()} />
			<div className="flex size-12 items-center justify-center rounded-xl bg-muted">
				<AudioLines className="size-5 text-muted-foreground" />
			</div>

			<div className="flex flex-col items-center gap-1.5">
				<p className="font-semibold text-base tracking-tight">
					Upload your audio file
				</p>

				<p className="text-center text-muted-foreground text-sm">
					Supports all audio formats, max size 20MB
				</p>
			</div>

			<Button size="sm" type="button" variant="outline">
				<FolderOpen className="size-3.5" />
				Upload file
			</Button>
		</div>
	);
}

function LanguageCombobox({
	value,
	onChange,
	isInvalid,
}: {
	value: string;
	onChange: (value: string) => void;
	isInvalid?: boolean;
}) {
	const [open, setOpen] = useState(false);

	const selectedLabel =
		LANGUAGE_OPTIONS.find((l) => l.value === value)?.label ?? "";

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button
					aria-expanded={open}
					aria-invalid={isInvalid}
					className={cn(
						"h-9 w-full justify-between font-normal",
						!value && "text-muted-foreground"
					)}
					role="combobox"
					type="button"
					variant="outline"
				>
					<div className="flex items-center gap-2 truncate">
						<Globe className="size-4 shrink-0 text-muted-foreground" />
						{value ? selectedLabel : "Select language..."}
					</div>
					<ChevronsUpDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
				<Command>
					<CommandInput placeholder="Search language..." />
					<CommandList>
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{LANGUAGE_OPTIONS.map((lang) => (
								<CommandItem
									key={lang.value}
									onSelect={() => {
										onChange(lang.value);
										setOpen(false);
									}}
									value={lang.label}
								>
									{lang.label}
									<Check
										className={cn(
											"ml-auto size-4",
											value === lang.value ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

type VoiceCreateFormProps = {
	footer?: (submit: React.ReactNode) => React.ReactNode;
	onError?: (message: string) => void;
	scrollable?: boolean;
};

export function VoiceCreateForm({
	scrollable,
	footer,
	onError,
}: VoiceCreateFormProps) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: async ({
			name,
			file,
			category,
			language,
			description,
		}: {
			name: string;
			file: File;
			category: string;
			language: string;
			description?: string;
		}) => {
			const params = new URLSearchParams({
				name,
				category,
				language,
			});
			if (description) {
				params.set("description", description);
			}

			const response = await fetch(`/api/voices/create?${params.toString()}`, {
				method: "POST",
				headers: { "Content-Type": file.type },
				body: file,
			});

			if (!response.ok) {
				const body = (await response.json()) as { error?: string };
				throw new Error(body.error ?? "Failed to create voice");
			}

			return response.json();
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			file: null as File | null,
			category: "GENERAL" as string,
			language: "en-US",
			description: "",
		},
		validators: {
			onSubmit: voiceCreateFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await createMutation.mutateAsync({
					name: value.name,
					file: value.file as File,
					category: value.category,
					language: value.language,
					description: value.description || undefined,
				});

				toast.success("Voice created successfully!");
				queryClient.invalidateQueries({
					queryKey: trpc.voices.getAll.queryKey(),
				});
				form.reset();
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Failed to create voice";

				if (onError) {
					onError(message);
				} else {
					toast.error(message);
				}
			}
		},
	});

	return (
		<form
			className={cn("flex flex-col", scrollable ? "min-h-0 flex-1" : "gap-6")}
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<div
				className={cn(
					scrollable
						? "no-scrollbar flex flex-col gap-6 overflow-y-auto px-4"
						: "flex flex-col gap-6"
				)}
			>
				<form.Field name="file">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<Tabs defaultValue="upload">
									<TabsList className="h-11! w-full">
										<TabsTrigger value="upload">
											<Upload className="size-3.5" />
											Upload
										</TabsTrigger>
										<TabsTrigger value="record">
											<Mic className="size-3.5" />
											Record
										</TabsTrigger>
									</TabsList>
									<TabsContent value="upload">
										<FileDropzone
											file={field.state.value}
											isInvalid={isInvalid}
											onFileChange={field.handleChange}
										/>
									</TabsContent>
									<TabsContent value="record">
										<VoiceRecorder
											file={field.state.value}
											isInvalid={isInvalid}
											onFileChange={field.handleChange}
										/>
									</TabsContent>
								</Tabs>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="name">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<div className="relative flex items-center">
									<div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
										<Tag className="size-4 text-muted-foreground" />
									</div>
									<Input
										aria-invalid={isInvalid}
										className="pl-10"
										id={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Voice Label"
										value={field.state.value}
									/>
								</div>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="category">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<div className="relative flex items-center">
									<div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
										<Layers className="size-4 text-muted-foreground" />
									</div>
									<Select
										onValueChange={field.handleChange}
										value={field.state.value}
									>
										<SelectTrigger className="w-full pl-10">
											<SelectValue placeholder="Select category..." />
										</SelectTrigger>
										<SelectContent>
											{VOICE_CATEGORIES.map((cat) => (
												<SelectItem key={cat} value={cat}>
													{VOICE_CATEGORY_LABELS[cat]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="language">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<LanguageCombobox
									isInvalid={isInvalid}
									onChange={field.handleChange}
									value={field.state.value}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="description">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<div className="relative flex items-center">
									<div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
										<AlignLeft className="size-4 text-muted-foreground" />
									</div>
									<Textarea
										aria-invalid={isInvalid}
										className="min-h-20 pl-10"
										id={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Describe this voice..."
										rows={3}
										value={field.state.value}
									/>
								</div>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Subscribe
					selector={(s) => ({
						isSubmitting: s.isSubmitting,
					})}
				>
					{({ isSubmitting }) => {
						const submitButton = (
							<Button disabled={isSubmitting} type="submit">
								{isSubmitting ? "Creating..." : "Create Voice"}
							</Button>
						);

						return footer ? footer(submitButton) : submitButton;
					}}
				</form.Subscribe>
			</div>
		</form>
	);
}
