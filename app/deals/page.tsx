import { getDeals } from "@/lib/sanity-deals"
import StructuredData from "@/components/structured-data"
import DealsPageClient from "./deals-client"

export interface SanityDeal {
  id: string
  name: string
  description: string
  image: string
  rating?: number
  redirectLink?: string
  formattedAddress: string
  category: string
  categoryColor?: string
  status: string
  featured: boolean
  validCoupons: { discount: string; code?: string }[]
  publishedAt?: string
}

export const metadata = {
  title: "Deals & Offers | Kohedha",
  description: "Discover amazing deals and offers on restaurants, food, and entertainment in Sri Lanka. Save money with exclusive coupons and discounts.",
  keywords: [
    "Sri Lanka deals",
    "restaurant deals Sri Lanka",
    "food offers Colombo",
    "discount coupons Sri Lanka",
    "restaurant coupons",
    "food discounts",
    "dining deals Sri Lanka",
    "special offers restaurants",
  ],
  openGraph: {
    title: "Deals & Offers | Kohedha",
    description: "Discover amazing deals and offers on restaurants, food, and entertainment in Sri Lanka.",
    type: "website",
    url: "https://kohedha.lk/deals",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deals & Offers | Kohedha",
    description: "Discover amazing deals and offers on restaurants, food, and entertainment in Sri Lanka.",
  },
}

export default async function DealsPage() {
  const allDeals: SanityDeal[] = await getDeals()
  const featuredDeals = allDeals.filter((d) => d.featured)
  const regularDeals = allDeals.filter((d) => !d.featured)

  return (
    <>
      <StructuredData type="website" data={{}} />
      <DealsPageClient allDeals={allDeals} featuredDeals={featuredDeals} regularDeals={regularDeals} />
    </>
  )
}
