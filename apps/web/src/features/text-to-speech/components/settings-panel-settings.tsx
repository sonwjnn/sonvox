import { Field, FieldGroup, FieldLabel } from "@sonvox/ui/components/field";
import { Slider } from "@sonvox/ui/components/slider";
import { useStore } from "@tanstack/react-form";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { VoiceSelector } from "@/features/text-to-speech/components/voice-selector";
import { sliders } from "@/features/text-to-speech/data/sliders";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

export function SettingsPanelSettings() {
	const form = useTypedAppFormContext(ttsFormOptions);
	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return (
		<>
			{/* Voice Style Dropdown Section */}
			<div className="border-b border-dashed p-4">
				<VoiceSelector />
			</div>

			{/* Voice Adjustments Section */}
			<div className="flex-1 p-4">
				<FieldGroup className="gap-8">
					{sliders.map((slider) => (
						<form.Field key={slider.id} name={slider.id}>
							{(field) => (
								<Field>
									<FieldLabel>{slider.label}</FieldLabel>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-xs">
											{slider.leftLabel}
										</span>
										<span className="text-muted-foreground text-xs">
											{slider.rightLabel}
										</span>
									</div>
									<Slider
										className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-track]:h-1 **:data-[slot=slider-thumb]:bg-foreground"
										disabled={isSubmitting}
										max={slider.max}
										min={slider.min}
										onValueChange={(value) => field.handleChange(value[0])}
										step={slider.step}
										value={[field.state.value]}
									/>
								</Field>
							)}
						</form.Field>
					))}
				</FieldGroup>
			</div>
		</>
	);
}
