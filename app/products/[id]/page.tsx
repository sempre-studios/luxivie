import Image from "next/image"
import Link from "next/link"
import { ProductDetailsClient } from "@/components/luxivie-landing/ProductDetailsClient"
import { SocialLinks } from "@/components/luxivie-landing/SocialLinks"

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <ProductDetailsClient params={params} />
      <footer className="border-t border-lux-text/10 bg-lux-background px-6 py-14 text-lux-text sm:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Image src="/luxivie-logo.png" alt="LUXIVIE" width={180} height={48} className="h-9 w-auto" />
            <p className="mt-5 text-sm text-lux-text/55">Hair care for your everyday routine.</p>
          </div>
          <div className="space-y-6 md:text-right">
            <nav className="flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium tracking-[0.04em]">
              <Link href="/#products" className="hover:text-lux-accent">Our products</Link>
              <Link href="/blog" className="hover:text-lux-accent">Hair care guides</Link>
            </nav>
            <SocialLinks className="flex gap-4 md:justify-end" />
          </div>
        </div>
      </footer>
    </>
  )
}
