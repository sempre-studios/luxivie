/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic"

import Link from "next/link"
import { LandingNav } from "@/components/luxivie-landing/LandingNav"
import { getPublishedBlogs } from "@/lib/blogs"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop"

function formatDate(dateString?: string) {
  if (!dateString) return "Winter 2025"
  const d = new Date(dateString)
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function estimateReadTime(html: string, readTime?: string) {
  if (readTime) return readTime
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  const words = plain ? plain.split(" ").length : 0
  return `${Math.max(3, Math.ceil(words / 220))} Min Read`
}

export default async function BlogPage() {
  const businessSlug = process.env.NEXT_PUBLIC_ORG_SLUG || "luxivie"
  const posts = await getPublishedBlogs(businessSlug)
  const featured = posts[0]
  const list = posts.slice(1, 7)
  const heroText =
    featured?.excerpt ||
    "Nature never hurries, yet everything is accomplished. Our journal explores the slow philosophy of botanical beauty."

  return (
    <div className="m-0 min-h-screen w-full overflow-x-hidden bg-[#F2F0EB] p-0 text-[#243027]">
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <LandingNav />

      <header className="border-b border-[#243027]/5 px-8 pb-20 pt-40 lg:px-20">
        <div className="flex flex-col items-end justify-between gap-12 lg:flex-row">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[#76885B]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#76885B]">The Botanical Archive</span>
            </div>
            <h1 className="mb-8 font-serif text-7xl leading-[0.9] tracking-tight lg:text-9xl">
              Living <br /> <span className="pl-20 font-normal italic lg:pl-40">Well.</span>
            </h1>
          </div>
          <div className="max-w-sm pb-4">
            <p className="mb-6 text-base italic leading-relaxed text-[#243027]/60">&quot;{heroText}&quot;</p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/40">Issue No. 04</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/40">•</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#76885B]">{featured ? formatDate(featured.publishedAt) : "Winter 2025"}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="px-8 py-24 lg:px-20">
        <div className="grid grid-cols-1 items-stretch gap-0 overflow-hidden rounded-sm bg-white shadow-[20px_20px_60px_rgba(36,48,39,0.05),-5px_-5px_30px_rgba(255,255,255,0.5)] lg:grid-cols-12">
          <div className="relative h-[600px] overflow-hidden lg:col-span-7 lg:h-auto">
            <img src={featured?.image_url || FALLBACK_IMAGE} className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" alt={featured?.title || "Featured Image"} />
            <div className="absolute left-8 top-8 bg-white/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] backdrop-blur">Cover Story</div>
          </div>
          <div className="flex flex-col justify-center border-l border-[#243027]/5 p-12 lg:col-span-5 lg:p-20">
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#76885B]">{featured?.category || "Ingredient Spotlight"}</span>
            <h2 className="mb-8 font-serif text-4xl leading-tight lg:text-5xl">{featured?.title || "The Silent Power of Wild Rosemary"}</h2>
            <p className="mb-10 text-lg leading-relaxed text-[#243027]/70">{featured?.excerpt || "More than a kitchen staple, wild rosemary holds the key to cellular scalp regeneration. We trace its lineage from the cliffs of the Mediterranean to our laboratory."}</p>
            <div className="mb-12 space-y-6">
              {(featured?.tags?.slice(0, 2) || ["Molecular stimulation of the hair bulb.", "Antioxidant barriers against urban pollutants."]).map((tag, idx) => (
                <div className="flex items-start gap-4" key={tag}>
                  <span className="font-serif text-2xl italic text-[#76885B]">{String(idx + 1).padStart(2, "0")}.</span>
                  <p className="text-sm text-[#243027]/60">{tag}</p>
                </div>
              ))}
            </div>
            <Link href={featured ? `/blog/${featured.slug}` : "/blog"} className="group inline-flex items-center gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] transition-colors group-hover:text-[#76885B]">Read the Full Thesis</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#243027]/10 transition-all group-hover:border-[#76885B] group-hover:bg-[#76885B] group-hover:text-white">
                <i className="ph ph-arrow-right" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="topics" className="mb-20 px-8 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-[#243027]/10 pb-8 md:flex-row">
          <h3 className="font-serif text-3xl">Explore by Topic</h3>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <button type="button" className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#243027]">
              All Entries
              <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#76885B]" />
            </button>
            {["Health", "Ingredients", "Rituals", "Origins"].map((topic) => (
              <button key={topic} type="button" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#243027]/40 transition-colors hover:text-[#76885B]">{topic}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-40 px-8 lg:px-20">
        <div className="grid grid-cols-1 gap-x-12 gap-y-32 md:grid-cols-2 lg:grid-cols-3">
          {list.length > 0 ? (
            list.map((post, idx) => {
              const isWide = idx === 3
              return (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.id}
                  className={`${isWide ? "lg:col-span-2 mt-12" : idx === 1 ? "lg:mt-24" : ""} group cursor-pointer transition-transform duration-300 hover:-translate-y-2`}
                >
                  <div className={`${isWide ? "aspect-[16/9]" : "aspect-[3/4]"} relative mb-10 overflow-hidden bg-[#243027]/5`}>
                    <img src={post.image_url || FALLBACK_IMAGE} className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0" alt={post.title} />
                    {!isWide ? (
                      <div className="absolute bottom-6 right-6 text-[9px] font-bold uppercase tracking-[0.4em] text-white/80 transition-colors [writing-mode:vertical-rl] group-hover:text-white">
                        {post.category || "Volume VI"}
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[#243027]/20 transition-all duration-700 group-hover:bg-transparent" />
                        <div className="absolute bottom-10 left-10 max-w-lg">
                          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.4em] text-white">{post.category || "Ethics & Planet"}</span>
                          <h4 className="font-serif text-5xl leading-tight text-white">{post.title}</h4>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="max-w-xs">
                    <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.3em] text-[#76885B]">{post.category || "Journal"}</span>
                    <h4 className="mb-4 font-serif text-3xl leading-snug transition-all group-hover:italic">{post.title}</h4>
                    <p className="mb-6 text-sm leading-relaxed text-[#243027]/50">{post.excerpt || "Explore our latest botanical insights and practical rituals for healthier hair."}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#243027] text-[8px] font-bold text-white">
                        {(post.author || "LX").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#243027]/40">
                        {estimateReadTime(post.content, post.readTime)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full rounded-sm border border-[#243027]/10 bg-white p-12 text-center">
              <p className="text-[#243027]/60">No published blog entries yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#243027] px-8 py-32 text-center lg:px-20">
        <div className="absolute left-0 top-0 h-full w-full overflow-hidden opacity-10">
          <i className="ph ph-leaf absolute -left-20 -top-20 rotate-45 text-[400px] text-white" />
          <i className="ph ph-flower-lotus absolute -bottom-20 -right-20 -rotate-12 text-[400px] text-white" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-10 block text-[11px] font-bold uppercase tracking-[0.6em] text-[#76885B]">Community Matters</span>
          <h2 className="mb-12 font-serif text-5xl leading-tight text-[#F2F0EB] lg:text-7xl">
            Crafting a conscious <br /> <span className="font-normal italic">dialogue.</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-xl leading-relaxed text-[#F2F0EB]/60">
            Receive our monthly editorial direct to your inbox. No spam, just botanical insights and early access to limited harvests.
          </p>
          <form className="mx-auto flex max-w-xl flex-col gap-4 md:flex-row">
            <input type="email" placeholder="Your Email Address" className="flex-1 rounded-full border border-white/10 bg-white/5 px-8 py-5 text-sm text-white transition-all placeholder:text-white/60 focus:bg-white/10 focus:outline-none" />
            <button type="button" className="rounded-full bg-[#76885B] px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-[#243027]">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-lux-text/5 bg-lux-background px-6 pb-12 pt-24 sm:px-12 sm:pt-32">
        <div className="mx-auto mb-24 grid max-w-7xl grid-cols-12 gap-12 sm:mb-32">
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-10 flex items-center">
              <img
                src="/luxivie-logo.png"
                alt="LUXIVIE"
                className="h-10 w-auto sm:h-12"
              />
            </div>
            <p className="mb-10 max-w-sm leading-relaxed text-lux-text/40">
              Small batch hair care, formulated for the conscious soul.
              Botanically powerful, ethically created.
            </p>
            <div className="flex gap-4">
              {["instagram-logo", "pinterest-logo", "tiktok-logo"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-lux-text/10 transition-all hover:bg-lux-accent hover:text-white"
                  aria-label={icon.replace("-logo", "")}
                >
                  <i className={`ph ph-${icon} text-xl`} aria-hidden />
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <h5 className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Collection
            </h5>
            <ul className="space-y-6 text-sm text-lux-text/60">
              {["Bestsellers", "Scalp Care", "Growth Rituals", "New Arrivals"].map(
                (t) => (
                  <li key={t}>
                    <Link
                      href="/products"
                      className="transition-colors hover:text-lux-text"
                    >
                      {t}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <h5 className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Journal
            </h5>
            <ul className="space-y-6 text-sm text-lux-text/60">
              {[
                ["Our Sourcing", "/blog"],
                ["Ritual Guides", "/blog"],
                ["Ingredients", "/blog"],
                ["About Us", "/blog"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-lux-text">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <h5 className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Locations
            </h5>
            <div className="space-y-8">
              <div>
                <p className="mb-2 text-sm font-bold text-lux-text">
                  Vancouver Flagship
                </p>
                <p className="text-sm text-lux-text/40">
                  1240 Robson St, BC V6E 1C1
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-lux-text">
                  Toronto Studio
                </p>
                <p className="text-sm text-lux-text/40">
                  181 Bay Street, ON M5J 2T3
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 border-t border-lux-text/5 pt-12 md:flex-row">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-lux-text/20 md:text-left">
            © 2026 LUXIVIE BOTANICALS. FOR THE CONSCIOUS SOUL.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-lux-text/20 md:gap-12">
            {["Shipping", "Returns", "Privacy"].map((t) => (
              <a key={t} href="#" className="transition-colors hover:text-lux-text">
                {t}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
