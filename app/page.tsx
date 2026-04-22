import { LuxivieLandingPage } from "@/components/luxivie-landing/LuxivieLandingPage"
import { getLandingProducts } from "@/lib/landing-products"

export default async function Home() {
  const products = await getLandingProducts(8)
  return <LuxivieLandingPage products={products} />
}
