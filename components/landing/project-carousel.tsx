"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, BrainCircuit, Gamepad2, ExternalLink } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

type Project = {
	id: string
	icon: LucideIcon
	titleKey: string
	descriptionKey: string
	highlightKeys: string[]
	primaryCtaKey: string
	secondaryCtaKey: string
	primaryUrl: string
	secondaryUrl: string
	secondaryExternal?: boolean
}

const projects: Project[] = [
	{
		id: "visualizer",
		icon: BrainCircuit,
		titleKey: "orgLanding.projectCardTitle",
		descriptionKey: "orgLanding.projectCardDescription",
		highlightKeys: [
			"orgLanding.projectCardBullet1",
			"orgLanding.projectCardBullet2",
			"orgLanding.projectCardBullet3",
		],
		primaryCtaKey: "orgLanding.projectCardPrimaryCta",
		secondaryCtaKey: "orgLanding.projectCardSecondaryCta",
		primaryUrl: "/visualizador-es/",
		secondaryUrl: "/visualizer/",
	},
	{
		id: "pacman",
		icon: Gamepad2,
		titleKey: "orgLanding.pacmanCardTitle",
		descriptionKey: "orgLanding.pacmanCardDescription",
		highlightKeys: [
			"orgLanding.pacmanCardBullet1",
			"orgLanding.pacmanCardBullet2",
			"orgLanding.pacmanCardBullet3",
		],
		primaryCtaKey: "orgLanding.pacmanCardPrimaryCta",
		secondaryCtaKey: "orgLanding.pacmanCardSecondaryCta",
		primaryUrl: "/pacman-es/",
		secondaryUrl: "https://github.com/israelgo93/estructuradatos.org/tree/main/pacman-es",
		secondaryExternal: true,
	},
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
							{t(projects[currentIndex].titleKey)}
						</h3>
						<p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-4 sm:mb-6">
							{t(projects[currentIndex].descriptionKey)}
						</p>
						<ul className="text-sm sm:text-base text-muted-foreground max-w-lg mb-6 sm:mb-8 space-y-2">
							{projects[currentIndex].highlightKeys.map((highlightKey) => (
								<li key={highlightKey} className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
									<span>{t(highlightKey)}</span>
								</li>
							))}
						</ul>
						<div className="flex flex-col sm:flex-row gap-3">
							<Button size="lg" className="rounded-full px-8 h-12 sm:h-14" asChild>
								<Link href={projects[currentIndex].primaryUrl}>
									{t(projects[currentIndex].primaryCtaKey)}
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="rounded-full px-8 h-12 sm:h-14" asChild>
								<Link
									href={projects[currentIndex].secondaryUrl}
									target={projects[currentIndex].secondaryExternal ? "_blank" : undefined}
									rel={projects[currentIndex].secondaryExternal ? "noopener noreferrer" : undefined}
									className="gap-2"
								>
									{t(projects[currentIndex].secondaryCtaKey)}
									{projects[currentIndex].secondaryExternal ? <ExternalLink className="h-4 w-4" /> : null}
								</Link>
							</Button>
						</div>
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
