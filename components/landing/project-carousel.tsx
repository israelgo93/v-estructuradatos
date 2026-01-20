"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Layers, List, Network, Database, GitBranch, Binary } from "lucide-react"
import Link from "next/link"

const projects = [
	{ id: "stack", icon: Layers, translationKey: "stack" },
	{ id: "queue", icon: List, translationKey: "queue" },
	{ id: "linkedList", icon: Network, translationKey: "linkedList" },
	{ id: "binaryTree", icon: Database, translationKey: "binaryTree" },
	{ id: "avlTree", icon: GitBranch, translationKey: "avlTree" },
	{ id: "heap", icon: Binary, translationKey: "heap" },
]

export function ProjectCarousel() {
	const { t } = useTranslation()
	const [currentIndex, setCurrentIndex] = useState(0)

	const next = () => setCurrentIndex((prev) => (prev + 1) % projects.length)
	const prev = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)

	useEffect(() => {
		const timer = setInterval(next, 5000)
		return () => clearInterval(timer)
	}, [])

	return (
		<div className="relative w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div className="relative h-[500px] sm:h-[400px] overflow-hidden rounded-3xl bg-muted/30 border border-border/50 backdrop-blur-sm">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-center"
					>
						<div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-full bg-primary/10 text-primary">
							{(() => {
								const Icon = projects[currentIndex].icon
								return <Icon className="w-8 h-8 sm:w-12 sm:h-12" />
							})()}
						</div>
						<h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 tracking-tighter">
							{t(`common.${projects[currentIndex].id}`)}
						</h3>
						<p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-6 sm:mb-8">
							{t(`landing.${projects[currentIndex].id}Desc`)}
						</p>
						<Link href="/visualizer">
							<Button size="lg" className="rounded-full px-8 h-12 sm:h-14">
								{t("landing.tryItOut")}
							</Button>
						</Link>
					</motion.div>
				</AnimatePresence>

				{/* Navigation Buttons */}
				<div className="absolute inset-y-0 left-4 flex items-center">
					<Button
						variant="ghost"
						size="icon"
						onClick={prev}
						className="rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
					>
						<ChevronLeft className="w-6 h-6" />
					</Button>
				</div>
				<div className="absolute inset-y-0 right-4 flex items-center">
					<Button
						variant="ghost"
						size="icon"
						onClick={next}
						className="rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
					>
						<ChevronRight className="w-6 h-6" />
					</Button>
				</div>

				{/* Indicators */}
				<div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
					{projects.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 rounded-full transition-all ${
								index === currentIndex ? "bg-primary w-6" : "bg-primary/30"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
