"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

function FloatingShape({ position, color, speed, size }: { position: [number, number, number], color: string, speed: number, size: number }) {
	const mesh = useRef<THREE.Mesh>(null)
	
	useFrame((state) => {
		if (!mesh.current) return
		const t = state.clock.getElapsedTime() * speed
		mesh.current.position.y = position[1] + Math.sin(t) * 0.5
		mesh.current.rotation.x = t * 0.2
		mesh.current.rotation.y = t * 0.3
	})

	return (
		<Float speed={2} rotationIntensity={1} floatIntensity={1}>
			<Sphere ref={mesh} position={position} args={[size, 32, 32]}>
				<MeshDistortMaterial
					color={color}
					speed={2}
					distort={0.4}
					radius={1}
				/>
			</Sphere>
		</Float>
	)
}

function Rig() {
	return useFrame((state) => {
		state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 2, 0.05)
		state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 2, 0.05)
		state.camera.lookAt(0, 0, 0)
	})
}

export function Hero3D() {
	const shapes = useMemo(() => [
		{ position: [-4, 2, -2] as [number, number, number], color: "#4f46e5", speed: 0.5, size: 0.8 },
		{ position: [4, -1, -1] as [number, number, number], color: "#818cf8", speed: 0.7, size: 0.6 },
		{ position: [-2, -3, 0] as [number, number, number], color: "#6366f1", speed: 0.4, size: 0.4 },
		{ position: [2, 3, -3] as [number, number, number], color: "#4338ca", speed: 0.6, size: 0.5 },
	], [])

	return (
		<div className="absolute inset-0 -z-10 h-full w-full pointer-events-none sm:pointer-events-auto">
			<Canvas shadows dpr={[1, 2]}>
				<PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} intensity={1} />
				<spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#4f46e5" />
				
				{shapes.map((shape, i) => (
					<FloatingShape key={i} {...shape} />
				))}
				
				<Rig />
			</Canvas>
		</div>
	)
}
