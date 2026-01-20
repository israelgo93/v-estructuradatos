"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Consumer } from "./types"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

interface ConsumerControlsProps {
  consumers: Consumer[]
  onProcess: (consumerId: string) => void
  queueSize: number
}

export function ConsumerControls({ consumers, onProcess, queueSize }: ConsumerControlsProps) {
	const { t } = useTranslation()

	return (
		<Card className="bg-card/50 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-lg">{t('messageQueue.consumers')}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-2">
					{consumers.map((consumer, index) => (
						<Button
							key={consumer.id}
							variant="outline"
							onClick={() => onProcess(consumer.id)}
							disabled={consumer.isProcessing || queueSize === 0}
							className="relative w-full text-left"
						>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
								<span className="min-w-0 break-words">{t('messageQueue.consumerLabel', { index: index + 1 })}</span>
								{consumer.isProcessing ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full w-fit">
										{t('messageQueue.processed', { count: consumer.processedCount })}
									</span>
								)}
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	)
} 