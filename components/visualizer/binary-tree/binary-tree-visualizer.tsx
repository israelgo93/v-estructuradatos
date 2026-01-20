"use client"

import dynamic from "next/dynamic"
import { BinaryTreeControls } from "./binary-tree-controls"
import { BinaryTreeAnalysis } from "./binary-tree-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBinaryTree } from "@/hooks/use-binary-tree"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { InteractiveExplanation } from "@/components/visualizer/shared/interactive-explanation"
import { BINARY_TREE_EXPLANATION_DATA } from "@/components/visualizer/shared/explanation-data"

const BinaryTreeDisplay = dynamic(
  () => import("./binary-tree-display").then(mod => ({ default: mod.BinaryTreeDisplay })),
  { ssr: false, loading: () => <Skeleton className="h-[500px] w-full rounded-xl" /> }
)

interface BinaryTreeVisualizerProps {
  content: React.ReactNode
}

export function BinaryTreeVisualizer({ content }: BinaryTreeVisualizerProps) {
  const { t } = useTranslation()
  const { 
    tree, 
    highlightedNodes, 
    insert, 
    inorderTraversal, 
    preorderTraversal, 
    postorderTraversal, 
    clear,
    isAnimating,
    traversalHistory
  } = useBinaryTree()

  const handleTraversal = async (type: "inorder" | "preorder" | "postorder") => {
    switch (type) {
      case "inorder":
        await inorderTraversal()
        break
      case "preorder":
        await preorderTraversal()
        break
      case "postorder":
        await postorderTraversal()
        break
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('common.binaryTree')}</h1>
        <p className="text-muted-foreground">{t('binaryTree.description')}</p>
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 order-1 xl:order-2">
              <BinaryTreeDisplay 
                tree={tree}
                highlightedNodes={highlightedNodes}
              />
            </div>
            <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
              <BinaryTreeControls 
                onInsert={insert}
                onClear={clear}
                onTraversal={handleTraversal}
                isAnimating={isAnimating}
                traversalHistory={traversalHistory}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <BinaryTreeAnalysis tree={tree} />
        </TabsContent>
        
        <TabsContent value="explanation">
          <InteractiveExplanation data={BINARY_TREE_EXPLANATION_DATA} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
