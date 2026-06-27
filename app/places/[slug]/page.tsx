import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Star, MapPin, Tag, Clock, Phone, Mail, Globe, Facebook, Instagram, Twitter, Check } from "lucide-react"
import { getPlace } from "@/lib/sanity-places"
import { PortableText } from "@portabletext/react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import StructuredData from "@/components/structured-data"
import { C } from "@/lib/brand-theme"

interface PlacePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const place = await getPlace(params.slug)

  if (!place) {
    return { title: "Place Not Found", description: "The requested place could not be found." }
  }

  return {
    title: place.name,
    description: place.description || `Visit ${place.name} in Sri Lanka. Discover amazing restaurants and cafes with Kohedha.`,
    keywords: [place.category, "Sri Lanka", "restaurants", "cafes", "dining", "food", "local places", ...(place.cuisine || []), ...(place.tags || [])],
    authors: [{ name: "Kohedha Team" }],
    openGraph: {
      title: place.name,
      description: place.description || `Visit ${place.name} in Sri Lanka.`,
      type: "website",
      url: `https://kohedha.lk/places/${place.id}`,
      images: [{ url: place.image, width: 1200, height: 630, alt: place.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: place.name,
      description: place.description || `Visit ${place.name} in Sri Lanka.`,
      images: [place.image],
      creator: "@kohedha",
    },
    alternates: { canonical: `/places/${place.id}` },
  }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const place = await getPlace(params.slug)

  if (!place) {
    notFound()
  }

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
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <StructuredData type="organization" data={place} />

      {/* Breadcrumb */}
      <div style={{ background: C.bg2, borderBottom: "1px solid rgba(13,13,13,0.08)", padding: "14px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Link href="/places" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", fontWeight: 500 }}>
            <ArrowLeft size={14} />
            Back to Places
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div style={{ position: "relative", height: "clamp(280px,45vh,480px)", overflow: "hidden" }}>
        <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "40px 48px" }}>
          <div style={{ maxWidth: "800px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              <span style={{ background: C.accent, color: C.text, borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500 }}>
                {place.category}
              </span>
              {place.featured && (
                <span style={{ background: C.dark, color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={10} />Featured
                </span>
              )}
              {place.isOpen !== null && (
                <span style={{ background: place.isOpen ? "#4CAF50" : "#E53935", color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500 }}>
                  {place.isOpen ? "Open Now" : "Closed"}
                </span>
              )}
            </div>
            <h1 className="font-display" style={{ color: "white", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.15, marginBottom: "14px" }}>
              {place.name}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
              {place.rating && (
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Star size={14} style={{ fill: "#F59E0B", color: "#F59E0B" }} />{place.rating} stars
                </span>
              )}
              {place.formattedLocation && (
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MapPin size={14} />{place.formattedLocation}</span>
              )}
              {place.priceRange && (
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Tag size={14} />{getPriceRangeLabel(place.priceRange)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "40px", alignItems: "flex-start" }}>

          {/* Main */}
          <div>
            <div style={{ marginBottom: "36px" }}>
              <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>About This Place</h2>
              <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.85 }}>{place.description}</p>
            </div>

            {place.body && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>More Details</h2>
                <div className="prose prose-lg max-w-none" style={{ color: C.muted }}>
                  <PortableText value={place.body} />
                </div>
              </div>
            )}

            {place.cuisine && place.cuisine.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Cuisine</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {place.cuisine.map((cuisine: string, index: number) => (
                    <span key={index} style={{ background: C.cream, border: "1px solid rgba(13,13,13,0.12)", borderRadius: "40px", padding: "6px 14px", fontSize: "13px", color: C.text }}>
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {place.features && place.features.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Features & Amenities</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                  {place.features.map((feature: string, index: number) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.muted }}>
                      <Check size={14} style={{ color: C.accent, flexShrink: 0 }} />
                      <span style={{ textTransform: "capitalize" }}>{feature.replace(/-/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vibe */}
            {place.vibe && place.vibe.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Vibe & Atmosphere</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {place.vibe.map((vibe: string, index: number) => (
                    <span key={index} style={{ background: C.bg2, border: "1px solid rgba(13,13,13,0.12)", borderRadius: "40px", padding: "6px 14px", fontSize: "13px", color: C.muted }}>
                      {vibe.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {place.images && place.images.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Gallery</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {place.images.map((image: any, index: number) => (
                    <div key={index} style={{ position: "relative", height: "120px", borderRadius: "12px", overflow: "hidden" }}>
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt || place.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Info card */}
            <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(13,13,13,0.08)", overflow: "hidden" }}>
              <div style={{ background: C.dark, padding: "18px 22px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={18} />Place Information
                </h3>
              </div>
              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {place.location && (
                  <div>
                    <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "6px", fontWeight: 500 }}>Location</p>
                    <div style={{ fontSize: "13px", color: C.muted, lineHeight: 1.6 }}>
                      {place.location.name && <div style={{ fontWeight: 600, color: C.text }}>{place.location.name}</div>}
                      {place.location.address && <div>{place.location.address}</div>}
                      {place.location.city && <div>{place.location.city}</div>}
                      {place.location.district && <div>{place.location.district}</div>}
                    </div>
                  </div>
                )}

                {place.openingHours && (
                  <>
                    <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
                    <div>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "8px", fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={11} />Opening Hours
                      </p>
                      <div style={{ fontSize: "13px", color: C.muted }}>
                        {Object.entries(place.openingHours).map(([day, hours]: [string, any]) => (
                          <div key={day} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{day}</span>
                            <span>{hours || "Closed"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {place.priceRange && (
                  <>
                    <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
                    <div>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "6px", fontWeight: 500 }}>Price Range</p>
                      <p style={{ fontSize: "13px", color: C.text, fontWeight: 600 }}>{getPriceRangeLabel(place.priceRange)}</p>
                    </div>
                  </>
                )}

                {place.rating && (
                  <>
                    <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
                    <div>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "6px", fontWeight: 500 }}>Rating</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Star size={14} style={{ fill: "#F59E0B", color: "#F59E0B" }} />
                        <span style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{place.rating} out of 5</span>
                      </div>
                    </div>
                  </>
                )}

                {place.tags && place.tags.length > 0 && (
                  <>
                    <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
                    <div>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "8px", fontWeight: 500 }}>Tags</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {place.tags.map((tag: string, index: number) => (
                          <span key={index} style={{ background: C.bg2, borderRadius: "40px", padding: "3px 10px", fontSize: "11px", color: C.muted }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact */}
            {place.contactInfo && (
              <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(13,13,13,0.08)", padding: "20px 22px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", color: C.text, marginBottom: "16px" }}>Contact</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {place.contactInfo.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Phone size={14} style={{ color: C.muted }} />
                      <a href={`tel:${place.contactInfo.phone}`} style={{ color: C.accent, textDecoration: "none" }}>{place.contactInfo.phone}</a>
                    </div>
                  )}
                  {place.contactInfo.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Mail size={14} style={{ color: C.muted }} />
                      <a href={`mailto:${place.contactInfo.email}`} style={{ color: C.accent, textDecoration: "none" }}>{place.contactInfo.email}</a>
                    </div>
                  )}
                  {place.contactInfo.whatsapp && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Phone size={14} style={{ color: "#4CAF50" }} />
                      <a href={`https://wa.me/${place.contactInfo.whatsapp}`} style={{ color: "#4CAF50", textDecoration: "none" }}>WhatsApp</a>
                    </div>
                  )}
                  {place.contactInfo.website && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Globe size={14} style={{ color: C.muted }} />
                      <a href={place.contactInfo.website} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Visit Website</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social */}
            {place.socialLinks && (
              <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(13,13,13,0.08)", padding: "20px 22px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", color: C.text, marginBottom: "16px" }}>Follow & Share</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {place.socialLinks.facebook && (
                    <a href={place.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", border: "1px solid rgba(13,13,13,0.15)", borderRadius: "40px", padding: "6px 14px" }}>
                      <Facebook size={13} />Facebook
                    </a>
                  )}
                  {place.socialLinks.instagram && (
                    <a href={place.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", border: "1px solid rgba(13,13,13,0.15)", borderRadius: "40px", padding: "6px 14px" }}>
                      <Instagram size={13} />Instagram
                    </a>
                  )}
                  {place.socialLinks.twitter && (
                    <a href={place.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", border: "1px solid rgba(13,13,13,0.15)", borderRadius: "40px", padding: "6px 14px" }}>
                      <Twitter size={13} />Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
