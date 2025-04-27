"use client"

import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isMounted) return null

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Krishimitra Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Krishimitra
                </span>
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Krishimitra Logo"
                        width={32}
                        height={32}
                        className="rounded-md"
                      />
                      <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                        Krishimitra
                      </span>
                    </div>
                    <nav className="flex flex-col gap-2">
                      <Link href="/" passHref>
                        <Button variant={pathname === "/" ? "default" : "ghost"} className="justify-start">
                          {t("home")}
                        </Button>
                      </Link>
                      <Link href="/about" passHref>
                        <Button variant={pathname === "/about" ? "default" : "ghost"} className="justify-start">
                          {t("about")}
                        </Button>
                      </Link>
                      <Link href="/contact" passHref>
                        <Button variant={pathname === "/contact" ? "default" : "ghost"} className="justify-start">
                          {t("contact")}
                        </Button>
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <Link href="/" passHref>
                <Button variant={pathname === "/" ? "default" : "ghost"}>{t("home")}</Button>
              </Link>
              <Link href="/about" passHref>
                <Button variant={pathname === "/about" ? "default" : "ghost"}>{t("about")}</Button>
              </Link>
              <Link href="/contact" passHref>
                <Button variant={pathname === "/contact" ? "default" : "ghost"}>{t("contact")}</Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
