"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Message, Consumer } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { useTranslation } from "react-i18next"

interface MessageQueueDisplayProps {
  queue: Message[]
  processed: Message[]
  consumers: Consumer[]
}

function MessageCard({ message }: { message: Message }) {
	const { t } = useTranslation()
  const getStatusColor = () => {
    switch (message.status) {
      case 'pending': return 'bg-muted'
      case 'processing': return 'bg-yellow-500/20 text-yellow-500'
      case 'completed': return 'bg-green-500/20 text-green-500'
      case 'failed': return 'bg-red-500/20 text-red-500'
      default: return 'bg-muted'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg ${getStatusColor()} transition-colors`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm break-words">{message.content}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </p>
        </div>
        <span className="text-xs font-medium capitalize">
          {t(`messageQueue.status.${message.status}`)}
        </span>
      </div>
    </motion.div>
  )
}

export function MessageQueueDisplay({ queue, processed, consumers }: MessageQueueDisplayProps) {
	const { t } = useTranslation()
  const activeConsumers = consumers.filter(c => c.isProcessing).length

  return (
    <div className="space-y-6">
      {/* Queue Section */}
      <Card>
				<CardHeader>
					<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-base sm:text-lg">{t('messageQueue.title')}</CardTitle>
						<span className="text-xs sm:text-sm text-muted-foreground">
							{t('messageQueue.messagesWaiting', { count: queue.length })}
						</span>
					</div>
				</CardHeader>
        <CardContent>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {queue.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Processing Section */}
			{activeConsumers > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">{t('messageQueue.currentlyProcessing')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{consumers.filter(c => c.isProcessing).map((consumer) => {
								const consumerIndex = consumers.findIndex(c => c.id === consumer.id)
								const label = t('messageQueue.consumerLabel', { index: consumerIndex + 1 })
								return (
									<div key={consumer.id} className="text-sm text-muted-foreground">
										{t('messageQueue.processingBy', { name: label })}
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>
			)}

      {/* Processed Messages */}
			{processed.length > 0 && (
				<Card>
					<CardHeader>
						<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
							<CardTitle className="text-base sm:text-lg">{t('messageQueue.processedMessages')}</CardTitle>
							<span className="text-xs sm:text-sm text-muted-foreground">
								{t('messageQueue.completed', { count: processed.length })}
							</span>
						</div>
					</CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {[...processed].reverse().slice(0, 5).map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 