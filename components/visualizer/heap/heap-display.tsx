"use client"

import dynamic from "next/dynamic"
import { HeapNode } from './types'

const BaseScene3D = dynamic(
  () => import('../shared/base-scene-3d').then(mod => ({ default: mod.BaseScene3D })),
  { ssr: false }
)

const TreeNode3D = dynamic(
  () => import('../binary-tree/tree-node-3d').then(mod => ({ default: mod.TreeNode3D })),
  { ssr: false }
)

const LinkedListLink3D = dynamic(
  () => import('../linked-list/linked-list-link-3d').then(mod => ({ default: mod.LinkedListLink3D })),
  { ssr: false }
)

interface HeapDisplayProps {
  heap: HeapNode | null
  highlightedNodes: string[]
}

export function HeapDisplay({ heap, highlightedNodes }: HeapDisplayProps) {
  
  const renderHeap = (
    node: HeapNode,
    x: number = 0,
    y: number = 0,
    level: number = 0,
    parentPosition?: [number, number, number]
  ): React.ReactNode[] => {
    const nodes: React.ReactNode[] = []
    const baseSpacing = 5
    const spacing = Math.pow(1.5, level) * baseSpacing
    const verticalSpacing = -2.5
    
    const currentPosition: [number, number, number] = [x, y, 0]
    
    nodes.push(
      <TreeNode3D
        key={node.id}
        value={node.value}
        position={currentPosition}
        isHighlighted={highlightedNodes.includes(node.id)}
      />
    )
    
    if (parentPosition) {
      nodes.push(
        <LinkedListLink3D
          key={`${node.id}-link`}
          start={parentPosition}
          end={currentPosition}
        />
      )
    }
    
    if (node.left) {
      nodes.push(...renderHeap(
        node.left, 
        x - spacing / Math.pow(2, level + 1), 
        y + verticalSpacing, 
        level + 1, 
        currentPosition
      ))
    }
    
    if (node.right) {
      nodes.push(...renderHeap(
        node.right, 
        x + spacing / Math.pow(2, level + 1), 
        y + verticalSpacing, 
        level + 1, 
        currentPosition
      ))
    }
    
    return nodes
  }

  return (
    <div className="w-full h-[350px] sm:h-[600px] bg-card rounded-lg overflow-hidden">
      <BaseScene3D>
        {heap && renderHeap(heap)}
      </BaseScene3D>
    </div>
  )
}
