"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { BinaryTreeNode } from './types'
import { useTranslation } from "react-i18next"

const BaseScene3D = dynamic(
  () => import('../shared/base-scene-3d').then(mod => ({ default: mod.BaseScene3D })),
  { ssr: false }
)

const TreeNode3D = dynamic(
  () => import('./tree-node-3d').then(mod => ({ default: mod.TreeNode3D })),
  { ssr: false }
)

const LinkedListLink3D = dynamic(
  () => import('../linked-list/linked-list-link-3d').then(mod => ({ default: mod.LinkedListLink3D })),
  { ssr: false }
)

const Text3D = dynamic(
  () => import("@react-three/drei").then(mod => ({ default: mod.Text })),
  { ssr: false }
)

const Float = dynamic(
  () => import("@react-three/drei").then(mod => ({ default: mod.Float })),
  { ssr: false }
)

interface BinaryTreeDisplayProps {
  tree: BinaryTreeNode | null
  highlightedNodes: string[]
}

// Función auxiliar para calcular altura del árbol
function getTreeHeight(node: BinaryTreeNode | null): number {
  if (!node) return 0
  return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right))
}

// Función auxiliar para contar nodos
function countNodes(node: BinaryTreeNode | null): number {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

export function BinaryTreeDisplay({ tree, highlightedNodes }: BinaryTreeDisplayProps) {
	const { t } = useTranslation()
  
  // Calcular métricas del árbol para escalado dinámico
  const treeMetrics = useMemo(() => {
    const height = getTreeHeight(tree)
    const nodeCount = countNodes(tree)
    
    // Escalar basado en la altura y cantidad de nodos
    const nodeScale = height > 4 ? Math.max(0.5, 1 - (height - 4) * 0.1) : 1
    const baseSpacing = height > 4 ? Math.max(3, 5 - (height - 4) * 0.4) : 5
    const verticalSpacing = height > 4 ? Math.max(-1.8, -2.5 + (height - 4) * 0.15) : -2.5
    
    // Ajuste de cámara
    const cameraZ = Math.max(10, 8 + height * 1.5)
    const cameraY = Math.max(5, 3 + height * 0.8)
    
    return { height, nodeCount, nodeScale, baseSpacing, verticalSpacing, cameraZ, cameraY }
  }, [tree])
  
  const renderTree = (
    node: BinaryTreeNode,
    x: number = 0,
    y: number = 0,
    level: number = 0,
    parentPosition?: [number, number, number]
  ): React.ReactNode[] => {
    const nodes: React.ReactNode[] = []
    const { nodeScale, baseSpacing, verticalSpacing } = treeMetrics
    const spacing = Math.pow(1.5, level) * baseSpacing
    
    const currentPosition: [number, number, number] = [x, y, 0]
    
    nodes.push(
      <TreeNode3D
        key={node.id}
        value={node.value}
        position={currentPosition}
        isHighlighted={highlightedNodes.includes(node.id)}
        scale={nodeScale}
      />
    )
    
    if (parentPosition) {
      nodes.push(
        <LinkedListLink3D
          key={`${node.id}-link`}
          start={parentPosition}
          end={currentPosition}
          scale={nodeScale}
        />
      )
    }
    
    if (node.left) {
      nodes.push(...renderTree(
        node.left, 
        x - spacing / Math.pow(2, level + 1), 
        y + verticalSpacing, 
        level + 1, 
        currentPosition
      ))
    }
    
    if (node.right) {
      nodes.push(...renderTree(
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
    <div className="w-full h-[350px] sm:h-[600px] bg-gradient-to-b from-card via-card to-secondary/10 rounded-xl overflow-hidden border-2 border-primary/10 shadow-xl">
      <BaseScene3D cameraPosition={[0, treeMetrics.cameraY, treeMetrics.cameraZ]}>
        {tree ? (
          renderTree(tree)
        ) : (
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group position={[0, 0, 0]}>
              <Text3D
                position={[0, 0.3, 0]}
                fontSize={0.5}
                color="#6b7280"
                anchorX="center"
                anchorY="middle"
              >
                {t('visualizer.treeEmpty')}
              </Text3D>
              <Text3D
                position={[0, -0.3, 0]}
                fontSize={0.3}
                color="#4b5563"
                anchorX="center"
                anchorY="middle"
              >
                {t('visualizer.treeEmptyHint')}
              </Text3D>
            </group>
          </Float>
        )}
        
        {/* Info del árbol */}
        {tree && (
          <Float speed={1} floatIntensity={0.1}>
            <Text3D
              position={[0, -treeMetrics.height * Math.abs(treeMetrics.verticalSpacing) - 1.5, 2]}
              fontSize={0.3}
              color="#9ca3af"
              anchorX="center"
              anchorY="middle"
            >
              {`${t('analysis.height')}: ${treeMetrics.height} | ${t('analysis.nodes')}: ${treeMetrics.nodeCount}`}
            </Text3D>
          </Float>
        )}
      </BaseScene3D>
    </div>
  )
}
