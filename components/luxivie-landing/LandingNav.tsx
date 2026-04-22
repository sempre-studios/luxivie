"use client"

import Link from "next/link"
import Image from "next/image"

export function LandingNav() {
  return (
    <nav className="fixed top-0 z-[100] flex w-full items-center justify-between border-b border-lux-text/5 px-4 py-5 glass-nav sm:px-12 relative">
      <div className="flex items-center">
        <Image
          src="/luxivie-logo.png"
          alt="LUXIVIE"
          width={180}
          height={48}
          className="h-9 w-auto sm:h-10"
          priority
        />
      </div>

      <div className="hidden min-w-0 flex-1 items-center justify-end gap-8 text-[11px] font-bold uppercase tracking-[0.2em] md:flex">
        <a href="#products" className="transition-colors hover:text-lux-accent">
          Products
        </a>
        <a href="#ritual" className="transition-colors hover:text-lux-accent">
          Ritual
        </a>
        <a href="#sustainability" className="transition-colors hover:text-lux-accent">
          Sustainability
        </a>
      </div>
    </nav>
  )
}
