/* eslint-disable @next/next/no-img-element -- Unsplash assets match static design */
import Link from "next/link"
import Image from "next/image"
import { LandingNav } from "./LandingNav"
import { cn } from "@/components/ui/utils"
import {
  type LandingProduct,
} from "@/lib/landing-products"

const IMG = {
  sustainable:
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop",
}

function amazonProductLink(productName: string) {
  const normalized = productName.toLowerCase()

  if (normalized.includes("biotin shampoo conditioner")) {
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

  return "/products"
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

export function LuxivieLandingPage({ products }: LuxivieLandingPageProps) {
  const p1 = products[0] ?? EMPTY_PRODUCT
  const p2 = products[1] ?? p1
  const p3 = products[2] ?? p2
  const p4 = products[3] ?? p2
  const heroImageA = products[4]?.image_url || p3.image_url || p1.image_url
  const heroImageB = products[5]?.image_url || p4.image_url || p2.image_url
  const heroAltA = products[4]?.name || p3.name || "Luxivie product"
  const heroAltB = products[5]?.name || p4.name || "Luxivie product"

  return (
    <div className="m-0 h-full w-full overflow-x-hidden bg-lux-background p-0 text-lux-text scrollbar-hide">
      <LandingNav />

      <section className="relative flex min-h-screen items-center px-6 pb-20 pt-20 sm:px-12 sm:pt-28">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-lux-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
                Made in Canada
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
              <Link
                href="/products"
                className="rounded-full bg-lux-accent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:brightness-110 shadow-[0_25px_50px_-12px_rgb(201_124_93_/_0.2)]"
              >
                Shop Now
              </Link>
              <button
                type="button"
                className="group flex items-center gap-3 border-b border-lux-text pb-1 text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                See How It Works
                <i className="ph ph-play-circle text-lg" aria-hidden />
              </button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="organic-shape absolute right-0 top-1/2 -z-10 h-[90%] w-[110%] -translate-y-1/2 bg-lux-mist opacity-60" />
            <div className="relative flex items-end gap-6 sm:gap-8">
              <div className="product-image-container mb-12 h-80 w-52 border-4 border-white bg-neutral-200 sm:h-96 sm:w-64">
                <img
                  src={heroImageA}
                  alt={heroAltA}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="product-image-container relative mb-24 h-64 w-48 border-4 border-white bg-neutral-300 sm:mb-32 sm:h-80 sm:w-56">
                <img
                  src={heroImageB}
                  alt={heroAltB}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-lux-text/5 px-6 py-24 sm:px-12">
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
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lux-mist text-lux-text">
                <i className={`ph ${item.icon} text-3xl`} aria-hidden />
              </div>
              <h3 className="mb-3 font-serif text-2xl">{item.title}</h3>
              <p className="text-sm leading-relaxed text-lux-text/50">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="px-6 py-32 sm:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Bestseller
            </span>
            <h2 className="mb-6 font-serif text-4xl sm:text-5xl">
              <span>{p1.name}</span>
            </h2>
            <ul className="mb-8 list-none space-y-3 text-lg leading-relaxed text-lux-text/60">
              {productBenefits(p1).map((line) => (
                <li key={`p1-${line}`}>{line}</li>
              ))}
            </ul>
            <a
              href={amazonProductLink(p1.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-lux-text px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
            >
              Shop in Amazon
            </a>
          </div>
          <div className="relative">
            <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[60px] bg-lux-sand shadow-2xl">
              <img
                src={p1.image_url || ""}
                alt={p1.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-32 sm:px-12 bg-lux-mist/20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[60px] bg-lux-sand shadow-2xl">
              <img
                src={p2.image_url || ""}
                alt={p2.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              {p2.badges[0] || "Intensive Care"}
            </span>
            <h2 className="mb-6 font-serif text-4xl sm:text-5xl">
              <span>{p2.name}</span>
            </h2>
            <ul className="mb-8 list-none space-y-3 text-lg leading-relaxed text-lux-text/60">
              {productBenefits(p2).map((line) => (
                <li key={`p2-${line}`}>{line}</li>
              ))}
            </ul>
            <a
              href={amazonProductLink(p2.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-lux-text px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
            >
              Shop in Amazon
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-32 sm:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="rounded-full bg-lux-accent px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                New Arrival
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl sm:text-5xl">
              <span>{p3.name}</span>
            </h2>
            <ul className="mb-8 list-none space-y-3 text-lg leading-relaxed text-lux-text/60">
              {productBenefits(p3).map((line) => (
                <li key={`p3-${line}`}>{line}</li>
              ))}
            </ul>
            <a
              href={amazonProductLink(p3.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-lux-text px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
            >
              Shop in Amazon
            </a>
          </div>
          <div className="relative">
            <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[60px] bg-lux-sand shadow-2xl">
              <img
                src={p3.image_url || ""}
                alt={p3.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-32 sm:px-12 bg-lux-mist/20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[60px] bg-lux-sand shadow-2xl">
              <img
                src={p4.image_url || ""}
                alt={p4.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              {p4.badges[0] || "Intensive Care"}
            </span>
            <h2 className="mb-6 font-serif text-4xl sm:text-5xl">
              <span>{p4.name}</span>
            </h2>
            <ul className="mb-8 list-none space-y-3 text-lg leading-relaxed text-lux-text/60">
              {productBenefits(p4).map((line) => (
                <li key={`p4-${line}`}>{line}</li>
              ))}
            </ul>
            <a
              href={amazonProductLink(p4.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-lux-text px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-lux-accent"
            >
              Shop in Amazon
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-lux-text px-6 py-32 text-lux-background sm:px-12">
        <div className="mx-auto max-w-7xl text-center">
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
          <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-20 md:grid-cols-3">
            {[
              ["100%", "Transparent Sourcing"],
              ["0", "Synthetic Chemicals"],
              ["25+", "Active Botanicals"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="mb-4 font-serif text-4xl text-lux-accent sm:text-5xl">
                  {stat}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-32 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-lux-accent">
              Transparency
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl">Rooted in Earth</h2>
          </div>
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
            ].map((card) => (
              <div
                key={card.title}
                className="group rounded-[40px] border border-lux-text/5 p-10 transition-all hover:border-lux-accent/20"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-lux-mist text-lux-text transition-colors group-hover:bg-lux-accent group-hover:text-white">
                  <i className={`ph ${card.icon} text-3xl`} aria-hidden />
                </div>
                <h4 className="mb-4 font-serif text-2xl">{card.title}</h4>
                <p className="text-sm leading-relaxed text-lux-text/50">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ritual" className="bg-lux-background px-6 py-32 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-24 text-center">
            <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.4em] text-lux-accent">
              Your Ritual
            </span>
            <h2 className="mb-8 font-serif text-4xl sm:text-6xl">
              Three Steps to Radiance
            </h2>
          </div>
          <div className="grid grid-cols-1 overflow-hidden rounded-[60px] border border-lux-text/5 bg-white md:grid-cols-3">
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
          </div>
        </div>
      </section>

      <section id="sustainability" className="bg-lux-mist/10 px-6 py-32 sm:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
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
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-[60px] bg-neutral-300 shadow-2xl">
              <img
                src={IMG.sustainable}
                alt="Sustainable beauty"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-12">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[60px] bg-lux-accent p-12 text-center sm:p-20">
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
        </div>
      </section>

      <section className="bg-lux-text px-6 py-32 text-center text-lux-background sm:px-12 sm:py-40">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 font-serif text-4xl sm:text-6xl">
            Ready to transform your hair?
          </h2>
          <p className="mb-12 text-lg text-lux-background/60">
            Experience the potency of pure botanicals. Start your journey to
            healthier hair today.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              href="/products"
              className="w-full rounded-full bg-lux-accent px-12 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:brightness-110 shadow-[0_25px_50px_-12px_rgb(201_124_93_/_0.1)] sm:w-auto"
            >
              Shop The Collection
            </Link>
            <button
              type="button"
              className="w-full rounded-full border border-white/20 px-12 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-lux-text sm:w-auto"
            >
              Take The Hair Quiz
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-lux-text/5 bg-lux-background px-6 pb-12 pt-24 sm:px-12 sm:pt-32">
        <div className="mx-auto mb-24 grid max-w-7xl grid-cols-12 gap-12 sm:mb-32">
          <div className="col-span-12 lg:col-span-4">
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
