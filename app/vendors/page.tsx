"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const C = {
  bg: "#E8E4DA",
  bg2: "#DDD9CE",
  bg3: "#D4CFC3",
  text: "#2A2620",
  muted: "#7A7368",
  accent: "#C4724A",
  accent2: "#B85E38",
  cream: "#F2EEE6",
  dark: "#1E1B17",
}

const benefits = [
  {
    icon: "◈",
    title: "Vibe-matched discovery",
    body: "Customers filter by mood before they search. Your venue appears to people already looking for exactly what you offer — no cold traffic, no wrong crowd.",
  },
  {
    icon: "⊞",
    title: "Floor plan control",
    body: "Define your sections, set capacity per table, and control exactly which slots are bookable. You stay in charge of your floor at all times.",
  },
  {
    icon: "◉",
    title: "Menu intelligence",
    body: "Community upvotes and downvotes on individual dishes give you live feedback. Know what to keep, what to improve — straight from real customers.",
  },
  {
    icon: "◎",
    title: "Events & deals engine",
    body: "Publish events and deals directly from your dashboard. They surface on the map for every nearby user — zero extra marketing needed.",
  },
]

const steps = [
  {
    num: "01",
    title: "List your venue",
    body: "Add photos, set your vibe tags, upload your floor plan, build your menu, and set opening hours. Takes under 30 minutes.",
  },
  {
    num: "02",
    title: "Go live on the map",
    body: "Your venue appears in radius searches, vibe-filtered results, and event feeds. Customers within your area see you instantly.",
  },
  {
    num: "03",
    title: "Manage everything",
    body: "Reservations, events, deals, and menu ratings — all in one dashboard. Real-time notifications when a table is booked.",
  },
]

const menuItems = [
  { name: "Grilled kingfish", pct: 94, bad: false },
  { name: "Wood-fired flatbread", pct: 81, bad: false },
  { name: "Coconut panna cotta", pct: 68, bad: false },
  { name: "Tamarind prawn curry", pct: 52, bad: false },
  { name: "Chicken kottu (old recipe)", pct: 31, bad: true },
]

const pricingPlans = [
  {
    tier: "Starter",
    price: "Free",
    cadence: "Always. No credit card needed.",
    features: [
      "Venue listing on the map",
      "Vibe tags & photos",
      "Basic table reservations",
      "Menu with community ratings",
      "Up to 2 active deals",
    ],
    cta: "Get listed free",
    featured: false,
  },
  {
    tier: "Growth",
    price: "LKR 4,900",
    cadence: "per month",
    features: [
      "Everything in Starter",
      "Priority map placement",
      "Unlimited events",
      "Unlimited deals",
      "Menu analytics dashboard",
      "Push notifications to followers",
    ],
    cta: "Start free trial",
    featured: true,
    badge: "Most popular",
  },
  {
    tier: "Pro",
    price: "LKR 9,900",
    cadence: "per month",
    features: [
      "Everything in Growth",
      "Featured venue badge",
      "Advanced floor plan editor",
      "Customer insights & reports",
      "Dedicated support",
      "Multi-branch management",
    ],
    cta: "Contact us",
    featured: false,
  },
]

const testimonials = [
  {
    quote: '"The menu ratings changed how we look at our menu. We dropped two dishes that were quietly losing us regulars."',
    author: "Chaminda Perera",
    venue: "The Patio, Colombo 7",
  },
  {
    quote: '"Our event bookings doubled in the first month. The right people found us — people who actually love rooftop nights."',
    author: "Dilini Jayawardena",
    venue: "Rooftop Sessions, Colombo 3",
  },
  {
    quote: '"We used to get random walk-ins who weren\'t our crowd. Now almost everyone who books has already decided we\'re their vibe."',
    author: "Nirosha Fernando",
    venue: "Harbour Lights, Colombo 1",
  },
]

const faqs = [
  {
    q: "How long does it take to get listed?",
    a: "Once you submit your venue details, we review and approve listings within 24 hours. You can start setting up your floor plan and menu immediately after signing up.",
  },
  {
    q: "Can I control which tables are bookable?",
    a: "Yes, completely. You define your floor plan, set which tables are available for booking, set capacity per table, and control available time slots. You can also block out tables or dates at any time.",
  },
  {
    q: "What happens when a customer cancels?",
    a: "You get notified instantly and the slot reopens for booking automatically. Customers can cancel up to 2 hours before their reservation time.",
  },
  {
    q: "Can I respond to menu ratings?",
    a: "Currently menu ratings are aggregated and shown as approval percentages — you see the data in your dashboard. A response feature is on the roadmap.",
  },
  {
    q: "Is there a contract or minimum commitment?",
    a: "No contracts. The Starter plan is free forever. Paid plans are month-to-month and can be cancelled at any time.",
  },
  {
    q: "How do events and deals get promoted?",
    a: "Events and deals you publish appear on the Kohedha map as pins for users within the relevant radius. They also surface in the Events and Deals sections of the consumer app.",
  },
]

const navLinks = [
  { label: "Benefits", href: "#benefits" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export default function VendorLandingPage() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    venueName: "",
    yourName: "",
    phone: "",
    city: "",
    email: "",
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to the existing vendor registration flow
    router.push("/vendors/register")
  }

  const bgWord = (text: string, style?: React.CSSProperties) => (
    <span
      className="font-dm-serif"
      style={{
        position: "absolute",
        fontSize: "clamp(100px,18vw,200px)",
        fontWeight: 600,
        letterSpacing: "-0.04em",
        color: "rgba(196,114,74,0.07)",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </span>
  )

  return (
    <div
      className="font-dm-sans"
      style={{ background: C.bg, color: C.text, overflowX: "hidden", minHeight: "100vh" }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          gap: "48px",
          background: "rgba(232,228,218,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(42,38,32,0.08)",
        }}
      >
        <Link
          href="/"
          className="font-dm-serif"
          style={{ fontSize: "22px", color: C.text, textDecoration: "none", letterSpacing: "-0.02em", marginRight: "auto" }}
        >
          kohedha.
        </Link>

        <div className="hidden md:flex" style={{ gap: "32px" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-dm-sans"
              style={{ fontSize: "13px", fontWeight: 400, color: C.muted, textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <span
          className="hidden md:inline-block font-dm-sans"
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: C.accent,
            background: "rgba(196,114,74,0.1)",
            padding: "6px 14px",
            borderRadius: "20px",
          }}
        >
          For venues
        </span>

        <a
          href="#getlisted"
          className="hidden md:inline-block font-dm-sans"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: C.cream,
            background: C.accent,
            padding: "9px 20px",
            borderRadius: "40px",
            textDecoration: "none",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
        >
          List your venue
        </a>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: C.text, fontSize: "22px", lineHeight: 1 }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>

        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgba(232,228,218,0.97)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(42,38,32,0.08)",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-dm-sans"
                style={{ fontSize: "14px", color: C.text, textDecoration: "none" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#getlisted"
              onClick={() => setMobileOpen(false)}
              className="font-dm-sans"
              style={{
                display: "inline-block",
                fontSize: "13px",
                fontWeight: 500,
                color: C.cream,
                background: C.accent,
                padding: "10px 20px",
                borderRadius: "40px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              List your venue
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "80px", position: "relative", overflow: "hidden" }}>
        {bgWord("GROW", { bottom: "-40px", right: "-40px" })}
        <div
          style={{
            minHeight: "100vh",
            padding: "80px 48px 100px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "80px",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Left */}
          <div className="lp-fade-up">
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "24px" }}>
              For restaurants, cafés & bars
            </p>
            <h1
              className="font-dm-serif"
              style={{ fontSize: "clamp(44px,5.5vw,72px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: C.text, marginBottom: "20px" }}
            >
              Your venue,
              <br />
              discovered by
              <br />
              the <em style={{ fontStyle: "italic", color: C.accent }}>right crowd</em>
            </h1>
            <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.7, marginBottom: "36px", maxWidth: "440px" }}>
              Kohedha connects you to customers already looking for your vibe — not random walk-ins. Get listed, manage
              reservations, publish events, and let your menu ratings do the talking.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
              <Link
                href="/vendors/register"
                className="font-dm-sans"
                style={{
                  background: C.accent,
                  color: C.cream,
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "13px 28px",
                  borderRadius: "40px",
                  textDecoration: "none",
                  transition: "background 0.2s, transform 0.15s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.accent2; e.currentTarget.style.transform = "translateY(-1px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
              >
                List your venue — it's free
              </Link>
              <a
                href="#how"
                className="font-dm-sans"
                style={{
                  background: "transparent",
                  color: C.text,
                  fontSize: "14px",
                  fontWeight: 400,
                  padding: "13px 28px",
                  borderRadius: "40px",
                  border: "1px solid rgba(42,38,32,0.2)",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(42,38,32,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(42,38,32,0.2)")}
              >
                See how it works
              </a>
            </div>

            {/* Stats */}
            {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
              {[
                { num: "3.2k+", label: "Active users this month" },
                { num: "140+", label: "Venues listed" },
                { num: "Free", label: "To start, always" },
              ].map((stat) => (
                <div key={stat.num} style={{ background: C.cream, border: "1px solid rgba(42,38,32,0.06)", borderRadius: "14px", padding: "24px 20px" }}>
                  <div className="font-dm-serif" style={{ fontSize: "36px", color: C.text, letterSpacing: "-0.03em", marginBottom: "4px" }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: "13px", color: C.muted }}>{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>

          {/* Right — Dashboard preview */}
          <div className="lp-fade-up">
            <div
              style={{
                background: C.dark,
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Window dots */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                {["#ff5f56", "#ffbd2e", "#27c93f"].map((col) => (
                  <div key={col} style={{ width: "8px", height: "8px", borderRadius: "50%", background: col }} />
                ))}
                <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(232,228,218,0.7)", marginLeft: "auto", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Venue dashboard
                </span>
              </div>

              {/* Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {[
                  { val: "24", label: "Today's bookings" },
                  { val: "6", label: "Remaining slots" },
                  { val: "92%", label: "Menu approval" },
                ].map((m) => (
                  <div key={m.label} style={{ background: "rgba(232,228,218,0.05)", borderRadius: "10px", padding: "14px", border: "1px solid rgba(232,228,218,0.06)" }}>
                    <div className="font-dm-serif" style={{ fontSize: "24px", color: C.cream, marginBottom: "3px" }}>{m.val}</div>
                    <div style={{ fontSize: "11px", color: "rgba(232,228,218,0.4)" }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Reservations */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: "rgba(232,228,218,0.4)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Upcoming reservations
                </div>
                {[
                  { table: "T4", name: "Priya S. – 2 guests", time: "Tonight · 7:30 PM" },
                  { table: "T7", name: "Ashan R. – 4 guests", time: "Tonight · 8:00 PM" },
                  { table: "T2", name: "Nimasha K. – 3 guests", time: "Tonight · 8:45 PM" },
                ].map((res) => (
                  <div
                    key={res.table}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(232,228,218,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "rgba(196,114,74,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: C.accent,
                        flexShrink: 0,
                      }}
                    >
                      {res.table}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", color: "rgba(232,228,218,0.8)" }}>{res.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(232,228,218,0.4)" }}>{res.time}</div>
                    </div>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "rgba(125,196,142,0.15)", color: "#7DC48E" }}>
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>

              {/* Menu performance */}
              <div style={{ background: "rgba(232,228,218,0.04)", borderRadius: "10px", padding: "14px", border: "1px solid rgba(232,228,218,0.06)" }}>
                <div style={{ fontSize: "11px", color: "rgba(232,228,218,0.4)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Top menu items this week
                </div>
                {[
                  { name: "Grilled kingfish", pct: 92 },
                  { name: "Flatbread", pct: 78 },
                  { name: "Coconut panna cotta", pct: 64 },
                ].map((item) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0" }}>
                    <span style={{ fontSize: "13px", color: "rgba(232,228,218,0.7)", flex: 1 }}>{item.name}</span>
                    <div style={{ width: "80px", height: "4px", background: "rgba(232,228,218,0.08)", borderRadius: "2px" }}>
                      <div style={{ width: `${item.pct}%`, height: "4px", borderRadius: "2px", background: C.accent }} />
                    </div>
                    <span style={{ fontSize: "11px", color: "rgba(232,228,218,0.4)", minWidth: "28px", textAlign: "right" }}>{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section id="benefits" style={{ background: C.bg2, padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        {bgWord("REACH", { bottom: "-30px", right: "-30px" })}
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            Why Kohedha
          </p>
          <h2 className="font-dm-serif" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: C.text, marginBottom: "56px", maxWidth: "560px" }}>
            Built for Sri Lanka's dining culture
          </h2>

          <div
            className="lp-fade-up"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2px",
              border: "1px solid rgba(42,38,32,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {benefits.map((b) => (
              <div
                key={b.title}
                style={{ background: C.cream, padding: "40px 36px", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#EDE9E0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = C.cream)}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(196,114,74,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    color: C.accent,
                    fontSize: "16px",
                  }}
                >
                  {b.icon}
                </div>
                <div className="font-dm-serif" style={{ fontSize: "22px", color: C.text, marginBottom: "10px" }}>{b.title}</div>
                <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.75 }}>{b.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            Getting started
          </p>
          <h2 className="font-dm-serif" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: C.text, maxWidth: "560px" }}>
            Three steps to live on the map
          </h2>

          <div
            className="lp-fade-up"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "40px",
              marginTop: "56px",
            }}
          >
            {steps.map((step) => (
              <div key={step.num}>
                <div className="font-dm-serif" style={{ fontSize: "72px", color: "rgba(196,114,74,0.12)", lineHeight: 1, marginBottom: "16px" }}>
                  {step.num}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 500, color: C.text, marginBottom: "10px" }}>{step.title}</div>
                <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.75 }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU INTELLIGENCE ── */}
      <section style={{ background: C.dark, padding: "100px 48px", position: "relative", overflow: "hidden", color: C.cream }}>
        {bgWord("TASTE", { bottom: "-30px", right: "-30px", color: "rgba(196,114,74,0.06)" })}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "80px",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="lp-fade-up">
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
              Menu ratings
            </p>
            <h2 className="font-dm-serif" style={{ fontSize: "38px", letterSpacing: "-0.02em", color: C.cream, marginBottom: "20px" }}>
              Your menu competes
              <br />
              with <em style={{ fontStyle: "italic" }}>itself</em>
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(232,228,218,0.5)", lineHeight: 1.8, marginBottom: "32px" }}>
              After every visit, customers rate individual dishes. Not a star review — a simple upvote or downvote on
              each item. You see exactly what's landing and what isn't.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                "See your top and bottom performing dishes each week",
                "Identify menu items to retire before they damage your reputation",
                "Use community data to decide what to promote in deals",
                "Restaurants that act on this data see higher repeat visit rates",
              ].map((point) => (
                <div key={point} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.accent, marginTop: "7px", flexShrink: 0 }} />
                  <p style={{ fontSize: "14px", color: "rgba(232,228,218,0.65)", lineHeight: 1.6 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div
            className="lp-fade-up"
            style={{ background: "rgba(232,228,218,0.04)", border: "1px solid rgba(232,228,218,0.07)", borderRadius: "16px", padding: "24px" }}
          >
            <div style={{ fontSize: "12px", color: "rgba(232,228,218,0.4)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Menu performance — this week
            </div>
            {menuItems.map((item) => (
              <div key={item.name} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ color: item.bad ? "rgba(208,112,112,0.7)" : "rgba(232,228,218,0.75)" }}>{item.name}</span>
                  <span style={{ color: item.bad ? "#D07070" : C.accent }}>{item.pct}%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(232,228,218,0.07)", borderRadius: "3px" }}>
                  <div
                    style={{
                      width: `${item.pct}%`,
                      height: "6px",
                      borderRadius: "3px",
                      background: item.bad ? "rgba(208,112,112,0.6)" : C.accent,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            Pricing
          </p>
          <h2 className="font-dm-serif" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: C.text, maxWidth: "560px" }}>
            Transparent. Simple. No surprises.
          </h2>

          <div
            className="lp-fade-up"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginTop: "56px",
            }}
          >
            {pricingPlans.map((plan) => (
              <div
                key={plan.tier}
                style={{
                  background: plan.featured ? C.dark : C.cream,
                  border: plan.featured ? "none" : "1px solid rgba(42,38,32,0.08)",
                  borderRadius: "20px",
                  padding: "36px 28px",
                  position: "relative",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
              >
                {plan.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.accent,
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "5px 14px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {plan.badge}
                  </span>
                )}

                <div style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.featured ? "rgba(232,228,218,0.5)" : C.muted, marginBottom: "16px" }}>
                  {plan.tier}
                </div>
                <div className="font-dm-serif" style={{ fontSize: "44px", color: plan.featured ? C.cream : C.text, letterSpacing: "-0.03em", marginBottom: "4px" }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: "13px", color: plan.featured ? "rgba(232,228,218,0.5)" : C.muted, marginBottom: "28px" }}>
                  {plan.cadence}
                </div>

                <ul style={{ listStyle: "none", marginBottom: "32px" }}>
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontSize: "14px",
                        color: plan.featured ? "rgba(232,228,218,0.6)" : C.muted,
                        padding: "8px 0",
                        borderBottom: `1px solid ${plan.featured ? "rgba(232,228,218,0.06)" : "rgba(42,38,32,0.06)"}`,
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: C.accent, fontSize: "12px", flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#getlisted"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: plan.featured ? 500 : 400,
                    padding: "13px 28px",
                    borderRadius: "40px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    background: plan.featured ? C.accent : "transparent",
                    color: plan.featured ? C.cream : C.text,
                    border: plan.featured ? "none" : "1px solid rgba(42,38,32,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.featured) e.currentTarget.style.background = C.accent2
                    else e.currentTarget.style.borderColor = "rgba(42,38,32,0.5)"
                  }}
                  onMouseLeave={(e) => {
                    if (plan.featured) e.currentTarget.style.background = C.accent
                    else e.currentTarget.style.borderColor = "rgba(42,38,32,0.2)"
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: C.bg2, padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        {bgWord("LOVE", { top: "-20px", left: "-20px" })}
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            From the venues
          </p>
          <h2 className="font-dm-serif" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: C.text, maxWidth: "560px" }}>
            What listed venues say
          </h2>

          <div
            className="lp-fade-up"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginTop: "56px",
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.author}
                style={{ background: C.cream, border: "1px solid rgba(42,38,32,0.06)", borderRadius: "16px", padding: "28px" }}
              >
                <div
                  className="font-dm-serif"
                  style={{ fontSize: "17px", color: C.text, lineHeight: 1.55, marginBottom: "20px", fontStyle: "italic" }}
                >
                  {t.quote}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: C.text }}>{t.author}</div>
                <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>{t.venue}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            Questions
          </p>
          <h2 className="font-dm-serif" style={{ fontSize: "38px", letterSpacing: "-0.02em", color: C.text, marginBottom: "48px" }}>
            FAQ for venues
          </h2>

          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(42,38,32,0.1)" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  padding: "24px 0",
                  fontFamily: "inherit",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: C.text,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {faq.q}
                <span
                  style={{
                    color: C.muted,
                    fontSize: "18px",
                    lineHeight: 1,
                    transition: "transform 0.2s",
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.8, paddingBottom: "24px" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA / SIGNUP ── */}
      <section
        id="getlisted"
        style={{ background: C.dark, padding: "120px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        {bgWord("START", { top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "rgba(196,114,74,0.06)" })}

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "24px" }}>
            List your venue
          </p>
          <h2
            className="font-dm-serif"
            style={{ fontSize: "clamp(40px,6vw,70px)", color: C.cream, maxWidth: "700px", margin: "0 auto 24px", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Get listed.
            <br />
            <em style={{ fontStyle: "italic", color: C.accent }}>It's free to start.</em>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(232,228,218,0.5)", maxWidth: "440px", margin: "0 auto 48px", lineHeight: 1.7 }}>
            Tell us about your venue and we'll have you live on the map within 24 hours.
          </p>

          {/* Form */}
          <form
            onSubmit={handleFormSubmit}
            style={{
              background: "rgba(232,228,218,0.05)",
              border: "1px solid rgba(232,228,218,0.08)",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Venue name"
                required
                value={form.venueName}
                onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                className="font-dm-sans"
                style={{
                  background: "rgba(232,228,218,0.06)",
                  border: "1px solid rgba(232,228,218,0.1)",
                  borderRadius: "10px",
                  padding: "13px 16px",
                  fontSize: "14px",
                  color: C.cream,
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(196,114,74,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(232,228,218,0.1)")}
              />
              <input
                type="text"
                placeholder="Your name"
                required
                value={form.yourName}
                onChange={(e) => setForm({ ...form, yourName: e.target.value })}
                className="font-dm-sans"
                style={{
                  background: "rgba(232,228,218,0.06)",
                  border: "1px solid rgba(232,228,218,0.1)",
                  borderRadius: "10px",
                  padding: "13px 16px",
                  fontSize: "14px",
                  color: C.cream,
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(196,114,74,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(232,228,218,0.1)")}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Phone number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="font-dm-sans"
                style={{
                  background: "rgba(232,228,218,0.06)",
                  border: "1px solid rgba(232,228,218,0.1)",
                  borderRadius: "10px",
                  padding: "13px 16px",
                  fontSize: "14px",
                  color: C.cream,
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(196,114,74,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(232,228,218,0.1)")}
              />
              <input
                type="text"
                placeholder="City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="font-dm-sans"
                style={{
                  background: "rgba(232,228,218,0.06)",
                  border: "1px solid rgba(232,228,218,0.1)",
                  borderRadius: "10px",
                  padding: "13px 16px",
                  fontSize: "14px",
                  color: C.cream,
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(196,114,74,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(232,228,218,0.1)")}
              />
            </div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="font-dm-sans"
              style={{
                width: "100%",
                display: "block",
                background: "rgba(232,228,218,0.06)",
                border: "1px solid rgba(232,228,218,0.1)",
                borderRadius: "10px",
                padding: "13px 16px",
                fontSize: "14px",
                color: C.cream,
                outline: "none",
                transition: "border-color 0.2s",
                marginBottom: "12px",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(196,114,74,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(232,228,218,0.1)")}
            />
            <button
              type="submit"
              className="font-dm-sans"
              style={{
                width: "100%",
                background: C.accent,
                color: C.cream,
                fontSize: "15px",
                fontWeight: 500,
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accent2; e.currentTarget.style.transform = "translateY(-1px)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
            >
              List my venue for free →
            </button>
            <p style={{ fontSize: "12px", color: "rgba(232,228,218,0.3)", marginTop: "14px", textAlign: "center" }}>
              No credit card. No contract. Live within 24 hours.
            </p>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: C.dark,
          color: C.cream,
          padding: "40px 48px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <Link
            href="/"
            className="font-dm-serif"
            style={{ fontSize: "24px", color: C.cream, textDecoration: "none" }}
          >
            kohedha.
          </Link>

          <div className="font-dm-sans" style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "About", href: "/about" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Support", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "13px", color: "rgba(232,228,218,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(232,228,218,0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,228,218,0.4)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="font-dm-sans"
            style={{
              fontSize: "13px",
              color: C.accent,
              textDecoration: "none",
              border: "1px solid rgba(196,114,74,0.4)",
              padding: "8px 18px",
              borderRadius: "20px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = "white" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.accent }}
          >
            Browse venues →
          </Link>
        </div>
      </footer>
    </div>
  )
}
