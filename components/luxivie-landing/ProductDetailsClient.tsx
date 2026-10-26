"use client"

/* eslint-disable @next/next/no-img-element -- Product packshots are supplied by the CMS. */
import Link from "next/link"
import { useEffect, useState } from "react"
import { LandingNav } from "@/components/luxivie-landing/LandingNav"

type Product = {
  id: string
  name: string
  price: number
  image_url: string
  images?: string[]
  benefits?: string[]
  description?: string
  ingredients?: string[]
  how_to_use?: string
  sizes?: string[]
  status?: string
}

const ROSEMARY_MINT_ID = "b3233319-90ff-417f-b329-1cb0774e80d4"

const AMAZON_LINKS: Record<string, string> = {
  [ROSEMARY_MINT_ID]: "https://www.amazon.ca/dp/B0G5SDZNB7",
  "4dd292f9-f700-4732-a65a-ac55157125e9": "https://www.amazon.ca/dp/B0G6XKF4N5",
  "581bd553-24a2-4dfe-9ad3-7283697ec3ff": "https://www.amazon.ca/dp/B0FJYHPHBG",
}

export function ProductDetailsClient({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")

  useEffect(() => {
    params.then(({ id }) => setProductId(id))
  }, [params])

  useEffect(() => {
    if (!productId) return
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const businessSlug = process.env.NEXT_PUBLIC_ORG_SLUG || "luxivie"
        const response = await fetch(`/api/products/${productId}?businessSlug=${encodeURIComponent(businessSlug)}`, { signal: controller.signal })
        if (!response.ok) throw new Error(response.status === 404 ? "Product not found" : "Unable to load this product")
        const data = await response.json()
        if (!data.product) throw new Error("Product not found")
        setProduct(data.product)
        setSelectedImage(0)
        setSelectedSize(data.product.sizes?.[0] || "")
      } catch (caught) {
        if (controller.signal.aborted) return
        setError(caught instanceof Error ? caught.message : "Unable to load this product")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [productId])

  const isRosemaryMint = product?.id === ROSEMARY_MINT_ID
  const images = [...new Set([product?.image_url, ...(product?.images || [])].filter((value): value is string => typeof value === "string" && value.length > 0 && !value.startsWith("blob:")))].slice(0, 4)
  const amazonHref = product ? AMAZON_LINKS[product.id] : undefined
  const title = isRosemaryMint ? "Rosemary Mint" : product?.name || "Product details"
  const description = isRosemaryMint
    ? "This shampoo and conditioner duo pairs a fresh, clean feel with conditioning for manageable hair. Designed for oily hair."
    : product?.description
  const benefits = isRosemaryMint
    ? ["A fresh, clean feel for oily-hair needs", "Conditioning for manageability", "A straightforward two-step routine"]
    : product?.benefits || []

  return (
    <div className="min-h-screen bg-lux-background text-lux-text">
      <LandingNav />
      <main className="px-6 pb-24 pt-32 sm:px-12 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-xs text-lux-text/55">
            <Link href="/" className="hover:text-lux-accent">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#products" className="hover:text-lux-accent">Our products</Link>
            {product && <><span aria-hidden="true">/</span><span className="text-lux-text">{title}</span></>}
          </nav>

          {loading ? (
            <div className="grid animate-pulse gap-12 lg:grid-cols-2" aria-label="Loading product">
              <div className="aspect-square rounded-xl bg-lux-mist/30" />
              <div className="space-y-5 pt-8"><div className="h-4 w-32 rounded bg-lux-mist/40" /><div className="h-14 w-3/4 rounded bg-lux-mist/40" /><div className="h-28 rounded bg-lux-mist/30" /></div>
            </div>
          ) : error || !product ? (
            <div className="rounded-xl border border-lux-text/15 bg-white p-10">
              <h1 className="font-serif text-4xl">{error || "Product not found"}</h1>
              <Link href="/#products" className="mt-7 inline-block text-sm font-medium underline underline-offset-4">Explore our products</Link>
            </div>
          ) : (
            <>
              <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                  <div className="aspect-square overflow-hidden rounded-xl border border-lux-text/10 bg-white p-8 sm:p-12">
                    {images.length ? <img src={images[selectedImage] || images[0]} alt={`${product.name}, view ${selectedImage + 1}`} className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center text-sm text-lux-text/50">Product image unavailable</div>}
                  </div>
                  {images.length > 1 && (
                    <div className="mt-4 grid max-w-lg grid-cols-4 gap-3" aria-label="Product images">
                      {images.map((src, index) => (
                        <button key={src} type="button" onClick={() => setSelectedImage(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={selectedImage === index} className={`aspect-square overflow-hidden rounded-lg border bg-white p-2 transition-colors ${selectedImage === index ? "border-lux-text" : "border-lux-text/15 hover:border-lux-text/50"}`}>
                          <img src={src} alt="" className="h-full w-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:pt-4">
                  <p className="mb-5 text-xs font-medium tracking-[0.12em] text-lux-text/55">{isRosemaryMint ? "For oily hair" : "Luxivie hair care"}</p>
                  <h1 className="font-serif text-5xl leading-[1.1] tracking-[-0.035em] sm:text-6xl">{title}</h1>
                  {isRosemaryMint && <p className="mt-5 text-sm font-medium">Shampoo + Conditioner | 2 x 500 mL</p>}
                  {description && <p className="mt-7 max-w-xl text-base leading-[1.8] text-lux-text/70 sm:text-lg">{description}</p>}
                  {isRosemaryMint && <p className="mt-5 text-sm font-semibold">Not recommended for dry hair.</p>}
                  {product.price > 0 && <p className="mt-7 text-lg font-medium">${product.price.toFixed(2)} CAD</p>}

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-8">
                      <p className="mb-3 text-sm font-medium">Size</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size} className={`rounded-lg border px-4 py-2 text-sm ${selectedSize === size ? "border-lux-text bg-white" : "border-lux-text/20 hover:border-lux-text/50"}`}>{size}</button>)}
                      </div>
                    </div>
                  )}

                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    {amazonHref && <a href={amazonHref} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-lux-text px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-lux-accent">Buy on Amazon.ca</a>}
                  </div>
                </div>
              </div>

              <section className="mt-20 grid gap-12 border-t border-lux-text/15 pt-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
                <div>
                  <p className="mb-5 text-xs text-lux-text/55">The details</p>
                  <h2 className="font-serif text-4xl tracking-[-0.025em] sm:text-5xl">A closer look.</h2>
                </div>
                <div className="divide-y divide-lux-text/15 border-y border-lux-text/15">
                  <details className="group py-5" open>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-medium">Benefits <span aria-hidden="true" className="text-xl">+</span></summary>
                    <ul className="mt-5 space-y-3 text-sm leading-[1.7] text-lux-text/70">{benefits.length ? benefits.map((benefit) => <li key={benefit}>{benefit}</li>) : <li>See the product description for details.</li>}</ul>
                  </details>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-medium">Ingredients <span aria-hidden="true" className="text-xl">+</span></summary>
                    {product.ingredients?.length ? <ul className="mt-5 space-y-3 text-sm leading-[1.7] text-lux-text/70">{product.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul> : <p className="mt-5 text-sm leading-[1.7] text-lux-text/70">Please refer to the product packaging for the full ingredient list.</p>}
                  </details>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-medium">How to use <span aria-hidden="true" className="text-xl">+</span></summary>
                    <p className="mt-5 whitespace-pre-line text-sm leading-[1.7] text-lux-text/70">{product.how_to_use || "Follow the directions on the product packaging."}</p>
                  </details>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
