"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { SanityDeal } from "./page"
import { C } from "@/lib/brand-theme"

interface ModalData {
  discount: string
  title: string
  venue: string
  detail: string
}

const tickerItems = [
  { deal: "30% off cocktails", venue: "The Patio" },
  { deal: "Set menu for two", venue: "Harbour Lights" },
  { deal: "2-for-1 craft beers", venue: "The Loft" },
  { deal: "20% off brunch", venue: "Garden Social" },
  { deal: "Free dessert with dinner", venue: "Rooftop Sessions" },
  { deal: "40% off wine", venue: "The Cellar" },
]

const statusFilters = ["All deals", "Active now", "Coming soon"]
const typeFilters = ["Happy hour", "Set menu", "Drinks", "Brunch"]
const vibeFilters = ["Chill", "Date night", "Party"]

function parseDiscount(coupon?: { discount: string; code?: string }): { big: string; suffix: string } {
  if (!coupon?.discount) return { big: "—", suffix: "" }
  const d = coupon.discount
  // e.g. "30% off" → big: "30", suffix: "% off"
  const pct = d.match(/^(\d+)\s*(%\s*off)/i)
  if (pct) return { big: pct[1], suffix: pct[2] }
  // e.g. "2for1" or "2 for 1"
  const twoFor = d.match(/^(\d+\s*for\s*\d+)/i)
  if (twoFor) return { big: twoFor[1].replace(/\s/g, ""), suffix: "" }
  // e.g. "Free dessert"
  const free = d.match(/^(Free)\s*(.*)/i)
  if (free) return { big: "Free", suffix: free[2] ? ` ${free[2]}` : "" }
  return { big: d, suffix: "" }
}

function StatusPill({ status }: { status: string }) {
  const isActive = status === "active"
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        fontWeight: 500,
        padding: "4px 10px",
        borderRadius: "20px",
        marginBottom: "14px",
        background: isActive ? C.greenBg : "rgba(245,230,66,0.1)",
        color: isActive ? C.green : C.accent,
      }}
    >
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: isActive ? C.green : C.accent, display: "inline-block" }} />
      {isActive ? "Active now" : "Coming soon"}
    </span>
  )
}

function DealCard({ deal, onClick }: { deal: SanityDeal; onClick: () => void }) {
  const { big, suffix } = parseDiscount(deal.validCoupons?.[0])
  return (
    <div
      onClick={onClick}
      style={{
        background: C.cream,
        borderRadius: "18px",
        overflow: "visible",
        border: "1px solid rgba(13,13,13,0.06)",
        transition: "transform 0.2s",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
    >
      {/* Top */}
      <div
        style={{
          padding: "24px",
          position: "relative",
          borderBottom: "1px dashed rgba(13,13,13,0.1)",
        }}
      >
        {/* punch holes */}
        <div style={{ position: "absolute", bottom: "-10px", left: "-1px", width: "20px", height: "20px", borderRadius: "50%", background: C.bg, border: "1px solid rgba(13,13,13,0.06)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "-10px", right: "-1px", width: "20px", height: "20px", borderRadius: "50%", background: C.bg, border: "1px solid rgba(13,13,13,0.06)", zIndex: 1 }} />

        <StatusPill status={deal.status} />
        <div className="font-display" style={{ fontSize: "52px", lineHeight: 1, color: C.text, letterSpacing: "-0.04em", marginBottom: "6px" }}>
          {big}
          <span className="font-dm-sans" style={{ fontSize: "24px", color: C.muted, fontWeight: 300 }}>{suffix}</span>
        </div>
        <div style={{ fontSize: "15px", fontWeight: 500, color: C.text, marginBottom: "4px" }}>{deal.name}</div>
        <div style={{ fontSize: "13px", color: C.muted, lineHeight: 1.5 }}>{deal.description}</div>
      </div>

      {/* Bottom */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: C.text }}>{deal.name}</div>
          <div style={{ fontSize: "12px", color: C.muted }}>{deal.formattedAddress}</div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {deal.category && (
            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", background: C.bg, color: C.muted, border: "1px solid rgba(13,13,13,0.08)" }}>
              {deal.category}
            </span>
          )}
        </div>
      </div>

      {/* Redeem link */}
      {deal.redirectLink && (
        <div style={{ padding: "0 20px 16px" }} onClick={(e) => e.stopPropagation()}>
          <a
            href={deal.redirectLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%", background: C.accent, color: C.text, fontSize: "13px", fontWeight: 500, padding: "10px", borderRadius: "10px", textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            <ExternalLink size={14} />
            Redeem Now
          </a>
        </div>
      )}
    </div>
  )
}

export default function DealsPageClient({ allDeals, featuredDeals, regularDeals }: { allDeals: SanityDeal[]; featuredDeals: SanityDeal[]; regularDeals: SanityDeal[] }) {
  const [activeFilter, setActiveFilter] = useState("All deals")
  const [modal, setModal] = useState<ModalData | null>(null)

  const pillBase: React.CSSProperties = {
    fontSize: "13px",
    padding: "7px 16px",
    borderRadius: "40px",
    border: "1px solid rgba(13,13,13,0.15)",
    color: C.muted,
    cursor: "pointer",
    transition: "all 0.15s",
    background: "transparent",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  }
  const pillActive: React.CSSProperties = { ...pillBase, background: C.accent, color: C.text, borderColor: C.accent }

  const filteredDeals = allDeals.filter((d) => {
    if (activeFilter === "Active now") return d.status === "active"
    if (activeFilter === "Coming soon") return d.status !== "active"
    return true
  })

  const activeDeals = filteredDeals.filter((d) => d.status === "active")
  const comingSoonDeals = filteredDeals.filter((d) => d.status !== "active")

  const topFeatured = featuredDeals[0]

  const openDealModal = (deal: SanityDeal) => {
    const { big, suffix } = parseDiscount(deal.validCoupons?.[0])
    setModal({ discount: `${big}${suffix}`, title: deal.name, venue: deal.formattedAddress, detail: deal.description })
  }

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, overflowX: "hidden", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div style={{ paddingTop: "64px", position: "relative", overflow: "hidden" }}>
        <span className="font-display" style={{ position: "absolute", bottom: "-40px", left: "-20px", fontSize: "clamp(100px,18vw,200px)", fontWeight: 600, letterSpacing: "-0.04em", color: "rgba(245,230,66,0.07)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
          DEALS
        </span>
        <div style={{ padding: "80px 48px 60px", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "80px", alignItems: "center", position: "relative" }}>
          <div className="lp-fade-up">
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
              Live offers near you
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(48px,6vw,80px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: C.text, marginBottom: "20px" }}>
              Great places,<br /><em style={{ fontStyle: "italic", color: C.accent }}>even better</em><br />prices
            </h1>
            <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.7, maxWidth: "420px" }}>
              Real-time deals from venues matched to your vibe — happy hours, set menus, and exclusive discounts active right now.
            </p>
          </div>

          {/* Preview deals panel */}
          <div className="lp-fade-up" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(allDeals.length > 0 ? allDeals.slice(0, 4) : [
              { id: "1", name: "Happy hour cocktails", formattedAddress: "The Patio · Colombo 7", status: "active", discount: "30%" },
              { id: "2", name: "Set menu for two", formattedAddress: "Harbour Lights · Colombo 1", status: "active", discount: "50%" },
              { id: "3", name: "Weekend brunch", formattedAddress: "Garden Social · Colombo 5", status: "soon", discount: "20%" },
              { id: "4", name: "Craft beer Tuesday", formattedAddress: "The Loft · Colombo 4", status: "soon", discount: "2for1" },
            ] as any[]).map((deal, i) => {
              const coupon = (deal as SanityDeal).validCoupons?.[0]
              const { big } = parseDiscount(coupon)
              const discountText = coupon ? big : (deal.discount || "—")
              const isActive = deal.status === "active"
              return (
                <div key={deal.id || i} style={{ background: C.cream, borderRadius: "16px", padding: "18px 20px", border: "1px solid rgba(13,13,13,0.06)", display: "flex", alignItems: "center", gap: "16px", transition: "transform 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateX(0)")}
                >
                  <div className="font-display" style={{ fontSize: "28px", color: C.accent, minWidth: "64px", textAlign: "center", lineHeight: 1 }}>
                    {discountText}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: C.text, marginBottom: "3px" }}>{deal.name}</div>
                    <div style={{ fontSize: "12px", color: C.muted }}>{deal.formattedAddress}</div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 500, padding: "4px 10px", borderRadius: "20px", background: isActive ? C.greenBg : "rgba(245,230,66,0.1)", color: isActive ? C.green : C.accent, whiteSpace: "nowrap" }}>
                    {isActive ? "Active now" : "Coming soon"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── LIVE TICKER ── */}
      <div style={{ background: C.dark, padding: "14px 0", overflow: "hidden", position: "relative" }}>
        <div className="lp-ticker" style={{ display: "flex", gap: "48px", whiteSpace: "nowrap" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, flexShrink: 0, display: "inline-block" }} />
              <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{item.deal}</strong>
              {" at "}
              <span style={{ color: "rgba(245,230,66,0.7)" }}>{item.venue}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ background: C.bg2, padding: "32px 48px", display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap", borderTop: "1px solid rgba(13,13,13,0.06)", borderBottom: "1px solid rgba(13,13,13,0.06)" }}>
        {[
          { num: allDeals.length > 0 ? String(allDeals.length) : "38", label: "Active deals right now" },
          { num: allDeals.length > 0 ? String(new Set(allDeals.map(d => d.formattedAddress)).size) : "12", label: "Venues with live offers" },
          { num: "LKR 4k", label: "Avg. saving per visit" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div className="font-display" style={{ fontSize: "36px", color: C.text, letterSpacing: "-0.03em" }}>{stat.num}</div>
            <div style={{ fontSize: "13px", color: C.muted, marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ background: C.cream, borderBottom: "1px solid rgba(13,13,13,0.08)", padding: "16px 48px", position: "sticky", top: "64px", zIndex: 90, display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", overflowX: "auto" }}>
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, marginRight: "4px", whiteSpace: "nowrap" }}>Status</span>
        {statusFilters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} style={activeFilter === f ? pillActive : pillBase}>{f}</button>
        ))}
        <div style={{ width: "1px", height: "24px", background: "rgba(13,13,13,0.1)", margin: "0 4px", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, marginRight: "4px", whiteSpace: "nowrap" }}>Type</span>
        {typeFilters.map((f) => (
          <button key={f} style={pillBase} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(13,13,13,0.15)"; e.currentTarget.style.color = C.muted }}>{f}</button>
        ))}
        <div style={{ width: "1px", height: "24px", background: "rgba(13,13,13,0.1)", margin: "0 4px", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, marginRight: "4px", whiteSpace: "nowrap" }}>Vibe</span>
        {vibeFilters.map((f) => (
          <button key={f} style={pillBase} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(13,13,13,0.15)"; e.currentTarget.style.color = C.muted }}>{f}</button>
        ))}
      </div>

      <div style={{ padding: "60px 48px 80px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── FEATURED DEAL BANNER ── */}
        {topFeatured && (
          <div
            className="lp-fade-up"
            style={{ background: C.dark, borderRadius: "24px", padding: "48px", display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center", marginBottom: "40px", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
                Deal of the week
              </p>
              <h2 className="font-display" style={{ fontSize: "38px", color: C.cream, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "10px" }}>
                {topFeatured.name}
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "28px", maxWidth: "500px" }}>
                {topFeatured.description}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => openDealModal(topFeatured)}
                  style={{ background: C.accent, color: C.text, fontSize: "14px", fontWeight: 500, padding: "13px 28px", borderRadius: "40px", border: "none", cursor: "pointer", transition: "background 0.2s", fontFamily: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                >
                  View deal
                </button>
                {topFeatured.redirectLink && (
                  <a href={topFeatured.redirectLink} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontSize: "14px", padding: "13px 28px", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none", transition: "background 0.2s" }}>
                    View venue
                  </a>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="font-display" style={{ fontSize: "96px", color: C.accent, lineHeight: 1, letterSpacing: "-0.05em" }}>
                {parseDiscount(topFeatured.validCoupons?.[0]).big}
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>off regular price</div>
            </div>
          </div>
        )}

        {/* ── ACTIVE DEALS ── */}
        {activeDeals.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 className="font-display" style={{ fontSize: "32px", color: C.text, letterSpacing: "-0.02em" }}>Active now</h2>
              <span style={{ fontSize: "13px", color: C.muted }}>{activeDeals.length} active deals</span>
            </div>
            <div className="lp-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "60px" }}>
              {activeDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onClick={() => openDealModal(deal)} />
              ))}
            </div>
          </>
        )}

        {/* ── COMING SOON ── */}
        {comingSoonDeals.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
              <h2 className="font-display" style={{ fontSize: "32px", color: C.text, letterSpacing: "-0.02em" }}>Coming soon</h2>
              <span style={{ fontSize: "13px", color: C.muted }}>{comingSoonDeals.length} upcoming deals</span>
            </div>
            <div className="lp-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "60px" }}>
              {comingSoonDeals.map((deal) => {
                const { big } = parseDiscount(deal.validCoupons?.[0])
                return (
                  <div key={deal.id} style={{ background: C.cream, borderRadius: "14px", padding: "20px 24px", border: "1px solid rgba(13,13,13,0.06)", display: "flex", gap: "16px", alignItems: "center", opacity: 0.7 }}>
                    <div className="font-display" style={{ fontSize: "28px", color: C.muted, minWidth: "56px" }}>{big}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: C.text, marginBottom: "3px" }}>{deal.name}</div>
                      <div style={{ fontSize: "12px", color: C.muted }}>{deal.formattedAddress}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: C.accent, fontWeight: 500, whiteSpace: "nowrap" }}>
                      {deal.publishedAt ? new Date(deal.publishedAt).toLocaleDateString("en", { day: "numeric", month: "short" }) : "Soon"}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {allDeals.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p className="font-display" style={{ fontSize: "28px", color: C.text, marginBottom: "12px" }}>No deals right now</p>
            <p style={{ fontSize: "15px", color: C.muted, marginBottom: "32px" }}>Check back soon — venues drop new offers daily.</p>
            <Link href="/" style={{ display: "inline-block", background: C.accent, color: C.text, fontSize: "14px", fontWeight: 500, padding: "13px 28px", borderRadius: "40px", textDecoration: "none" }}>
              Explore venues
            </Link>
          </div>
        )}
      </div>

      {/* ── HOW DEALS WORK ── */}
      <div style={{ background: C.bg2, padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div className="lp-fade-up" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
            How it works
          </p>
          <h2 className="font-display" style={{ fontSize: "36px", letterSpacing: "-0.02em", color: C.text, marginBottom: "40px" }}>
            Redeem in seconds
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px" }}>
            {[
              { num: "01", title: "Find the deal", body: "Browse by venue, vibe, or deal type. Active deals are live right now — coming soon deals let you plan ahead." },
              { num: "02", title: "Book your table", body: "Reserve a seat at the venue for the deal window. Your booking locks in the offer so it's waiting when you arrive." },
              { num: "03", title: "Show up & redeem", body: "Show your Kohedha booking at the venue. No voucher codes, no screenshots — just your reservation confirmation." },
            ].map((step) => (
              <div key={step.num} style={{ background: C.cream, borderRadius: "16px", padding: "28px", border: "1px solid rgba(13,13,13,0.06)" }}>
                <div className="font-display" style={{ fontSize: "48px", color: "rgba(245,230,66,0.2)", lineHeight: 1, marginBottom: "16px" }}>{step.num}</div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: C.text, marginBottom: "8px" }}>{step.title}</div>
                <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.7 }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── APP CTA ── */}
      <div style={{ background: "black", padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span className="font-display" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(100px,18vw,200px)", fontWeight: 600, letterSpacing: "-0.04em", color: "rgba(245,230,66,0.06)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
          SAVE
        </span>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", color: C.cream, lineHeight: 1.1, marginBottom: "16px" }}>
            Never miss a deal<br /><em style={{ fontStyle: "italic", color: C.accent }}>near you</em>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "400px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            Get push alerts the moment a venue near you drops a deal. Exclusive in-app offers only available on the app.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {[{ label: "Download on the", strong: "App Store" }, { label: "Get it on", strong: "Google Play" }].map((b) => (
              <a key={b.strong} href="#" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.08)", color: C.cream, padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "13px", border: "1px solid rgba(255,255,255,0.1)", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                <div>
                  <span style={{ fontSize: "11px", opacity: 0.6, display: "block" }}>{b.label}</span>
                  <strong style={{ fontSize: "15px", fontWeight: 500 }}>{b.strong}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(30,27,23,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div style={{ background: C.cream, borderRadius: "24px", padding: "40px", maxWidth: "500px", width: "100%", position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: "16px", right: "16px", background: C.bg2, border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ✕
            </button>
            <div className="font-display" style={{ fontSize: "72px", color: C.accent, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "8px" }}>
              {modal.discount}
            </div>
            <h2 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "6px" }}>{modal.title}</h2>
            <p style={{ fontSize: "14px", color: C.muted, marginBottom: "20px" }}>{modal.venue}</p>
            <div style={{ background: C.bg, borderRadius: "12px", padding: "16px", marginBottom: "20px", fontSize: "14px", color: C.muted, lineHeight: 1.7 }}>
              {modal.detail}
            </div>
            <div style={{ fontSize: "13px", color: C.accent, background: "rgba(245,230,66,0.08)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
              Redeem this deal on the Kohedha app for exclusive offers and push alerts.
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", borderRadius: "40px", fontSize: "14px", fontWeight: 500, cursor: "pointer", border: "none", background: C.accent, color: C.text, fontFamily: "inherit" }}>
                Redeem deal →
              </button>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", borderRadius: "40px", fontSize: "14px", fontWeight: 500, cursor: "pointer", border: "none", background: C.bg2, color: C.text, fontFamily: "inherit" }}>
                Book a table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
