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
    name: "Rosemary Mint Shampoo and Conditioner",
    price: 39.99,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1765851197495-27.png",
    benefits: [
      "Gently cleanses and refreshes with a rich lather",
      "Adds body for hair that looks fuller and feels stronger",
      "Helps reduce the look of dryness and split ends",
    ],
    description:
      "Complete cleansing + conditioning routine that leaves hair feeling fresh, soft, and shiny with a fuller-looking finish. Shampoo gently cleanses and refreshes while adding body and lift, helping hair look thicker and more voluminous without feeling heavy. Conditioner moisturizes and smooths for better manageability and healthy-looking shine; helps reduce split ends.",
    status: "active",
    is_bestseller: true,
    rating: 4.9,
    review_count: 840,
    badges: ["Bestseller"],
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
      "Adds Shine and Smoothness",
      "Enhances Fuller Looking Hair",
      "Improves the Look of Dry Hair",
    ],
    description:
      "A lightweight blend of 100% natural oils for shine and softness. It helps smooth the appearance of dry or rough hair and reduce the look of split ends for healthier-looking strands. Can be used on the scalp, as a leave-in, or before shampooing. Lightweight texture absorbs quickly and suits all hair types.",
    status: "active",
    is_bestseller: false,
    rating: 4.8,
    review_count: 320,
    badges: ["Botanical Oil"],
  },
  {
    id: "4dd292f9-f700-4732-a65a-ac55157125e9",
    name: "Biotin Shampoo Conditioner with Keratin",
    price: 39.99,
    image_url:
      "https://kvirwlcodrpwnwzvfcqr.supabase.co/storage/v1/object/public/gallery/7fca71ec-1a2f-406b-906f-5154356620af/1766714944700-luxivie-biotin-keratin-shampoo-conditioner.png",
    benefits: [
      "Adds body for a fuller-looking finish.",
      "Softens and smoothens for easier detangling",
      "Leaves hair looking polished and refreshed",
    ],
    description:
      "Biotin & Keratin Care for Fuller-Looking, Healthier-Looking Hair. Fortifies hair’s look and feel while adding body for a fuller-looking finish. Conditioner helps soften and smooth for easier detangling and improved manageability. Sulfate & paraben free, designed for regular use and most hair types.",
    status: "active",
    is_bestseller: false,
    rating: 5,
    review_count: 1240,
    badges: ["Intensive Care"],
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
