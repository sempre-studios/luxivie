"use client"

import type { ReactNode } from "react"

type TrackedLinkProps = {
  href: string
  className?: string
  children: ReactNode
  event: "concern_select" | "product_details_open" | "amazon_outbound_click" | "guide_click"
  section: string
  product?: string
}

export function TrackedLink({ href, className, children, event, section, product }: TrackedLinkProps) {
  const handleClick = () => {
    const dataLayer = (
      window as typeof window & { dataLayer?: Array<Record<string, unknown>> }
    ).dataLayer

    dataLayer?.push({
      event,
      section,
      product,
      device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
    })
  }

  return <a href={href} className={className} onClick={handleClick}>{children}</a>
}
