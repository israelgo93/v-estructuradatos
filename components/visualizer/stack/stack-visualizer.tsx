"use client"

import dynamic from "next/dynamic"
import { useState, useCallback } from "react"
import { StackControls } from "@/components/visualizer/stack/stack-controls"
import { StackOperations } from "@/components/visualizer/stack/stack-operations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStack } from "@/hooks/use-stack"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { OperationFeedback, useFeedback } from "@/components/visualizer/shared/operation-feedback"
import { InteractiveExplanation, STACK_EXPLANATION_DATA } from "@/components/visualizer/shared/interactive-explanation"
import { STACK_FEEDBACK_TEMPLATES } from "@/components/visualizer/shared/feedback-types"

const StackDisplay = dynamic(
  () => import("@/components/visualizer/stack/stack-display").then(mod => ({ default: mod.StackDisplay })),
  { ssr: false, loading: () => <Skeleton className="h-[600px] w-full rounded-xl" /> }
)

interface StackVisualizerProps {
  content: React.ReactNode
}

export function StackVisualizer({ content }: StackVisualizerProps) {
  const { t } = useTranslation()
  const { 
    stack,
    operations,
    isAnimating,
    highlightedIndex,
    push: originalPush,
    pop: originalPop,
    clear,
    isFull,
    isEmpty,
  } = useStack()

  const { currentFeedback, startFeedback, completeFeedback } = useFeedback()

  // Wrap push with feedback
  const push = useCallback(async (value: number) => {
    const template = STACK_FEEDBACK_TEMPLATES.push
    startFeedback({
      operationName: template.operationName,
      operationNameEs: template.operationNameEs,
      steps: template.getSteps(value, stack.length + 1),
      complexity: template.complexity
    })
    
    await originalPush(value)
    completeFeedback()
  }, [originalPush, startFeedback, completeFeedback, stack.length])

  // Wrap pop with feedback
  const pop = useCallback(async () => {
    if (stack.length === 0) return
    
    const topValue = stack[stack.length - 1].value
    const template = STACK_FEEDBACK_TEMPLATES.pop
    startFeedback({
      operationName: template.operationName,
      operationNameEs: template.operationNameEs,
      steps: template.getSteps(topValue, stack.length - 1),
      complexity: template.complexity
    })
    
    await originalPop()
    completeFeedback()
  }, [originalPop, startFeedback, completeFeedback, stack])

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('common.stack')}</h1>
        <p className="text-muted-foreground">
          {t('stack.description')}
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
              <StackDisplay 
                stack={stack}
                highlightedIndex={highlightedIndex}
              />
            </div>
            <div className="xl:col-span-1 space-y-4 order-2 xl:order-1">
              <StackControls 
                onPush={push}
                onPop={pop}
                onClear={clear}
                isAnimating={isAnimating}
                isFull={isFull}
                isEmpty={isEmpty}
              />
              <OperationFeedback 
                feedback={currentFeedback}
                isAnimating={isAnimating}
              />
              <StackOperations operations={operations} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explanation">
          <InteractiveExplanation data={STACK_EXPLANATION_DATA} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
