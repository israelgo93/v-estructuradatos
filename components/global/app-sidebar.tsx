"use client"

import { Binary, Home, Database, BrainCircuit, TreePine, List, SquareStack, SquareChevronLeft, MessageSquare, X, ArrowRightLeft, Camera } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/navigation/nav-main"
import { NavProjects } from "@/components/navigation/nav-projects"
import { useTranslation } from "react-i18next"

export function AppSidebar() {
	const { t } = useTranslation()

	const navItems = [
		{
			title: t('common.home'),
			url: "/",
			icon: Home,
		},
		{
			title: t('common.dataStructures'),
			url: "/visualizer/",
			icon: Database,
		},
	]

	const dataStructures = [
		{
			name: t('common.stack'),
			url: "/visualizer/stack/",
			icon: SquareStack,
			description: t('stack.description'),
		},  
		{
			name: t('common.queue'),
			url: "/visualizer/queue/",
			icon: SquareChevronLeft,
			description: t('queue.description'),
		},  
		{
			name: t('common.linkedList'),
			url: "/visualizer/linked-list/",
			icon: List,
			description: t('linkedList.description'),
		},
		{
			name: t('common.binaryTree'),
			url: "/visualizer/binary-tree/",
			icon: Binary,
			description: t('binaryTree.description'),
		},
		{
			name: t('common.avlTree'),
			url: "/visualizer/avl-tree/",
			icon: TreePine,
			description: t('avlTree.description'),
		},
		{
			name: t('common.heap'),
			url: "/visualizer/heap/",
			icon: Database,
			description: t('heap.description'),
		},
	]

	const applications = [
		{
			name: t('common.messageQueue'),
			url: "/visualizer/queue-applications/",
			icon: MessageSquare,
			description: t('landing.messageQueueDesc'),
		},
		{
			name: t('common.polynomial'),
			url: "/visualizer/polynomial/",
			icon: X,
			description: t('landing.polynomialDesc'),
		},
		{
			name: t('common.dijkstra'),
			url: "/visualizer/dijkstra/",
			icon: ArrowRightLeft,
			description: t('dijkstra.description'),
		},
		{
			name: t('common.computerVision'),
			url: "/visualizer/computer-vision/",
			icon: Camera,
			description: t('landing.computerVisionDesc'),
		},
	]

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="px-6 py-4 border-b flex items-center gap-2">
					<BrainCircuit className="h-6 w-6" />
					<h1 className="text-sm font-semibold">{t('common.title')}</h1>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
				<NavProjects
					title={t('common.dataStructures')}
					projects={dataStructures}
				/>
				<NavProjects
					title={t('common.applications')}
					projects={applications}
				/>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
