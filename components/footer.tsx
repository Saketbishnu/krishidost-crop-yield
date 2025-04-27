"use client"

import { Github, Heart } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Krishimitra. {t("footer.rights")}.
        </p>
        <div className="flex items-center gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            <span className="flex items-center gap-1">
              Developed by MaverickScripts with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for farmers
            </span>
          </p>
          <Link
            href="https://github.com/MaverickScripts"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1 hover:bg-accent"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
