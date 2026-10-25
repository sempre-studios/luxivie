/* eslint-disable @next/next/no-img-element -- CMS product images are remote and must preserve their full packshot framing. */
import Image from "next/image"
import Link from "next/link"
import { LandingNav, ScrollReveal } from "./LandingNav"
import { SocialLinks } from "./SocialLinks"
import { TrackedLink } from "./TrackedLink"
import { FALLBACK_PRODUCTS, type LandingProduct } from "@/lib/landing-products"

const AMAZON_LINKS = {
  rosemaryMint: "https://www.amazon.ca/dp/B0G5SDZNB7",
  biotinKeratin: "https://www.amazon.ca/dp/B0G6XKF4N5",
  rosemaryOil: "https://www.amazon.ca/dp/B0FJYHPHBG",
} as const

const HAIR_CARE_GUIDES = [
  {
    eyebrow: "Oily hair",
    title: "Choosing a lightweight conditioner",
    href: "https://www.luxivie.ca/blog/how-to-choose-a-lightweight-conditioner-for-oily-hair",
  },
  {
    eyebrow: "Normal-to-dry hair",
    title: "Biotin vs keratin: the difference",
    href: "https://www.luxivie.ca/blog/biotin-vs-keratin-whats-the-difference",
  },
] as const

const EMPTY_PRODUCT: LandingProduct = {
  id: "fallback-empty",
  name: "Product",
  price: 0,
  image_url: "",
  benefits: [],
  description: "",
  status: "active",
  is_bestseller: false,
  rating: null,
  review_count: 0,
  badges: [],
}

function findProductByKeywords(products: LandingProduct[], keywords: string[], fallbackIndex: number) {
  const match = products.find((product) => {
    const name = product.name.toLowerCase()
    return keywords.every((keyword) => name.includes(keyword))
  })

  return match ?? FALLBACK_PRODUCTS[fallbackIndex] ?? products[0] ?? EMPTY_PRODUCT
}

function productPageHref(product: LandingProduct) {
  return product.id && product.id !== "fallback-empty" ? `/products/${product.id}` : "/products"
}

type LuxivieLandingPageProps = { products: LandingProduct[] }

const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-lux-text px-8 py-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-accent"

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-lux-text/20 px-8 py-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-lux-text transition-colors hover:border-lux-text hover:bg-lux-text hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-accent"

export function LuxivieLandingPage({ products }: LuxivieLandingPageProps) {
  const rosemaryMint = findProductByKeywords(products, ["rosemary mint", "shampoo"], 0)
  const biotinKeratin = findProductByKeywords(products, ["biotin", "keratin"], 3)
  const rosemaryOil = findProductByKeywords(products, ["rosemary", "oil"], 2)

  return (
    <div className="min-h-screen overflow-x-hidden bg-lux-background text-lux-text">
      <LandingNav />

      <main>
        <section id="hero" className="px-6 pb-20 pt-32 sm:px-12 sm:pb-28 sm:pt-40">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <ScrollReveal y={18}>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
                Hair care that fits your routine
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                Your hair needs.
                <br />
                <span className="italic">A routine that fits.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-lux-text/70">
                Oily roots or dry-feeling lengths? Start with care chosen for what your hair needs today.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href="#find-your-routine" className={primaryButton}>Find my routine</a>
                <a href="#products" className={secondaryButton}>Explore our products</a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08} y={14} className="hidden md:block">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { product: rosemaryMint, label: "Oily hair", href: "#rosemary-mint" },
                  { product: biotinKeratin, label: "Normal-to-dry hair", href: "#biotin-keratin" },
                ].map(({ product, label, href }) => (
                  <a key={label} href={href} className="group rounded-[36px] border border-lux-text/10 bg-white p-4 shadow-[0_24px_60px_-30px_rgba(27,45,36,.35)]">
                    <div className="aspect-[4/5] rounded-[28px] bg-lux-sand/55 p-4">
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <p className="px-2 pb-2 pt-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-lux-text/65">{label}</p>
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="find-your-routine" className="scroll-mt-24 bg-lux-mist/45 px-6 py-20 sm:px-12">
          <div className="mx-auto max-w-[1200px]">
            <ScrollReveal y={14}>
              <h2 className="mb-10 font-serif text-4xl sm:text-5xl">What would you like help with?</h2>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Oily roots", "Explore Rosemary Mint", "#rosemary-mint", "rosemary-mint"],
                ["Normal-to-dry hair", "Explore Biotin + Keratin", "#biotin-keratin", "biotin-keratin"],
                ["Dry-looking ends", "Explore Rosemary Hair Oil", "#rosemary-oil", "rosemary-oil"],
              ].map(([title, cta, href, product], index) => (
                <ScrollReveal key={title} delay={index * 0.06} y={12}>
                  <TrackedLink href={href} event="concern_select" section="find-your-routine" product={product} className="group block min-h-32 rounded-[28px] border border-lux-text/10 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-lux-accent/30 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-accent">
                    <h3 className="font-serif text-2xl">{title}</h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-lux-accent">{cta}<i className="ph ph-arrow-down" aria-hidden /></span>
                  </TrackedLink>
                </ScrollReveal>
              ))}
            </div>
            <p className="mt-6 text-sm text-lux-text/60">Not sure, or have oily roots and dry ends? See the routine guidance below.</p>
          </div>
        </section>

        <section id="products" className="scroll-mt-24 px-6 py-24 sm:px-12 sm:py-32">
          <div className="mx-auto max-w-[1200px]">
            <ScrollReveal y={14} className="mb-14">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">Choose your wash-day routine</p>
              <h2 className="font-serif text-4xl sm:text-6xl">Two sets. Different hair needs.</h2>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-2">
              <RoutineCard id="rosemary-mint" eyebrow="For oily hair" title="Rosemary Mint" size="Shampoo + Conditioner | 2 x 500 mL" description="A fresh, clean feel with conditioning for manageable hair." note="Not recommended for dry hair." product={rosemaryMint} amazonHref={AMAZON_LINKS.rosemaryMint} tint="bg-lux-mist/50" />
              <RoutineCard id="biotin-keratin" eyebrow="For normal-to-dry hair" title="Biotin + Keratin" size="Shampoo + Conditioner | 2 x 500 mL" description="Nourished, manageable and healthy-looking hair." note="Choose for normal-to-dry hair needs." product={biotinKeratin} amazonHref={AMAZON_LINKS.biotinKeratin} tint="bg-lux-sand/50" />
            </div>

            <ScrollReveal y={16}>
              <article id="rosemary-oil" className="mt-8 scroll-mt-28 grid items-center gap-10 rounded-[40px] bg-lux-mist/55 p-7 sm:p-10 md:grid-cols-[.7fr_1.3fr] lg:p-14">
                <div className="aspect-square rounded-[30px] bg-white p-6">
                  <img src={rosemaryOil.image_url} alt={rosemaryOil.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-lux-accent">Optional care for lengths &amp; ends</p>
                  <h3 className="font-serif text-3xl sm:text-5xl">A little extra care for dry-looking ends.</h3>
                  <p className="mt-6 text-lg leading-relaxed text-lux-text/70">Rosemary Hair Oil | 100 mL<br />For softness, shine and a healthy-looking finish.</p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <TrackedLink href={AMAZON_LINKS.rosemaryOil} event="amazon_outbound_click" section="rosemary-oil" product="rosemary-oil" className={primaryButton}>Buy on Amazon.ca</TrackedLink>
                    <TrackedLink href={productPageHref(rosemaryOil)} event="product_details_open" section="rosemary-oil" product="rosemary-oil" className={secondaryButton}>Explore the oil</TrackedLink>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-white px-6 py-24 sm:px-12">
          <div className="mx-auto max-w-[1200px]">
            <ScrollReveal y={14}><h2 className="font-serif text-4xl sm:text-5xl">Know what you are choosing.</h2></ScrollReveal>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                ["Clear product fit", "Oily hair and normal-to-dry hair have distinct routines."],
                ["Straightforward details", "Ingredients and directions are easy to find on each product page."],
                ["A simple next step", "Choose your product, then complete your order on Amazon.ca."],
              ].map(([title, body], index) => (
                <ScrollReveal key={title} delay={index * 0.06} y={10}>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-lux-text/65">{body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="routine-guidance" className="px-6 py-24 sm:px-12 sm:py-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-16 lg:grid-cols-[1.2fr_.8fr]">
              <ScrollReveal y={14}>
                <h2 className="font-serif text-4xl sm:text-5xl">A routine you can keep simple.</h2>
                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                  {[
                    ["01", "Choose your duo", "Match the set to oily or normal-to-dry hair."],
                    ["02", "Cleanse & condition", "Follow the directions for your selected products."],
                    ["03", "Finish if needed", "Consider oil for dry-looking lengths and ends."],
                  ].map(([number, title, body]) => (
                    <div key={number}>
                      <span className="font-serif text-4xl text-lux-accent/45">{number}</span>
                      <h3 className="mt-4 font-bold">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-lux-text/60">{body}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08} y={14}>
                <div className="divide-y divide-lux-text/10 border-y border-lux-text/10">
                  {[
                    ["Which set fits my hair?", "Choose Rosemary Mint when oiliness is your main concern. Choose Biotin + Keratin for normal-to-dry hair."],
                    ["What if my hair is fine?", "Choose according to oiliness and dryness rather than strand thickness alone, and adjust the amount used."],
                    ["What about oily roots and dry ends?", "Use the wash routine that best matches your scalp, then apply hair oil sparingly to dry-looking lengths and ends."],
                  ].map(([question, answer]) => (
                    <details key={question} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-accent">{question}<i className="ph ph-plus text-lg transition-transform group-open:rotate-45" aria-hidden /></summary>
                      <p className="pt-4 leading-relaxed text-lux-text/65">{answer}</p>
                    </details>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="guides" className="bg-lux-mist/30 px-6 py-24 sm:px-12">
          <div className="mx-auto max-w-[1200px]">
            <ScrollReveal y={14}><h2 className="font-serif text-4xl sm:text-5xl">Hair Care Guides</h2></ScrollReveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {HAIR_CARE_GUIDES.map((guide, index) => (
                <ScrollReveal key={guide.href} delay={index * 0.06} y={10}>
                  <TrackedLink href={guide.href} event="guide_click" section="guides" product={guide.title} className="group block rounded-[28px] border border-lux-text/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-lux-accent/30 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-accent">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lux-accent">{guide.eyebrow}</p>
                    <h3 className="mt-4 flex items-end justify-between gap-8 font-serif text-2xl sm:text-3xl">{guide.title}<i className="ph ph-arrow-up-right shrink-0 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden /></h3>
                  </TrackedLink>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-lux-text px-6 py-20 text-lux-background sm:px-12">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 className="font-serif text-4xl sm:text-5xl">Find the routine that fits your hair.</h2>
            <a href="#find-your-routine" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-lux-background px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-text transition-colors hover:bg-lux-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Find my routine</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-lux-text/5 bg-lux-background px-6 py-14 sm:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Image src="/luxivie-logo.png" alt="LUXIVIE" width={180} height={48} className="h-9 w-auto" />
            <p className="mt-5 text-sm text-lux-text/55">Hair care for your everyday routine.</p>
          </div>
          <div className="space-y-6 md:text-right">
            <nav className="flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold uppercase tracking-[0.13em]">
              <Link href="/products" className="hover:text-lux-accent">Where to buy</Link>
              <Link href="/blog" className="hover:text-lux-accent">Hair care guides</Link>
            </nav>
            <SocialLinks className="flex gap-4 md:justify-end" />
          </div>
        </div>
      </footer>
    </div>
  )
}

type RoutineCardProps = {
  id: string
  eyebrow: string
  title: string
  size: string
  description: string
  note: string
  product: LandingProduct
  amazonHref: string
  tint: string
}

function RoutineCard({ id, eyebrow, title, size, description, note, product, amazonHref, tint }: RoutineCardProps) {
  return (
    <ScrollReveal y={16}>
      <article id={id} className="scroll-mt-28 rounded-[40px] border border-lux-text/10 bg-white p-5 shadow-sm sm:p-7">
        <div className={`aspect-[4/3] rounded-[30px] p-6 ${tint}`}>
          <img src={product.image_url} alt={product.name} className="h-full w-full object-contain" />
        </div>
        <div className="p-2 pt-8 sm:p-4 sm:pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-lux-accent">{eyebrow}</p>
          <h3 className="mt-4 font-serif text-3xl sm:text-4xl">{title}</h3>
          <p className="mt-4 font-medium">{size}</p>
          <p className="mt-6 text-lg leading-relaxed text-lux-text/70">{description}</p>
          <p className="mt-5 font-bold">{note}</p>
          <div className="mt-8 grid gap-3">
            <TrackedLink href={amazonHref} event="amazon_outbound_click" section={id} product={id} className={primaryButton}>Buy on Amazon.ca</TrackedLink>
            <TrackedLink href={productPageHref(product)} event="product_details_open" section={id} product={id} className={secondaryButton}>View ingredients &amp; product details</TrackedLink>
          </div>
        </div>
      </article>
    </ScrollReveal>
  )
}
