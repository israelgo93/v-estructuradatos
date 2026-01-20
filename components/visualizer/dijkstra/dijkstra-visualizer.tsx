"use client"

import dynamic from "next/dynamic"
import { DijkstraControls } from "@/components/visualizer/dijkstra/dijkstra-controls"
import { DijkstraAnalysis } from "@/components/visualizer/dijkstra/dijkstra-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDijkstra } from "@/hooks/use-dijkstra"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { InteractiveExplanation } from "@/components/visualizer/shared/interactive-explanation"
import { DIJKSTRA_EXPLANATION_DATA } from "@/components/visualizer/shared/explanation-data"

const DijkstraDisplay = dynamic(
  () => import("@/components/visualizer/dijkstra/dijkstra-display").then(mod => ({ default: mod.DijkstraDisplay })),
  { ssr: false, loading: () => <Skeleton className="h-[500px] w-full rounded-xl" /> }
)

interface DijkstraVisualizerProps {
  content: React.ReactNode
}

export function DijkstraVisualizer({ content }: DijkstraVisualizerProps) {
  const { t } = useTranslation()
  const {
    graph,
    distances,
    path,
    currentNode,
    visitedNodes,
    isAnimating,
    addNode,
    addEdge,
    setStartNode,
    setEndNode,
    findShortestPath,
    clear,
    nextStep,
    previousStep,
    currentStep,
    totalSteps,
    loadExample,
    startNodeId,
    endNodeId,
    isAutoPlaying,
    toggleAutoPlay,
  } = useDijkstra()

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('common.dijkstra')}</h1>
        <p className="text-muted-foreground">
          {t('dijkstra.description')}
        </p>
      </div>

      <Tabs defaultValue="visualization" className="w-full space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex w-full min-w-max sm:grid sm:grid-cols-3 h-auto p-1 sm:h-10 sm:p-1">
            <TabsTrigger value="visualization" className="flex-1">{t('common.visualization')}</TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">{t('common.analysis')}</TabsTrigger>
            <TabsTrigger value="explanation" className="flex-1">{t('common.explanation')}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 order-1 lg:order-2">
              <DijkstraDisplay
                graph={graph}
                distances={distances}
                path={path}
                currentNode={currentNode}
                visitedNodes={visitedNodes}
              />
            </div>
            <div className="lg:col-span-2 order-2 lg:order-1">
              <DijkstraControls
                onAddNode={addNode}
                onAddEdge={addEdge}
                onSetStartNode={setStartNode}
                onSetEndNode={setEndNode}
                onFindPath={findShortestPath}
                onClear={clear}
                onNext={nextStep}
                onPrevious={previousStep}
                isAnimating={isAnimating}
                currentStep={currentStep}
                totalSteps={totalSteps}
                onLoadExample={loadExample}
                startNodeId={startNodeId}
                endNodeId={endNodeId}
                path={path}
                distances={distances}
                onAutoPlay={toggleAutoPlay}
                isAutoPlaying={isAutoPlaying}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <DijkstraAnalysis
            graph={graph}
            distances={distances}
            path={path}
            visitedNodes={visitedNodes}
          />
        </TabsContent>
        
        <TabsContent value="explanation">
          <InteractiveExplanation data={DIJKSTRA_EXPLANATION_DATA} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
