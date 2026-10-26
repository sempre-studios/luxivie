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

export const FALLBACK_PRODUCTS: LandingProduct[] = [
  {
    id: "b3233319-90ff-417f-b329-1cb0774e80d4",
    name: "Rosemary Mint Shampoo & Conditioner Set",
    price: 39.99,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/luxivie/gallery/rosemary-mint-shampoo-and-conditioner/1792964029751-Rosemary-Mint-Set.jpg",
    benefits: [
      "A fresh, clean feel for oily-hair needs",
      "Conditioning for manageability",
      "A straightforward two-step routine",
    ],
    description:
      "When your roots look oily soon after washing, choosing the right routine matters. This Rosemary Mint duo pairs cleansing with conditioning for a fresh, clean feel and manageable hair. Designed for oily hair. Not recommended for dry hair.",
    status: "active",
    is_bestseller: false,
    rating: null,
    review_count: 0,
    badges: ["For oily hair", "Sulfate-free & paraben-free"],
  },
  {
    id: "a8307850-3fff-4749-9a0c-7c65105f3595",
    name: "Rosemary Mint Hair & Scalp Serum",
    price: 24.99,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714080088-Rosemary-Mint-hair-Serum-Main-Image1.jpg",
    benefits: [
      "Thickens and Makes Hair Stronger",
      "Nourishes for Healthy Looking Hair",
      "Helps Reduce the Look of Frizz",
    ],
    description:
      "Lightweight oil-based serum designed to smooth hair, add shine, and improve manageability with just a few drops. Made with 4 pure natural oils: rosemary, peppermint, castor, and olive oils that work together to leave hair looking soft, refreshed, and fuller-looking.",
    status: "active",
    is_bestseller: false,
    rating: 5,
    review_count: 1240,
    badges: ["Intensive Care"],
  },
  {
    id: "581bd553-24a2-4dfe-9ad3-7283697ec3ff",
    name: "Rosemary Hair Oil",
    price: 21.99,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714531701-Luxivie-Rosemary-Hair-Oil-100mL.jpg",
    benefits: [
      "Added softness for dry-looking lengths and ends",
      "A shinier, more polished finish",
      "Targeted application where extra care is needed",
    ],
    description:
      "When your lengths or ends look dry or dull, a targeted finishing step may be all you need. Luxivie Rosemary Hair Oil helps add softness and shine for a nourished, healthy-looking appearance.",
    status: "active",
    is_bestseller: false,
    rating: null,
    review_count: 0,
    badges: ["For dry-looking lengths & ends"],
  },
  {
    id: "4dd292f9-f700-4732-a65a-ac55157125e9",
    name: "Biotin + Keratin Shampoo & Conditioner Set",
    price: 39.99,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714944700-luxivie-biotin-keratin-shampoo-conditioner.png",
    benefits: [
      "Softness and manageability",
      "A nourished appearance",
      "Healthy-looking hair",
    ],
    description:
      "When your hair feels dry, rough or difficult to manage, start with a routine matched to those needs. This Biotin + Keratin duo cleanses and conditions for nourished, manageable and healthy-looking hair. Designed for normal-to-dry hair.",
    status: "active",
    is_bestseller: false,
    rating: null,
    review_count: 0,
    badges: ["For normal-to-dry hair", "Sulfate-free & paraben-free"],
  },
]

type SupabaseLikeError = {
  code?: string | null
  message?: string | null
}

function isMissingBusinessesTable(error: SupabaseLikeError | null | undefined) {
  return error?.code === "42P01" && (error?.message || "").includes("public.businesses")
}

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
      if (businessError && !isMissingBusinessesTable(businessError)) {
        console.error("[getLandingProducts] business:", businessError)
      }
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
      image_url: product.image_url?.startsWith("blob:")
        ? FALLBACK_PRODUCTS.find((fallback) => fallback.id === product.id)?.image_url || ""
        : product.image_url || "",
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
