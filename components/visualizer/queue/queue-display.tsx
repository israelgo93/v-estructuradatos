"use client"

import dynamic from "next/dynamic"
import { QueueNode } from "./types"
import { useTranslation } from "react-i18next"

const BaseScene3D = dynamic(
	() => import("../shared/base-scene-3d").then(mod => ({ default: mod.BaseScene3D })),
	{ ssr: false }
)

const QueueElement3D = dynamic(
	() => import("./queue-element-3d").then(mod => ({ default: mod.QueueElement3D })),
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

interface QueueDisplayProps {
	queue: QueueNode[]
	highlightedIndex: number | null
}

export function QueueDisplay({ queue, highlightedIndex }: QueueDisplayProps) {
	const { t } = useTranslation()
	// Escalado dinámico similar al Stack
	const maxVisibleWidth = 18
	const defaultElementWidth = 2.2
	const elementSpacing = queue.length > 8 
		? Math.max(1.2, maxVisibleWidth / queue.length) 
		: defaultElementWidth
	
	// Escala de los elementos basada en el espacio disponible
	const elementScale = queue.length > 8 
		? Math.max(0.5, 1 - (queue.length - 8) * 0.05) 
		: 1
	
	// Calcular el ancho total y centrar
	const totalWidth = (queue.length - 1) * elementSpacing
	const offsetX = -totalWidth / 2

	// Ajustar cámara dinámicamente
	const cameraZ = Math.max(12, 10 + queue.length * 0.4)
	const cameraY = queue.length > 10 ? 5 : 4

	// Tamaño de la pista basado en la cola
	const trackWidth = Math.max(22, totalWidth + 6)

	return (
		<div className="relative h-[350px] sm:h-[600px] w-full bg-gradient-to-b from-card via-card to-secondary/10 rounded-xl overflow-hidden border-2 border-primary/10 shadow-xl">
			<BaseScene3D showSparkles={queue.length > 0} cameraPosition={[0, cameraY, cameraZ]}>
				{/* Pista principal de la cola */}
				<mesh position={[0, -0.9, 0]} receiveShadow>
					<boxGeometry args={[trackWidth, 0.15, 3]} />
					<meshStandardMaterial 
						color="#1e1b4b" 
						roughness={0.1}
						metalness={0.9}
					/>
				</mesh>

				{/* Bordes luminosos de la pista */}
				<mesh position={[0, -0.82, 1.55]}>
					<boxGeometry args={[trackWidth, 0.05, 0.08]} />
					<meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.4} />
				</mesh>
				<mesh position={[0, -0.82, -1.55]}>
					<boxGeometry args={[trackWidth, 0.05, 0.08]} />
					<meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.4} />
				</mesh>

				{/* Indicadores de esquina */}
				{[[-trackWidth/2 + 0.5, -1.55], [trackWidth/2 - 0.5, -1.55], 
				  [-trackWidth/2 + 0.5, 1.55], [trackWidth/2 - 0.5, 1.55]].map(([x, z], i) => (
					<mesh key={i} position={[x, -0.75, z]}>
						<cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
						<meshStandardMaterial 
							color="#22c55e" 
							emissive="#22c55e" 
							emissiveIntensity={0.3}
						/>
					</mesh>
				))}
				
				{/* Elementos de la cola con escalado dinámico */}
				{queue.map((node, i) => (
					<QueueElement3D
						key={node.id}
						value={node.value}
						position={[offsetX + i * elementSpacing, 0, 0]}
						isHighlighted={highlightedIndex === node.index}
						isFront={i === 0}
						isRear={i === queue.length - 1}
						scale={elementScale}
					/>
				))}

				{/* Etiquetas flotantes con posición dinámica */}
				{queue.length > 0 && (
					<>
						<Float speed={2} rotationIntensity={0} floatIntensity={0.4}>
							<Text3D
								position={[offsetX, 2, 0]}
								fontSize={Math.min(0.45, 0.35 + elementScale * 0.1)}
								color="#22c55e"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.frontLabel')}
							</Text3D>
						</Float>
						<Float speed={2} rotationIntensity={0} floatIntensity={0.4}>
							<Text3D
								position={[offsetX + totalWidth, 2, 0]}
								fontSize={Math.min(0.45, 0.35 + elementScale * 0.1)}
								color="#8b5cf6"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.rearLabel')}
							</Text3D>
						</Float>
					</>
				)}

				{/* Indicador de cola vacía */}
				{queue.length === 0 && (
					<Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
						<group position={[0, 1.5, 0]}>
							<Text3D
								position={[0, 0.3, 0]}
								fontSize={0.5}
								color="#6b7280"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.queueEmpty')}
							</Text3D>
							<Text3D
								position={[0, -0.3, 0]}
								fontSize={0.3}
								color="#4b5563"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.queueEmptyHint')}
							</Text3D>
						</group>
					</Float>
				)}

				{/* Contador de elementos */}
				<Float speed={1} floatIntensity={0.1}>
					<Text3D
						position={[0, -2, 2]}
						fontSize={0.35}
						color="#9ca3af"
						anchorX="center"
						anchorY="middle"
					>
						{`${t('common.size')}: ${queue.length}`}
					</Text3D>
				</Float>
			</BaseScene3D>
		</div>
	)
}
