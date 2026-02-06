"use client";
import { BrainCircuit, Github, Menu } from "lucide-react";
import React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/global/mode-toggle";
import { LanguageToggle } from "@/components/global/language-toggle";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

export const Navbar = () => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = React.useState(false);
	const pathname = usePathname();
	const isVisualizerLanding = pathname.startsWith("/visualizador-es");

	const routeList = isVisualizerLanding
		? [
			{
				href: "/visualizer/",
				label: t('common.dashboard'),
			},
		]
		: [
			{
				href: "/#mission",
				label: t('orgLanding.navMission'),
			},
			{
				href: "/#open-source",
				label: t('orgLanding.navOpenSource'),
			},
			{
				href: "/#community",
				label: t('orgLanding.navCommunity'),
			},
		];

	const visualizerFeatures = [
		{
			title: t('common.stack'),
			description: t('landing.stackDesc'),
			url: "/visualizer/stack/"
		},
		{
			title: t('common.queue'),
			description: t('landing.queueDesc'),
			url: "/visualizer/queue/"
		},
		{
			title: t('common.linkedList'),
			description: t('landing.linkedListDesc'),
			url: "/visualizer/linked-list/"
		},
		{
			title: t('common.binaryTree'),
			description: t('landing.bstDesc'),
			url: "/visualizer/binary-tree/"
		},
		{
			title: t('common.avlTree'),
			description: t('landing.avlDesc'),
			url: "/visualizer/avl-tree/"
		},
		{
			title: t('common.heap'),
			description: t('landing.heapDesc'),
			url: "/visualizer/heap/"
		},
		{
			title: t('common.messageQueue'),
			description: t('landing.messageQueueDesc'),
			url: "/visualizer/queue-applications/"
		},
		{
			title: t('common.polynomial'),
			description: t('landing.polynomialDesc'),
			url: "/visualizer/polynomial/"
		},
		{
			title: t('common.dijkstra'),
			description: t('landing.dijkstraDesc'),
			url: "/visualizer/dijkstra/"
		},
		{
			title: t('common.computerVision'),
			description: t('landing.computerVisionDesc'),
			url: "/visualizer/computer-vision/"
		},
	];

	const orgProjects = [
		{
			title: t('orgLanding.projectCardTitle'),
			description: t('orgLanding.projectCardDescription'),
			url: "/visualizador-es/"
		},
		{
			title: t('orgLanding.pacmanCardTitle'),
			description: t('orgLanding.pacmanCardDescription'),
			url: "/pacman-es/"
		},
	];

	const menuLabel = isVisualizerLanding ? t('common.dataStructures') : t('orgLanding.navProjects');
	const menuItems = isVisualizerLanding ? visualizerFeatures : orgProjects;

	return (
		<header className="shadow-inner bg-opacity-15 w-[95%] sm:w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card/60 backdrop-blur-md">
			<Link href="/" className="font-bold text-base sm:text-lg flex items-center shrink-0">
				<BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
				<span className="hidden sm:inline-block">{t('common.title')}</span>
				<span className="sm:hidden">ed.org</span>
			</Link>

			{/* Mobile Menu */}
			<div className="flex items-center lg:hidden">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Menu
							onClick={() => setIsOpen(!isOpen)}
							className="cursor-pointer lg:hidden"
						/>
					</SheetTrigger>

					<SheetContent
						side="left"
						className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
					>
						<SheetDescription className="sr-only">Navegación principal del sitio</SheetDescription>
						<div>
							<SheetHeader className="mb-4 ml-4">
								<SheetTitle className="flex items-center">
									<Link href="/" className="flex items-center">
										<BrainCircuit className="h-6 w-6 mr-2" />
										{t('common.title')}
									</Link>
								</SheetTitle>
							</SheetHeader>

							<div className="flex flex-col gap-2">
								{routeList.map(({ href, label }) => (
									<Button
										key={href}
										onClick={() => setIsOpen(false)}
										asChild
										variant="secondary"
										className="justify-start text-base"
									>
										<Link href={href}>{label}</Link>
									</Button>
								))}
							</div>
						</div>

						<SheetFooter className="flex-col sm:flex-col justify-start items-start gap-2">
							<Separator className="mb-2" />
							<div className="flex gap-2">
								<LanguageToggle />
								<ModeToggle />
							</div>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop Menu */}
			<div className="hidden lg:flex items-center justify-center flex-1 mx-4">
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger className="bg-transparent">
								{menuLabel}
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
									{menuItems.map(({ title, description, url }) => (
										<NavigationMenuLink key={title} asChild>
											<Link href={url}>
												<li key={title} className="rounded-md p-3 hover:bg-muted">
													<p className="mb-1 font-semibold leading-none text-foreground">
														{title}
													</p>
													<p className="line-clamp-2 text-muted-foreground">
														{description}
													</p>
												</li>
											</Link>
										</NavigationMenuLink>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<div className="flex items-center">
								{routeList.map(({ href, label }) => (
									<NavigationMenuLink key={href} asChild>
										<Link href={href} className="px-3 text-sm font-medium hover:text-primary transition-colors">
											{label}
										</Link>
									</NavigationMenuLink>
								))}
							</div>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<div className="hidden lg:flex items-center gap-2">
				<LanguageToggle />
				<ModeToggle />
				<Button asChild size="sm" variant="ghost" aria-label="View on GitHub">
					<Link
						aria-label="View on GitHub"
						href="https://github.com/israelgo93/estructuradatos.org"
						target="_blank"
					>
						<Github className="size-5" />
					</Link>
				</Button>
			</div>
		</header>
	);
};
