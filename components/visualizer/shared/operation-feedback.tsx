"use client"

import { useState, useEffect } from "react"
import type { ComponentType, SVGProps } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { 
	CheckCircle2, 
	AlertCircle, 
	ArrowRight, 
	Code2, 
	Clock, 
	Cpu,
	ChevronDown,
	ChevronUp,
	Lightbulb,
	GitCompare,
	Variable,
	Link2,
	Navigation,
	Info
} from "lucide-react"
import type { FeedbackStep, FeedbackStepType, OperationFeedback } from "./feedback-types"

interface OperationFeedbackProps {
	feedback: OperationFeedback | null
	isAnimating?: boolean
	showComplexity?: boolean
	className?: string
}

const stepTypeConfig: Record<FeedbackStepType, { icon: ComponentType<SVGProps<SVGSVGElement>>; color: string; bgColor: string }> = {
	info: { icon: Info, color: "text-blue-500", bgColor: "bg-blue-500/10" },
	comparison: { icon: GitCompare, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
	assignment: { icon: Variable, color: "text-purple-500", bgColor: "bg-purple-500/10" },
	"pointer-change": { icon: Link2, color: "text-orange-500", bgColor: "bg-orange-500/10" },
	traversal: { icon: Navigation, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
	success: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
	warning: { icon: AlertCircle, color: "text-red-500", bgColor: "bg-red-500/10" },
	complexity: { icon: Cpu, color: "text-indigo-500", bgColor: "bg-indigo-500/10" }
}

export function OperationFeedback({ 
	feedback, 
	isAnimating = false,
	showComplexity = true,
	className = ""
}: OperationFeedbackProps) {
	const { t, i18n } = useTranslation()
	const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
	const [showAllSteps, setShowAllSteps] = useState(false)
	const isSpanish = i18n.language === 'es'

	const toggleStep = (stepId: string) => {
		setExpandedSteps(prev => {
			const newSet = new Set(prev)
			if (newSet.has(stepId)) {
				newSet.delete(stepId)
			} else {
				newSet.add(stepId)
			}
			return newSet
		})
	}

	if (!feedback) {
		return (
			<Card className={`${className} border-dashed`}>
				<CardContent className="flex flex-col items-center justify-center py-8 text-center">
					<Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground text-sm">
						{isSpanish 
							? "Realiza una operación para ver el feedback paso a paso"
							: "Perform an operation to see step-by-step feedback"
						}
					</p>
				</CardContent>
			</Card>
		)
	}

	const visibleSteps = showAllSteps 
		? feedback.steps 
		: feedback.steps.slice(0, Math.max(feedback.currentStepIndex + 1, 1))

	return (
		<Card className={`${className} overflow-hidden`}>
			<CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg flex items-center gap-2">
						<Code2 className="h-5 w-5 text-primary" />
						{isSpanish ? feedback.operationNameEs : feedback.operationName}
					</CardTitle>
					{isAnimating && (
						<Badge variant="outline" className="animate-pulse">
							<Clock className="h-3 w-3 mr-1" />
							{isSpanish ? "Ejecutando..." : "Running..."}
						</Badge>
					)}
					{feedback.isComplete && (
						<Badge className="bg-green-500/20 text-green-600 border-green-500/30">
							<CheckCircle2 className="h-3 w-3 mr-1" />
							{isSpanish ? "Completado" : "Complete"}
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="p-0">
				{/* Complexity Info */}
				{showComplexity && (
					<div className="px-4 py-3 bg-secondary/30 border-b flex flex-wrap gap-4">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span className="text-xs text-muted-foreground">
								{isSpanish ? "Tiempo:" : "Time:"}
							</span>
							<Badge variant="secondary" className="font-mono text-xs">
								{feedback.complexity.time}
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<Cpu className="h-4 w-4 text-muted-foreground" />
							<span className="text-xs text-muted-foreground">
								{isSpanish ? "Espacio:" : "Space:"}
							</span>
							<Badge variant="secondary" className="font-mono text-xs">
								{feedback.complexity.space}
							</Badge>
						</div>
					</div>
				)}

				{/* Steps */}
				<ScrollArea className="max-h-[350px]">
					<div className="p-4 space-y-2">
						<AnimatePresence mode="popLayout">
							{visibleSteps.map((step, index) => {
								const config = stepTypeConfig[step.type]
								const Icon = config.icon
								const isCurrentStep = index === feedback.currentStepIndex && !feedback.isComplete
								const isExpanded = expandedSteps.has(step.id)

								return (
									<motion.div
										key={step.id}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										transition={{ duration: 0.2, delay: index * 0.05 }}
										className={`
											rounded-lg border transition-all duration-200
											${isCurrentStep ? 'ring-2 ring-primary/50 border-primary/30' : 'border-border/50'}
											${config.bgColor}
										`}
									>
										<button
											onClick={() => toggleStep(step.id)}
											className="w-full p-3 flex items-start gap-3 text-left hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
										>
											<div className={`mt-0.5 p-1.5 rounded-full ${config.bgColor}`}>
												<Icon className={`h-4 w-4 ${config.color}`} />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="font-medium text-sm">
														{isSpanish ? step.titleEs : step.title}
													</span>
													{isCurrentStep && (
														<Badge variant="outline" className="text-[10px] px-1.5 py-0 animate-pulse">
															{isSpanish ? "Actual" : "Current"}
														</Badge>
													)}
												</div>
												<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
													{isSpanish ? step.descriptionEs : step.description}
												</p>
											</div>
											{step.code && (
												<div className="text-muted-foreground">
													{isExpanded ? (
														<ChevronUp className="h-4 w-4" />
													) : (
														<ChevronDown className="h-4 w-4" />
													)}
												</div>
											)}
										</button>

										{/* Expanded Code View */}
										<AnimatePresence>
											{isExpanded && step.code && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.2 }}
													className="overflow-hidden"
												>
													<div className="px-3 pb-3">
														<pre className="bg-slate-900 text-slate-100 p-3 rounded-md text-xs font-mono overflow-x-auto">
															<code>{step.code}</code>
														</pre>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								)
							})}
						</AnimatePresence>

						{/* Show More/Less Button */}
						{feedback.steps.length > 1 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowAllSteps(!showAllSteps)}
								className="w-full mt-2 text-xs"
							>
								{showAllSteps ? (
									<>
										<ChevronUp className="h-3 w-3 mr-1" />
										{isSpanish ? "Mostrar menos" : "Show less"}
									</>
								) : (
									<>
										<ChevronDown className="h-3 w-3 mr-1" />
										{isSpanish 
											? `Mostrar todos (${feedback.steps.length} pasos)` 
											: `Show all (${feedback.steps.length} steps)`
										}
									</>
								)}
							</Button>
						)}
					</div>
				</ScrollArea>

				{/* Complexity Explanation */}
				{showComplexity && feedback.isComplete && (
					<div className="px-4 py-3 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-t">
						<div className="flex items-start gap-2">
							<Lightbulb className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
							<p className="text-xs text-muted-foreground">
								{isSpanish ? feedback.complexity.explanationEs : feedback.complexity.explanation}
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// Hook para crear feedback fácilmente
export function useFeedback() {
	const [currentFeedback, setCurrentFeedback] = useState<OperationFeedback | null>(null)
	const [feedbackHistory, setFeedbackHistory] = useState<OperationFeedback[]>([])

	const startFeedback = (feedback: Omit<OperationFeedback, 'currentStepIndex' | 'isComplete'>) => {
		const newFeedback: OperationFeedback = {
			...feedback,
			currentStepIndex: 0,
			isComplete: false
		}
		setCurrentFeedback(newFeedback)
	}

	const advanceStep = () => {
		setCurrentFeedback(prev => {
			if (!prev) return null
			const newIndex = prev.currentStepIndex + 1
			const isComplete = newIndex >= prev.steps.length
			
			if (isComplete) {
				setFeedbackHistory(history => [prev, ...history].slice(0, 10))
			}
			
			return {
				...prev,
				currentStepIndex: Math.min(newIndex, prev.steps.length - 1),
				isComplete
			}
		})
	}

	const completeFeedback = () => {
		setCurrentFeedback(prev => {
			if (!prev) return null
			const completed = {
				...prev,
				currentStepIndex: prev.steps.length - 1,
				isComplete: true
			}
			setFeedbackHistory(history => [completed, ...history].slice(0, 10))
			return completed
		})
	}

	const clearFeedback = () => {
		setCurrentFeedback(null)
	}

	return {
		currentFeedback,
		feedbackHistory,
		startFeedback,
		advanceStep,
		completeFeedback,
		clearFeedback
	}
}
