"use client"

import dynamic from "next/dynamic"
import { useCallback } from "react"
import { QueueControls } from "@/components/visualizer/queue/queue-controls"
import { QueueOperations } from "@/components/visualizer/queue/queue-operations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQueue } from "@/hooks/use-queue"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { OperationFeedback, useFeedback } from "@/components/visualizer/shared/operation-feedback"
import { InteractiveExplanation, QUEUE_EXPLANATION_DATA } from "@/components/visualizer/shared/interactive-explanation"
import { QUEUE_FEEDBACK_TEMPLATES } from "@/components/visualizer/shared/feedback-types"

const QueueDisplay = dynamic(
  () => import("@/components/visualizer/queue/queue-display").then(mod => ({ default: mod.QueueDisplay })),
  { ssr: false, loading: () => <Skeleton className="h-[600px] w-full rounded-xl" /> }
)

interface QueueVisualizerProps {
  content: React.ReactNode
}

export function QueueVisualizer({ content }: QueueVisualizerProps) {
  const { t } = useTranslation()
  const { 
    queue,
    operations,
    isAnimating,
    highlightedIndex,
    enqueue: originalEnqueue,
    dequeue: originalDequeue,
    clear,
    isFull,
    isEmpty,
  } = useQueue()

  const { currentFeedback, startFeedback, completeFeedback } = useFeedback()

  // Wrap enqueue with feedback
  const enqueue = useCallback(async (value: number) => {
    const template = QUEUE_FEEDBACK_TEMPLATES.enqueue
    startFeedback({
      operationName: template.operationName,
      operationNameEs: template.operationNameEs,
      steps: template.getSteps(value, queue.length + 1),
      complexity: template.complexity
    })
    
    await originalEnqueue(value)
    completeFeedback()
  }, [originalEnqueue, startFeedback, completeFeedback, queue.length])

  // Wrap dequeue with feedback
  const dequeue = useCallback(async () => {
    if (queue.length === 0) return
    
    const frontValue = queue[0].value
    const template = QUEUE_FEEDBACK_TEMPLATES.dequeue
    startFeedback({
      operationName: template.operationName,
      operationNameEs: template.operationNameEs,
      steps: template.getSteps(frontValue, queue.length - 1),
      complexity: template.complexity
    })
    
    await originalDequeue()
    completeFeedback()
  }, [originalDequeue, startFeedback, completeFeedback, queue])

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('common.queue')}</h1>
        <p className="text-muted-foreground">
          {t('queue.description')}
        </p>
      </div>

      <Tabs defaultValue="visualization" className="w-full space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex w-full min-w-max sm:grid sm:grid-cols-2 h-auto p-1 sm:h-10 sm:p-1">
            <TabsTrigger value="visualization" className="flex-1">{t('common.visualization')}</TabsTrigger>
            <TabsTrigger value="explanation" className="flex-1">{t('common.explanation')}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 order-1 xl:order-2">
              <QueueDisplay 
                queue={queue}
                highlightedIndex={highlightedIndex}
              />
            </div>
            <div className="xl:col-span-1 space-y-4 order-2 xl:order-1">
              <QueueControls 
                onEnqueue={enqueue}
                onDequeue={dequeue}
                onClear={clear}
                isAnimating={isAnimating}
                isFull={isFull}
                isEmpty={isEmpty}
              />
              <OperationFeedback 
                feedback={currentFeedback}
                isAnimating={isAnimating}
              />
              <QueueOperations operations={operations} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explanation">
          <InteractiveExplanation data={QUEUE_EXPLANATION_DATA} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
