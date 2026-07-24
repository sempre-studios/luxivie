/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { Metadata } from "next"
import { getBlogBySlug, getPublishedBlogs, type BlogPost } from "@/lib/blogs"
import { LandingNav } from "@/components/luxivie-landing/LandingNav"
import { SocialLinks } from "@/components/luxivie-landing/SocialLinks"

export const dynamic = "force-dynamic"

interface BlogPostPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await getBlogBySlug(id)
  if (!post) return { title: 'Journal' }
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function authorInitials(author?: string) {
  if (!author) return "LX"
  return author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function estimateReadTime(html: string, readTime?: string) {
  if (readTime) return readTime
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  const words = plain ? plain.split(" ").length : 0
  return `${Math.max(3, Math.ceil(words / 220))} Min Read`
}

function RelatedCard({ post }: { post: BlogPost }) {
  const img =
    post.image_url ||
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop"
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="filmstrip-card relative flex-shrink-0 snap-start group overflow-hidden rounded-[40px]"
      style={{
        flex: "0 0 450px",
        height: 600,
        boxShadow: "20px 20px 60px rgba(36,48,39,0.05),-5px -5px 30px rgba(255,255,255,0.5)",
      }}
    >
      <img
        src={img}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#243027]/90 via-[#243027]/20 to-transparent p-12">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#76885B]">
          {post.category || "Journal"}
        </span>
        <h4 className="mb-6 font-serif text-4xl text-[#F2F0EB] leading-tight">{post.title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F2F0EB]/40">
            {estimateReadTime(post.content, post.readTime)}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
            <i className="ph ph-arrow-up-right" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = await getBlogBySlug(id)
  const allBlogs = await getPublishedBlogs()
  const related = allBlogs.filter((p) => p.id !== post?.id).slice(0, 4)

  if (!post) {
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-8">
          <p className="text-[#243027]/50 text-lg">Blog post not found.</p>
          <Link href="/blog" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#76885B] hover:underline">
            ← Back to Journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="m-0 min-h-screen w-full overflow-x-hidden bg-[#F2F0EB] p-0 text-[#243027]">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <LandingNav />

      {/* ── Article Header ── */}
      <header className="px-6 pb-12 pt-48 lg:px-24">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb + status row */}
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#243027]/40">
              <Link href="/blog" className="transition-colors hover:text-[#243027]">Journal</Link>
              <span>/</span>
              <span className="text-[#243027]/60">{post.category || "Article"}</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-[#76885B]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#76885B]">
                <span className="h-1 w-1 rounded-full bg-[#76885B]" />
                Published
              </span>
              <span className="font-mono text-[9px] text-[#243027]/30">#{post.slug}</span>
            </div>
          </div>

          {/* Category pill + title */}
          <div className="mb-12">
            {post.category && (
              <span className="mb-8 inline-block rounded-full bg-[#76885B] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.4em] text-white">
                {post.category}
              </span>
            )}
            <h1 className="mb-10 font-serif text-6xl leading-[0.9] tracking-tight md:text-8xl lg:text-[100px]">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#243027]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Author + meta row */}
          <div className="flex flex-col justify-between gap-8 border-b border-t border-[#243027]/10 py-10 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#243027] text-xs font-bold text-white ring-4 ring-white/50">
                {authorInitials(post.author)}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#243027]">
                  {post.author || "Luxivie Team"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#243027]/40">Botanical Research</p>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-start md:items-end">
                <span className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#243027]/30">Published</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#243027]/70">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#243027]/30">Read Time</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#243027]/70">
                  {estimateReadTime(post.content, post.readTime)}
                </span>
              </div>
              {/* Social links */}
              <div className="border-l border-[#243027]/10 pl-10">
                <SocialLinks visibility={post.socialVisibility} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 pb-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#76885B] transition-colors hover:text-[#243027]"
          >
            <i className="ph ph-arrow-left" />
            Back to Journal
          </Link>
        </div>
      </div>

      {/* ── Article Body ── */}
      <section className="mb-40 px-6 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div
            className="article-content"
            style={
              {
                "--article-h2-font": "Playfair Display, serif",
              } as React.CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* ── Related Posts Filmstrip ── */}
      {related.length > 0 && (
        <section className="overflow-hidden bg-[#F2F0EB] pb-12">
          <div className="mb-10 flex items-end justify-between px-6 lg:px-24">
            <div>
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.6em] text-[#76885B]">
                Archive Feed
              </span>
              <h3 className="font-serif text-5xl leading-none lg:text-7xl">
                Related <br />
                <span className="italic">Perspectives.</span>
              </h3>
            </div>
            <div className="flex gap-4">
              {["arrow-left", "arrow-right"].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#243027]/10 transition-all hover:bg-[#243027] hover:text-white"
                >
                  <i className={`ph ph-${icon} text-xl`} />
                </button>
              ))}
            </div>
          </div>
          <div className="hide-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 py-10 lg:px-24">
            {related.map((p) => (
              <RelatedCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Footer (matches /blog) ── */}
      <footer className="border-t border-lux-text/5 bg-lux-background px-6 pb-12 pt-24 sm:px-12 sm:pt-32">
        <div className="mx-auto mb-24 grid max-w-7xl grid-cols-12 gap-12 sm:mb-32">
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-10 flex items-center">
              <img src="/luxivie-logo.png" alt="LUXIVIE" className="h-10 w-auto sm:h-12" />
            </div>
            <p className="mb-10 max-w-sm leading-relaxed text-lux-text/40">
              Small batch hair care, formulated for the conscious soul. Botanically powerful, ethically created.
            </p>
            <SocialLinks visibility={post.socialVisibility} />
          </div>
          <div className="col-span-6 lg:col-span-2">
            <h5 className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">Collection</h5>
            <ul className="space-y-6 text-sm text-lux-text/60">
              {["Bestsellers", "Scalp Care", "Growth Rituals", "New Arrivals"].map((t) => (
                <li key={t}>
                  <Link href="/products" className="transition-colors hover:text-lux-text">{t}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <h5 className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">Journal</h5>
            <ul className="space-y-6 text-sm text-lux-text/60">
              {[["Our Sourcing", "/blog"], ["Ritual Guides", "/blog"], ["Ingredients", "/blog"], ["About Us", "/blog"]].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-lux-text">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <h5 className="mb-10 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">Locations</h5>
            <div className="space-y-8">
              <div>
                <p className="mb-2 text-sm font-bold text-lux-text">Vancouver Flagship</p>
                <p className="text-sm text-lux-text/40">1240 Robson St, BC V6E 1C1</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-lux-text">Toronto Studio</p>
                <p className="text-sm text-lux-text/40">181 Bay Street, ON M5J 2T3</p>
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
              <a key={t} href="#" className="transition-colors hover:text-lux-text">{t}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
