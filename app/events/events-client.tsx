"use client"

import { useState } from "react"
import Link from "next/link"
import type { SanityEvent } from "./page"
import { C } from "@/lib/brand-theme"

interface ModalData {
  title: string
  venue: string
  date: string
  price: string
  vibe: string
}

function parseDateBadge(dateStr: string): { day: string; month: string } {
  if (!dateStr) return { day: "--", month: "---" }
  // Try native Date parse
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    return {
      day: String(d.getDate()),
      month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
    }
  }
  // Try extract "14 Dec" style
  const m = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})/)
  if (m) return { day: m[1], month: m[2].toUpperCase() }
  return { day: "--", month: "---" }
}

const vibeFilters = ["All", "Live music", "Party", "Date night", "Chill", "Brunch"]
const whenFilters = ["Tonight", "This weekend", "This week"]
const priceFilters = ["Free", "Under LKR 2k"]

const vibeColors: Record<string, string> = {
  "Live music": C.accent,
  Party: "#7a4ab8",
  "Date night": C.accent2,
  Brunch: "#5a8a6a",
  Chill: C.accent,
}

const timeline = [
  {
    day: "Thursday",
    date: "12 Dec",
    events: [
      { name: "Acoustic Afternoons", meta: "The Loft · 4:00 PM", vibe: "CHILL" },
      { name: "After-Work Social", meta: "The Patio · 6:00 PM", vibe: "AFTER WORK" },
    ],
  },
  {
    day: "Friday",
    date: "13 Dec",
    events: [
      { name: "Candlelit Dinner Series", meta: "Harbour Lights · 7:00 PM", vibe: "DATE NIGHT" },
      { name: "Friday Night Sessions", meta: "Rooftop Sessions · 9:00 PM", vibe: "PARTY" },
      { name: "Wine & Jazz", meta: "The Cellar · 8:00 PM", vibe: "CHILL" },
    ],
  },
  {
    day: "Saturday",
    date: "14 Dec",
    events: [
      { name: "Rooftop Jazz & Sunset", meta: "Harbour Lights · 6:30 PM", vibe: "LIVE MUSIC" },
      { name: "Electric Saturdays", meta: "Rooftop Sessions · 9:00 PM", vibe: "PARTY" },
      { name: "Street Food Pop-Up", meta: "Garden Social · 5:00 PM", vibe: "CHILL" },
    ],
  },
  {
    day: "Sunday",
    date: "15 Dec",
    events: [
      { name: "Sunday Jazz Brunch", meta: "The Patio · 11:00 AM", vibe: "BRUNCH" },
      { name: "Slow Sunday Sessions", meta: "The Loft · 2:00 PM", vibe: "CHILL" },
    ],
  },
  {
    day: "Monday",
    date: "16 Dec",
    events: [],
  },
]

const activeVenues = [
  {
    initial: "H",
    name: "Harbour Lights",
    location: "Colombo 1 · Sea-facing rooftop",
    events: [
      { name: "Rooftop Jazz & Sunset", date: "Sat 14", price: "LKR 2,500" },
      { name: "Candlelit Dinner", date: "Fri 13", price: "LKR 4,500" },
      { name: "NYE Gala", date: "Dec 31", price: "LKR 8,500" },
    ],
  },
  {
    initial: "R",
    name: "Rooftop Sessions",
    location: "Colombo 3 · Open-air",
    events: [
      { name: "Electric Saturdays", date: "Sat 14", price: "LKR 1,500" },
      { name: "Friday Night Sessions", date: "Fri 13", price: "LKR 1,000" },
    ],
  },
  {
    initial: "P",
    name: "The Patio",
    location: "Colombo 7 · Garden setting",
    events: [
      { name: "Sunday Jazz Brunch", date: "Sun 15", price: "Free" },
      { name: "After-Work Social", date: "Thu 12", price: "Free" },
    ],
  },
  {
    initial: "L",
    name: "The Loft",
    location: "Colombo 4 · Industrial chic",
    events: [
      { name: "Acoustic Afternoons", date: "Thu 12", price: "Free" },
      { name: "Slow Sunday Sessions", date: "Sun 15", price: "Free" },
    ],
  },
]

export default function EventsPageClient({ events }: { events: SanityEvent[] }) {
  const [activeVibe, setActiveVibe] = useState("All")
  const [activeWhen, setActiveWhen] = useState<string | null>(null)
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalData | null>(null)

  const filteredEvents = events.filter((e) => {
    if (activeVibe !== "All") {
      const cat = (e.category || "").toLowerCase()
      if (!cat.includes(activeVibe.toLowerCase())) return false
    }
    if (activePrice === "Free" && e.price && e.price !== "Free" && e.price !== "0") return false
    return true
  })

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
  const pillActive: React.CSSProperties = {
    ...pillBase,
    background: C.accent,
    color: C.cream,
    borderColor: C.accent,
  }

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, overflowX: "hidden", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div style={{ paddingTop: "64px", position: "relative", overflow: "hidden" }}>
        <span
          className="font-display"
          style={{
            position: "absolute",
            bottom: "-40px",
            right: "-30px",
            fontSize: "clamp(100px,18vw,200px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "rgba(245,230,66,0.07)",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          EVENTS
        </span>
        <div style={{ padding: "80px 48px 60px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            Happening near you
          </p>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(52px,7vw,88px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: C.text, marginBottom: "20px" }}
          >
            Nights worth
            <br />
            <em style={{ fontStyle: "italic", color: C.accent }}>showing up for</em>
          </h1>
          <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.7, maxWidth: "480px" }}>
            Live music, themed dinners, pop-ups, and exclusive evenings — all at venues matched to your vibe.
          </p>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div
        style={{
          background: C.cream,
          borderBottom: "1px solid rgba(13,13,13,0.08)",
          padding: "16px 48px",
          position: "sticky",
          top: "64px",
          zIndex: 90,
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          overflowX: "auto",
        }}
      >
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, marginRight: "4px", whiteSpace: "nowrap" }}>Vibe</span>
        {vibeFilters.map((f) => (
          <button key={f} onClick={() => setActiveVibe(f)} style={activeVibe === f ? pillActive : pillBase}>
            {f}
          </button>
        ))}
        <div style={{ width: "1px", height: "24px", background: "rgba(13,13,13,0.1)", margin: "0 4px", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, marginRight: "4px", whiteSpace: "nowrap" }}>When</span>
        {whenFilters.map((f) => (
          <button key={f} onClick={() => setActiveWhen(activeWhen === f ? null : f)} style={activeWhen === f ? pillActive : pillBase}>
            {f}
          </button>
        ))}
        <div style={{ width: "1px", height: "24px", background: "rgba(13,13,13,0.1)", margin: "0 4px", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, marginRight: "4px", whiteSpace: "nowrap" }}>Price</span>
        {priceFilters.map((f) => (
          <button key={f} onClick={() => setActivePrice(activePrice === f ? null : f)} style={activePrice === f ? pillActive : pillBase}>
            {f}
          </button>
        ))}
      </div>

      {/* ── FEATURED EVENT ── */}
      <div className="lp-fade-up" style={{ padding: "60px 48px 0", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: "24px" }}>
          Featured tonight
        </p>
        <div
          style={{
            background: "black",
            borderRadius: "24px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            marginBottom: "60px",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
          className="featured-event-grid"
        >
          <div style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(245,230,66,0.2)",
                color: C.accent,
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: "20px",
                marginBottom: "24px",
                width: "fit-content",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, display: "inline-block" }} />
              Live tonight
            </span>
            <h2 className="font-display" style={{ fontSize: "42px", color: C.cream, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Rooftop Jazz &amp; Sunset Sessions
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
              Harbour Lights · Colombo 1
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
              {[
                { icon: "◷", text: "Saturday, 14 Dec · 6:30 PM – 11:00 PM" },
                { icon: "◎", text: "Rooftop terrace · Sea-facing" },
                { icon: "◈", text: "LKR 2,500 per person · Includes welcome drink" },
                { icon: "♪", text: "Live jazz · DJ set from 9 PM" },
              ].map((row) => (
                <div key={row.text} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, color: "rgba(255,255,255,0.5)" }}>
                    {row.icon}
                  </div>
                  {row.text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setModal({ title: "Rooftop Jazz & Sunset Sessions", venue: "Harbour Lights · Colombo 1", date: "Sat 14 Dec · 6:30 PM", price: "LKR 2,500 / person", vibe: "Live music · Date night" })}
                style={{ background: C.accent, color: C.text, fontSize: "14px", fontWeight: 500, padding: "13px 28px", borderRadius: "40px", border: "none", cursor: "pointer", transition: "background 0.2s", fontFamily: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
              >
                Get tickets
              </button>
              <button
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontSize: "14px", padding: "13px 28px", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                Learn more
              </button>
            </div>
          </div>
          <div style={{ background: C.bg3, position: "relative", overflow: "hidden", minHeight: "400px" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, rgba(13,13,13,0.04) 0, rgba(13,13,13,0.04) 1px, transparent 1px, transparent 20px)" }} />
            <div style={{ position: "absolute", bottom: "20px", right: "20px", background: "rgba(30,27,23,0.85)", color: C.cream, fontSize: "13px", padding: "10px 16px", borderRadius: "12px", backdropFilter: "blur(8px)" }}>
              <div className="font-display" style={{ fontSize: "24px", color: C.accent, lineHeight: 1 }}>12</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>spots left</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EVENTS GRID ── */}
      <div style={{ padding: "0 48px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
          <h2 className="font-display" style={{ fontSize: "28px", color: C.text, letterSpacing: "-0.02em" }}>
            All events
          </h2>
          <span style={{ fontSize: "13px", color: C.muted }}>{filteredEvents.length} events this week</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p className="font-display" style={{ fontSize: "24px", color: C.text, marginBottom: "12px" }}>No events found</p>
            <p style={{ fontSize: "15px", color: C.muted }}>Try a different filter or check back soon.</p>
          </div>
        ) : (
          <div
            className="lp-fade-up"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}
          >
            {filteredEvents.map((event) => {
              const { day, month } = parseDateBadge(event.date)
              const isFree = !event.price || event.price === "Free" || event.price === "0"
              const vibeColor = vibeColors[event.category] ?? C.accent
              return (
                <div
                  key={event.id}
                  style={{ background: C.cream, borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(13,13,13,0.06)", transition: "transform 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
                  onClick={() => setModal({ title: event.title, venue: `${event.location?.name ?? ""} · ${event.location?.city ?? ""}`, date: `${event.date} · ${event.time}`, price: event.price || "Free", vibe: event.category || "" })}
                >
                  <div style={{ height: "180px", background: C.bg2, position: "relative", overflow: "hidden" }}>
                    {event.image ? (
                      <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(-45deg, rgba(13,13,13,0.04) 0, rgba(13,13,13,0.04) 1px, transparent 1px, transparent 16px)" }} />
                    )}
                    <div style={{ position: "absolute", top: "14px", left: "14px", background: C.dark, color: C.cream, borderRadius: "10px", padding: "8px 12px", textAlign: "center", minWidth: "48px" }}>
                      <div className="font-display" style={{ fontSize: "22px", lineHeight: 1 }}>{day}</div>
                      <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{month}</div>
                    </div>
                    <span style={{ position: "absolute", bottom: "12px", left: "12px", background: vibeColor, color: "white", fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px" }}>
                      {event.category || "Event"}
                    </span>
                    <span style={{ position: "absolute", top: "14px", right: "14px", background: isFree ? "rgba(125,196,142,0.2)" : "rgba(242,238,230,0.92)", color: isFree ? "#3a7a4a" : C.text, fontSize: "13px", fontWeight: 500, padding: "4px 12px", borderRadius: "20px", backdropFilter: "blur(4px)" }}>
                      {event.price || "Free"}
                    </span>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, color: C.text, marginBottom: "4px", lineHeight: 1.3 }}>{event.title}</div>
                    <div style={{ fontSize: "13px", color: C.muted, marginBottom: "14px" }}>
                      {event.location?.name ? `${event.location.name} · ${event.location.city ?? ""}` : event.organizer}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: C.muted }}>{event.time}</span>
                      <Link
                        href={`/events/${event.id}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: "12px", color: C.accent, textDecoration: "none", fontWeight: 500 }}
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── TIMELINE ── */}
      <div style={{ background: "black", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div className="lp-fade-up" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "36px", color: "white", letterSpacing: "-0.02em", marginBottom: "48px" }}>
            This week at a glance
          </h2>
          <div>
            {timeline.map((day) => (
              <div
                key={day.day}
                style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderTop: "1px solid rgba(13,13,13,0.08)" }}
              >
                <div style={{ padding: "20px 0" }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{day.day}</div>
                  <div style={{ fontSize: "12px", color: C.muted }}>{day.date}</div>
                </div>
                <div style={{ display: "flex", gap: "10px", padding: "16px 0", flexWrap: "wrap", alignItems: "center" }}>
                  {day.events.length === 0 ? (
                    <span style={{ fontSize: "13px", color: "white" }}>No events — quiet night in</span>
                  ) : (
                    day.events.map((ev) => (
                      <div
                        key={ev.name}
                        style={{ background: C.cream, border: "1px solid rgba(13,13,13,0.08)", borderRadius: "10px", padding: "10px 14px", cursor: "pointer", transition: "border-color 0.15s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = C.accent)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(13,13,13,0.08)")}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 500, color: C.text, marginBottom: "2px" }}>{ev.name}</div>
                        <div style={{ fontSize: "11px", color: C.muted }}>{ev.meta}</div>
                        <div style={{ fontSize: "10px", color: C.accent, fontWeight: 500, marginTop: "4px", letterSpacing: "0.04em" }}>{ev.vibe}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(13,13,13,0.08)", borderBottom: "1px solid rgba(13,13,13,0.08)", height: "1px" }} />
          </div>
        </div>
      </div>

      {/* ── VENUES WITH EVENTS ── */}
      <div className="lp-fade-up" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: "24px" }}>
          Active venues
        </p>
        <h2 className="font-display" style={{ fontSize: "32px", letterSpacing: "-0.02em", color: C.text, marginBottom: "8px" }}>
          Venues with upcoming events
        </h2>
        <p style={{ fontSize: "15px", color: C.muted, marginBottom: "32px" }}>Tap any venue to see their full schedule</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {activeVenues.map((venue) => (
            <div
              key={venue.name}
              style={{ background: C.cream, borderRadius: "18px", padding: "28px", border: "1px solid rgba(13,13,13,0.06)", display: "flex", gap: "20px", alignItems: "flex-start", transition: "transform 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
            >
              <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: C.bg2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(13,13,13,0.08)" }}>
                <span className="font-display" style={{ fontSize: "22px", color: C.muted }}>{venue.initial}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: 500, color: C.text, marginBottom: "4px" }}>{venue.name}</div>
                <div style={{ fontSize: "13px", color: C.muted, marginBottom: "12px" }}>{venue.location}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {venue.events.map((ev) => (
                    <div key={ev.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.bg, borderRadius: "8px" }}>
                      <span style={{ fontSize: "13px", color: C.text }}>{ev.name}</span>
                      <span style={{ fontSize: "12px", color: C.muted }}>{ev.date}</span>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: C.accent }}>{ev.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── APP CTA ── */}
      <div style={{ background: C.dark, padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span className="font-display" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(100px,18vw,200px)", fontWeight: 600, letterSpacing: "-0.04em", color: "rgba(245,230,66,0.06)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
          NIGHTS
        </span>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="font-display" style={{ fontSize: "clamp(36px,5vw,60px)", color: C.cream, lineHeight: 1.1, marginBottom: "16px" }}>
            Never miss a<br /><em style={{ fontStyle: "italic", color: C.accent }}>night worth going to</em>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "400px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            Get push alerts when venues you follow publish new events. Reserve your seat before it sells out.
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
          <div style={{ background: C.cream, borderRadius: "24px", padding: "40px", maxWidth: "520px", width: "100%", position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: "16px", right: "16px", background: C.bg2, border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ✕
            </button>
            <span style={{ display: "inline-flex", gap: "6px", alignItems: "center", background: "rgba(245,230,66,0.12)", color: C.accent, fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "20px", marginBottom: "16px" }}>
              Live tonight
            </span>
            <h2 className="font-display" style={{ fontSize: "28px", color: C.text, marginBottom: "8px", lineHeight: 1.2 }}>{modal.title}</h2>
            <p style={{ fontSize: "14px", color: C.muted, marginBottom: "20px" }}>{modal.venue}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", padding: "16px", background: C.bg, borderRadius: "12px" }}>
              <div style={{ display: "flex", gap: "10px", fontSize: "13px", color: C.muted, alignItems: "center" }}>
                <span style={{ color: C.accent, fontSize: "12px", width: "16px" }}>◷</span>
                {modal.date}
              </div>
              <div style={{ display: "flex", gap: "10px", fontSize: "13px", color: C.muted, alignItems: "center" }}>
                <span style={{ color: C.accent, fontSize: "12px", width: "16px" }}>◈</span>
                {modal.price}
              </div>
              <div style={{ display: "flex", gap: "10px", fontSize: "13px", color: C.muted, alignItems: "center" }}>
                <span style={{ color: C.accent, fontSize: "12px", width: "16px" }}>◎</span>
                {modal.vibe}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", borderRadius: "40px", fontSize: "14px", fontWeight: 500, textAlign: "center", cursor: "pointer", border: "none", background: C.accent, color: C.text, fontFamily: "inherit" }}>
                Get tickets →
              </button>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", borderRadius: "40px", fontSize: "14px", fontWeight: 500, textAlign: "center", cursor: "pointer", border: "none", background: C.bg2, color: C.text, fontFamily: "inherit" }}>
                Save event
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .featured-event-grid { grid-template-columns: 1fr !important; }
          .featured-event-grid > div:last-child { min-height: 200px !important; }
        }
      `}</style>
    </div>
  )
}
