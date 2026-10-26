/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic"

import Link from "next/link"
import { LandingNav } from "@/components/luxivie-landing/LandingNav"
import { SocialLinks } from "@/components/luxivie-landing/SocialLinks"
import { getPublishedBlogs } from "@/lib/blogs"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop"

function estimateReadTime(html: string, readTime?: string) {
  if (readTime) return readTime
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  const words = plain ? plain.split(" ").length : 0
  return `${Math.max(3, Math.ceil(words / 220))} Min Read`
}

function extractFirstImageFromContent(html: string): string | undefined {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return imgMatch ? imgMatch[1] : undefined
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams
  const posts = await getPublishedBlogs()
  const categories = [...new Set(posts.map((p) => p.category).filter((value): value is string => Boolean(value)))]
  const filteredPosts = category ? posts.filter((p) => p.category === category) : posts
  const list = filteredPosts.slice(0, 7)
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
            <h1 className="mb-8 font-serif text-5xl leading-[1.1] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Living <br /> <span className="pl-20 italic lg:pl-40">Well.</span>
            </h1>
          </div>
          <div className="max-w-sm pb-4">
            <p className="mb-6 text-base italic leading-[1.8] text-lux-text/65">
              Thoughtful hair care guidance rooted in botanicals, designed to help you build a routine that works for your hair and everyday life.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium tracking-[0.08em] text-lux-text/55">
              <span>The Luxivie Journal</span>
              <span>•</span>
              <span>Hair care, simplified</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-40 px-8 lg:px-20">
        {categories.length > 0 && (
          <nav className="mb-12 border-y border-lux-text/10 py-5" aria-label="Filter journal articles by topic">
            <p className="mb-3 text-xs font-medium tracking-[0.08em] text-lux-text/55">Browse by topic</p>
            <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              <Link
                href="/blog"
                aria-current={!category ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-accent focus-visible:ring-offset-2 ${
                  !category
                    ? "border-lux-text bg-lux-text text-white shadow-sm"
                    : "border-lux-text/15 bg-white/50 text-lux-text/70 hover:border-lux-text/40 hover:bg-white hover:text-lux-text"
                }`}
              >
                {!category && <span className="h-1.5 w-1.5 rounded-full bg-lux-accent" aria-hidden="true" />}
                All topics
              </Link>
              {categories.map((topic) => {
                const isActive = category === topic
                return (
                  <Link
                    key={topic}
                    href={`/blog?category=${encodeURIComponent(topic)}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-accent focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-lux-text bg-lux-text text-white shadow-sm"
                        : "border-lux-text/15 bg-white/50 text-lux-text/70 hover:border-lux-text/40 hover:bg-white hover:text-lux-text"
                    }`}
                  >
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-lux-accent" aria-hidden="true" />}
                    {topic}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
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
                    <img src={extractFirstImageFromContent(post.content) || post.image_url || FALLBACK_IMAGE} className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0" alt={post.title} />
                    {!isWide ? (
                      <div className="absolute bottom-6 right-6 text-xs font-medium tracking-[0.12em] text-white/80 transition-colors [writing-mode:vertical-rl] group-hover:text-white">
                        {post.category || "Volume VI"}
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[#243027]/20 transition-all duration-700 group-hover:bg-transparent" />
                        <div className="absolute bottom-10 left-10 max-w-lg">
                          <span className="mb-4 block text-xs font-medium tracking-[0.12em] text-white">{post.category || "Ethics & Planet"}</span>
                          <h4 className="font-serif text-4xl leading-[1.1] tracking-[-0.025em] text-white sm:text-5xl">{post.title}</h4>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="max-w-xs">
                    <span className="mb-4 block text-xs font-medium tracking-[0.12em] text-lux-accent">{post.category || "Journal"}</span>
                    <h4 className="mb-4 font-serif text-2xl leading-snug tracking-[-0.02em] transition-all group-hover:italic sm:text-3xl">{post.title}</h4>
                    <p className="mb-6 text-sm leading-[1.75] text-lux-text/65">{post.excerpt || "Explore our latest botanical insights and practical rituals for healthier hair."}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lux-text text-xs font-medium text-white">
                        {(post.author || "LX").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-lux-text/55">
                        {estimateReadTime(post.content, post.readTime)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full rounded-sm border border-[#243027]/10 bg-white p-12 text-center">
            <p className="text-lux-text/60">No published blog entries yet.</p>
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
          <span className="mb-10 block text-xs font-medium tracking-[0.12em] text-lux-background/60">Community Matters</span>
          <h2 className="mb-12 font-serif text-4xl tracking-[-0.025em] text-[#F2F0EB] sm:text-5xl lg:text-7xl">
            Crafting a conscious <br /> <span className="italic">dialogue.</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-base leading-[1.8] text-[#F2F0EB]/60 sm:text-lg">
            Receive our monthly editorial direct to your inbox. No spam, just botanical insights and early access to limited harvests.
          </p>
          <form className="mx-auto flex max-w-xl flex-col gap-4 md:flex-row">
            <input type="email" placeholder="Your Email Address" className="flex-1 rounded-full border border-white/10 bg-white/5 px-8 py-5 text-sm text-white transition-all placeholder:text-white/60 focus:bg-white/10 focus:outline-none" />
            <button type="button" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-lux-background px-8 py-3 text-xs font-semibold tracking-[0.04em] text-lux-text transition-colors hover:bg-lux-accent hover:text-white">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-lux-text/5 bg-lux-background px-6 pb-12 pt-24 sm:px-12 sm:pt-32">
        <div className="mx-auto mb-24 flex max-w-7xl flex-col justify-between gap-12 sm:mb-32 lg:flex-row lg:items-start">
          <div className="max-w-sm">
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
          </div>
          <div className="lg:ml-auto">
            <SocialLinks className="flex justify-start gap-4 lg:justify-end" />
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
