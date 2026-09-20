"use client";

import { useState } from "react";
import Link from "next/link";
import type { SanityEvent } from "./page";
import { C } from "@/lib/brand-theme";

function parseDateBadge(dateStr: string): { day: string; month: string } {
  if (!dateStr) return { day: "--", month: "---" };
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return {
      day: String(d.getDate()),
      month: d.toLocaleString("en", { month: "short" }),
    };
  }
  const m = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})/);
  if (m) return { day: m[1], month: m[2] };
  return { day: "--", month: "---" };
}

const vibeFilters = [
  "All",
  "Live music",
  "Party",
  "Date night",
  "Chill",
  "Brunch",
];

const FALLBACK_EVENTS = [
  {
    id: "f1",
    title: "Rooftop Sessions Vol. 4",
    date: "2025-06-14",
    time: "9:00 PM",
    location: { name: "Colombo 3", address: "", city: "Colombo" },
    category: "Live music",
    description: "",
    image: "",
    organizer: "",
    price: "",
    status: "active",
  },
  {
    id: "f2",
    title: "Night Market After Dark",
    date: "2025-06-15",
    time: "6:00 PM",
    location: { name: "Galle Face", address: "", city: "Colombo" },
    category: "Party",
    description: "",
    image: "",
    organizer: "",
    price: "",
    status: "active",
  },
  {
    id: "f3",
    title: "Jazz & Small Plates",
    date: "2025-06-18",
    time: "7:30 PM",
    location: { name: "Colombo 7", address: "", city: "Colombo" },
    category: "Date night",
    description: "",
    image: "",
    organizer: "",
    price: "",
    status: "active",
  },
  {
    id: "f4",
    title: "Garden Brunch Pop-up",
    date: "2025-06-21",
    time: "11:00 AM",
    location: { name: "Battaramulla", address: "", city: "Colombo" },
    category: "Sunday brunch",
    description: "",
    image: "",
    organizer: "",
    price: "",
    status: "active",
  },
] as SanityEvent[];

export default function EventsPageClient({
  events,
}: {
  events: SanityEvent[];
}) {
  const [activeVibe, setActiveVibe] = useState("All");

  const source = events.length > 0 ? events : FALLBACK_EVENTS;

  const filteredEvents = source.filter((e) => {
    if (activeVibe === "All") return true;
    const cat = (e.category || "").toLowerCase();
    return cat.includes(activeVibe.toLowerCase());
  });

  return (
    <div
      className="font-grotesk"
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        fontFamily:
          "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <section style={{ background: "#0D0D0D", color: "#F6F6F4" }}>
        <div
          className="om-pad"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "120px",
            paddingBottom: "100px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(246,246,244,0.5)",
            }}
          >
            Trending events
          </div>
          <h1
            className="om-hero-h1"
            style={{ margin: "28px 0 0", maxWidth: "14ch", fontSize: "72px" }}
          >
            What&apos;s on this week.
          </h1>
          <p
            style={{
              margin: "28px 0 0",
              maxWidth: "48ch",
              fontSize: "17px",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "rgba(246,246,244,0.6)",
            }}
          >
            Across Sri Lanka, hand-picked by vibe. Live music, themed dinners,
            pop-ups, and exclusive evenings.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div
        className="om-pad"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          paddingTop: "40px",
          paddingBottom: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {vibeFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveVibe(f)}
            style={{
              padding: "11px 20px",
              borderRadius: "999px",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
              border:
                activeVibe === f
                  ? "1px solid #0D0D0D"
                  : "1px solid rgba(13,13,13,0.16)",
              background: activeVibe === f ? "#0D0D0D" : "transparent",
              color: activeVibe === f ? "#F6F6F4" : "rgba(13,13,13,0.75)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div
        className="om-pad"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          paddingTop: "48px",
          paddingBottom: "120px",
        }}
      >
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "28px", letterSpacing: "-0.02em" }}>
              No events match this vibe
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "15px",
                fontWeight: 300,
                color: "rgba(13,13,13,0.55)",
              }}
            >
              Try another filter or check back soon.
            </p>
          </div>
        ) : (
          <div style={{ borderTop: "1px solid rgba(13,13,13,0.1)" }}>
            {filteredEvents.map((ev) => {
              const { day, month } = parseDateBadge(ev.date);
              const meta = [
                ev.location?.name || ev.location?.city,
                ev.time,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="om-event-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "96px 1fr auto",
                    gap: "32px",
                    alignItems: "center",
                    padding: "30px 8px",
                    borderBottom: "1px solid rgba(13,13,13,0.1)",
                    color: "#0D0D0D",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: 300,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {day}
                    </span>{" "}
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgba(13,13,13,0.5)",
                      }}
                    >
                      {month}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {ev.title}
                    </div>
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "14px",
                        color: "rgba(13,13,13,0.5)",
                      }}
                    >
                      {meta}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(13,13,13,0.55)",
                    }}
                  >
                    {ev.category || "Event"}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
