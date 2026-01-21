"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/navigation/navbar"

const PacmanApp = dynamic(() => import("../../pacman-es/App"), { ssr: false })

export default function PacmanPage() {
	return (
		<div className="pacman-theme min-h-screen bg-background text-foreground">
			<Navbar />
			<PacmanApp />
		</div>
	)
}
