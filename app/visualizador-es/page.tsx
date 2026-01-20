"use client"

import dynamicImport from "next/dynamic"

const Hero = dynamicImport(() => import("@/components/landing/hero").then(mod => ({ default: mod.Hero })), { ssr: false })
const Features = dynamicImport(() => import("@/components/landing/features").then(mod => ({ default: mod.Features })), { ssr: false })
const TechStack = dynamicImport(() => import("@/components/landing/tech-stack").then(mod => ({ default: mod.TechStack })), { ssr: false })
const CTA = dynamicImport(() => import("@/components/landing/cta").then(mod => ({ default: mod.CTA })), { ssr: false })
const Navbar = dynamicImport(() => import("@/components/navigation/navbar").then(mod => ({ default: mod.Navbar })), { ssr: false })

export default function VisualizadorLanding() {
	return (
		<div className="flex flex-col min-h-screen p-4 sm:p-10">
			<Navbar />
			<Hero />
			<Features />
			<TechStack />
			<CTA />
		</div>
	)
}
