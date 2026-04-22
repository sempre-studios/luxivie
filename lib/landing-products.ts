import { supabaseAdmin } from "@/lib/supabase"

export type LandingProduct = {
  id: string
  name: string
  price: number
  image_url: string
  benefits: string[]
  description: string
  status: string
  is_bestseller: boolean
  rating: number | null
  review_count: number
  badges: string[]
}

const FALLBACK_PRODUCTS: LandingProduct[] = [
  {
    id: "fallback-1",
    name: "Rosemary Mint Shampoo and Conditioner",
    price: 32,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1765851197495-27.png",
    benefits: [
      "Gently cleanses and refreshes with a rich lather",
      "Adds body for hair that looks fuller and feels stronger",
      "Helps reduce the look of dryness and split ends",
    ],
    description: "",
    status: "active",
    is_bestseller: true,
    rating: 4.9,
    review_count: 840,
    badges: ["Bestseller"],
  },
  {
    id: "fallback-2",
    name: "Rosemary Mint Hair & Scalp Serum",
    price: 48,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714080088-Rosemary-Mint-hair-Serum-Main-Image1.jpg",
    benefits: [
      "Thickens and Makes Hair Stronger",
      "Nourishes for Healthy Looking Hair",
      "Helps Reduce the Look of Frizz",
    ],
    description: "",
    status: "active",
    is_bestseller: false,
    rating: 5,
    review_count: 1240,
    badges: ["Intensive Care"],
  },
  {
    id: "fallback-3",
    name: "Rosemary Hair Oil",
    price: 36,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714531701-Luxivie-Rosemary-Hair-Oil-100mL.jpg",
    benefits: [
      "Adds Shine and Smoothness",
      "Enhances Fuller Looking Hair",
      "Improves the Look of Dry Hair",
    ],
    description: "",
    status: "active",
    is_bestseller: false,
    rating: 4.8,
    review_count: 320,
    badges: ["New Arrival"],
  },
  {
    id: "fallback-4",
    name: "Biotin Shampoo Conditioner with Keratin",
    price: 48,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714944700-luxivie-biotin-keratin-shampoo-conditioner.png",
    benefits: [
      "Adds body for a fuller-looking finish.",
      "Softens and smoothens for easier detangling",
      "Leaves hair looking polished and refreshed",
    ],
    description: "",
    status: "active",
    is_bestseller: false,
    rating: 5,
    review_count: 1240,
    badges: ["Intensive Care"],
  },
]

function parseBenefits(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map((b) => (typeof b === "string" ? b.trim() : ""))
      .filter(Boolean)
  }
  return []
}

function parseBadges(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map((b) => (typeof b === "string" ? b.trim() : ""))
      .filter(Boolean)
  }
  return []
}

export async function getLandingProducts(
  limit = 8,
): Promise<LandingProduct[]> {
  const businessSlug = process.env.NEXT_PUBLIC_ORG_SLUG || "luxivie"

  try {
    const { data: business, error: businessError } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .eq("slug", businessSlug)
      .limit(1)
      .single()

    if (businessError || !business) {
      console.error("[getLandingProducts] business:", businessError)
      return FALLBACK_PRODUCTS
    }

    const { data: rows, error: productsError } = await supabaseAdmin
      .from("retail_products_table")
      .select(
        "id, name, price, image_url, benefits, description, status, is_bestseller, rating, review_count, badges, created_at",
      )
      .eq("business_id", business.id)
      .in("status", ["active", "out of stock"])
      .order("is_bestseller", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (productsError || !rows?.length) {
      if (productsError) console.error("[getLandingProducts] products:", productsError)
      return FALLBACK_PRODUCTS
    }

    return rows.map((product) => ({
      id: product.id,
      name: product.name || "Product",
      price: product.price ? parseFloat(String(product.price)) : 0,
      image_url: product.image_url || "",
      benefits: parseBenefits(product.benefits),
      description:
        typeof product.description === "string" ? product.description : "",
      status: product.status || "active",
      is_bestseller: Boolean(product.is_bestseller),
      rating:
        product.rating != null ? parseFloat(String(product.rating)) : null,
      review_count: Number(product.review_count) || 0,
      badges: parseBadges(product.badges),
    }))
  } catch (e) {
    console.error("[getLandingProducts]", e)
    return FALLBACK_PRODUCTS
  }
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}
