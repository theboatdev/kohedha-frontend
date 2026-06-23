import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Star, MapPin, Tag, Clock, Phone, Mail, Globe, Facebook, Instagram, ExternalLink } from "lucide-react"
import { getDeal } from "@/lib/sanity-deals"
import { PortableText } from "@portabletext/react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import StructuredData from "@/components/structured-data"
import { CouponCard } from "./coupon-card"
import { C } from "@/lib/brand-theme"

interface DealPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const deal = await getDeal(params.slug)

  if (!deal) {
    return { title: "Deal Not Found", description: "The requested deal could not be found." }
  }

  return {
    title: deal.name,
    description: deal.description || `Get amazing deals and discounts on ${deal.name} in Sri Lanka. Save money with exclusive offers and coupons.`,
    keywords: [deal.category, "Sri Lanka deals", "restaurant deals", "food discounts", "coupons", "offers", ...(deal.tags || [])],
    authors: [{ name: "Kohedha Team" }],
    openGraph: {
      title: deal.name,
      description: deal.description || `Get amazing deals and discounts on ${deal.name} in Sri Lanka.`,
      type: "website",
      url: `https://kohedha.lk/deals/${deal.id}`,
      images: [{ url: deal.image, width: 1200, height: 630, alt: deal.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: deal.name,
      description: deal.description || `Get amazing deals and discounts on ${deal.name} in Sri Lanka.`,
      images: [deal.image],
      creator: "@kohedha",
    },
    alternates: { canonical: `/deals/${deal.id}` },
  }
}

const statusLabel: { [key: string]: { label: string; color: string } } = {
  active:       { label: "Active Deal",  color: "#4CAF50" },
  expired:      { label: "Expired",      color: "#E53935" },
  "coming-soon":{ label: "Coming Soon",  color: "#FB8C00" },
  "sold-out":   { label: "Sold Out",     color: "#6B6B6B" },
  paused:       { label: "Paused",       color: "#6B6B6B" },
}

export default async function DealPage({ params }: DealPageProps) {
  const deal = await getDeal(params.slug)

  if (!deal) {
    notFound()
  }

  const status = statusLabel[deal.status] ?? { label: deal.status, color: C.muted }

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <StructuredData type="organization" data={deal} />

      {/* Breadcrumb */}
      <div style={{ background: C.bg2, borderBottom: "1px solid rgba(13,13,13,0.08)", padding: "14px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Link href="/deals" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", fontWeight: 500 }}>
            <ArrowLeft size={14} />
            Back to Deals
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", height: "clamp(260px,42vh,460px)", overflow: "hidden" }}>
        <Image src={deal.image || "/placeholder.svg"} alt={deal.name} fill className="object-cover" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.68))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "40px 48px" }}>
          <div style={{ maxWidth: "780px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              <span style={{ background: C.accent, color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500 }}>
                {deal.category}
              </span>
              {deal.featured && (
                <span style={{ background: C.dark, color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={10} />Featured
                </span>
              )}
              <span style={{ background: status.color, color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500 }}>
                {status.label}
              </span>
            </div>
            <h1 className="font-display" style={{ color: "white", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.15, marginBottom: "14px" }}>
              {deal.name}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
              {deal.rating && (
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Star size={14} style={{ fill: "#F59E0B", color: "#F59E0B" }} />{deal.rating} stars
                </span>
              )}
              {deal.formattedAddress && (
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MapPin size={14} />{deal.formattedAddress}</span>
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
            {/* Redeem CTA */}
            {deal.redirectLink && (
              <div style={{ marginBottom: "32px" }}>
                <a
                  href={deal.redirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.accent, color: "white", borderRadius: "40px", padding: "14px 32px", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}
                >
                  <ExternalLink size={18} />
                  Redeem Now
                </a>
                <p style={{ fontSize: "13px", color: C.muted, marginTop: "8px" }}>Click to visit the deal site and redeem your offer</p>
              </div>
            )}

            <div style={{ marginBottom: "36px" }}>
              <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>About This Deal</h2>
              <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.85 }}>{deal.description}</p>
            </div>

            {deal.validCoupons && deal.validCoupons.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "20px" }}>Available Offers</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {deal.validCoupons.map((coupon: any, index: number) => (
                    <CouponCard key={index} coupon={coupon} />
                  ))}
                </div>
              </div>
            )}

            {deal.notes && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Terms & Conditions</h2>
                <div className="prose prose-lg max-w-none" style={{ color: C.muted }}>
                  <PortableText value={deal.notes} />
                </div>
              </div>
            )}

            {deal.images && deal.images.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Gallery</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {deal.images.map((image: any, index: number) => (
                    <div key={index} style={{ position: "relative", height: "120px", borderRadius: "12px", overflow: "hidden" }}>
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt || deal.name}
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

            {/* Deal info */}
            <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(13,13,13,0.08)", overflow: "hidden" }}>
              <div style={{ background: C.dark, padding: "18px 22px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Tag size={18} />Deal Information
                </h3>
              </div>
              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {deal.redirectLink && (
                  <a
                    href={deal.redirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: C.accent, color: "white", borderRadius: "40px", padding: "12px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
                  >
                    <ExternalLink size={14} />Redeem Now
                  </a>
                )}

                {deal.address && (
                  <div>
                    <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "6px", fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}>
                      <MapPin size={11} />Location
                    </p>
                    <div style={{ fontSize: "13px", color: C.muted, lineHeight: 1.6 }}>
                      {deal.address.street && <div>{deal.address.street}</div>}
                      {deal.address.city && <div>{deal.address.city}</div>}
                      {deal.address.district && <div>{deal.address.district}</div>}
                      {deal.address.country && <div>{deal.address.country}</div>}
                    </div>
                  </div>
                )}

                {deal.couponValidityInfo && (
                  <>
                    <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
                    <div>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "8px", fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={11} />Validity
                      </p>
                      <div style={{ fontSize: "13px", color: C.muted, display: "flex", flexDirection: "column", gap: "4px" }}>
                        {deal.couponValidityInfo.startDate && <div>From: {new Date(deal.couponValidityInfo.startDate).toLocaleDateString()}</div>}
                        {deal.couponValidityInfo.endDate && <div>Until: {new Date(deal.couponValidityInfo.endDate).toLocaleDateString()}</div>}
                        {deal.couponValidityInfo.validDays?.length > 0 && <div>Valid on: {deal.couponValidityInfo.validDays.join(", ")}</div>}
                        {deal.couponValidityInfo.validHours && <div>Hours: {deal.couponValidityInfo.validHours.start} – {deal.couponValidityInfo.validHours.end}</div>}
                      </div>
                    </div>
                  </>
                )}

                {deal.tags && deal.tags.length > 0 && (
                  <>
                    <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
                    <div>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.accent, marginBottom: "8px", fontWeight: 500 }}>Tags</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {deal.tags.map((tag: string, index: number) => (
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
            {deal.contactInfo && (
              <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(13,13,13,0.08)", padding: "20px 22px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", color: C.text, marginBottom: "16px" }}>Contact</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {deal.contactInfo.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Phone size={14} style={{ color: C.muted }} />
                      <a href={`tel:${deal.contactInfo.phone}`} style={{ color: C.accent, textDecoration: "none" }}>{deal.contactInfo.phone}</a>
                    </div>
                  )}
                  {deal.contactInfo.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Mail size={14} style={{ color: C.muted }} />
                      <a href={`mailto:${deal.contactInfo.email}`} style={{ color: C.accent, textDecoration: "none" }}>{deal.contactInfo.email}</a>
                    </div>
                  )}
                  {deal.contactInfo.whatsapp && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Phone size={14} style={{ color: "#4CAF50" }} />
                      <a href={`https://wa.me/${deal.contactInfo.whatsapp}`} style={{ color: "#4CAF50", textDecoration: "none" }}>WhatsApp</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social */}
            {deal.socialLinks && (
              <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(13,13,13,0.08)", padding: "20px 22px" }}>
                <h3 className="font-display" style={{ fontSize: "20px", color: C.text, marginBottom: "16px" }}>Follow & Share</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {deal.socialLinks.facebook && (
                    <a href={deal.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", border: "1px solid rgba(13,13,13,0.15)", borderRadius: "40px", padding: "6px 14px" }}>
                      <Facebook size={13} />Facebook
                    </a>
                  )}
                  {deal.socialLinks.instagram && (
                    <a href={deal.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", border: "1px solid rgba(13,13,13,0.15)", borderRadius: "40px", padding: "6px 14px" }}>
                      <Globe size={13} />Website
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
