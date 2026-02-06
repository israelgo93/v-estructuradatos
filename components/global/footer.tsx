"use client"

import { useTranslation } from "react-i18next"
import Link from "next/link"

export function Footer() {
	const { t } = useTranslation()

	return (
		<footer className="border-t border-border bg-background/50 backdrop-blur-sm mt-auto">
			<div className="mx-auto w-full max-w-7xl px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
				<div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
					<p className="font-semibold text-foreground tracking-tight">{t('footer.educationalProject')}</p>
					<p>{t('footer.course')}</p>
					<p>{t('footer.faculty')}</p>
				</div>

				<div className="flex flex-col items-center md:items-end gap-3">
					<Link 
						href="/about/" 
						className="text-sm font-medium hover:text-primary transition-colors hover:underline underline-offset-4"
					>
						{t('footer.about', 'Acerca de')}
					</Link>
					
					<a 
						href="https://github.com/CubeStar1/dsa-visualizer/"
						target="_blank"
						rel="noopener noreferrer" 
						className="text-[10px] text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors select-none"
						aria-label="Original repository credit"
					>
						{t('footer.originalRepo', 'Basado en dsa-visualizer')}
					</a>
				</div>
			</div>
		</footer>
	)
}
