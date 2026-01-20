"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, Grid, Sparkles } from "@react-three/drei"
import { ReactNode, Suspense } from "react"
import * as THREE from "three"

interface BaseScene3DProps {
	children: ReactNode
	showGrid?: boolean
	showSparkles?: boolean
	cameraPosition?: [number, number, number]
}

function SceneContent({ children, showGrid = false, showSparkles = false }: Omit<BaseScene3DProps, 'cameraPosition'>) {
	return (
		<>
			{/* Iluminación mejorada */}
			<ambientLight intensity={0.4} />
			<spotLight 
				position={[10, 15, 10]} 
				angle={0.25} 
				penumbra={1} 
				intensity={1.5} 
				castShadow 
				shadow-mapSize={[2048, 2048]}
			/>
			<spotLight 
				position={[-10, 10, -10]} 
				angle={0.3} 
				penumbra={1} 
				intensity={0.5} 
				color="#4f46e5"
			/>
			<pointLight position={[0, 10, 0]} intensity={0.3} color="#fbbf24" />
			
			<Suspense fallback={null}>
				{children}
				<Environment preset="city" />
			</Suspense>

			{/* Grid decorativo */}
			{showGrid && (
				<Grid
					position={[0, -1.01, 0]}
					args={[20, 20]}
					cellSize={0.5}
					cellThickness={0.5}
					cellColor="#4f46e5"
					sectionSize={2}
					sectionThickness={1}
					sectionColor="#6366f1"
					fadeDistance={25}
					fadeStrength={1}
					followCamera={false}
				/>
			)}

			{/* Partículas ambientales */}
			{showSparkles && (
				<Sparkles
					count={50}
					scale={15}
					size={2}
					speed={0.3}
					color="#4f46e5"
					opacity={0.5}
				/>
			)}
			
			{/* Sombras de contacto mejoradas */}
			<ContactShadows 
				position={[0, -1, 0]} 
				opacity={0.5} 
				scale={25} 
				blur={2.5} 
				far={5} 
				color="#1e1b4b"
			/>
		</>
	)
}

export function BaseScene3D({ 
	children, 
	showGrid = false, 
	showSparkles = false,
	cameraPosition = [0, 5, 10] 
}: BaseScene3DProps) {
	return (
		<div className="w-full h-full min-h-[350px] sm:min-h-[500px] bg-gradient-to-b from-background via-background to-secondary/10 rounded-xl overflow-hidden border shadow-inner cursor-grab active:cursor-grabbing">
			<Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
				<PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
				<OrbitControls 
					enablePan={true} 
					enableZoom={true} 
					minPolarAngle={0.2} 
					maxPolarAngle={Math.PI / 2.1}
					minDistance={5}
					maxDistance={25}
					enableDamping
					dampingFactor={0.05}
					// Configuración de mouse: click izquierdo para mover (pan), click derecho para rotar
					mouseButtons={{
						LEFT: THREE.MOUSE.PAN,
						MIDDLE: THREE.MOUSE.DOLLY,
						RIGHT: THREE.MOUSE.ROTATE
					}}
					// Configuración táctil
					touches={{
						ONE: THREE.TOUCH.PAN,
						TWO: THREE.TOUCH.DOLLY_ROTATE
					}}
				/>
				<SceneContent showGrid={showGrid} showSparkles={showSparkles}>
					{children}
				</SceneContent>
			</Canvas>
		</div>
	)
}
