/* eslint-disable @next/next/no-img-element -- Unsplash assets match static design */
import Link from "next/link"
import Image from "next/image"
import { LandingNav, ScrollReveal } from "./LandingNav"
import { SocialLinks } from "./SocialLinks"
import { cn } from "@/components/ui/utils"
import {
  FALLBACK_PRODUCTS,
  type LandingProduct,
} from "@/lib/landing-products"

const IMG = {
  sustainable:
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop",
}

const HAIR_CARE_GUIDES = [
  {
    title: "Leave-in conditioner vs hair oil",
    category: "Dry & Damaged Hair",
    excerpt:
      "Learn the difference between leave-in conditioner and hair oil for dry hair and how to use both in a Canadian winter routine.",
    href: "https://www.luxivie.ca/blog/leave-in-conditioner-vs-hair-oil-for-dry-hair",
    image:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/blog-images/blog-1789249268618-ztzwqy.jpg",
  },
  {
    title: "Biotin vs keratin: the difference",
    category: "Dry & Damaged Hair",
    excerpt:
      "Compare biotin and keratin, learn how each supports hair, and choose the right strengthening care for damaged strands.",
    href: "https://www.luxivie.ca/blog/biotin-vs-keratin-whats-the-difference",
    image:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/blog-images/blog-1785126291444-68jdpu.jpg",
  },
  {
    title: "Choosing a lightweight conditioner",
    category: "Oily Hair",
    excerpt:
      "Learn how to choose a lightweight conditioner for oily hair that hydrates ends without weighing down the roots.",
    href: "https://www.luxivie.ca/blog/how-to-choose-a-lightweight-conditioner-for-oily-hair",
    image:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/blog-images/blog-1785803763345-08bood.jpg",
  },
] as const

function amazonProductLink(productName: string) {
  const normalized = productName.toLowerCase()

  if (normalized.includes("biotin") && normalized.includes("conditioner")) {
    return "https://www.amazon.ca/Luxivie-Conditioner-Fortifying-Nourishing-Fuller-Looking/dp/B0G6XKF4N5/"
  }

  if (
    normalized.includes("rosemary mint shampoo") &&
    normalized.includes("conditioner")
  ) {
    return "https://www.amazon.ca/Luxivie-Conditioner-Clarifying-Lightweight-Fuller-Looking/dp/B0G5SDZNB7"
  }

  if (normalized.includes("rosemary hair oil")) {
    return "https://www.amazon.ca/Luxivie-Rosemary-Hair-3-38-Healthy-Looking/dp/B0FJYHPHBG"
  }

  if (
    normalized.includes("rosemary") &&
    (normalized.includes("serum") || normalized.includes("scalp serum"))
  ) {
    return "https://www.amazon.ca/Luxivie-Rosemary-Peppermint-Castor-Lightweight/dp/B0DZNDJ8XV"
  }

  return "https://www.amazon.ca/s?k=Luxivie"
}

function productPageHref(product: LandingProduct) {
  if (!product.id || product.id === "fallback-empty") {
    return "/products"
  }
  return `/products/${product.id}`
}

type LuxivieLandingPageProps = {
  products: LandingProduct[]
}

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

function productBenefits(product: LandingProduct) {
  if (product.benefits.length > 0) return product.benefits.slice(0, 3)

  if (product.description.trim()) {
    return product.description
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3)
  }

  return ["Discover this formula in our collection."]
}

function findProductByKeywords(
  products: LandingProduct[],
  keywords: string[],
  fallbackIndex: number,
): LandingProduct {
  const match = products.find((p) => {
    const n = p.name.toLowerCase()
    return keywords.every((kw) => n.includes(kw))
  })
  return match ?? FALLBACK_PRODUCTS[fallbackIndex] ?? products[0] ?? EMPTY_PRODUCT
}

export function LuxivieLandingPage({ products }: LuxivieLandingPageProps) {
  const rosemaryMintSet = findProductByKeywords(
    products,
    ["rosemary mint", "shampoo"],
    0,
  )
  const biotinKeratinSet = findProductByKeywords(
    products,
    ["biotin", "keratin"],
    3,
  )
  const rosemaryOil = findProductByKeywords(
    products,
    ["rosemary", "oil"],
    2,
  )
  const heroImageA = rosemaryOil.image_url || rosemaryMintSet.image_url
  const heroAltA = rosemaryOil.name || "Luxivie Rosemary Hair Oil"

  return (
    <div className="m-0 h-full w-full overflow-x-hidden bg-lux-background p-0 text-lux-text scrollbar-hide">
      <LandingNav />

      <section id="hero" className="relative flex min-h-screen items-center px-6 pb-20 pt-20 sm:px-12 sm:pt-28">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal y={20}>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-lux-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
                Designed in Canada
              </span>
            </div>
            <h1 className="mb-10 font-serif text-5xl leading-none sm:text-6xl lg:text-8xl">
              Clean Beauty, <br />
              <span className="font-normal italic">Made to</span> <br />
              Perform
            </h1>
            <p className="mb-12 max-w-lg text-lg leading-relaxed text-lux-text/70">
              Luxivie is modern hair care crafted with thoughtfully chosen
              ingredients and a feel-good routine clean, gentle, and designed
              for everyday results.
            </p>
            <div className="mb-16 flex flex-wrap items-center gap-6">
              <a
                href="#hair-concerns"
                className="rounded-full bg-lux-accent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:brightness-110 shadow-[0_25px_50px_-12px_rgb(201_124_93_/_0.2)]"
              >
                Find my routine
              </a>
              <a
                href="#products"
                className="group flex items-center gap-3 border-b border-lux-text pb-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-lux-accent hover:text-lux-accent"
              >
                Explore our products
                <i className="ph ph-arrow-down text-lg" aria-hidden />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal
            delay={0.1}
            y={14}
            className="relative isolate hidden md:flex md:items-center md:justify-center lg:justify-end"
          >
            <div className="relative isolate w-full max-w-[520px] p-5 sm:p-7">
              {/* Permanent soft layered backdrop (z-0 inside isolated stacking context) */}
              <div
                aria-hidden
                className="organic-shape pointer-events-none absolute -inset-2 z-0 bg-lux-mist/65"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 z-0 rounded-[48px] border border-lux-text/10 bg-lux-sand/50"
              />

              <div className="relative z-10 space-y-4">
                {/* Main featured product card */}
                <a
                  href="#product-rosemary-mint"
                  className="group block rounded-[36px] border border-lux-text/10 bg-white p-4 shadow-[0_24px_50px_-12px_rgba(27,45,36,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-12px_rgba(27,45,36,0.18)]"
                >
                  <div className="mb-3 flex items-center justify-between px-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lux-mist text-lux-accent">
                        <i className="ph ph-leaf text-xs" aria-hidden />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-lux-text/70">
                        Sulfate &amp; Paraben Free
                      </span>
                    </div>
                    <span className="rounded-full bg-lux-mist/60 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-lux-text">
                      Bestseller Duo
                    </span>
                  </div>

                  <div className="aspect-[16/13] w-full overflow-hidden rounded-[26px] bg-lux-sand/40">
                    <img
                      src={rosemaryMintSet.image_url || heroImageA}
                      alt={rosemaryMintSet.name || heroAltA}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between px-2 pb-1">
                    <div className="min-w-0 pr-3">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-lux-accent">
                        Clarifying &amp; Volume
                      </span>
                      <p className="truncate font-serif text-base text-lux-text sm:text-lg">
                        {rosemaryMintSet.name}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lux-text text-white transition-colors group-hover:bg-lux-accent">
                      <i className="ph ph-arrow-down-right text-sm" aria-hidden />
                    </span>
                  </div>
                </a>

                {/* Companion cards row below — no overlap */}
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="#product-biotin-keratin"
                    className="group flex items-center gap-3.5 rounded-[26px] border border-lux-text/10 bg-white/95 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-lux-accent/30 hover:shadow-md"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-lux-sand">
                      <img
                        src={biotinKeratinSet.image_url || heroImageA}
                        alt={biotinKeratinSet.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-lux-accent">
                        Strength Care
                      </span>
                      <p className="truncate font-serif text-sm text-lux-text">
                        Biotin + Keratin
                      </p>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lux-text/50 transition-colors group-hover:text-lux-accent">
                        Explore
                        <i className="ph ph-arrow-down text-xs" aria-hidden />
                      </span>
                    </div>
                  </a>

                  <a
                    href="#oil-section"
                    className="group flex items-center gap-3.5 rounded-[26px] border border-lux-text/10 bg-white/95 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-lux-accent/30 hover:shadow-md"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-lux-sand">
                      <img
                        src={heroImageA}
                        alt={heroAltA}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-lux-accent">
                        Botanical Oil
                      </span>
                      <p className="truncate font-serif text-sm text-lux-text">
                        {rosemaryOil.name}
                      </p>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lux-text/50 transition-colors group-hover:text-lux-accent">
                        Explore
                        <i className="ph ph-arrow-down text-xs" aria-hidden />
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="values" className="border-y border-lux-text/5 px-6 py-24 sm:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-3">
          {[
            {
              icon: "ph-flask",
              title: "Clinically Proven",
              body: "Dermatologist tested formulas that deliver visible results in 14 days.",
            },
            {
              icon: "ph-leaf",
              title: "100% Botanical",
              body: "Every ingredient is ethically sourced and derived from the purest plants.",
            },
            {
              icon: "ph-heart",
              title: "Cruelty Free",
              body: "Leaping Bunny certified. We never test on animals, only on willing hair.",
            },
          ].map((item, idx) => (
            <ScrollReveal
              key={item.title}
              delay={idx * 0.08}
              y={16}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lux-mist text-lux-text">
                <i className={`ph ${item.icon} text-3xl`} aria-hidden />
              </div>
              <h3 className="mb-3 font-serif text-2xl">{item.title}</h3>
              <p className="text-sm leading-relaxed text-lux-text/50">{item.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section
        id="hair-concerns"
        className="scroll-mt-24 bg-lux-mist/20 px-6 py-28 sm:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal y={16} className="mb-16 text-center">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Personalized Discovery
            </span>
            <h2 className="mb-4 font-serif text-4xl sm:text-5xl">
              Match Your Hair Concern
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-lux-text/60 sm:text-lg">
              Choose what your hair needs most right now to jump directly to the
              formula crafted for your routine.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: "ph-wind",
                tag: "Clarifying & Volume",
                title: "Oily Roots, Buildup & Flat Hair",
                body: "Refreshing rosemary and cooling peppermint gently cleanse away buildup while adding lightweight body and lift.",
                cta: "Explore Rosemary Mint",
                href: "#product-rosemary-mint",
              },
              {
                icon: "ph-shield-check",
                tag: "Strength & Smoothness",
                title: "Dry, Damaged or Brittle Strands",
                body: "Fortifying biotin and smoothing keratin soften rough texture, ease detangling, and leave hair looking fuller and polished.",
                cta: "Explore Biotin + Keratin",
                href: "#product-biotin-keratin",
              },
              {
                icon: "ph-drop",
                tag: "Shine & Scalp Care",
                title: "Dry Ends, Frizz & Dullness",
                body: "A lightweight blend of 100% natural oils to nourish the scalp, smooth split ends, and lock in healthy-looking shine.",
                cta: "Explore Rosemary Hair Oil",
                href: "#oil-section",
              },
            ].map((choice, idx) => (
              <ScrollReveal
                key={choice.title}
                delay={idx * 0.09}
                y={18}
                className="flex flex-col justify-between rounded-[40px] border border-lux-text/10 bg-white p-10 shadow-sm transition-all hover:-translate-y-1 hover:border-lux-accent/30 hover:shadow-xl"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-lux-accent">
                      {choice.tag}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lux-mist/60 text-lux-text">
                      <i className={`ph ${choice.icon} text-2xl`} aria-hidden />
                    </div>
                  </div>
                  <h3 className="mb-4 font-serif text-2xl sm:text-3xl">
                    {choice.title}
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-lux-text/60 sm:text-base">
                    {choice.body}
                  </p>
                </div>
                <a
                  href={choice.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lux-text px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
                >
                  {choice.cta}
                  <i className="ph ph-arrow-down text-sm" aria-hidden />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 px-6 py-28 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal y={16} className="mb-20 text-center">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Complete Wash-Day Duos
            </span>
            <h2 className="mb-4 font-serif text-4xl sm:text-5xl">
              Shampoo &amp; Conditioner Sets
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-lux-text/60 sm:text-lg">
              Thoughtfully paired cleansing and conditioning routines formulated
              without sulfates or parabens.
            </p>
          </ScrollReveal>

          <div className="space-y-24">
            <div
              id="product-rosemary-mint"
              className="scroll-mt-28 grid grid-cols-1 items-center gap-12 rounded-[48px] border border-lux-text/10 bg-white p-8 shadow-sm sm:p-14 lg:grid-cols-2 lg:gap-16"
            >
              <ScrollReveal y={18}>
                <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
                  {rosemaryMintSet.badges[0] || "Clarifying & Volumizing Set"}
                </span>
                <h3 className="mb-6 font-serif text-3xl sm:text-5xl">
                  <span>{rosemaryMintSet.name}</span>
                </h3>
                <ul className="mb-10 list-none space-y-3 text-base leading-relaxed text-lux-text/70 sm:text-lg">
                  {productBenefits(rosemaryMintSet).map((line) => (
                    <li key={`rm-${line}`} className="flex items-start gap-3">
                      <i
                        className="ph ph-check-circle mt-1 shrink-0 text-lg text-lux-accent"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={productPageHref(rosemaryMintSet)}
                    className="inline-block rounded-full border border-lux-text/20 bg-transparent px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-text transition-colors hover:border-lux-text hover:bg-lux-text hover:text-white"
                  >
                    View ingredients &amp; product details
                  </Link>
                  <a
                    href={amazonProductLink(rosemaryMintSet.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-lux-text px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
                  >
                    Buy on Amazon.ca
                  </a>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1} y={14} scale={0.985} className="relative">
                <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[40px] bg-lux-sand shadow-2xl">
                  <img
                    src={rosemaryMintSet.image_url || ""}
                    alt={rosemaryMintSet.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>

            <div
              id="product-biotin-keratin"
              className="scroll-mt-28 grid grid-cols-1 items-center gap-12 rounded-[48px] border border-lux-text/10 bg-lux-mist/25 p-8 shadow-sm sm:p-14 lg:grid-cols-2 lg:gap-16"
            >
              <ScrollReveal
                delay={0.1}
                y={14}
                scale={0.985}
                className="relative order-2 lg:order-1"
              >
                <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[40px] bg-lux-sand shadow-2xl">
                  <img
                    src={biotinKeratinSet.image_url || ""}
                    alt={biotinKeratinSet.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal y={18} className="order-1 lg:order-2">
                <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
                  {biotinKeratinSet.badges[0] || "Fortifying & Smoothing Set"}
                </span>
                <h3 className="mb-6 font-serif text-3xl sm:text-5xl">
                  <span>{biotinKeratinSet.name}</span>
                </h3>
                <ul className="mb-10 list-none space-y-3 text-base leading-relaxed text-lux-text/70 sm:text-lg">
                  {productBenefits(biotinKeratinSet).map((line) => (
                    <li key={`bk-${line}`} className="flex items-start gap-3">
                      <i
                        className="ph ph-check-circle mt-1 shrink-0 text-lg text-lux-accent"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={productPageHref(biotinKeratinSet)}
                    className="inline-block rounded-full border border-lux-text/20 bg-transparent px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-text transition-colors hover:border-lux-text hover:bg-lux-text hover:text-white"
                  >
                    View ingredients &amp; product details
                  </Link>
                  <a
                    href={amazonProductLink(biotinKeratinSet.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-lux-text px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
                  >
                    Buy on Amazon.ca
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section
        id="oil-section"
        className="scroll-mt-24 bg-lux-mist/30 px-6 py-28 sm:px-12"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal y={18}>
            <div className="mb-6 flex items-center gap-4">
              <span className="rounded-full bg-lux-accent px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                {rosemaryOil.badges[0] || "100% Natural Botanical Oil"}
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl sm:text-5xl">
              <span>{rosemaryOil.name}</span>
            </h2>
            <p className="mb-6 text-base leading-relaxed text-lux-text/70 sm:text-lg">
              {rosemaryOil.description ||
                "A lightweight blend of 100% natural oils crafted for scalp nourishment, softness, and healthy-looking shine without heavy residue."}
            </p>
            <ul className="mb-10 list-none space-y-3 text-base leading-relaxed text-lux-text/70 sm:text-lg">
              {productBenefits(rosemaryOil).map((line) => (
                <li key={`oil-${line}`} className="flex items-start gap-3">
                  <i
                    className="ph ph-check-circle mt-1 shrink-0 text-lg text-lux-accent"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={productPageHref(rosemaryOil)}
                className="inline-block rounded-full border border-lux-text/20 bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-text transition-colors hover:border-lux-text hover:bg-lux-text hover:text-white"
              >
                View ingredients &amp; product details
              </Link>
              <a
                href={amazonProductLink(rosemaryOil.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-lux-text px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
              >
                Buy on Amazon.ca
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} y={14} scale={0.985} className="relative">
            <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[60px] bg-lux-sand shadow-2xl">
              <img
                src={rosemaryOil.image_url || ""}
                alt={rosemaryOil.name}
                className="h-full w-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="philosophy" className="relative overflow-hidden bg-lux-text px-6 py-32 text-lux-background sm:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <ScrollReveal y={18}>
            <span className="mb-8 block text-[11px] font-bold uppercase tracking-[0.4em] text-lux-accent">
              Our Philosophy
            </span>
            <h2 className="mx-auto mb-12 max-w-4xl font-serif text-4xl italic leading-tight sm:text-5xl lg:text-6xl">
              &quot;We believe beauty should be <br />
              as pure as the soul.&quot;
            </h2>
            <p className="mx-auto mb-24 max-w-2xl text-lg leading-relaxed text-lux-background/60 sm:text-xl">
              Conscious beauty is more than a trend; it&apos;s our DNA. We source
              the world&apos;s most potent botanical extracts, ensuring every drop
              contributes to the long-term health of your hair.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-20 md:grid-cols-3">
            {[
              ["100%", "Transparent Sourcing"],
              ["0", "Synthetic Chemicals"],
              ["25+", "Active Botanicals"],
            ].map(([stat, label], idx) => (
              <ScrollReveal key={label} delay={idx * 0.08} y={14}>
                <p className="mb-4 font-serif text-4xl text-lux-accent sm:text-5xl">
                  {stat}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                  {label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ingredients" className="bg-white px-6 py-32 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal y={16} className="mb-20 text-center">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Transparency
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl">Rooted in Earth</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "ph-flower-lotus",
                title: "Rosemary Extract",
                body: "Wild-harvested from the Mediterranean to stimulate scalp micro-circulation.",
              },
              {
                icon: "ph-drop",
                title: "Pure Biotin",
                body: "A high-concentration B-vitamin that fortifies the hair shaft against daily breakage.",
              },
              {
                icon: "ph-wind",
                title: "Peppermint Oil",
                body: "Cleanses and balances natural oils while providing a refreshing cooling sensation.",
              },
              {
                icon: "ph-tree",
                title: "Argan & Jojoba",
                body: "Rich in Vitamin E and essential fatty acids for deep hydration and mirror-like shine.",
              },
            ].map((card, idx) => (
              <ScrollReveal
                key={card.title}
                delay={idx * 0.07}
                y={16}
                className="group rounded-[40px] border border-lux-text/5 p-10 transition-all hover:border-lux-accent/20"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-lux-mist text-lux-text transition-colors group-hover:bg-lux-accent group-hover:text-white">
                  <i className={`ph ${card.icon} text-3xl`} aria-hidden />
                </div>
                <h4 className="mb-4 font-serif text-2xl">{card.title}</h4>
                <p className="text-sm leading-relaxed text-lux-text/50">
                  {card.body}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ritual" className="bg-lux-background px-6 py-32 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal y={16} className="mb-24 text-center">
            <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.4em] text-lux-accent">
              Your Ritual
            </span>
            <h2 className="mb-8 font-serif text-4xl sm:text-6xl">
              Three Steps to Radiance
            </h2>
          </ScrollReveal>
          <ScrollReveal
            y={18}
            className="grid grid-cols-1 overflow-hidden rounded-[60px] border border-lux-text/5 bg-white md:grid-cols-3"
          >
            {[
              {
                n: "01",
                title: "Cleanse",
                body: "Massage Rosemary Mint Shampoo into the scalp for 60 seconds. Let the botanicals breathe.",
              },
              {
                n: "02",
                title: "Treat",
                body: "Apply 4 drops of Biotin Serum to damp roots. Its fast-absorbing formula strengthens from within.",
              },
              {
                n: "03",
                title: "Seal",
                body: "Finish with Botanical Conditioning Oil on ends to lock in hydration and create a glass-like finish.",
              },
            ].map((step, idx) => (
              <div
                key={step.n}
                className={cn(
                  "group flex flex-col items-center p-12 text-center transition-colors hover:bg-lux-mist/10 sm:p-20",
                  idx < 2 && "md:border-r md:border-lux-text/5",
                )}
              >
                <span className="mb-10 font-serif text-7xl leading-none text-lux-mist/30 transition-colors group-hover:text-lux-accent/20 sm:text-[120px]">
                  {step.n}
                </span>
                <h3 className="mb-6 font-serif text-2xl sm:text-3xl">{step.title}</h3>
                <p className="text-sm leading-relaxed text-lux-text/60">{step.body}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section id="sustainability" className="bg-lux-mist/10 px-6 py-32 sm:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal y={18}>
            <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Our Footprint
            </span>
            <h2 className="mb-12 font-serif text-4xl sm:text-5xl">
              Beauty with <br />
              Responsibility
            </h2>
            <div className="space-y-10">
              {[
                {
                  icon: "ph-recycle",
                  title: "Recyclable Packaging",
                  body: "Every bottle is made from 100% PCR glass and aluminum, infinitely recyclable.",
                },
                {
                  icon: "ph-globe-hemisphere-west",
                  title: "Sustainably Sourced",
                  body: "Direct-to-farm partnerships ensure ethical wages and regenerative farming practices.",
                },
                {
                  icon: "ph-leaf",
                  title: "Carbon Neutral",
                  body: "We offset 100% of our production and shipping emissions through reforestation.",
                },
              ].map((row) => (
                <div key={row.title} className="flex gap-8">
                  <div className="h-10 w-10 shrink-0 text-lux-accent">
                    <i className={`ph ${row.icon} text-4xl`} aria-hidden />
                  </div>
                  <div>
                    <h4 className="mb-2 font-serif text-2xl">{row.title}</h4>
                    <p className="text-sm leading-relaxed text-lux-text/60">
                      {row.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} y={14} scale={0.985} className="relative">
            <div className="aspect-square overflow-hidden rounded-[60px] bg-neutral-300 shadow-2xl">
              <img
                src={IMG.sustainable}
                alt="Sustainable beauty"
                className="h-full w-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="guides" className="scroll-mt-24 bg-white px-6 py-28 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            y={16}
            className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
                From the Journal
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl">
                Hair Care Guides
              </h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 border-b border-lux-text pb-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-lux-accent hover:text-lux-accent"
            >
              View all articles
              <i className="ph ph-arrow-right text-base" aria-hidden />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HAIR_CARE_GUIDES.map((guide, idx) => (
              <ScrollReveal key={guide.href} delay={idx * 0.09} y={18} className="flex">
                <a
                  href={guide.href}
                  className="group flex w-full flex-col overflow-hidden rounded-[40px] border border-lux-text/10 bg-lux-background transition-all hover:-translate-y-1 hover:border-lux-accent/30 hover:shadow-xl"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-lux-sand">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-8 sm:p-10">
                    <div>
                      <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.25em] text-lux-accent">
                        {guide.category}
                      </span>
                      <h3 className="mb-4 font-serif text-2xl leading-snug transition-colors group-hover:text-lux-accent">
                        {guide.title}
                      </h3>
                      <p className="mb-6 text-sm leading-relaxed text-lux-text/60">
                        {guide.excerpt}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-lux-text transition-colors group-hover:text-lux-accent">
                      Read guide
                      <i className="ph ph-arrow-up-right text-base" aria-hidden />
                    </span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="newsletter" className="px-6 py-24 sm:px-12">
        <ScrollReveal
          y={18}
          scale={0.99}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[60px] bg-lux-accent p-12 text-center sm:p-20"
        >
          <div className="organic-shape absolute -left-[50px] -top-[50px] h-64 w-64 bg-white/10" />
          <div className="relative z-10">
            <h2 className="mb-6 font-serif text-4xl text-white sm:text-5xl">
              Join the Ritual.
            </h2>
            <p className="mb-12 text-lg text-white/80 sm:text-xl">
              Be first to know when new drops launch and receive expert care tips.
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-4 md:flex-row">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="flex-1 rounded-full border-none bg-white px-8 py-5 text-sm outline-none focus:ring-2 focus:ring-lux-text/20"
              />
              <button
                type="submit"
                className="rounded-full bg-lux-text px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-lux-text"
              >
                Subscribe
              </button>
            </form>
          </div>
        </ScrollReveal>
      </section>

      <section id="cta" className="bg-lux-text px-6 py-32 text-center text-lux-background sm:px-12 sm:py-40">
        <ScrollReveal y={18} className="mx-auto max-w-3xl">
          <h2 className="mb-10 font-serif text-4xl sm:text-6xl">
            Ready to transform your hair?
          </h2>
          <p className="mb-12 text-lg text-lux-background/60">
            Experience the potency of pure botanicals. Start your journey to
            healthier hair today.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="#hair-concerns"
              className="w-full rounded-full bg-lux-accent px-12 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:brightness-110 shadow-[0_25px_50px_-12px_rgb(201_124_93_/_0.1)] sm:w-auto"
            >
              Find my routine
            </a>
            <a
              href="#products"
              className="w-full rounded-full border border-white/20 px-12 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-lux-text sm:w-auto"
            >
              Explore our products
            </a>
          </div>
        </ScrollReveal>
      </section>

      <footer id="footer" className="border-t border-lux-text/5 bg-lux-background px-6 pb-12 pt-24 sm:px-12 sm:pt-32">
        <div className="mx-auto mb-24 flex max-w-7xl flex-col justify-between gap-12 sm:mb-32 lg:flex-row lg:items-start">
          <div className="max-w-sm">
            <div className="mb-10 flex items-center">
              <Image
                src="/luxivie-logo.png"
                alt="LUXIVIE"
                width={220}
                height={56}
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
