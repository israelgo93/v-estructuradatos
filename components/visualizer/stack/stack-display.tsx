"use client"

import dynamic from "next/dynamic"
import { StackNode } from "./types"
import { useTranslation } from "react-i18next"

const BaseScene3D = dynamic(
	() => import("../shared/base-scene-3d").then(mod => ({ default: mod.BaseScene3D })),
	{ ssr: false }
)

const StackElement3D = dynamic(
	() => import("./stack-element-3d").then(mod => ({ default: mod.StackElement3D })),
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

interface StackDisplayProps {
	stack: StackNode[]
	highlightedIndex: number | null
}

export function StackDisplay({ stack, highlightedIndex }: StackDisplayProps) {
	const { t } = useTranslation()
	// Parámetros de escalado dinámico
	const maxVisibleHeight = 12
	const defaultElementHeight = 1.1
	const elementHeight = stack.length > 8 
		? Math.max(0.3, maxVisibleHeight / stack.length) 
		: defaultElementHeight
	
	const spacing = elementHeight * 1.2
	const totalHeight = stack.length * spacing
	
	// Centrado vertical: el stack se expande hacia arriba y abajo desde el centro
	// o se mantiene sobre la base si hay pocos elementos
	const offsetY = stack.length > 8 ? -(totalHeight / 2) + spacing / 2 : 0
	const basePosY = stack.length > 8 ? offsetY - spacing : -1.2

	// Calcular la posición de la cámara basada en el volumen ocupado
	const cameraDistance = Math.max(14, 10 + totalHeight * 0.6)
	const cameraHeight = stack.length > 8 ? 0 : Math.max(6, 4 + stack.length * 0.5)
	
	return (
		<div className="relative h-full min-h-[350px] sm:min-h-[600px] w-full bg-gradient-to-b from-card via-card to-secondary/10 rounded-xl overflow-hidden border-2 border-primary/10 shadow-xl">
			<BaseScene3D 
				showSparkles={stack.length > 0}
				cameraPosition={[0, cameraHeight, cameraDistance]}
			>
				{/* Base de la pila mejorada con efecto de vidrio */}
				<mesh position={[0, basePosY, 0]} receiveShadow>
					<boxGeometry args={[6, 0.4, 6]} />
					<meshStandardMaterial 
						color="#1e1b4b" 
						roughness={0.1}
						metalness={0.95}
					/>
				</mesh>

				{/* Bordes decorativos de la base con gradiente */}
				<mesh position={[0, basePosY + 0.2, 0]}>
					<boxGeometry args={[6.3, 0.08, 6.3]} />
					<meshStandardMaterial 
						color="#4f46e5" 
						emissive="#4f46e5" 
						emissiveIntensity={0.5}
					/>
				</mesh>

				{/* Marco exterior de la base */}
				<mesh position={[0, basePosY + 0.05, 0]}>
					<boxGeometry args={[6.5, 0.1, 6.5]} />
					<meshStandardMaterial 
						color="#312e81" 
						metalness={0.9}
						roughness={0.2}
					/>
				</mesh>

				{/* Indicadores de esquina en la base */}
				{[[-2.8, -2.8], [2.8, -2.8], [-2.8, 2.8], [2.8, 2.8]].map(([x, z], i) => (
					<mesh key={i} position={[x, basePosY + 0.25, z]}>
						<cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
						<meshStandardMaterial 
							color="#22c55e" 
							emissive="#22c55e" 
							emissiveIntensity={0.3}
						/>
					</mesh>
				))}
				
				{/* Elementos de la pila */}
				{stack.map((node, i) => (
					<StackElement3D
						key={node.id}
						value={node.value}
						position={[0, offsetY + i * spacing, 0]}
						isHighlighted={highlightedIndex === node.index}
						isTop={i === stack.length - 1}
						index={i}
						total={stack.length}
						elementHeight={elementHeight}
					/>
				))}

				{/* Etiqueta TOP flotante mejorada */}
				{stack.length > 0 && (
					<Float speed={3} rotationIntensity={0} floatIntensity={0.6}>
						<group position={[-4.5, offsetY + (stack.length - 1) * spacing + 0.3, 0]}>
							<Text3D
								fontSize={Math.min(0.6, elementHeight * 0.8 + 0.2)}
								color="#22c55e"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.topLabel')}
							</Text3D>
						</group>
					</Float>
				)}

				{/* Indicador de índice para el stack */}
				{stack.map((_, i) => (
					<Float key={`idx-${i}`} speed={1} floatIntensity={0.2}>
						<Text3D
							position={[4.2, offsetY + i * spacing + 0.2, 0]}
							fontSize={Math.min(0.35, elementHeight * 0.5 + 0.1)}
							color="#6b7280"
							anchorX="center"
							anchorY="middle"
						>
							[{i}]
						</Text3D>
					</Float>
				))}

				{/* Indicador de pila vacía mejorado */}
				{stack.length === 0 && (
					<Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
						<group position={[0, 2, 0]}>
							<Text3D
								position={[0, 0.5, 0]}
								fontSize={0.6}
								color="#6b7280"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.stackEmpty')}
							</Text3D>
							<Text3D
								position={[0, -0.3, 0]}
								fontSize={0.35}
								color="#4b5563"
								anchorX="center"
								anchorY="middle"
							>
								{t('visualizer.stackEmptyHint')}
							</Text3D>
						</group>
					</Float>
				)}

				{/* Contador de elementos */}
				<Float speed={1} floatIntensity={0.1}>
					<Text3D
						position={[0, basePosY - 1.5, 3]}
						fontSize={0.4}
						color="#9ca3af"
						anchorX="center"
						anchorY="middle"
					>
						{`${t('common.size')}: ${stack.length}`}
					</Text3D>
				</Float>
			</BaseScene3D>
		</div>
	)
}
