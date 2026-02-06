"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { MoveRight, Github, Sparkles, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navigation/navbar"
import { Hero3D } from "@/components/landing/hero-3d"
import { ProjectCarousel } from "@/components/landing/project-carousel"
import dynamic from "next/dynamic"

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 }
}

export default function Home() {
	const { t } = useTranslation()

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<Navbar />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
					<Hero3D />
					<div className="container mx-auto relative z-10">
						<motion.div 
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="flex flex-col gap-8 text-center items-center"
						>
							<motion.div variants={itemVariants}>
								<Badge variant="outline" className="px-4 py-1 backdrop-blur-md bg-primary/5 border-primary/20 text-primary uppercase tracking-widest text-[10px]">
									{t('orgLanding.heroSubtitle')}
								</Badge>
							</motion.div>
							
							<motion.h1 
								variants={itemVariants}
								className="text-3xl sm:text-5xl md:text-8xl tracking-tighter font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 max-w-4xl"
							>
								{t('orgLanding.heroTitle').toLowerCase()}
							</motion.h1>
							
							<motion.p 
								variants={itemVariants}
								className="text-lg md:text-2xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground/80 font-light"
							>
								{t('orgLanding.heroDescription')}
							</motion.p>
							
							<motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4">
								<Link href="/visualizador-es/">
									<Button size="lg" className="gap-2 rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
										{t('orgLanding.heroPrimaryCta')} <MoveRight className="w-5 h-5" />
									</Button>
								</Link>
								<Link href="https://github.com/israelgo93/estructuradatos.org" target="_blank" rel="noopener noreferrer">
									<Button size="lg" variant="outline" className="gap-2 rounded-full px-8 h-14 text-lg backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95">
										{t('orgLanding.heroSecondaryCta')} <Github className="w-5 h-5" />
									</Button>
								</Link>
							</motion.div>
						</motion.div>
					</div>
					
					{/* Scroll Indicator */}
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 1 }}
						className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
					>
						<span className="text-[10px] uppercase tracking-[0.2em]">Sigue explorando</span>
						<motion.div 
							animate={{ y: [0, 10, 0] }}
							transition={{ repeat: Infinity, duration: 2 }}
							className="w-px h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent"
						/>
					</motion.div>
				</section>

				{/* Mission Section */}
				<section id="mission" className="w-full py-24 lg:py-32 bg-muted/20">
					<div className="container mx-auto px-4">
						<div className="flex flex-col gap-16">
							<motion.div 
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="flex flex-col gap-4 max-w-3xl"
							>
								<Badge className="w-fit">{t('orgLanding.missionBadge')}</Badge>
								<h2 className="text-4xl md:text-6xl tracking-tighter font-bold">
									{t('orgLanding.missionTitle')}
								</h2>
								<p className="text-xl text-muted-foreground/80 leading-relaxed">
									{t('orgLanding.missionDescription')}
								</p>
							</motion.div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{[
									{ title: t('orgLanding.value1Title'), desc: t('orgLanding.value1Description'), icon: Sparkles },
									{ title: t('orgLanding.value2Title'), desc: t('orgLanding.value2Description'), icon: ShieldCheck },
									{ title: t('orgLanding.value3Title'), desc: t('orgLanding.value3Description'), icon: Users },
								].map((value, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
									>
										<Card className="h-full bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all group overflow-hidden relative">
											<div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/50 transition-all" />
											<CardHeader>
												<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
													<value.icon className="w-6 h-6 text-primary" />
												</div>
												<CardTitle className="text-2xl tracking-tight group-hover:text-primary transition-colors">
													{value.title}
												</CardTitle>
											</CardHeader>
											<CardContent className="text-muted-foreground leading-relaxed">
												{value.desc}
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Projects Section (Carousel) */}
				<section id="projects" className="w-full py-24 lg:py-32 overflow-hidden">
					<div className="container mx-auto px-4">
						<div className="flex flex-col gap-12 text-center">
							<motion.div 
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="flex flex-col gap-4 items-center"
							>
								<Badge variant="outline" className="w-fit">{t('orgLanding.projectsBadge')}</Badge>
								<h2 className="text-4xl md:text-6xl tracking-tighter font-bold">
									{t('orgLanding.projectsTitle')}
								</h2>
								<p className="text-xl text-muted-foreground max-w-2xl">
									{t('orgLanding.projectsDescription')}
								</p>
							</motion.div>
							
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2, duration: 0.8 }}
							>
								<ProjectCarousel />
							</motion.div>
						</div>
					</div>
				</section>

				{/* Open Source Section */}
				<section id="open-source" className="w-full py-24 lg:py-32 relative">
					<div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-right" />
					<div className="container mx-auto px-4 relative">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="max-w-4xl mx-auto"
						>
							<Card className="bg-background/80 backdrop-blur-xl border-primary/20 overflow-hidden">
								<div className="grid grid-cols-1 md:grid-cols-2">
									<div className="p-12 flex flex-col gap-6 justify-center">
										<h2 className="text-4xl font-bold tracking-tighter">
											{t('orgLanding.openSourceTitle')}
										</h2>
										<p className="text-lg text-muted-foreground leading-relaxed">
											{t('orgLanding.openSourceDescription')}
										</p>
										<div className="flex flex-wrap gap-4 mt-2">
											<Link href="https://github.com/israelgo93/estructuradatos.org" target="_blank" rel="noopener noreferrer">
												<Button className="gap-2 rounded-full px-6">
													<Github className="w-4 h-4" /> {t('orgLanding.openSourceCta')}
												</Button>
											</Link>
											<Link href="/about/">
												<Button variant="ghost" className="gap-2 rounded-full px-6">
													{t('orgLanding.aboutCta')} <MoveRight className="w-4 h-4" />
												</Button>
											</Link>
										</div>
									</div>
									<div className="bg-muted/50 p-12 flex items-center justify-center border-l border-border/50">
										<div className="relative w-full aspect-square max-w-[200px] flex items-center justify-center">
											<motion.div 
												animate={{ rotate: 360 }}
												transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
												className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full"
											/>
											<Github className="w-24 h-24 text-primary/40" />
										</div>
									</div>
								</div>
							</Card>
						</motion.div>
					</div>
				</section>

				{/* Community Section */}
				<section id="community" className="w-full py-24 lg:py-32">
					<div className="container mx-auto px-4">
						<motion.div 
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							className="relative overflow-hidden rounded-[3rem] bg-foreground text-background p-16 md:p-24 text-center"
						>
							<div className="relative z-10 flex flex-col items-center gap-8">
								<h2 className="text-4xl md:text-7xl font-bold tracking-tighter max-w-3xl">
									{t('orgLanding.communityTitle')}
								</h2>
								<p className="text-xl md:text-2xl text-background/60 max-w-2xl font-light leading-relaxed">
									{t('orgLanding.communityDescription')}
								</p>
								<Link href="https://github.com/israelgo93/estructuradatos.org" target="_blank" rel="noopener noreferrer">
									<Button variant="secondary" size="lg" className="gap-3 rounded-full px-10 h-16 text-lg hover:scale-105 active:scale-95 transition-all">
										<Github className="w-6 h-6" /> {t('orgLanding.communityCta')}
									</Button>
								</Link>
							</div>
							
							{/* Decorative Blurs */}
							<div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full" />
							<div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] bg-indigo-500/20 blur-[120px] rounded-full" />
						</motion.div>
					</div>
				</section>
			</main>
			
			<footer className="py-12 border-t border-border/50">
				<div className="container mx-auto px-4 text-center">
					<p className="text-sm text-muted-foreground tracking-widest uppercase">
						© {new Date().getFullYear()} estructuradatos.org
					</p>
				</div>
			</footer>
		</div>
	)
}
