"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PolynomialMultiplication } from "./polynomial-multiplication"
import { Card } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { InteractiveExplanation } from "@/components/visualizer/shared/interactive-explanation"
import { POLYNOMIAL_EXPLANATION_DATA } from "@/components/visualizer/shared/explanation-data"

interface PolynomialVisualizerProps {
  content: React.ReactNode
}

export function PolynomialVisualizer({ content }: PolynomialVisualizerProps) {
	const { t } = useTranslation()

	return (
		<div className="container mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight">
					{t('polynomial.title')}
				</h1>
				<p className="text-muted-foreground">
					{t('polynomial.description')}
				</p>
			</div>

			<Tabs defaultValue="multiply" className="w-full space-y-6">
				<div className="overflow-x-auto pb-2">
					<TabsList className="flex w-full min-w-max sm:grid sm:grid-cols-2 h-auto p-1 sm:h-10 sm:p-1">
						<TabsTrigger value="multiply" className="flex-1">
							{t('polynomial.multiply')}
						</TabsTrigger>
						<TabsTrigger value="explanation" className="flex-1">
							{t('common.explanation')}
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="multiply" className="space-y-6">
					<Card className="p-6">
						<PolynomialMultiplication />
					</Card>
				</TabsContent>
				
				<TabsContent value="explanation">
					<InteractiveExplanation data={POLYNOMIAL_EXPLANATION_DATA} />
				</TabsContent>
			</Tabs>
		</div>
	)
} 