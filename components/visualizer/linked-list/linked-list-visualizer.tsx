"use client"

import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkedListControls } from "@/components/visualizer/linked-list/linked-list-controls"
import { LinkedListOperations } from "@/components/visualizer/linked-list/linked-list-operations"
import { useLinkedList } from "@/hooks/use-linked-list"
import { ListType } from "./types"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { InteractiveExplanation } from "@/components/visualizer/shared/interactive-explanation"
import { LINKED_LIST_EXPLANATION_DATA } from "@/components/visualizer/shared/explanation-data"

const LinkedListDisplay = dynamic(
  () => import("@/components/visualizer/linked-list/linked-list-display").then(mod => ({ default: mod.LinkedListDisplay })),
  { ssr: false, loading: () => <Skeleton className="h-[500px] w-full rounded-xl" /> }
)

const LIST_TYPES: { value: ListType; label: string }[] = [
  { value: 'SLL', label: 'SLL' },
  { value: 'DLL', label: 'DLL' },
  { value: 'CSLL', label: 'CSLL' },
  { value: 'CDLL', label: 'CDLL' },
]

interface LinkedListVisualizerProps {
  content: React.ReactNode
}

export function LinkedListVisualizer({ content }: LinkedListVisualizerProps) {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('common.linkedList')}</h1>
        <p className="text-muted-foreground">
          {t('linkedList.description')}
        </p>
      </div>

      <Tabs defaultValue="SLL" className="w-full space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex w-full min-w-max gap-2 sm:grid sm:grid-cols-5 sm:gap-0 h-auto p-1 sm:h-10 sm:p-1">
            {LIST_TYPES.map(type => (
              <TabsTrigger key={type.value} value={type.value} className="shrink-0">
                {type.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="explanation" className="shrink-0">{t('common.explanation')}</TabsTrigger>
          </TabsList>
        </div>

        {LIST_TYPES.map(type => (
          <TabsContent key={type.value} value={type.value} className="space-y-6">
            <LinkedListContent type={type.value} />
          </TabsContent>
        ))}
        
        <TabsContent value="explanation">
          <InteractiveExplanation data={LINKED_LIST_EXPLANATION_DATA} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LinkedListContent({ type }: { type: ListType }) {
  const {
    list,
    operations,
    animationState,
    isAnimating,
    insertFront,
    insertBack,
    deleteFront,
    deleteBack,
    reverse,
  } = useLinkedList(type)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 order-1 xl:order-2">
        <LinkedListDisplay 
          list={list}
          highlightedNodes={animationState.highlightedNodes}
          message={animationState.message}
        />
      </div>
      <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
        <LinkedListControls 
          onInsertFront={insertFront}
          onInsertBack={insertBack}
          onDeleteFront={deleteFront}
          onDeleteBack={deleteBack}
          onReverse={reverse}
          isAnimating={isAnimating}
          isEmpty={!list.head}
        />
        <LinkedListOperations operations={operations} />
      </div>
    </div>
  )
}
