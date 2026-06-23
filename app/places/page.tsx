import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, ArrowRight } from "lucide-react"
import { getPlaces } from "@/lib/sanity-places"
import StructuredData from "@/components/structured-data"
import { C } from "@/lib/brand-theme"

interface Place {
  id: string
  name: string
  description: string
  image: string
  rating?: number
  priceRange?: string
  cuisine?: string[]
  vibe?: string[]
  formattedLocation: string
  category: string
  categoryColor?: string
  status: string
  featured: boolean
  isOpen: boolean | null
  publishedAt?: string
}

export const metadata = {
  title: "Places & Venues | Kohedha",
  description: "Discover amazing restaurants, cafes, and dining venues across Sri Lanka. Find the perfect place for your next meal or coffee break.",
  keywords: ["Sri Lanka restaurants", "Colombo cafes", "Sri Lankan dining", "restaurants Sri Lanka", "cafes Colombo", "food venues", "dining places Sri Lanka", "best restaurants"],
  openGraph: {
    title: "Places & Venues | Kohedha",
    description: "Discover amazing restaurants, cafes, and dining venues across Sri Lanka.",
    type: "website",
    url: "https://kohedha.lk/places",
  },
  twitter: {
    card: "summary_large_image",
    title: "Places & Venues | Kohedha",
    description: "Discover amazing restaurants, cafes, and dining venues across Sri Lanka.",
  },
}

export default async function PlacesPage() {
  const allPlaces = await getPlaces()
  const featuredPlaces = allPlaces.filter((place: Place) => place.featured)
  const regularPlaces = allPlaces.filter((place: Place) => !place.featured)

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <StructuredData type="website" data={{}} />

      {/* Hero */}
      <section style={{ background: C.dark, color: "white", padding: "80px 48px 72px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
            Explore
          </p>
          <h1 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "-0.02em", marginBottom: "20px", lineHeight: 1.15 }}>
            Places & Venues
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Discover amazing restaurants, cafes, and dining venues across Sri Lanka.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "28px", flexWrap: "wrap" }}>
            {["Restaurants", "Cafes", "Dining Venues"].map((tag) => (
              <span key={tag} style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: "40px", padding: "6px 16px", fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ padding: "72px 48px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Featured */}
        {featuredPlaces.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "36px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "8px" }}>
                  Editor's picks
                </p>
                <h2 className="font-display" style={{ fontSize: "34px", letterSpacing: "-0.02em", color: C.text }}>
                  Featured Places
                </h2>
              </div>
              <span style={{ border: `1px solid ${C.accent}`, borderRadius: "40px", padding: "5px 14px", fontSize: "12px", color: C.accent, display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={12} />
                Featured
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {featuredPlaces.map((place: Place) => (
                <PlaceCard key={place.id} place={place} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Places */}
        <section>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "36px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "8px" }}>
                Discover
              </p>
              <h2 className="font-display" style={{ fontSize: "34px", letterSpacing: "-0.02em", color: C.text }}>
                All Places
              </h2>
            </div>
            <span style={{ fontSize: "13px", color: C.muted }}>{allPlaces.length} places</span>
          </div>

          {allPlaces.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <MapPin size={48} style={{ color: C.muted, margin: "0 auto 16px" }} />
              <h3 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "12px" }}>
                No places available yet
              </h3>
              <p style={{ color: C.muted, marginBottom: "28px" }}>Check back soon for amazing restaurants and cafes.</p>
              <Link href="/blog" style={{ background: C.accent, color: C.cream, padding: "12px 28px", borderRadius: "40px", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
                Read Our Blog
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {regularPlaces.map((place: Place) => (
                <PlaceCard key={place.id} place={place} featured={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function PlaceCard({ place, featured }: { place: Place; featured: boolean }) {
  const getPriceRangeLabel = (range?: string) => {
    if (!range) return ""
    const labels: { [key: string]: string } = {
      budget: "Under LKR 1,000",
      moderate: "LKR 1,000–3,000",
      expensive: "LKR 3,000–7,000",
      "fine-dining": "Above LKR 7,000",
    }
    return labels[range] || range
  }

  return (
    <div
      className="group"
      style={{
        background: C.cream,
        borderRadius: "16px",
        overflow: "hidden",
        border: featured ? `2px solid ${C.accent}` : "1px solid rgba(13,13,13,0.08)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <Image
          src={place.image || "/placeholder.svg"}
          alt={place.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "14px", left: "14px", background: C.dark, color: "white", borderRadius: "40px", padding: "4px 12px", fontSize: "11px", fontWeight: 500 }}>
          {place.category}
        </div>
        {featured && (
          <div style={{ position: "absolute", top: "14px", right: "14px", background: C.accent, color: "white", borderRadius: "40px", padding: "4px 12px", fontSize: "11px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={10} />
            Featured
          </div>
        )}
        {place.isOpen !== null && (
          <div style={{ position: "absolute", bottom: "14px", right: "14px", background: place.isOpen ? "#4CAF50" : "#E53935", color: "white", borderRadius: "40px", padding: "4px 10px", fontSize: "11px", fontWeight: 500 }}>
            {place.isOpen ? "Open Now" : "Closed"}
          </div>
        )}
      </div>

      <div style={{ padding: "20px 22px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h3 className="font-display" style={{ fontSize: "20px", color: C.text, lineHeight: 1.2 }}>{place.name}</h3>
          {place.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, marginLeft: "8px" }}>
              <Star size={14} style={{ fill: "#F59E0B", color: "#F59E0B" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{place.rating}</span>
            </div>
          )}
        </div>

        <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.65, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {place.description}
        </p>

        {place.formattedLocation && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: C.muted, marginBottom: "12px" }}>
            <MapPin size={12} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.formattedLocation}</span>
          </div>
        )}

        {place.cuisine && place.cuisine.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {place.cuisine.slice(0, 2).map((c: string, i: number) => (
              <span key={i} style={{ background: C.bg2, borderRadius: "40px", padding: "3px 10px", fontSize: "11px", color: C.muted }}>
                {c}
              </span>
            ))}
            {place.cuisine.length > 2 && (
              <span style={{ background: C.bg2, borderRadius: "40px", padding: "3px 10px", fontSize: "11px", color: C.muted }}>
                +{place.cuisine.length - 2}
              </span>
            )}
          </div>
        )}

        {place.priceRange && (
          <div style={{ fontSize: "12px", color: C.muted, marginBottom: "16px" }}>
            <span style={{ fontWeight: 600, color: C.text }}>Price: </span>
            {getPriceRangeLabel(place.priceRange)}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", borderTop: "1px solid rgba(13,13,13,0.08)", paddingTop: "14px" }}>
          <Link
            href={`/places/${place.id}`}
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: C.accent, textDecoration: "none" }}
          >
            View Details
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
