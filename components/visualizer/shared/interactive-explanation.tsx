"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import {
	ChevronDown,
	ChevronRight,
	BookOpen,
	Code2,
	Lightbulb,
	CheckCircle2,
	XCircle,
	HelpCircle,
	Clock,
	Cpu,
	Zap,
	Target,
	Award
} from "lucide-react"

// Tipos para las explicaciones
export interface ConceptSection {
	id: string
	title: string
	titleEs: string
	content: string
	contentEs: string
	code?: string
	complexity?: {
		time: string
		space: string
	}
	tips?: string[]
	tipsEs?: string[]
}

export interface QuizQuestion {
	id: string
	question: string
	questionEs: string
	options: string[]
	optionsEs: string[]
	correctIndex: number
	explanation: string
	explanationEs: string
}

export interface ExplanationData {
	title: string
	titleEs: string
	description: string
	descriptionEs: string
	concepts: ConceptSection[]
	quiz?: QuizQuestion[]
	useCases?: { title: string; titleEs: string; description: string; descriptionEs: string }[]
	comparisons?: { 
		structure: string
		structureEs: string
		pros: string[]
		prosEs: string[]
		cons: string[]
		consEs: string[]
	}[]
}

interface InteractiveExplanationProps {
	data: ExplanationData
	className?: string
}

export function InteractiveExplanation({ data, className = "" }: InteractiveExplanationProps) {
	const { i18n } = useTranslation()
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([data.concepts[0]?.id]))
	const [quizState, setQuizState] = useState<{
		currentQuestion: number
		answers: (number | null)[]
		showResults: boolean
	}>({
		currentQuestion: 0,
		answers: data.quiz?.map(() => null) || [],
		showResults: false
	})

	const isSpanish = i18n.language === 'es'

	const toggleSection = (sectionId: string) => {
		setExpandedSections(prev => {
			const newSet = new Set(prev)
			if (newSet.has(sectionId)) {
				newSet.delete(sectionId)
			} else {
				newSet.add(sectionId)
			}
			return newSet
		})
	}

	const handleQuizAnswer = (optionIndex: number) => {
		setQuizState(prev => {
			const newAnswers = [...prev.answers]
			newAnswers[prev.currentQuestion] = optionIndex
			return { ...prev, answers: newAnswers }
		})
	}

	const nextQuestion = () => {
		if (data.quiz && quizState.currentQuestion < data.quiz.length - 1) {
			setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
		} else {
			setQuizState(prev => ({ ...prev, showResults: true }))
		}
	}

	const resetQuiz = () => {
		setQuizState({
			currentQuestion: 0,
			answers: data.quiz?.map(() => null) || [],
			showResults: false
		})
	}

	const correctAnswers = data.quiz?.filter((q, i) => quizState.answers[i] === q.correctIndex).length || 0

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold flex flex-wrap items-center gap-2">
					<BookOpen className="h-6 w-6 text-primary" />
					{isSpanish ? data.titleEs : data.title}
				</h2>
				<p className="text-muted-foreground mt-1">
					{isSpanish ? data.descriptionEs : data.description}
				</p>
			</div>

			{/* Concepts Accordion */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold flex items-center gap-2">
					<Lightbulb className="h-5 w-5 text-yellow-500" />
					{isSpanish ? "Conceptos Clave" : "Key Concepts"}
				</h3>

				{data.concepts.map((concept) => {
					const isExpanded = expandedSections.has(concept.id)
					
					return (
						<Card key={concept.id} className="overflow-hidden">
							<button
								onClick={() => toggleSection(concept.id)}
								className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-secondary/50 transition-colors"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className={`p-2 rounded-lg ${isExpanded ? 'bg-primary/10' : 'bg-secondary'}`}>
										<Code2 className={`h-4 w-4 ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
									</div>
									<span className="font-medium break-words">
										{isSpanish ? concept.titleEs : concept.title}
									</span>
								</div>
								{isExpanded ? (
									<ChevronDown className="h-5 w-5 text-muted-foreground" />
								) : (
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								)}
							</button>

							<AnimatePresence>
								{isExpanded && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
									<CardContent className="pt-0 pb-4 px-4 space-y-4">
											<p className="text-sm text-muted-foreground leading-relaxed">
												{isSpanish ? concept.contentEs : concept.content}
											</p>

											{concept.code && (
											<pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono overflow-x-auto max-w-full">
													<code>{concept.code}</code>
												</pre>
											)}

											{concept.complexity && (
												<div className="flex flex-wrap gap-3 pt-2">
													<div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full">
														<Clock className="h-4 w-4 text-blue-500" />
														<span className="text-xs font-medium">
															{isSpanish ? "Tiempo:" : "Time:"} {concept.complexity.time}
														</span>
													</div>
													<div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full">
														<Cpu className="h-4 w-4 text-purple-500" />
														<span className="text-xs font-medium">
															{isSpanish ? "Espacio:" : "Space:"} {concept.complexity.space}
														</span>
													</div>
												</div>
											)}

											{concept.tips && concept.tips.length > 0 && (
												<div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
													<div className="flex items-center gap-2 mb-2">
														<Zap className="h-4 w-4 text-yellow-500" />
														<span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
															{isSpanish ? "Consejos" : "Tips"}
														</span>
													</div>
													<ul className="text-xs text-muted-foreground space-y-1">
														{(isSpanish ? concept.tipsEs : concept.tips)?.map((tip, i) => (
															<li key={i} className="flex items-start gap-2">
																<span className="text-yellow-500">•</span>
																{tip}
															</li>
														))}
													</ul>
												</div>
											)}
										</CardContent>
									</motion.div>
								)}
							</AnimatePresence>
						</Card>
					)
				})}
			</div>

			{/* Use Cases */}
			{data.useCases && data.useCases.length > 0 && (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<Target className="h-5 w-5 text-green-500" />
						{isSpanish ? "Casos de Uso" : "Use Cases"}
					</h3>
					<div className="grid gap-3 md:grid-cols-2">
						{data.useCases.map((useCase, i) => (
							<Card key={i} className="bg-green-500/5 border-green-500/20">
								<CardContent className="p-4">
									<h4 className="font-medium text-green-600 dark:text-green-400 mb-1">
										{isSpanish ? useCase.titleEs : useCase.title}
									</h4>
									<p className="text-xs text-muted-foreground">
										{isSpanish ? useCase.descriptionEs : useCase.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Comparisons */}
			{data.comparisons && data.comparisons.length > 0 && (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<Cpu className="h-5 w-5 text-indigo-500" />
						{isSpanish ? "Comparativas" : "Comparisons"}
					</h3>
					<div className="grid gap-4">
						{data.comparisons.map((comp, i) => (
							<Card key={i}>
								<CardHeader className="pb-2">
									<CardTitle className="text-base">
										{isSpanish ? comp.structureEs : comp.structure}
									</CardTitle>
								</CardHeader>
								<CardContent className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Badge className="bg-green-500/20 text-green-600 border-green-500/30">
											{isSpanish ? "Ventajas" : "Pros"}
										</Badge>
										<ul className="text-xs space-y-1">
											{(isSpanish ? comp.prosEs : comp.pros).map((pro, j) => (
												<li key={j} className="flex items-start gap-2">
													<CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
													{pro}
												</li>
											))}
										</ul>
									</div>
									<div className="space-y-2">
										<Badge className="bg-red-500/20 text-red-600 border-red-500/30">
											{isSpanish ? "Desventajas" : "Cons"}
										</Badge>
										<ul className="text-xs space-y-1">
											{(isSpanish ? comp.consEs : comp.cons).map((con, j) => (
												<li key={j} className="flex items-start gap-2">
													<XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
													{con}
												</li>
											))}
										</ul>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Quiz Section */}
			{data.quiz && data.quiz.length > 0 && (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<HelpCircle className="h-5 w-5 text-primary" />
						{isSpanish ? "Comprueba tu Conocimiento" : "Test Your Knowledge"}
					</h3>

					<Card className="overflow-hidden">
						{!quizState.showResults ? (
							<>
								<CardHeader className="bg-primary/5">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										<CardTitle className="text-base">
											{isSpanish ? "Pregunta" : "Question"} {quizState.currentQuestion + 1}/{data.quiz.length}
										</CardTitle>
										<Badge variant="outline" className="w-fit">
											{correctAnswers}/{data.quiz.length} {isSpanish ? "correctas" : "correct"}
										</Badge>
									</div>
									<CardDescription>
										{isSpanish 
											? data.quiz[quizState.currentQuestion].questionEs 
											: data.quiz[quizState.currentQuestion].question
										}
									</CardDescription>
								</CardHeader>
								<CardContent className="p-4 space-y-3">
									{(isSpanish 
										? data.quiz[quizState.currentQuestion].optionsEs 
										: data.quiz[quizState.currentQuestion].options
									).map((option, i) => {
										const isSelected = quizState.answers[quizState.currentQuestion] === i
										const isCorrect = data.quiz![quizState.currentQuestion].correctIndex === i
										const showResult = quizState.answers[quizState.currentQuestion] !== null

										return (
											<button
												key={i}
												onClick={() => handleQuizAnswer(i)}
												disabled={showResult}
												className={`
													w-full p-3 text-left rounded-lg border-2 transition-all text-sm
													${isSelected 
														? showResult
															? isCorrect 
																? 'border-green-500 bg-green-500/10' 
																: 'border-red-500 bg-red-500/10'
															: 'border-primary bg-primary/10'
														: showResult && isCorrect
															? 'border-green-500 bg-green-500/5'
															: 'border-border hover:border-primary/50 hover:bg-secondary/50'
													}
												`}
											>
												<div className="flex items-center gap-3">
													<span className={`
														w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
														${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
													`}>
														{String.fromCharCode(65 + i)}
													</span>
													<span>{option}</span>
													{showResult && isSelected && (
														isCorrect 
															? <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
															: <XCircle className="h-4 w-4 text-red-500 ml-auto" />
													)}
													{showResult && !isSelected && isCorrect && (
														<CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
													)}
												</div>
											</button>
										)
									})}

									{quizState.answers[quizState.currentQuestion] !== null && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className="mt-4 p-3 bg-secondary/50 rounded-lg"
										>
											<p className="text-xs text-muted-foreground">
												<span className="font-medium text-foreground">
													{isSpanish ? "Explicación: " : "Explanation: "}
												</span>
												{isSpanish 
													? data.quiz![quizState.currentQuestion].explanationEs
													: data.quiz![quizState.currentQuestion].explanation
												}
											</p>
										</motion.div>
									)}

									{quizState.answers[quizState.currentQuestion] !== null && (
										<Button onClick={nextQuestion} className="w-full mt-2">
											{quizState.currentQuestion < data.quiz!.length - 1 
												? (isSpanish ? "Siguiente Pregunta" : "Next Question")
												: (isSpanish ? "Ver Resultados" : "See Results")
											}
										</Button>
									)}
								</CardContent>
							</>
						) : (
							<CardContent className="p-6 text-center">
								<Award className={`h-16 w-16 mx-auto mb-4 ${
									correctAnswers === data.quiz.length 
										? 'text-yellow-500' 
										: correctAnswers >= data.quiz.length / 2 
											? 'text-green-500' 
											: 'text-orange-500'
								}`} />
								<h4 className="text-xl font-bold mb-2">
									{correctAnswers === data.quiz.length 
										? (isSpanish ? "¡Perfecto!" : "Perfect!")
										: correctAnswers >= data.quiz.length / 2
											? (isSpanish ? "¡Bien hecho!" : "Well done!")
											: (isSpanish ? "Sigue practicando" : "Keep practicing")
									}
								</h4>
								<p className="text-muted-foreground mb-4">
									{isSpanish 
										? `Respondiste correctamente ${correctAnswers} de ${data.quiz.length} preguntas`
										: `You answered ${correctAnswers} out of ${data.quiz.length} questions correctly`
									}
								</p>
								<Button onClick={resetQuiz} variant="outline">
									{isSpanish ? "Intentar de Nuevo" : "Try Again"}
								</Button>
							</CardContent>
						)}
					</Card>
				</div>
			)}
		</div>
	)
}

// Datos de explicación para Stack
export const STACK_EXPLANATION_DATA: ExplanationData = {
	title: "Stack (LIFO Data Structure)",
	titleEs: "Pila (Estructura LIFO)",
	description: "A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.",
	descriptionEs: "Una pila es una estructura de datos lineal que sigue el principio Último en Entrar, Primero en Salir (LIFO).",
	concepts: [
		{
			id: "lifo",
			title: "LIFO Principle",
			titleEs: "Principio LIFO",
			content: "LIFO stands for Last-In-First-Out. Think of a stack of plates: you can only add or remove plates from the top. The last plate you put on is the first one you take off.",
			contentEs: "LIFO significa Último en Entrar, Primero en Salir. Piensa en una pila de platos: solo puedes añadir o quitar platos de arriba. El último plato que pones es el primero que sacas.",
			tips: [
				"The stack only allows access to the top element",
				"You cannot access elements in the middle without removing those above"
			],
			tipsEs: [
				"La pila solo permite acceso al elemento superior",
				"No puedes acceder a elementos del medio sin quitar los de arriba"
			]
		},
		{
			id: "push",
			title: "Push Operation",
			titleEs: "Operación Push",
			content: "Push adds an element to the top of the stack. It's a constant time operation O(1) because we only need to update the top pointer and add the new element.",
			contentEs: "Push añade un elemento en la cima de la pila. Es una operación de tiempo constante O(1) porque solo necesitamos actualizar el puntero superior y añadir el nuevo elemento.",
			code: `def push(self, value):
    if len(self.items) >= self.max_size:
        raise Exception("Stack Overflow!")
    self.items.append(value)`,
			complexity: { time: "O(1)", space: "O(1)" },
			tips: [
				"Always check for overflow before pushing",
				"The top pointer is incremented before assignment"
			],
			tipsEs: [
				"Siempre verifica overflow antes de hacer push",
				"El puntero top se incrementa antes de la asignación"
			]
		},
		{
			id: "pop",
			title: "Pop Operation",
			titleEs: "Operación Pop",
			content: "Pop removes and returns the top element. Like push, it's O(1) because we only access the top element and decrement the pointer.",
			contentEs: "Pop elimina y devuelve el elemento superior. Como push, es O(1) porque solo accedemos al elemento superior y decrementamos el puntero.",
			code: `def pop(self):
    if len(self.items) == 0:
        raise Exception("Stack Underflow!")
    return self.items.pop()`,
			complexity: { time: "O(1)", space: "O(1)" },
			tips: [
				"Always check for underflow before popping",
				"The value is returned before decrementing top"
			],
			tipsEs: [
				"Siempre verifica underflow antes de hacer pop",
				"El valor se devuelve antes de decrementar top"
			]
		},
		{
			id: "peek",
			title: "Peek Operation",
			titleEs: "Operación Peek",
			content: "Peek returns the top element without removing it. Useful when you need to see what's on top without modifying the stack.",
			contentEs: "Peek devuelve el elemento superior sin eliminarlo. Útil cuando necesitas ver qué hay arriba sin modificar la pila.",
			code: `def peek(self):
    if len(self.items) == 0:
        raise Exception("Stack is empty!")
    return self.items[-1]`,
			complexity: { time: "O(1)", space: "O(1)" }
		}
	],
	useCases: [
		{
			title: "Function Call Stack",
			titleEs: "Pila de Llamadas de Funciones",
			description: "When a function calls another, the return address is pushed. When it returns, the address is popped.",
			descriptionEs: "Cuando una función llama a otra, la dirección de retorno se apila. Al retornar, se desapila."
		},
		{
			title: "Undo Operations",
			titleEs: "Operaciones Deshacer",
			description: "Text editors use a stack to store actions. Undo pops the last action.",
			descriptionEs: "Los editores de texto usan una pila para almacenar acciones. Deshacer saca la última acción."
		},
		{
			title: "Browser History",
			titleEs: "Historial del Navegador",
			description: "The back button works like a stack - each page visited is pushed, back pops.",
			descriptionEs: "El botón atrás funciona como una pila - cada página visitada se apila, atrás desapila."
		},
		{
			title: "Expression Evaluation",
			titleEs: "Evaluación de Expresiones",
			description: "Compilers use stacks to evaluate arithmetic expressions and check balanced parentheses.",
			descriptionEs: "Los compiladores usan pilas para evaluar expresiones aritméticas y verificar paréntesis balanceados."
		}
	],
	comparisons: [
		{
			structure: "Array vs Linked List Implementation",
			structureEs: "Implementación con Array vs Lista Enlazada",
			pros: [
				"Array: Faster access, better cache locality",
				"Linked List: Dynamic size, no overflow"
			],
			prosEs: [
				"Array: Acceso más rápido, mejor localidad de caché",
				"Lista Enlazada: Tamaño dinámico, sin overflow"
			],
			cons: [
				"Array: Fixed size, may overflow",
				"Linked List: Extra memory for pointers"
			],
			consEs: [
				"Array: Tamaño fijo, puede desbordarse",
				"Lista Enlazada: Memoria extra para punteros"
			]
		}
	],
	quiz: [
		{
			id: "q1",
			question: "What does LIFO stand for?",
			questionEs: "¿Qué significa LIFO?",
			options: [
				"Last In First Out",
				"Last In Fast Out",
				"List In First Out",
				"Linear In First Out"
			],
			optionsEs: [
				"Último en Entrar, Primero en Salir",
				"Último en Entrar, Rápido en Salir",
				"Lista en Entrar, Primero en Salir",
				"Lineal en Entrar, Primero en Salir"
			],
			correctIndex: 0,
			explanation: "LIFO stands for Last In First Out - the last element added is the first to be removed.",
			explanationEs: "LIFO significa Último en Entrar, Primero en Salir - el último elemento añadido es el primero en ser eliminado."
		},
		{
			id: "q2",
			question: "What is the time complexity of the push operation?",
			questionEs: "¿Cuál es la complejidad temporal de la operación push?",
			options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
			optionsEs: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
			correctIndex: 2,
			explanation: "Push is O(1) because we only update the top pointer and add one element.",
			explanationEs: "Push es O(1) porque solo actualizamos el puntero superior y añadimos un elemento."
		},
		{
			id: "q3",
			question: "What happens when you pop from an empty stack?",
			questionEs: "¿Qué sucede cuando haces pop en una pila vacía?",
			options: [
				"Returns 0",
				"Stack Underflow error",
				"Returns null",
				"Nothing happens"
			],
			optionsEs: [
				"Devuelve 0",
				"Error de Stack Underflow",
				"Devuelve null",
				"No pasa nada"
			],
			correctIndex: 1,
			explanation: "Attempting to pop from an empty stack causes a Stack Underflow error.",
			explanationEs: "Intentar hacer pop en una pila vacía causa un error de Stack Underflow."
		}
	]
}

// Datos de explicación para Queue
export const QUEUE_EXPLANATION_DATA: ExplanationData = {
	title: "Queue (FIFO Data Structure)",
	titleEs: "Cola (Estructura FIFO)",
	description: "A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle.",
	descriptionEs: "Una cola es una estructura de datos lineal que sigue el principio Primero en Entrar, Primero en Salir (FIFO).",
	concepts: [
		{
			id: "fifo",
			title: "FIFO Principle",
			titleEs: "Principio FIFO",
			content: "FIFO stands for First-In-First-Out. Think of a line at a bank: the first person in line is the first one served. Elements are added at the rear and removed from the front.",
			contentEs: "FIFO significa Primero en Entrar, Primero en Salir. Piensa en una fila en el banco: la primera persona en la fila es la primera en ser atendida. Los elementos se añaden al final y se eliminan del frente.",
			tips: [
				"Two pointers are maintained: front and rear",
				"Enqueue at rear, dequeue from front"
			],
			tipsEs: [
				"Se mantienen dos punteros: frente y final",
				"Encolar al final, desencolar del frente"
			]
		},
		{
			id: "enqueue",
			title: "Enqueue Operation",
			titleEs: "Operación Enqueue",
			content: "Enqueue adds an element at the rear of the queue. It's O(1) as we only update the rear pointer.",
			contentEs: "Encolar añade un elemento al final de la cola. Es O(1) ya que solo actualizamos el puntero final.",
			code: `def enqueue(self, value):
    if len(self.items) >= self.max_size:
        raise Exception("Queue Overflow!")
    self.items.append(value)`,
			complexity: { time: "O(1)", space: "O(1)" }
		},
		{
			id: "dequeue",
			title: "Dequeue Operation",
			titleEs: "Operación Dequeue",
			content: "Dequeue removes and returns the front element. It's O(1) as we only access and update the front pointer.",
			contentEs: "Desencolar elimina y devuelve el elemento del frente. Es O(1) ya que solo accedemos y actualizamos el puntero frontal.",
			code: `def dequeue(self):
    if len(self.items) == 0:
        raise Exception("Queue Underflow!")
    return self.items.pop(0)`,
			complexity: { time: "O(1)", space: "O(1)" }
		}
	],
	useCases: [
		{
			title: "Process Scheduling",
			titleEs: "Planificación de Procesos",
			description: "Operating systems use queues to manage processes waiting for CPU time.",
			descriptionEs: "Los sistemas operativos usan colas para gestionar procesos esperando tiempo de CPU."
		},
		{
			title: "Print Queue",
			titleEs: "Cola de Impresión",
			description: "Print jobs are processed in the order they were received.",
			descriptionEs: "Los trabajos de impresión se procesan en el orden en que fueron recibidos."
		},
		{
			title: "BFS Algorithm",
			titleEs: "Algoritmo BFS",
			description: "Breadth-First Search uses a queue to explore nodes level by level.",
			descriptionEs: "La Búsqueda en Anchura usa una cola para explorar nodos nivel por nivel."
		},
		{
			title: "Message Queues",
			titleEs: "Colas de Mensajes",
			description: "Systems like RabbitMQ and Kafka use queues for async communication.",
			descriptionEs: "Sistemas como RabbitMQ y Kafka usan colas para comunicación asíncrona."
		}
	],
	quiz: [
		{
			id: "q1",
			question: "What does FIFO stand for?",
			questionEs: "¿Qué significa FIFO?",
			options: [
				"First In First Out",
				"Fast In Fast Out",
				"First In Fast Out",
				"Final In First Out"
			],
			optionsEs: [
				"Primero en Entrar, Primero en Salir",
				"Rápido en Entrar, Rápido en Salir",
				"Primero en Entrar, Rápido en Salir",
				"Final en Entrar, Primero en Salir"
			],
			correctIndex: 0,
			explanation: "FIFO stands for First In First Out - the first element added is the first to be removed.",
			explanationEs: "FIFO significa Primero en Entrar, Primero en Salir - el primer elemento añadido es el primero en ser eliminado."
		},
		{
			id: "q2",
			question: "Where are elements added in a queue?",
			questionEs: "¿Dónde se añaden los elementos en una cola?",
			options: ["Front", "Rear", "Middle", "Top"],
			optionsEs: ["Frente", "Final", "Medio", "Arriba"],
			correctIndex: 1,
			explanation: "Elements are always added at the rear (back) of the queue.",
			explanationEs: "Los elementos siempre se añaden al final (parte trasera) de la cola."
		}
	]
}
