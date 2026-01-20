"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { MoveRight, Github, Sparkles, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DotPattern } from "@/components/ui/dot-pattern"
import { Navbar } from "@/components/navigation/navbar"

export default function Home() {
	const { t } = useTranslation()

	return (
		<div className="flex flex-col min-h-screen p-4 sm:p-10">
			<Navbar />
			<main className="flex-1">
				<section className="relative w-full py-20 lg:py-32 overflow-hidden">
					<div className="absolute inset-0">
						<DotPattern
							width={20}
							height={20}
							cx={1}
							cy={1}
							cr={1}
							className="[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
						/>
					</div>
					<div className="container mx-auto relative">
						<div className="flex flex-col gap-8 text-center items-center">
							<Badge>{t('orgLanding.heroSubtitle')}</Badge>
							<h1 className="text-4xl md:text-6xl tracking-tighter font-regular">
								{t('orgLanding.heroTitle')}
							</h1>
							<p className="text-lg md:text-xl max-w-3xl leading-relaxed tracking-tight text-muted-foreground">
								{t('orgLanding.heroDescription')}
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/visualizador-es">
									<Button className="gap-2">
										{t('orgLanding.heroPrimaryCta')} <MoveRight className="w-4 h-4" />
									</Button>
								</Link>
								<Link href="https://github.com/israelgo93/estructuradatos.org" target="_blank" rel="noopener noreferrer">
									<Button variant="outline" className="gap-2">
										{t('orgLanding.heroSecondaryCta')} <Github className="w-4 h-4" />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section id="mission" className="w-full py-20 lg:py-28">
					<div className="container mx-auto">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-3">
								<Badge>{t('orgLanding.missionBadge')}</Badge>
								<h2 className="text-3xl md:text-4xl tracking-tighter font-regular">
									{t('orgLanding.missionTitle')}
								</h2>
								<p className="text-lg max-w-3xl text-muted-foreground">
									{t('orgLanding.missionDescription')}
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-xl">
											<Sparkles className="w-4 h-4 text-primary" />
											{t('orgLanding.value1Title')}
										</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground">
										{t('orgLanding.value1Description')}
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-xl">
											<ShieldCheck className="w-4 h-4 text-primary" />
											{t('orgLanding.value2Title')}
										</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground">
										{t('orgLanding.value2Description')}
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-xl">
											<Users className="w-4 h-4 text-primary" />
											{t('orgLanding.value3Title')}
										</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground">
										{t('orgLanding.value3Description')}
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</section>

				<section id="open-source" className="w-full py-20 lg:py-28">
					<div className="container mx-auto">
						<Card className="bg-muted/40">
							<CardHeader>
								<CardTitle>{t('orgLanding.openSourceTitle')}</CardTitle>
								<CardDescription>
									{t('orgLanding.openSourceDescription')}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col sm:flex-row gap-4">
								<Link href="https://github.com/israelgo93/estructuradatos.org" target="_blank" rel="noopener noreferrer">
									<Button variant="outline" className="gap-2">
										{t('orgLanding.openSourceCta')} <Github className="w-4 h-4" />
									</Button>
								</Link>
								<Link href="/about">
									<Button variant="ghost" className="gap-2">
										{t('orgLanding.aboutCta')} <MoveRight className="w-4 h-4" />
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				</section>

				<section id="projects" className="w-full py-20 lg:py-28">
					<div className="container mx-auto">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-3">
								<Badge>{t('orgLanding.projectsBadge')}</Badge>
								<h2 className="text-3xl md:text-4xl tracking-tighter font-regular">
									{t('orgLanding.projectsTitle')}
								</h2>
								<p className="text-lg max-w-3xl text-muted-foreground">
									{t('orgLanding.projectsDescription')}
								</p>
							</div>
							<Card>
								<CardHeader>
									<CardTitle>{t('orgLanding.projectCardTitle')}</CardTitle>
									<CardDescription>{t('orgLanding.projectCardDescription')}</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-4">
									<ul className="list-disc pl-5 text-muted-foreground space-y-2">
										<li>{t('orgLanding.projectCardBullet1')}</li>
										<li>{t('orgLanding.projectCardBullet2')}</li>
										<li>{t('orgLanding.projectCardBullet3')}</li>
									</ul>
									<div className="flex flex-col sm:flex-row gap-4">
										<Link href="/visualizador-es">
											<Button className="gap-2">
												{t('orgLanding.projectCardPrimaryCta')} <MoveRight className="w-4 h-4" />
											</Button>
										</Link>
										<Link href="/visualizer">
											<Button variant="outline" className="gap-2">
												{t('orgLanding.projectCardSecondaryCta')} <MoveRight className="w-4 h-4" />
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section id="community" className="w-full py-20 lg:py-28">
					<div className="container mx-auto">
						<div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-muted/50 to-muted p-12 md:p-16 text-center">
							<div className="relative flex flex-col items-center gap-6">
								<h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
									{t('orgLanding.communityTitle')}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl">
									{t('orgLanding.communityDescription')}
								</p>
								<Link href="https://github.com/israelgo93/estructuradatos.org" target="_blank" rel="noopener noreferrer">
									<Button className="gap-2">
										{t('orgLanding.communityCta')} <Github className="w-4 h-4" />
									</Button>
								</Link>
							</div>
							<div className="absolute -left-1/4 -top-1/4 h-72 w-72 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
							<div className="absolute -right-1/4 -bottom-1/4 h-72 w-72 bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl" />
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
