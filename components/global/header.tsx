"use client"

import * as React from "react"
import Link from "next/link"
import { BrainCircuit, Github } from "lucide-react"
import { ModeToggle } from "@/components/global/mode-toggle"
import { LanguageToggle } from "@/components/global/language-toggle"
import { useTranslation } from "react-i18next"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const { t } = useTranslation()

  const navigationItems = [
    {
      title: t('common.dataStructures'),
      href: "/visualizer",
      description: "Interactive visualizations of common data structures"
    },
  ]

  return (
    <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-40 w-full bg-background/60 backdrop-blur-lg border-b">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6" />
          <span className="font-semibold">{t('common.title')}</span>
        </Link>
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-transparent text-sm text-muted-foreground hover:text-foreground"
                    )}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <ModeToggle />
          <Button asChild size="sm" variant="ghost">
            <Link
              href="https://github.com/israelgo93/estructuradatos.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
