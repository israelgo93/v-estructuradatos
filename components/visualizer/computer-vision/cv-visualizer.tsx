"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState, useCallback } from "react"
import type { HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision"
import { useStack } from "@/hooks/use-stack"
import { useQueue } from "@/hooks/use-queue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"
import { 
	Camera, CameraOff, Loader2, Hand, Circle, ArrowDown, ArrowUp, 
	Sparkles, Activity, Clock, Layers, Zap, AlertCircle, ArrowRight,
	BookOpen, Lightbulb, HelpCircle, CheckCircle2
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"

const StackDisplay = dynamic(
	() => import("../stack/stack-display").then(mod => ({ default: mod.StackDisplay })),
	{ ssr: false, loading: () => <Skeleton className="h-[600px] w-full rounded-xl" /> }
)

const QueueDisplay = dynamic(
	() => import("../queue/queue-display").then(mod => ({ default: mod.QueueDisplay })),
	{ ssr: false, loading: () => <Skeleton className="h-[600px] w-full rounded-xl" /> }
)

type GestureType = "OPEN" | "FIST" | "PEACE" | "THUMBS_UP" | null
type DataStructureType = "stack" | "queue"

interface ActionHistory {
	type: string
	value?: number
	timestamp: number
	gesture: GestureType
}

const GESTURE_COOLDOWN = 1500

// Funciones de detección de gestos
function euclideanDistance(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
	const dx = p1.x - p2.x
	const dy = p1.y - p2.y
	const dz = (p1.z || 0) - (p2.z || 0)
	return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function isFingerExtended(
	landmarks: NormalizedLandmark[],
	tipIndex: number,
	pipIndex: number,
	mcpIndex: number
): boolean {
	const wrist = landmarks[0]
	const tip = landmarks[tipIndex]
	const pip = landmarks[pipIndex]
	const mcp = landmarks[mcpIndex]
	
	const tipToWrist = euclideanDistance(tip, wrist)
	const pipToWrist = euclideanDistance(pip, wrist)
	const mcpToWrist = euclideanDistance(mcp, wrist)
	
	return tipToWrist > pipToWrist && pipToWrist > mcpToWrist * 0.9
}

function isThumbExtended(landmarks: NormalizedLandmark[]): boolean {
	const wrist = landmarks[0]
	const thumbTip = landmarks[4]
	const thumbIP = landmarks[3]
	const thumbMCP = landmarks[2]
	const indexMCP = landmarks[5]
	
	const tipToIndexMCP = euclideanDistance(thumbTip, indexMCP)
	const ipToIndexMCP = euclideanDistance(thumbIP, indexMCP)
	const tipToWrist = euclideanDistance(thumbTip, wrist)
	const mcpToWrist = euclideanDistance(thumbMCP, wrist)
	
	return tipToIndexMCP > ipToIndexMCP && tipToWrist > mcpToWrist
}

// Configuración de gestos por estructura de datos
const GESTURE_CONFIG = {
	stack: {
		OPEN: { action: "push", label: "PUSH", labelEs: "Insertar", color: "#22c55e" },
		FIST: { action: "pop", label: "POP", labelEs: "Extraer", color: "#ef4444" }
	},
	queue: {
		OPEN: { action: "enqueue", label: "ENQUEUE", labelEs: "Encolar", color: "#22c55e" },
		FIST: { action: "dequeue", label: "DEQUEUE", labelEs: "Desencolar", color: "#ef4444" }
	}
}

export function CVVisualizer() {
	const { t, i18n } = useTranslation()
	const isSpanish = i18n.language === 'es'
	
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null)
	const [isCameraOn, setIsCameraOn] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [currentGesture, setCurrentGesture] = useState<GestureType>(null)
	const [actionHistory, setActionHistory] = useState<ActionHistory[]>([])
	const [cooldownProgress, setCooldownProgress] = useState(100)
	const [debugInfo, setDebugInfo] = useState<string>("")
	const [selectedStructure, setSelectedStructure] = useState<DataStructureType>("stack")
	const [lastFeedback, setLastFeedback] = useState<string>("")
	
	// Hooks para ambas estructuras
	const stackHook = useStack(15)
	const queueHook = useQueue(15)
	
	const lastGestureRef = useRef<GestureType>(null)
	const lastGestureTimeRef = useRef<number>(0)
	const lastVideoTimeRef = useRef<number>(-1)
	const animationFrameRef = useRef<number | null>(null)
	const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null)

	// Estadísticas por estructura
	const [stats, setStats] = useState({
		stack: { pushCount: 0, popCount: 0 },
		queue: { enqueueCount: 0, dequeueCount: 0 }
	})

	useEffect(() => {
		async function initMediaPipe() {
			try {
				setLoadError(null)
				const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision")
				
				const vision = await FilesetResolver.forVisionTasks(
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
				)
				
				let landmarker: HandLandmarker | null = null
				
				try {
					landmarker = await HandLandmarker.createFromOptions(vision, {
						baseOptions: {
							modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
							delegate: "GPU"
						},
						runningMode: "VIDEO",
						numHands: 1,
						minHandDetectionConfidence: 0.5,
						minHandPresenceConfidence: 0.5,
						minTrackingConfidence: 0.5
					})
				} catch (gpuError) {
					landmarker = await HandLandmarker.createFromOptions(vision, {
						baseOptions: {
							modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
							delegate: "CPU"
						},
						runningMode: "VIDEO",
						numHands: 1,
						minHandDetectionConfidence: 0.5,
						minHandPresenceConfidence: 0.5,
						minTrackingConfidence: 0.5
					})
				}
				
				setHandLandmarker(landmarker)
				setIsLoading(false)
			} catch (error) {
				console.error("Error initializing MediaPipe:", error)
				setLoadError(isSpanish 
					? "Error al cargar MediaPipe. Verifica tu conexión a internet."
					: "Error loading MediaPipe. Check your internet connection."
				)
				setIsLoading(false)
			}
		}
		initMediaPipe()

		return () => {
			if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
			if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current)
		}
	}, [isSpanish])

	const startCooldown = useCallback(() => {
		setCooldownProgress(0)
		if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current)
		
		const startTime = Date.now()
		cooldownIntervalRef.current = setInterval(() => {
			const elapsed = Date.now() - startTime
			const progress = Math.min((elapsed / GESTURE_COOLDOWN) * 100, 100)
			setCooldownProgress(progress)
			
			if (progress >= 100 && cooldownIntervalRef.current) {
				clearInterval(cooldownIntervalRef.current)
			}
		}, 50)
	}, [])

	const drawHandLandmarks = useCallback((landmarks: NormalizedLandmark[], gesture: GestureType) => {
		const canvas = canvasRef.current
		const video = videoRef.current
		if (!canvas || !video) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		const connections = [
			[0, 1], [1, 2], [2, 3], [3, 4],
			[0, 5], [5, 6], [6, 7], [7, 8],
			[0, 9], [9, 10], [10, 11], [11, 12],
			[0, 13], [13, 14], [14, 15], [15, 16],
			[0, 17], [17, 18], [18, 19], [19, 20],
			[5, 9], [9, 13], [13, 17]
		]

		const gestureConfig = GESTURE_CONFIG[selectedStructure]
		const color = gesture && gestureConfig[gesture as keyof typeof gestureConfig] 
			? gestureConfig[gesture as keyof typeof gestureConfig].color 
			: "#3b82f6"
		
		ctx.shadowColor = color
		ctx.shadowBlur = 20
		ctx.strokeStyle = color
		ctx.lineWidth = 5

		connections.forEach(([start, end]) => {
			const startPoint = landmarks[start]
			const endPoint = landmarks[end]
			ctx.beginPath()
			ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
			ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
			ctx.stroke()
		})

		landmarks.forEach((landmark, index) => {
			const x = landmark.x * canvas.width
			const y = landmark.y * canvas.height
			const isTip = [4, 8, 12, 16, 20].includes(index)
			const radius = index === 0 ? 14 : isTip ? 12 : 8
			
			ctx.beginPath()
			ctx.arc(x, y, radius, 0, 2 * Math.PI)
			ctx.fillStyle = isTip ? color : color
			ctx.fill()
			ctx.strokeStyle = "white"
			ctx.lineWidth = 3
			ctx.stroke()
		})
		
		ctx.shadowBlur = 0
	}, [selectedStructure])

	const executeAction = useCallback(async (gesture: GestureType) => {
		const config = GESTURE_CONFIG[selectedStructure]
		if (!gesture || !config[gesture as keyof typeof config]) return

		const actionConfig = config[gesture as keyof typeof config]
		const newValue = Math.floor(Math.random() * 100)

		if (selectedStructure === "stack") {
			if (gesture === "OPEN") {
				await stackHook.push(newValue)
				setStats(prev => ({ ...prev, stack: { ...prev.stack, pushCount: prev.stack.pushCount + 1 }}))
				setLastFeedback(isSpanish 
					? `✅ PUSH: Valor ${newValue} añadido a la cima de la pila`
					: `✅ PUSH: Value ${newValue} added to stack top`
				)
			} else if (gesture === "FIST") {
				await stackHook.pop()
				setStats(prev => ({ ...prev, stack: { ...prev.stack, popCount: prev.stack.popCount + 1 }}))
				setLastFeedback(isSpanish 
					? `✅ POP: Elemento superior eliminado de la pila`
					: `✅ POP: Top element removed from stack`
				)
			}
		} else if (selectedStructure === "queue") {
			if (gesture === "OPEN") {
				await queueHook.enqueue(newValue)
				setStats(prev => ({ ...prev, queue: { ...prev.queue, enqueueCount: prev.queue.enqueueCount + 1 }}))
				setLastFeedback(isSpanish 
					? `✅ ENQUEUE: Valor ${newValue} añadido al final de la cola`
					: `✅ ENQUEUE: Value ${newValue} added to queue rear`
				)
			} else if (gesture === "FIST") {
				await queueHook.dequeue()
				setStats(prev => ({ ...prev, queue: { ...prev.queue, dequeueCount: prev.queue.dequeueCount + 1 }}))
				setLastFeedback(isSpanish 
					? `✅ DEQUEUE: Elemento del frente eliminado de la cola`
					: `✅ DEQUEUE: Front element removed from queue`
				)
			}
		}

		const action: ActionHistory = { 
			type: actionConfig.action, 
			value: gesture === "OPEN" ? newValue : undefined, 
			timestamp: Date.now(),
			gesture 
		}
		setActionHistory(prev => [action, ...prev].slice(0, 10))
	}, [selectedStructure, stackHook, queueHook, isSpanish])

	const detectGestures = useCallback(() => {
		const video = videoRef.current
		if (!handLandmarker || !video || !isCameraOn) return

		if (video.readyState < 2 || video.currentTime === lastVideoTimeRef.current) {
			animationFrameRef.current = requestAnimationFrame(detectGestures)
			return
		}

		lastVideoTimeRef.current = video.currentTime
		const now = performance.now()
		
		try {
			const results = handLandmarker.detectForVideo(video, now)

			if (results.landmarks && results.landmarks.length > 0) {
				const landmarks = results.landmarks[0]
				
				const thumbExtended = isThumbExtended(landmarks)
				const indexExtended = isFingerExtended(landmarks, 8, 6, 5)
				const middleExtended = isFingerExtended(landmarks, 12, 10, 9)
				const ringExtended = isFingerExtended(landmarks, 16, 14, 13)
				const pinkyExtended = isFingerExtended(landmarks, 20, 18, 17)
				
				const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length
				const closedCount = 5 - extendedCount
				
				setDebugInfo(isSpanish ? `Dedos: ${extendedCount}/5 abiertos` : `Fingers: ${extendedCount}/5 open`)
				
				let detectedGesture: GestureType = null
				
				if (extendedCount >= 4) {
					detectedGesture = "OPEN"
				} else if (closedCount >= 4) {
					detectedGesture = "FIST"
				}
				
				setCurrentGesture(detectedGesture)
				drawHandLandmarks(landmarks, detectedGesture)

				const currentTime = Date.now()
				if (currentTime - lastGestureTimeRef.current > GESTURE_COOLDOWN) {
					if (detectedGesture && detectedGesture !== lastGestureRef.current) {
						executeAction(detectedGesture)
						lastGestureRef.current = detectedGesture
						lastGestureTimeRef.current = currentTime
						startCooldown()
					} else if (detectedGesture === null) {
						lastGestureRef.current = null
					}
				}
			} else {
				setCurrentGesture(null)
				setDebugInfo(isSpanish ? "No se detecta mano" : "No hand detected")
				if (canvasRef.current) {
					const ctx = canvasRef.current.getContext("2d")
					if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
				}
			}
		} catch (error) {
			console.error("Error in gesture detection:", error)
		}

		if (isCameraOn) {
			animationFrameRef.current = requestAnimationFrame(detectGestures)
		}
	}, [handLandmarker, isCameraOn, drawHandLandmarks, executeAction, startCooldown, isSpanish])

	useEffect(() => {
		if (isCameraOn && handLandmarker) {
			animationFrameRef.current = requestAnimationFrame(detectGestures)
		}
		
		return () => {
			if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
		}
	}, [isCameraOn, handLandmarker, detectGestures])

	const toggleCamera = async () => {
		if (isCameraOn) {
			if (videoRef.current && videoRef.current.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream
				stream.getTracks().forEach(track => track.stop())
			}
			setIsCameraOn(false)
			setCurrentGesture(null)
			setDebugInfo("")
		} else {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ 
					video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } 
				})
				if (videoRef.current) {
					videoRef.current.srcObject = stream
					videoRef.current.addEventListener("loadeddata", () => setIsCameraOn(true), { once: true })
				}
			} catch (err) {
				setLoadError(isSpanish 
					? "No se pudo acceder a la cámara. Verifica los permisos."
					: "Could not access camera. Check permissions."
				)
			}
		}
	}

	const getGestureDisplay = () => {
		if (!currentGesture) return null
		const config = GESTURE_CONFIG[selectedStructure]
		const gestureInfo = config[currentGesture as keyof typeof config]
		if (!gestureInfo) return null
		
		return {
			label: isSpanish ? gestureInfo.labelEs : gestureInfo.label,
			color: gestureInfo.color,
			icon: currentGesture === "OPEN" ? <Hand className="h-5 w-5" /> : <Circle className="h-5 w-5" />
		}
	}

	const gestureDisplay = getGestureDisplay()

	return (
		<div className="container mx-auto p-4 md:p-6 max-w-[1800px]">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<motion.div 
						className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
						animate={{ scale: [1, 1.05, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						<Sparkles className="h-8 w-8 text-primary" />
					</motion.div>
					<h1 className="text-3xl font-bold tracking-tight">
						{isSpanish ? "Aprendizaje con Visión Artificial" : "Computer Vision Learning"}
					</h1>
				</div>
				<p className="text-muted-foreground text-lg max-w-2xl">
					{isSpanish 
						? "Aprende estructuras de datos usando gestos de tu mano. ¡Interactúa con la visualización 3D!"
						: "Learn data structures using hand gestures. Interact with the 3D visualization!"
					}
				</p>
			</div>

			{/* Structure Selector */}
			<div className="mb-6">
				<Tabs value={selectedStructure} onValueChange={(v) => setSelectedStructure(v as DataStructureType)}>
					<div className="overflow-x-auto pb-2">
						<TabsList className="flex w-full min-w-max sm:grid sm:grid-cols-2 h-auto p-1 sm:h-10 sm:p-1 max-w-md">
							<TabsTrigger value="stack" className="gap-2 flex-1">
								<Layers className="h-4 w-4" />
								{isSpanish ? "Pila (Stack)" : "Stack"}
							</TabsTrigger>
							<TabsTrigger value="queue" className="gap-2 flex-1">
								<ArrowRight className="h-4 w-4" />
								{isSpanish ? "Cola (Queue)" : "Queue"}
							</TabsTrigger>
						</TabsList>
					</div>
				</Tabs>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
				{/* Panel de Visualización 3D */}
				<div className="xl:col-span-3 min-h-[600px] order-1 xl:order-2">
					{selectedStructure === "stack" ? (
						<StackDisplay stack={stackHook.stack} highlightedIndex={stackHook.highlightedIndex} />
					) : (
						<QueueDisplay queue={queueHook.queue} highlightedIndex={queueHook.highlightedIndex} />
					)}
				</div>

				{/* Panel de Cámara */}
				<div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
					<Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
						<div className="relative aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
							{isLoading && (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-20 gap-4">
									<Loader2 className="h-12 w-12 animate-spin text-primary" />
									<span className="text-base font-medium">
										{isSpanish ? "Cargando MediaPipe..." : "Loading MediaPipe..."}
									</span>
								</div>
							)}
							
							{loadError && (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-20 gap-4 p-6">
									<AlertCircle className="h-12 w-12 text-destructive" />
									<span className="text-base font-medium text-center text-destructive">{loadError}</span>
								</div>
							)}
							
							<video 
								ref={videoRef} 
								autoPlay 
								playsInline 
								muted
								className="w-full h-full object-cover"
								style={{ transform: "scaleX(-1)" }}
							/>
							<canvas
								ref={canvasRef}
								className="absolute inset-0 w-full h-full pointer-events-none"
								style={{ transform: "scaleX(-1)" }}
							/>
							
							{!isCameraOn && !isLoading && !loadError && (
								<div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
									<motion.div 
										className="p-6 rounded-full bg-muted/30 backdrop-blur-sm border border-white/10"
										animate={{ scale: [1, 1.1, 1] }}
										transition={{ duration: 2, repeat: Infinity }}
									>
										<CameraOff className="h-16 w-16 text-muted-foreground" />
									</motion.div>
									<p className="text-muted-foreground text-lg">
										{isSpanish ? "Inicia la cámara para comenzar" : "Start camera to begin"}
									</p>
								</div>
							)}

							{/* Indicador de gesto */}
							<AnimatePresence>
								{isCameraOn && gestureDisplay && (
									<motion.div
										initial={{ opacity: 0, scale: 0.5, y: 20 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.5, y: -20 }}
										className="absolute top-4 right-4"
									>
										<Badge 
											className="px-4 py-2 text-lg font-bold gap-3 border-2"
											style={{ 
												backgroundColor: `${gestureDisplay.color}20`,
												borderColor: `${gestureDisplay.color}50`,
												color: gestureDisplay.color
											}}
										>
											{gestureDisplay.icon}
											{gestureDisplay.label}
										</Badge>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Debug info */}
							{isCameraOn && debugInfo && (
								<div className="absolute bottom-12 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-mono">
									{debugInfo}
								</div>
							)}

							{/* Cooldown bar */}
							{isCameraOn && cooldownProgress < 100 && (
								<div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50">
									<motion.div 
										className="h-full bg-gradient-to-r from-primary to-primary/70"
										initial={{ width: "0%" }}
										animate={{ width: `${cooldownProgress}%` }}
									/>
								</div>
							)}
						</div>
					</Card>

					<Button 
						onClick={toggleCamera} 
						disabled={isLoading || !!loadError}
						size="lg"
						className="w-full gap-3 text-lg h-14 font-semibold"
						variant={isCameraOn ? "destructive" : "default"}
					>
						{isCameraOn ? (
							<><CameraOff className="h-6 w-6" />{isSpanish ? "Detener Cámara" : "Stop Camera"}</>
						) : (
							<><Camera className="h-6 w-6" />{isSpanish ? "Iniciar Cámara" : "Start Camera"}</>
						)}
					</Button>

					{/* Feedback del último gesto */}
					<AnimatePresence>
						{lastFeedback && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
							>
								<Card className="bg-green-500/10 border-green-500/30">
									<CardContent className="p-3 flex items-center gap-2">
										<CheckCircle2 className="h-5 w-5 text-green-500" />
										<span className="text-sm font-medium">{lastFeedback}</span>
									</CardContent>
								</Card>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Estadísticas */}
					<Card className="p-4 bg-gradient-to-br from-background to-secondary/20 border-2">
						<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
							<Activity className="h-5 w-5 text-primary" />
							{isSpanish ? "Estadísticas" : "Statistics"}
						</h3>
						<div className="grid grid-cols-3 gap-3">
							{selectedStructure === "stack" ? (
								<>
									<div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
										<ArrowDown className="h-4 w-4 text-green-500 mx-auto mb-1" />
										<p className="text-2xl font-bold text-green-500">{stats.stack.pushCount}</p>
										<p className="text-xs text-muted-foreground">PUSH</p>
									</div>
									<div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
										<ArrowUp className="h-4 w-4 text-red-500 mx-auto mb-1" />
										<p className="text-2xl font-bold text-red-500">{stats.stack.popCount}</p>
										<p className="text-xs text-muted-foreground">POP</p>
									</div>
									<div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
										<Layers className="h-4 w-4 text-primary mx-auto mb-1" />
										<p className="text-2xl font-bold text-primary">{stackHook.stack.length}</p>
										<p className="text-xs text-muted-foreground">{isSpanish ? "Tamaño" : "Size"}</p>
									</div>
								</>
							) : (
								<>
									<div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
										<ArrowRight className="h-4 w-4 text-green-500 mx-auto mb-1" />
										<p className="text-2xl font-bold text-green-500">{stats.queue.enqueueCount}</p>
										<p className="text-xs text-muted-foreground">ENQUEUE</p>
									</div>
									<div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
										<ArrowUp className="h-4 w-4 text-red-500 mx-auto mb-1" />
										<p className="text-2xl font-bold text-red-500">{stats.queue.dequeueCount}</p>
										<p className="text-xs text-muted-foreground">DEQUEUE</p>
									</div>
									<div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
										<Layers className="h-4 w-4 text-primary mx-auto mb-1" />
										<p className="text-2xl font-bold text-primary">{queueHook.queue.length}</p>
										<p className="text-xs text-muted-foreground">{isSpanish ? "Tamaño" : "Size"}</p>
									</div>
								</>
							)}
						</div>
					</Card>

					{/* Instrucciones */}
					<Card className="p-4 bg-gradient-to-br from-secondary/50 to-secondary/20 border-2">
						<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-primary" />
							{isSpanish ? "Instrucciones" : "Instructions"}
						</h3>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
								<div className="p-2 rounded-full bg-green-500/20">
									<Hand className="h-5 w-5 text-green-500" />
								</div>
								<div className="flex-1">
									<span className="font-bold text-green-600 dark:text-green-400">
										{selectedStructure === "stack" ? "PUSH" : "ENQUEUE"}
									</span>
									<p className="text-sm text-muted-foreground">
										{isSpanish 
											? "Abre la mano (4-5 dedos) para añadir un elemento" 
											: "Open hand (4-5 fingers) to add element"
										}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
								<div className="p-2 rounded-full bg-red-500/20">
									<Circle className="h-5 w-5 text-red-500" />
								</div>
								<div className="flex-1">
									<span className="font-bold text-red-600 dark:text-red-400">
										{selectedStructure === "stack" ? "POP" : "DEQUEUE"}
									</span>
									<p className="text-sm text-muted-foreground">
										{isSpanish 
											? "Cierra la mano (puño) para eliminar un elemento" 
											: "Close hand (fist) to remove element"
										}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2 mt-4 pt-3 border-t text-sm text-muted-foreground">
							<Clock className="h-4 w-4" />
							{isSpanish ? "Espera 1.5 segundos entre gestos" : "Wait 1.5 seconds between gestures"}
						</div>
					</Card>

					{/* Concepto educativo */}
					<Card className="p-4 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-2 border-yellow-500/20">
						<h3 className="font-semibold text-base mb-2 flex items-center gap-2">
							<Lightbulb className="h-5 w-5 text-yellow-500" />
							{isSpanish ? "¿Sabías que...?" : "Did you know...?"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{selectedStructure === "stack" 
								? (isSpanish 
									? "Las pilas se usan en la función 'deshacer' de los editores de texto. ¡Cada acción se apila y puedes deshacerlas en orden inverso!"
									: "Stacks are used in text editors for 'undo'. Each action is pushed and you can undo them in reverse order!"
								)
								: (isSpanish
									? "Las colas se usan en las colas de impresión. ¡Los documentos se imprimen en el orden en que fueron enviados (FIFO)!"
									: "Queues are used in print queues. Documents print in the order they were sent (FIFO)!"
								)
							}
						</p>
					</Card>
				</div>

				{/* Panel de Visualización 3D */}
				<div className="xl:col-span-3 min-h-[600px]">
					{selectedStructure === "stack" ? (
						<StackDisplay stack={stackHook.stack} highlightedIndex={stackHook.highlightedIndex} />
					) : (
						<QueueDisplay queue={queueHook.queue} highlightedIndex={queueHook.highlightedIndex} />
					)}
				</div>
			</div>
		</div>
	)
}
