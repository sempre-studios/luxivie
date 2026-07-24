"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const NAV_LINKS = [
  { id: "products", label: "Products" },
  { id: "ritual",   label: "Ritual" },
  { id: "sustainability", label: "Sustainability" },
] as const

export function LandingNav() {
  const pathname = usePathname()
  const isBlogSection = pathname === "/blog" || pathname.startsWith("/blog/")
  const isHome = pathname === "/"

  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Track which section is visible while on the home page
  useEffect(() => {
    if (!isHome) return

    const entries = new Map<string, number>()

    observerRef.current = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          entries.set(entry.target.id, entry.intersectionRatio)
        }
        // Pick the section with the highest visible ratio
        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of entries) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (bestRatio > 0) setActiveSection(best)
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: "-72px 0px 0px 0px" },
    )

    for (const { id } of NAV_LINKS) {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  const linkClass = (id: string) =>
    `transition-colors hover:text-lux-accent ${
      activeSection === id
        ? "text-lux-accent underline underline-offset-4 decoration-lux-accent/50"
        : ""
    }`

  const mobileLinkClass = (id: string) =>
    `transition-colors hover:text-lux-accent ${
      activeSection === id ? "text-lux-accent" : ""
    }`

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-[100] flex w-full items-center justify-between border-b border-lux-text/10 bg-lux-background/95 px-4 py-5 backdrop-blur-md sm:px-12">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/luxivie-logo.png"
              alt="LUXIVIE"
              width={180}
              height={48}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Link>
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
          {!isBlogSection ? (
            <>
              {NAV_LINKS.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className={linkClass(id)}>
                  {label}
                </a>
              ))}
              <Link
                href="/blog"
                className="rounded-full bg-lux-accent px-4 py-2 text-white transition-all hover:brightness-110"
              >
                Journal
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-lux-accent px-4 py-2 text-white transition-all hover:brightness-110"
            >
              Home
            </Link>
          )}
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
            <Link href="/" className="flex items-center">
              <Image
                src="/luxivie-logo.png"
                alt="LUXIVIE"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
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
            {!isBlogSection ? (
              <>
                {NAV_LINKS.map(({ id, label }) => (
                  <a key={id} href={`#${id}`} className={mobileLinkClass(id)} onClick={closeMenu}>
                    {label}
                  </a>
                ))}
                <Link
                  href="/blog"
                  className="inline-flex w-fit rounded-full bg-lux-accent px-4 py-2 text-white transition-all hover:brightness-110"
                  onClick={closeMenu}
                >
                  Journal
                </Link>
              </>
            ) : (
              <Link
                href="/"
                className="inline-flex w-fit rounded-full bg-lux-accent px-4 py-2 text-white transition-all hover:brightness-110"
                onClick={closeMenu}
              >
                Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
