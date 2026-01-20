import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/global/theme-provider";
import { I18nProvider } from "@/components/global/i18n-provider";
import { Footer } from "@/components/global/footer";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "EstructuraDatos.org",
  description: "Organización tecnológica sin fines de lucro con recursos open source para aprender programación y estructuras de datos.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<I18nProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="min-h-screen flex flex-col">
							<div className="flex-1">
								{children}
							</div>
							<Footer />
						</div>
						<Toaster />
					</ThemeProvider>
				</I18nProvider>
			</body>
		</html>
	);
}
