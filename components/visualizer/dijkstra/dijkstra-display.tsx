"use client"

import dynamic from "next/dynamic"
import { Graph } from '@/hooks/use-dijkstra'

const BaseScene3D = dynamic(
  () => import('../shared/base-scene-3d').then(mod => ({ default: mod.BaseScene3D })),
  { ssr: false }
)

const GraphNode3D = dynamic(
  () => import('./graph-node-3d').then(mod => ({ default: mod.GraphNode3D })),
  { ssr: false }
)

const LinkedListLink3D = dynamic(
  () => import('../linked-list/linked-list-link-3d').then(mod => ({ default: mod.LinkedListLink3D })),
  { ssr: false }
)

const Text3D = dynamic(
  () => import('@react-three/drei').then(mod => ({ default: mod.Text })),
  { ssr: false }
)

interface DijkstraDisplayProps {
  graph: Graph
  distances: Map<string, number>
  path: string[]
  currentNode: string | null
  visitedNodes: Set<string>
}

export function DijkstraDisplay({
  graph,
  distances,
  path,
  currentNode,
  visitedNodes,
}: DijkstraDisplayProps) {

  const getPosition = (x: number, y: number): [number, number, number] => {
    // Scaling down for 3D coordinates
    return [x / 50 - 5, 0, y / 50 - 5]
  }

  return (
    <div className="h-[350px] sm:h-[600px] bg-card rounded-lg overflow-hidden">
      <BaseScene3D>
        {/* Edges */}
        {graph.edges.map(edge => {
          const sourceNode = graph.nodes.find(n => n.id === edge.source)
          const targetNode = graph.nodes.find(n => n.id === edge.target)
          if (!sourceNode || !targetNode) return null

          const isPathEdge = path.some((node, index) => {
            const nextNode = path[index + 1]
            return (
              nextNode && 
              ((edge.source === node && edge.target === nextNode) ||
               (edge.target === node && edge.source === nextNode))
            )
          })

          const start = getPosition(sourceNode.x, sourceNode.y)
          const end = getPosition(targetNode.x, targetNode.y)
          const midpoint: [number, number, number] = [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 0.3,
            (start[2] + end[2]) / 2
          ]

          return (
            <group key={`${edge.source}-${edge.target}`}>
              <LinkedListLink3D
                start={start}
                end={end}
              />
              <Text3D
                position={midpoint}
                fontSize={0.2}
                color={isPathEdge ? "#22c55e" : "#94a3b8"}
              >
                {edge.weight}
              </Text3D>
            </group>
          )
        })}

        {/* Nodes */}
        {graph.nodes.map(node => (
          <GraphNode3D
            key={node.id}
            id={node.id}
            label={node.id}
            position={getPosition(node.x, node.y)}
            isVisited={visitedNodes.has(node.id)}
            isCurrent={node.id === currentNode}
            isPath={path.includes(node.id)}
            distance={distances.get(node.id) || Infinity}
          />
        ))}
      </BaseScene3D>
    </div>
  )
}
