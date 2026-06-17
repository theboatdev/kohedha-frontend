"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LatestEvents from "@/components/latest-events";

const C = {
  bg: "#ffffff", //#E8E4DA
  bg2: "#DDD9CE",
  bg3: "#D4CFC3",
  bg4: "#000000",
  text: "#2A2620",
  text2: "#ffffff",
  muted: "#7A7368",
  accent: "#C4724A",
  accent2: "#B85E38",
  cream: "#F2EEE6",
  dark: "#1E1B17",
};

const vibePills = [
  "Chill",
  "Date night",
  "Party",
  "Sunday brunch",
  "After work",
  "Live music",
  "Late night",
  "Rooftop",
];
const mapVibes = ["Places", "Events", "Deals"];

const faqs = [
  {
    q: "Do I need an account to browse venues?",
    a: "No. You can browse all venues, events, and deals without signing in. You'll need an account to make a reservation or rate menu items.",
  },
  {
    q: "Can I book a table on the website?",
    a: "Yes — full booking is available on web. The app adds QR entry at the door, push notifications for your saved vibes, and access to exclusive app-only deals.",
  },
  {
    q: "How do menu ratings work?",
    a: "After your visit, you can upvote or downvote individual dishes. Ratings are visible on the venue's menu and help other diners make better choices — and help restaurants improve what they serve.",
  },
  {
    q: "What cities is Kohedha available in?",
    a: "We're live in Colombo and expanding across Sri Lanka. If you'd like your city covered sooner, let us know via the feedback form.",
  },
  {
    q: "Can I cancel or modify a reservation?",
    a: "Yes. You can cancel or modify a booking up to 2 hours before your reservation time through the app or website.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [radius, setRadius] = useState(3);
  const [activePills, setActivePills] = useState<Set<string>>(
    new Set(["Chill"]),
  );
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(["Places", "Events", "Deals"]),
  );
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [phoneScrollProgress, setPhoneScrollProgress] = useState(0);

  useEffect(() => {
    const handlePhoneScroll = () => {
      const scrollY = window.scrollY;
      // Animate over first 500px of scroll
      const progress = Math.min(scrollY / 500, 1);
      setPhoneScrollProgress(progress);
    };
    window.addEventListener("scroll", handlePhoneScroll, { passive: true });
    return () => window.removeEventListener("scroll", handlePhoneScroll);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMapVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }

    return () => {
      if (mapSectionRef.current) {
        observer.unobserve(mapSectionRef.current);
      }
    };
  }, []);

  const togglePill = (pill: string) => {
    setActivePills((prev) => {
      const next = new Set(prev);
      next.has(pill) ? next.delete(pill) : next.add(pill);
      return next;
    });
  };

  const toggleLayer = (layer: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      next.has(layer) ? next.delete(layer) : next.add(layer);
      return next;
    });
  };

  const pillStyle = (active: boolean) => ({
    fontSize: "13px",
    fontWeight: 400,
    padding: "8px 18px",
    borderRadius: "40px",
    border: active ? `1px solid ${C.accent}` : "1px solid rgba(42,38,32,0.15)",
    background: active ? C.accent : "transparent",
    color: active ? C.cream : C.text,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div
      className="font-dm-sans"
      style={{ background: C.bg, color: C.text, overflowX: "hidden" }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          padding: "140px 48px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* bg word */}
        <span
          className="font-dm-serif"
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-40px",
            fontSize: "clamp(120px,20vw,220px)",
            fontWeight: 600,
            color: "rgba(196,114,74,0.07)",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
          }}
        >
          VIBE
        </span>

        <p
          className="lp-fade-up"
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: "24px",
            animationDelay: "0.05s",
          }}
        >
          Sri Lanka's vibe-first venue platform
        </p>

        <h1
          className="font-dm-serif lp-fade-up"
          style={{
            fontSize: "clamp(52px,8vw,96px)",
            lineHeight: 1.0,
            textAlign: "center",
            letterSpacing: "-0.03em",
            color: C.text,
            maxWidth: "820px",
            marginBottom: "16px",
            animationDelay: "0.2s",
          }}
        >
          Find your{" "}
          <em style={{ fontStyle: "italic", color: C.accent }}>vibe.</em>
          <br />
          Reserve your seat.
        </h1>

        <p
          className="lp-fade-up"
          style={{
            fontSize: "16px",
            color: C.muted,
            textAlign: "center",
            maxWidth: "460px",
            lineHeight: 1.7,
            marginBottom: "40px",
            animationDelay: "0.35s",
          }}
        >
          Discover restaurants, cafés, and bars matched to your mood — then book
          a table in seconds.
        </p>

        <div
          className="lp-fade-up"
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "72px",
            flexWrap: "wrap",
            justifyContent: "center",
            animationDelay: "0.5s",
          }}
        >
          <Link
            href="/vendors"
            style={{
              background: C.accent,
              color: C.cream,
              fontSize: "14px",
              fontWeight: 500,
              padding: "13px 28px",
              borderRadius: "40px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.accent2;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.accent;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            List your Venue
          </Link>
          <Link
            href="#how"
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
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(42,38,32,0.5)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(42,38,32,0.2)")
            }
          >
            See how it works
          </Link>
        </div>

        {/* Phone mockup */}
        <div
          style={{
            transform: `scale(${0.78 + phoneScrollProgress * 0.32}) translateY(${(1 - phoneScrollProgress) * 48}px)`,
            transition: "transform 0.1s linear",
            transformOrigin: "center bottom",
            filter:
              phoneScrollProgress > 0.5
                ? `drop-shadow(0 ${Math.round((1 - phoneScrollProgress) * 40 + 20)}px ${Math.round(phoneScrollProgress * 60 + 10)}px rgba(196,114,74,${(phoneScrollProgress * 0.35).toFixed(2)}))`
                : "none",
          }}
        >
          <div
            style={{
              width: "220px",
              height: "440px",
              border: `2px solid ${C.accent}`,
              borderRadius: "36px",
              position: "relative",
              background: "rgba(196,114,74,0.06)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                content: '""',
                position: "absolute",
                top: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "8px",
                background: C.accent,
                borderRadius: "4px",
                opacity: 0.4,
              }}
            />
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section
        id="about"
        style={{
          padding: "100px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          className="font-dm-serif"
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            fontSize: "clamp(120px,20vw,220px)",
            fontWeight: 600,
            color: "rgba(196,114,74,0.07)",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
          }}
        >
          MISSION
        </span>

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "80px",
            alignItems: "center",
          }}
        >
          <div data-reveal="left">
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: "20px",
              }}
            >
              Our mission
            </p>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "42px",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: C.text,
                marginBottom: "24px",
              }}
            >
              Every venue, perfectly matched to your mood
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: C.muted,
                lineHeight: 1.8,
                marginBottom: "32px",
              }}
            >
              Kohedha was built for Sri Lanka's dining culture — where the vibe
              matters as much as the menu. We connect you to places that fit how
              you're feeling right now, not just what you want to eat.
            </p>
            <Link
              href="#discover"
              style={{
                display: "inline-block",
                background: C.accent,
                color: C.cream,
                fontSize: "14px",
                fontWeight: 500,
                padding: "13px 28px",
                borderRadius: "40px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.accent2)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = C.accent)
              }
            >
              Start exploring
            </Link>
          </div>

          <div data-reveal="right">
            <p
              style={{ fontSize: "13px", color: C.muted, marginBottom: "16px" }}
            >
              Filter by vibe
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {vibePills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => togglePill(pill)}
                  style={pillStyle(activePills.has(pill))}
                >
                  {pill}
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: "13px",
                color: C.muted,
                marginTop: "24px",
                lineHeight: 1.7,
              }}
            >
              Pick your mood and the map finds venues, events, and deals that
              match — all within your chosen radius.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="how" style={{ padding: "0 48px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            data-reveal="up"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.muted,
              textAlign: "center",
              marginBottom: "48px",
            }}
          >
            Everything you need
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2px",
              border: "1px solid rgba(42,38,32,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {[
              {
                num: "01",
                title: "Places",
                body: "Venue listings filtered by your vibe and location. Browse photos, menus, events, and live deals before you decide.",
              },
              {
                num: "02",
                title: "Events",
                body: "Live music, themed nights, pop-ups — all hosted at venues on your map. Filter by date, vibe, or distance.",
              },
              {
                num: "03",
                title: "Deals",
                body: "Real-time offers from venues near you. Happy hours, set menus, exclusive discounts — active now or coming soon.",
              },
            ].map((card, i) => (
              <div
                key={card.num}
                data-reveal="up"
                data-delay={String(i + 1)}
                style={{
                  background: C.cream,
                  padding: "40px 32px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    "#EDE9E0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    C.cream)
                }
              >
                <div
                  className="font-dm-serif"
                  style={{
                    fontSize: "48px",
                    color: "rgba(196,114,74,0.25)",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  {card.num}
                </div>
                <div
                  className="font-dm-serif"
                  style={{
                    fontSize: "22px",
                    color: C.text,
                    marginBottom: "12px",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{ fontSize: "14px", color: C.muted, lineHeight: 1.7 }}
                >
                  {card.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP / RADIUS EXPLORER ── */}
      <section
        id="discover"
        ref={mapSectionRef}
        style={{
          background: C.bg4,
          padding: "100px 48px",
          position: "relative",
          overflow: "hidden",
          opacity: isMapVisible ? 1 : 0,
          transform: isMapVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "80px",
            alignItems: "center",
          }}
        >
          <div
            className="lp-fade-up"
            style={{
              opacity: isMapVisible ? 1 : 0,
              transform: isMapVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: "20px",
              }}
            >
              Radius explorer
            </p>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "42px",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: C.text2,
                marginBottom: "24px",
              }}
            >
              Drop a radius.
              <br />
              Find your scene.
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: C.muted,
                lineHeight: 1.8,
                marginBottom: "24px",
              }}
            >
              Set how far you're willing to go. The map pulls every venue,
              event, and deal within your reach — toggle layers to see exactly
              what you want.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {mapVibes.map((v) => (
                <button
                  key={v}
                  onClick={() => toggleLayer(v)}
                  style={pillStyle(activeLayers.has(v))}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div
            className="lp-fade-up"
            style={{
              opacity: isMapVisible ? 1 : 0,
              transform: isMapVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s",
            }}
          >
            {/* Map mock */}
            <div
              style={{
                background: C.bg3,
                borderRadius: "20px",
                height: "400px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(42,38,32,0.08)",
              }}
            >
              {/* Street Grid Background */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Horizontal streets */}
                {[60, 140, 220, 300].map((y) => (
                  <line
                    key={`h-${y}`}
                    x1="0"
                    y1={y}
                    x2="100%"
                    y2={y}
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                ))}
                {/* Vertical streets */}
                {[80, 180, 280, 380, 480].map((x) => (
                  <line
                    key={`v-${x}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="100%"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                ))}
              </svg>

              {/* Building blocks */}
              {[
                { top: "5%", left: "5%", width: "60px", height: "40px" },
                { top: "5%", left: "25%", width: "80px", height: "50px" },
                { top: "5%", left: "55%", width: "50px", height: "35px" },
                { top: "5%", left: "78%", width: "70px", height: "45px" },
                { top: "18%", left: "5%", width: "55px", height: "55px" },
                { top: "18%", left: "25%", width: "45px", height: "48px" },
                { top: "18%", left: "78%", width: "60px", height: "50px" },
                { top: "40%", left: "5%", width: "70px", height: "40px" },
                { top: "40%", left: "25%", width: "40px", height: "35px" },
                { top: "40%", left: "55%", width: "75px", height: "42px" },
                { top: "40%", left: "78%", width: "55px", height: "38px" },
                { top: "60%", left: "5%", width: "60px", height: "48px" },
                { top: "60%", left: "78%", width: "70px", height: "52px" },
                { top: "78%", left: "5%", width: "75px", height: "40px" },
                { top: "78%", left: "25%", width: "50px", height: "45px" },
                { top: "78%", left: "55%", width: "65px", height: "38px" },
                { top: "78%", left: "78%", width: "58px", height: "42px" },
              ].map((block, i) => (
                <div
                  key={`building-${i}`}
                  style={{
                    position: "absolute",
                    top: block.top,
                    left: block.left,
                    width: block.width,
                    height: block.height,
                    background: "rgba(186, 180, 168, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "4px",
                  }}
                />
              ))}

              {/* Small park/area */}
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  left: "40%",
                  width: "120px",
                  height: "90px",
                  background: "rgba(139, 195, 139, 0.25)",
                  borderRadius: "8px",
                  border: "1px solid rgba(139, 195, 139, 0.4)",
                }}
              />

              {/* Water/feature area */}
              <div
                style={{
                  position: "absolute",
                  top: "58%",
                  right: "8%",
                  width: "90px",
                  height: "50px",
                  background: "rgba(135, 206, 235, 0.2)",
                  borderRadius: "50%",
                  border: "1px solid rgba(135, 206, 235, 0.4)",
                }}
              />

              {/* Dynamic Radius ring */}
              <div
                style={{
                  position: "absolute",
                  border: "1.5px dashed rgba(196,114,74,0.4)",
                  borderRadius: "50%",
                  width: `${radius * 30}px`,
                  height: `${radius * 30}px`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  transition: "all 0.3s ease-out",
                }}
              />

              {/* Center dot */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: C.accent,
                  border: "3px solid white",
                  zIndex: 10,
                  boxShadow: "0 0 0 0 rgba(196, 114, 74, 0.4)",
                  animation: "pulse 2s infinite",
                }}
              />

              {/* Pins with labels - varied types */}
              {[
                {
                  top: "35%",
                  left: "60%",
                  type: "event",
                  label: "The Rooftop",
                  color: "#C4724A",
                },
                {
                  top: "55%",
                  left: "30%",
                  type: "deal",
                  label: "Night Market",
                  deal: "50% off drinks",
                  color: "#B85E38",
                },
                {
                  top: "30%",
                  left: "40%",
                  type: "place",
                  label: "Café Luna",
                  color: "#C4724A",
                },
                {
                  top: "65%",
                  left: "55%",
                  type: "place",
                  color: "#8BC38B",
                },
                { top: "45%", left: "70%", type: "event", color: "#87CEEB" },
                { top: "38%", left: "25%", type: "deal", color: "#C4724A" },
                { top: "58%", left: "68%", type: "place", color: "#8BC38B" },
                { top: "48%", left: "42%", type: "event", color: "#C4724A" },
              ].map((pin, i) => {
                const isVisible =
                  (pin.type === "place" && activeLayers.has("Places")) ||
                  (pin.type === "event" && activeLayers.has("Events")) ||
                  (pin.type === "deal" && activeLayers.has("Deals"));

                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: pin.top,
                      left: pin.left,
                      transform: "translate(-50%, -50%)",
                      zIndex: 5,
                      opacity: isMapVisible && isVisible ? 1 : 0,
                      animation:
                        isMapVisible && isVisible
                          ? `popIn 0.4s ease-out ${0.6 + i * 0.1}s forwards`
                          : "none",
                      transition: "opacity 0.3s ease-out",
                      pointerEvents: isVisible ? "auto" : "none",
                    }}
                  >
                    {/* Pin dot */}
                    <div
                      style={{
                        width: pin.label ? "14px" : "10px",
                        height: pin.label ? "14px" : "10px",
                        borderRadius: "50%",
                        background: pin.color,
                        boxShadow: `0 0 0 ${pin.label ? "5px" : "3px"} ${pin.color}40`,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.2)";
                        e.currentTarget.style.boxShadow = `0 0 0 ${pin.label ? "8px" : "6px"} ${pin.color}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = `0 0 0 ${pin.label ? "5px" : "3px"} ${pin.color}40`;
                      }}
                    />
                    {/* Label */}
                    {pin.label && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-32px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          whiteSpace: "nowrap",
                          background: "rgba(42, 38, 32, 0.92)",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 500,
                          pointerEvents: "none",
                        }}
                      >
                        {pin.label}
                      </div>
                    )}
                    {/* Deal callout */}
                    {pin.deal && (
                      <div
                        style={{
                          position: "absolute",
                          top: "24px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          whiteSpace: "nowrap",
                          background: "white",
                          color: C.text,
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          border: "1px solid rgba(42,38,32,0.1)",
                          pointerEvents: "none",
                        }}
                      >
                        {pin.deal}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div style={{ marginTop: "20px", padding: "0 4px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: C.muted,
                  marginBottom: "8px",
                }}
              >
                <span>Radius</span>
                <span>{radius} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.accent }}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                {["Places", "Events", "Deals"].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => toggleLayer(layer)}
                    style={{
                      fontSize: "12px",
                      padding: "5px 14px",
                      borderRadius: "20px",
                      border: activeLayers.has(layer)
                        ? `1px solid ${C.accent}`
                        : "1px solid rgba(42,38,32,0.15)",
                      background: activeLayers.has(layer)
                        ? C.accent
                        : "transparent",
                      color: activeLayers.has(layer) ? C.cream : C.muted,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APP / RESERVE ── */}
      <section
        id="app"
        style={{
          padding: "100px 48px",
          position: "relative",
          overflow: "hidden",
          background: "white",
        }}
      >
        <span
          className="font-dm-serif"
          style={{
            position: "absolute",
            top: "50%",
            left: "40%",
            transform: "translateY(-50%)",
            fontSize: "clamp(120px,20vw,220px)",
            fontWeight: 600,
            color: "rgba(196,114,74,0.07)",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
          }}
        >
          MANAGE
        </span>

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
          {/* Phone device */}
          <div
            data-reveal="left"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                width: "260px",
                height: "520px",
                background: C.dark,
                borderRadius: "44px",
                border: "2px solid rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 40px 80px rgba(30,27,23,0.25)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "10px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "5px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(160deg, #2A2620 0%, #1E1B17 100%)",
                  padding: "48px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(232,228,218,0.4)",
                    marginBottom: "16px",
                    letterSpacing: "0.08em",
                  }}
                >
                  YOUR BOOKINGS
                </p>
                {[
                  {
                    name: "The Patio – Colombo 7",
                    vibe: "Chill · Date night",
                    detail: "Tonight · 7:30 PM · Table 4",
                  },
                  {
                    name: "Rooftop Sessions",
                    vibe: "Live music · Party",
                    detail: "Sat 14 · 9:00 PM · Event",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(232,228,218,0.08)",
                      borderRadius: "12px",
                      padding: "14px",
                      marginBottom: "10px",
                      border: "1px solid rgba(232,228,218,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "rgba(232,228,218,0.9)",
                        marginBottom: "4px",
                      }}
                    >
                      {card.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(196,114,74,0.8)",
                      }}
                    >
                      {card.vibe}
                    </div>
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "rgba(232,228,218,0.5)",
                      }}
                    >
                      {card.detail}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    width: "100%",
                    background: C.accent,
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "12px",
                    borderRadius: "10px",
                    textAlign: "center",
                    marginTop: "16px",
                  }}
                >
                  Reserve your seat →
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div data-reveal="right">
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: "20px",
              }}
            >
              Reserve your seat
            </p>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "42px",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: C.text,
                marginBottom: "24px",
              }}
            >
              Discover dining
              <br />
              <em style={{ fontStyle: "italic", color: C.accent }}>
                with ease
              </em>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: C.muted,
                lineHeight: 1.8,
                marginBottom: "32px",
              }}
            >
              No calls. No waiting. Pick your table, pick your time, and your QR
              token is ready before you leave the house. Walk in, scan, sit
              down.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                {
                  n: "1",
                  title: "Pick your vibe & venue",
                  sub: "Browse the map, filter by mood",
                },
                {
                  n: "2",
                  title: "Reserve your seat",
                  sub: "Choose your table and time slot",
                },
                {
                  n: "3",
                  title: "Walk in & scan",
                  sub: "Your QR token is ready on the app",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "rgba(196,114,74,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "12px",
                      color: C.accent,
                      fontWeight: 500,
                    }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: C.text,
                        marginBottom: "3px",
                      }}
                    >
                      {step.title}
                    </p>
                    <p style={{ fontSize: "13px", color: C.muted }}>
                      {step.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING VENUES ── */}
      <section id="events" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div data-reveal="up" style={{ marginBottom: "48px" }}>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "38px",
                letterSpacing: "-0.02em",
                color: C.text,
                marginBottom: "8px",
              }}
            >
              Trending venues
            </h2>
            <p style={{ fontSize: "15px", color: C.muted }}>
              Discover the most-booked spots right now
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                name: "The Patio",
                meta: "Colombo 7 · Opens 11 AM",
                vibe: "Chill",
              },
              {
                name: "Harbour Lights",
                meta: "Colombo 1 · Opens 6 PM",
                vibe: "Date night",
              },
              {
                name: "Rooftop Sessions",
                meta: "Colombo 3 · Opens 7 PM",
                vibe: "Live music",
              },
            ].map((venue, i) => (
              <div
                key={venue.name}
                data-reveal="up"
                data-delay={String(i + 1)}
                style={{
                  background: C.cream,
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(42,38,32,0.06)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)")
                }
              >
                {/* Image area */}
                <div
                  style={{
                    height: "160px",
                    background: C.bg3,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "repeating-linear-gradient(45deg, rgba(42,38,32,0.04) 0px, rgba(42,38,32,0.04) 1px, transparent 1px, transparent 16px)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: C.accent,
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {venue.vibe}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    {venue.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: C.muted,
                      marginBottom: "12px",
                    }}
                  >
                    {venue.meta}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["Book a table", "See events", "Deals"].map(
                      (action, i) => (
                        <a
                          key={action}
                          href="#"
                          style={{
                            fontSize: "12px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border:
                              i === 0
                                ? `1px solid ${C.accent}`
                                : "1px solid rgba(42,38,32,0.15)",
                            background: i === 0 ? C.accent : "transparent",
                            color: i === 0 ? "white" : C.muted,
                            textDecoration: "none",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            if (i !== 0) {
                              e.currentTarget.style.background = C.accent;
                              e.currentTarget.style.color = "white";
                              e.currentTarget.style.borderColor = C.accent;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (i !== 0) {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = C.muted;
                              e.currentTarget.style.borderColor =
                                "rgba(42,38,32,0.15)";
                            }
                          }}
                        >
                          {action}
                        </a>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING EVENTS (API) ── */}
      <section style={{ padding: "0 48px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div data-reveal="up" style={{ marginBottom: "48px" }}>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "38px",
                letterSpacing: "-0.02em",
                color: C.text,
                marginBottom: "8px",
              }}
            >
              Trending events
            </h2>
            <p style={{ fontSize: "15px", color: C.muted }}>
              What's on across Sri Lanka this week
            </p>
          </div>
          <div data-reveal="up" data-delay="1">
            <LatestEvents />
          </div>
          <div
            data-reveal="up"
            data-delay="2"
            style={{ textAlign: "center", marginTop: "48px" }}
          >
            <Link
              href="/events"
              style={{
                display: "inline-block",
                fontSize: "14px",
                fontWeight: 400,
                padding: "12px 28px",
                borderRadius: "40px",
                border: "1px solid rgba(42,38,32,0.2)",
                color: C.text,
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(42,38,32,0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(42,38,32,0.2)")
              }
            >
              See all events
            </Link>
          </div>
        </div>
      </section>

      {/* ── MENU RATINGS ── */}
      <section
        style={{
          background: C.bg4,
          padding: "100px 48px",
          color: C.cream,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          className="font-dm-serif"
          style={{
            position: "absolute",
            bottom: "-30px",
            right: "-40px",
            fontSize: "clamp(120px,20vw,220px)",
            fontWeight: 600,
            color: "rgba(196,114,74,0.08)",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
          }}
        >
          TASTE
        </span>

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
          <div data-reveal="left">
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: "20px",
              }}
            >
              Menu ratings
            </p>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "38px",
                letterSpacing: "-0.02em",
                color: C.cream,
                marginBottom: "16px",
              }}
            >
              Restaurants competing
              <br />
              with <em style={{ fontStyle: "italic" }}>themselves</em>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(232,228,218,0.5)",
                lineHeight: 1.8,
              }}
            >
              After your visit, rate individual dishes. Venues see which items
              are loved — and which to drop. Your taste shapes the menu.
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              { name: "Grilled kingfish with mango sambol", up: 142, down: 8 },
              { name: "Wood-fired flatbread", up: 98, down: 12 },
              { name: "Coconut panna cotta", up: 76, down: 31 },
              { name: "Tamarind prawn curry", up: 63, down: 44 },
            ].map((item, i) => (
              <div
                key={item.name}
                data-reveal="right"
                data-delay={String(i + 1)}
                style={{
                  background: "rgba(232,228,218,0.05)",
                  border: "1px solid rgba(232,228,218,0.08)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontSize: "14px",
                    color: "rgba(232,228,218,0.85)",
                  }}
                >
                  {item.name}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      background: "rgba(232,228,218,0.05)",
                      color: "#7DC48E",
                      cursor: "pointer",
                    }}
                  >
                    ▲ <span style={{ fontWeight: 500 }}>{item.up}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      background: "rgba(232,228,218,0.05)",
                      color: "#D07070",
                      cursor: "pointer",
                    }}
                  >
                    ▼ <span style={{ fontWeight: 500 }}>{item.down}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP DOWNLOAD ── */}
      <section
        id="download"
        style={{
          padding: "100px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "white",
        }}
      >
        <span
          className="font-dm-serif"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "clamp(120px,20vw,220px)",
            fontWeight: 600,
            color: "rgba(196,114,74,0.07)",
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
          }}
        >
          APP
        </span>

        <div data-reveal="scale" style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: "24px",
            }}
          >
            Ready to taste the best of Sri Lanka
          </p>
          <h2
            className="font-dm-serif"
            style={{
              fontSize: "clamp(40px,6vw,72px)",
              lineHeight: 1.05,
              maxWidth: "700px",
              margin: "0 auto 24px",
              letterSpacing: "-0.02em",
              color: C.text,
            }}
          >
            Reserve your seat.
            <br />
            <em style={{ fontStyle: "italic", color: C.accent }}>
              Save the hassle.
            </em>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: C.muted,
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Full booking available on web — or download the app for QR entry,
            push alerts, and exclusive in-app deals.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "40px",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Download on the", strong: "App Store" },
              { label: "Get it on", strong: "Google Play" },
            ].map((badge) => (
              <a
                key={badge.strong}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: C.dark,
                  color: C.cream,
                  padding: "12px 24px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 400,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <div>
                  <span
                    style={{ fontSize: "11px", opacity: 0.6, display: "block" }}
                  >
                    {badge.label}
                  </span>
                  <strong style={{ fontSize: "15px", fontWeight: 500 }}>
                    {badge.strong}
                  </strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: C.cream , padding: "100px 48px" }}>
        <div data-reveal="up" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h2
            className="font-dm-serif"
            style={{
              fontSize: "38px",
              letterSpacing: "-0.02em",
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Frequently asked questions
          </h2>
          <p style={{ fontSize: "15px", color: C.muted, marginBottom: "48px" }}>
            Everything you need to know before your first booking
          </p>

          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid rgba(42,38,32,0.1)" }}
            >
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
                <div
                  style={{
                    fontSize: "14px",
                    color: C.muted,
                    lineHeight: 1.8,
                    paddingBottom: "24px",
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
