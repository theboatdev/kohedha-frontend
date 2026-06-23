"use client"

import { Users, Heart, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { C } from "@/lib/brand-theme"

export default function AboutPage() {
  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url('/cinematic-photo-of-sri-lankan-mountains-meeting-mo.png')`,
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.2), rgba(0,0,0,0.55))" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "white", padding: "0 32px", maxWidth: "780px" }}>
          <blockquote
            className="font-display"
            style={{ fontStyle: "italic", fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.25, marginBottom: "32px" }}
          >
            "More than a guide — we're your local vibe compass."
          </blockquote>
          <div style={{ width: "64px", height: "2px", background: C.accent, margin: "0 auto 28px" }} />
          <p className="font-dm-sans" style={{ fontSize: "18px", opacity: 0.88, maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Discover the soul of Sri Lanka through its flavors, celebrations, and hidden gems
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            Our story
          </p>
          <h1 className="font-display" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: C.text, marginBottom: "48px" }}>
            Born from a love of Sri Lanka's dining culture
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "16px", lineHeight: 1.85, color: C.muted }}>
            <p>
              Born from a passion for Sri Lanka's incredible culinary landscape and vibrant cultural scene, Kohedha
              emerged as more than just another discovery platform. We recognised that finding authentic experiences in
              Sri Lanka shouldn't be left to chance or generic recommendations.
            </p>
            <p>
              Our journey began with a simple observation: Sri Lanka's food and event scene is incredibly rich, but
              navigating it can be overwhelming. From hidden street food gems in Pettah to exclusive rooftop dining in
              Colombo 3, from traditional cultural performances to modern fusion experiences — the island offers endless
              possibilities, but they're often scattered and hard to discover.
            </p>
            <p>
              We built Kohedha to be your compass in this adventure. Not just pointing you toward destinations, but
              helping you understand the vibe, the culture, and the stories behind each experience. Whether you're a
              local looking to rediscover your city or a visitor seeking authentic Sri Lankan experiences, we curate
              every recommendation with care.
            </p>
            <p>
              Today, Kohedha connects food lovers and culture enthusiasts with Sri Lanka's most exciting venues and
              events. We partner with local businesses, celebrate traditional flavors, and champion innovative culinary
              artists who are shaping the future of Sri Lankan dining and entertainment.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: "black", padding: "100px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            What drives us
          </p>
          <h2 className="font-display" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: "white", marginBottom: "56px", maxWidth: "480px" }}>
            Three principles behind everything we do
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2px",
              border: "1px solid rgba(13,13,13,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {[
              {
                Icon: Heart,
                title: "Authentic experiences",
                body: "We celebrate genuine Sri Lankan culture, from traditional recipes passed down through generations to innovative interpretations that honour our heritage.",
              },
              {
                Icon: Users,
                title: "Community first",
                body: "We support local businesses, connect like-minded food enthusiasts, and build bridges between communities through shared culinary experiences.",
              },
              {
                Icon: Star,
                title: "Curated quality",
                body: "Every venue and event on Kohedha is personally vetted. We don't just list places — we recommend experiences that we believe in and would enjoy ourselves.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                style={{ background: C.cream, padding: "40px 36px", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#EDE9E0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = C.cream)}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245,230,66,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", color: C.accent }}>
                  <Icon size={18} />
                </div>
                <div className="font-display" style={{ fontSize: "22px", color: C.text, marginBottom: "12px" }}>{title}</div>
                <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.75 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: "20px" }}>
            The team
          </p>
          <h2 className="font-display" style={{ fontSize: "42px", letterSpacing: "-0.02em", color: C.text, marginBottom: "24px" }}>
            Built by people who love Sri Lanka
          </h2>
          <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.8, marginBottom: "56px" }}>
            Kohedha is built by a passionate team of food enthusiasts, cultural explorers, and technology innovators
            who call Sri Lanka home. We combine deep local knowledge with modern technology to create experiences that matter.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "56px" }}>
            {[
              { Icon: Users, title: "Culinary experts", body: "Local food critics and chefs who understand the nuances of Sri Lankan cuisine" },
              { Icon: MapPin, title: "Local explorers", body: "Community scouts who discover hidden gems and emerging trends across the island" },
            ].map(({ Icon, title, body }) => (
              <div key={title} style={{ background: C.cream, borderRadius: "16px", padding: "32px", border: "1px solid rgba(13,13,13,0.06)" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <Icon size={24} style={{ color: C.muted }} />
                </div>
                <div className="font-display" style={{ fontSize: "20px", color: C.text, marginBottom: "10px" }}>{title}</div>
                <div style={{ fontSize: "14px", color: C.muted, lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>

          <Link
            href="/vendors"
            style={{ display: "inline-block", background: C.accent, color: C.cream, fontSize: "14px", fontWeight: 500, padding: "13px 32px", borderRadius: "40px", textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            Join the community
          </Link>
        </div>
      </section>
    </div>
  )
}
