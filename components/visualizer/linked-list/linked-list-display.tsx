"use client"

import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { LinkedList } from "./types"
import { useTranslation } from "react-i18next"

const BaseScene3D = dynamic(
	() => import("../shared/base-scene-3d").then(mod => ({ default: mod.BaseScene3D })),
	{ ssr: false }
)

const LinkedListNode3D = dynamic(
	() => import("./linked-list-node-3d").then(mod => ({ default: mod.LinkedListNode3D })),
	{ ssr: false }
)

const LinkedListLink3D = dynamic(
	() => import("./linked-list-link-3d").then(mod => ({ default: mod.LinkedListLink3D })),
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

interface LinkedListDisplayProps {
	list: LinkedList
	highlightedNodes: string[]
	message: string
	format?: (value: string) => React.ReactNode
}

export function LinkedListDisplay({ 
	list, 
	highlightedNodes, 
	message,
}: LinkedListDisplayProps) {
	const { t } = useTranslation()

	const getNodeChain = () => {
		const chain: string[] = []
		let current = list.head
		const visited = new Set<string>()

		while (current) {
			const node = list.nodes.get(current)
			if (!node) break
			
			chain.push(current)
			visited.add(current)
			
			if (node.next && visited.has(node.next)) {
				break
			}
			
			current = node.next
		}

		return chain
	}

	const nodeChain = getNodeChain()
	
	// Escalado dinámico
	const maxVisibleWidth = 20
	const defaultSpacing = 3.5
	const nodeSpacing = nodeChain.length > 6 
		? Math.max(2.2, maxVisibleWidth / nodeChain.length) 
		: defaultSpacing
	
	// Escala de nodos basada en cantidad
	const nodeScale = nodeChain.length > 6 
		? Math.max(0.6, 1 - (nodeChain.length - 6) * 0.04) 
		: 1

	// Cálculo del ancho total
	const totalWidth = (nodeChain.length - 1) * nodeSpacing
	const offsetX = -totalWidth / 2

	// Ajuste de cámara dinámico
	const cameraZ = Math.max(12, 10 + nodeChain.length * 0.5)
	const cameraY = nodeChain.length > 8 ? 4 : 3

	// Tamaño de la plataforma
	const platformWidth = Math.max(totalWidth + 6, 10)

	return (
		<Card className="p-0 relative h-[350px] sm:h-[600px] overflow-hidden border-2 border-primary/10 rounded-xl shadow-xl bg-gradient-to-b from-card via-card to-secondary/10">
			{message && (
				<div className="absolute top-4 left-4 z-10 text-sm font-medium bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border shadow-lg">
					{message}
				</div>
			)}

			<BaseScene3D showSparkles={nodeChain.length > 0} cameraPosition={[0, cameraY, cameraZ]}>
				{/* Plataforma base */}
				<mesh position={[0, -2, 0]} receiveShadow>
					<boxGeometry args={[platformWidth, 0.2, 6]} />
					<meshStandardMaterial color="#1e1b4b" roughness={0.1} metalness={0.9} />
				</mesh>

				{/* Bordes luminosos */}
				<mesh position={[0, -1.88, 3.05]}>
					<boxGeometry args={[platformWidth, 0.05, 0.08]} />
					<meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.4} />
				</mesh>
				<mesh position={[0, -1.88, -3.05]}>
					<boxGeometry args={[platformWidth, 0.05, 0.08]} />
					<meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.4} />
				</mesh>

				{nodeChain.length === 0 && (
					<Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
						<group position={[0, 0.5, 0]}>
							<Text3D
								position={[0, 0.3, 0]}
								fontSize={0.5}
								color="#6b7280"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.listEmpty')}
							</Text3D>
							<Text3D
								position={[0, -0.3, 0]}
								fontSize={0.3}
								color="#4b5563"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.listEmptyHint')}
							</Text3D>
						</group>
					</Float>
				)}

				{nodeChain.map((nodeId, index) => {
					const node = list.nodes.get(nodeId)!
					const position: [number, number, number] = [offsetX + index * nodeSpacing, 0, 0]
					const isHead = index === 0
					const isTail = index === nodeChain.length - 1
					const nextPosition: [number, number, number] = [offsetX + (index + 1) * nodeSpacing, 0, 0]
					
					return (
						<group key={nodeId}>
							<LinkedListNode3D
								value={node.value}
								position={position}
								isHighlighted={highlightedNodes.includes(nodeId)}
								isHead={isHead}
								isTail={isTail}
								scale={nodeScale}
							/>
							
							{/* Enlace al siguiente nodo */}
							{index < nodeChain.length - 1 && (
								<LinkedListLink3D
									start={position}
									end={nextPosition}
									scale={nodeScale}
								/>
							)}

							{/* Etiqueta HEAD */}
							{isHead && (
								<Float speed={2} rotationIntensity={0} floatIntensity={0.4}>
									<Text3D
										position={[position[0], 2.2 * nodeScale, 0]}
										fontSize={0.4 * nodeScale}
										color="#22c55e"
										anchorX="center"
										anchorY="middle"
									>
									{t('visualizer.headLabel')}
									</Text3D>
								</Float>
							)}

							{/* Etiqueta TAIL */}
							{isTail && !isHead && (
								<Float speed={2} rotationIntensity={0} floatIntensity={0.4}>
									<Text3D
										position={[position[0], 2.2 * nodeScale, 0]}
										fontSize={0.4 * nodeScale}
										color="#f59e0b"
										anchorX="center"
										anchorY="middle"
									>
									{t('visualizer.tailLabel')}
									</Text3D>
								</Float>
							)}
						</group>
					)
				})}

				{/* Contador de nodos */}
				{nodeChain.length > 0 && (
					<Float speed={1} floatIntensity={0.1}>
						<Text3D
							position={[0, -3, 2]}
							fontSize={0.35}
							color="#9ca3af"
							anchorX="center"
							anchorY="middle"
						>
						{`${t('common.size')}: ${nodeChain.length}`}
						</Text3D>
					</Float>
				)}
			</BaseScene3D>
		</Card>
	)
}
