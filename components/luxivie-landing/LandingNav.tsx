"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function LandingNav() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-[100] relative flex w-full items-center justify-between border-b border-lux-text/10 bg-lux-background/95 px-4 py-5 backdrop-blur-md sm:px-12">
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

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-lux-text/20 text-lux-text md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-overlay"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <i className={`ph ${isOpen ? "ph-x" : "ph-list"} text-xl`} aria-hidden />
        </button>

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
          <Link
            href="/blog"
            className="rounded-full bg-lux-accent px-4 py-2 text-white transition-all hover:brightness-110"
          >
            Journal
          </Link>
        </div>
      </nav>

      <div
        id="mobile-nav-overlay"
        className={`fixed inset-0 z-[95] bg-lux-text/45 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-none bg-lux-background p-6 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-10 flex items-center justify-between">
            <Image
              src="/luxivie-logo.png"
              alt="LUXIVIE"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-lux-text/20"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            >
              <i className="ph ph-x text-lg" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-5 text-sm font-bold uppercase tracking-[0.2em]">
            <a href="#products" className="transition-colors hover:text-lux-accent" onClick={closeMenu}>
              Products
            </a>
            <a href="#ritual" className="transition-colors hover:text-lux-accent" onClick={closeMenu}>
              Ritual
            </a>
            <a href="#sustainability" className="transition-colors hover:text-lux-accent" onClick={closeMenu}>
              Sustainability
            </a>
            <Link
              href="/blog"
              className="inline-flex w-fit rounded-full bg-lux-accent px-4 py-2 text-white transition-all hover:brightness-110"
              onClick={closeMenu}
            >
              Journal
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
