import { Badge } from "@sonvox/ui/components/badge";
import { Button } from "@sonvox/ui/components/button";
import { Textarea } from "@sonvox/ui/components/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { useState } from "react";

import {
	COST_PER_UNIT,
	TEXT_MAX_LENGTH,
} from "@/features/text-to-speech/data/constants";

export function TextInputPanel() {
	const [text, setText] = useState("");
	const navigate = useNavigate();

	const handleGenerate = () => {
		const trimmed = text.trim();
		if (!trimmed) {
			return;
		}

		navigate({ to: "/text-to-speech", search: { text: trimmed } });
	};

	return (
		<div className="rounded-[22px] bg-linear-185 from-15% from-[#ff8ee3] via-39% via-[#57d7e0] to-85% to-[#dbf1f2] p-0.5 shadow-[0_0_0_4px_white]">
			{/* Using px values for border-radius to ensure proper gradient border math (outer - padding = inner). */}
			{/* Standard classes like rounded-4xl use CSS calc() which doesn't align cleanly at corners. */}
			<div className="rounded-[20px] bg-[#F9F9F9] p-1">
				<div className="space-y-4 rounded-2xl bg-white p-4 drop-shadow-xs">
					<Textarea
						className="min-h-35 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
						maxLength={TEXT_MAX_LENGTH}
						onChange={(e) => setText(e.target.value)}
						placeholder="Start typing or paste your text here..."
						value={text}
					/>

					{/* Bottom info */}

					<div className="flex items-center justify-between">
						<Badge className="gap-1.5 border-dashed" variant="outline">
							<Coins className="size-3 text-chart-5" />
							<span className="text-xs">
								{text.length === 0 ? (
									"Start typing to estimate"
								) : (
									<>
										<span className="tabular-nums">
											${(text.length * COST_PER_UNIT).toFixed(4)}
										</span>{" "}
										estimated
									</>
								)}
							</span>
						</Badge>
						<span className="text-muted-foreground text-xs">
							{text.length.toLocaleString()} /{" "}
							{TEXT_MAX_LENGTH.toLocaleString()} characters
						</span>
					</div>
				</div>

				{/* Action bar */}

				<div className="flex items-center justify-end p-3">
					<Button
						className="w-full lg:w-auto"
						disabled={!text.trim()}
						onClick={handleGenerate}
						size="sm"
					>
						Generate speech
					</Button>
				</div>
			</div>
		</div>
	);
}
