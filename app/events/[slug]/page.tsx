import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, Globe, Facebook, Instagram, Twitter } from "lucide-react"
import { getEvent } from "@/lib/sanity-events"
import { PortableText } from "@portabletext/react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import StructuredData from "@/components/structured-data"

const C = {
  bg: "#E8E4DA", bg2: "#DDD9CE", text: "#2A2620",
  muted: "#7A7368", accent: "#C4724A", accent2: "#B85E38",
  cream: "#F2EEE6", dark: "#1E1B17",
}

interface EventPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEvent(params.slug)

  if (!event) {
    return { title: "Event Not Found", description: "The requested event could not be found." }
  }

  return {
    title: event.title,
    description: event.description || `Join ${event.title} in Sri Lanka. Discover amazing events and experiences with Kohedha.`,
    keywords: [event.category, "Sri Lanka", "events", "entertainment", "culture", "activities", "local events", ...(event.location?.name ? [event.location.name] : [])],
    authors: [{ name: event.organizer }],
    openGraph: {
      title: event.title,
      description: event.description || `Join ${event.title} in Sri Lanka.`,
      type: "website",
      url: `https://kohedha.lk/events/${event.id}`,
      images: [{ url: event.image, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description || `Join ${event.title} in Sri Lanka.`,
      images: [event.image],
      creator: "@kohedha",
    },
    alternates: { canonical: `/events/${event.id}` },
    other: {
      "event:start_time": event.eventDate,
      "event:end_time": event.eventEndDate,
      "event:location": event.location?.name || "",
      "event:organizer": event.organizer,
      "event:category": event.category,
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <StructuredData type="event" data={event} />

      {/* Breadcrumb */}
      <div style={{ background: C.bg2, borderBottom: "1px solid rgba(42,38,32,0.08)", padding: "14px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: C.muted, textDecoration: "none", fontWeight: 500 }}>
            <ArrowLeft size={14} />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div style={{ position: "relative", height: "clamp(280px, 45vh, 480px)", overflow: "hidden" }}>
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "40px 48px" }}>
          <div style={{ maxWidth: "800px" }}>
            <div style={{ background: C.accent, color: "white", borderRadius: "40px", padding: "5px 14px", fontSize: "12px", fontWeight: 500, display: "inline-block", marginBottom: "14px" }}>
              {event.category}
            </div>
            <h1 className="font-dm-serif" style={{ color: "white", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.15, marginBottom: "16px" }}>
              {event.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={14} />{event.date}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} />{event.time}</span>
              {event.location?.name && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} />{event.location.name}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px", alignItems: "flex-start" }}>

          {/* Main */}
          <div>
            <div style={{ marginBottom: "36px" }}>
              <h2 className="font-dm-serif" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>About This Event</h2>
              <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.8 }}>{event.description}</p>
            </div>

            {event.body && (
              <div style={{ marginBottom: "36px" }}>
                <h2 className="font-dm-serif" style={{ fontSize: "26px", color: C.text, marginBottom: "16px" }}>Event Details</h2>
                <div className="prose prose-lg max-w-none" style={{ color: C.muted }}>
                  <PortableText value={event.body} />
                </div>
              </div>
            )}

            {/* Info card */}
            <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(42,38,32,0.08)", padding: "28px" }}>
              <h3 className="font-dm-serif" style={{ fontSize: "22px", color: C.text, marginBottom: "20px" }}>Event Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", background: C.bg2, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Calendar size={16} style={{ color: C.accent }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: C.muted, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date & Time</p>
                    <p style={{ fontWeight: 600, color: C.text }}>{event.date} at {event.time}</p>
                  </div>
                </div>

                {event.location && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", background: C.bg2, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin size={16} style={{ color: C.accent }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", color: C.muted, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Location</p>
                      <p style={{ fontWeight: 600, color: C.text }}>{event.location.name}</p>
                      {event.location.address && <p style={{ fontSize: "13px", color: C.muted }}>{event.location.address}</p>}
                      {event.location.city && <p style={{ fontSize: "13px", color: C.muted }}>{event.location.city}</p>}
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", background: C.bg2, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={16} style={{ color: C.accent }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", color: C.muted, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Organizer</p>
                      <p style={{ fontWeight: 600, color: C.text }}>{event.organizer}</p>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(196,114,74,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "16px", color: C.accent }}>₨</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: C.muted, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Price</p>
                    <p style={{ fontWeight: 700, fontSize: "18px", color: C.accent }}>{event.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Ticket */}
            <div style={{ background: C.dark, borderRadius: "16px", padding: "28px", color: "white" }}>
              <h3 className="font-dm-serif" style={{ fontSize: "22px", marginBottom: "12px" }}>Get Tickets</h3>
              <p style={{ fontSize: "28px", fontWeight: 700, color: C.accent, marginBottom: "20px" }}>{event.price}</p>
              <button style={{ width: "100%", background: C.accent, color: "white", border: "none", borderRadius: "40px", padding: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
                Book Now
              </button>
            </div>

            {/* Organizer contact */}
            {event.organizer && (
              <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(42,38,32,0.08)", padding: "24px" }}>
                <h3 className="font-dm-serif" style={{ fontSize: "20px", color: C.text, marginBottom: "16px" }}>Contact Organizer</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.muted }}>
                    <User size={14} /><span>{event.organizer}</span>
                  </div>
                  {event.organizerEmail && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Mail size={14} style={{ color: C.muted }} />
                      <a href={`mailto:${event.organizerEmail}`} style={{ color: C.accent, textDecoration: "none" }}>{event.organizerEmail}</a>
                    </div>
                  )}
                  {event.organizerPhone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Phone size={14} style={{ color: C.muted }} />
                      <a href={`tel:${event.organizerPhone}`} style={{ color: C.accent, textDecoration: "none" }}>{event.organizerPhone}</a>
                    </div>
                  )}
                  {event.organizerWebsite && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <Globe size={14} style={{ color: C.muted }} />
                      <a href={event.organizerWebsite} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Visit Website</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Share */}
            <div style={{ background: C.cream, borderRadius: "16px", border: "1px solid rgba(42,38,32,0.08)", padding: "24px" }}>
              <h3 className="font-dm-serif" style={{ fontSize: "20px", color: C.text, marginBottom: "16px" }}>Share Event</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <div key={i} style={{ width: "36px", height: "36px", border: "1px solid rgba(42,38,32,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Icon size={15} style={{ color: C.muted }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
