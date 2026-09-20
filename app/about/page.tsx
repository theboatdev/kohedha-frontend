"use client";

import Link from "next/link";
import { C } from "@/lib/brand-theme";

const FAQS = [
  {
    q: "Do I need an account to browse venues?",
    a: "No. You can explore the map, filter by vibe, and browse venues, events, and live deals without an account. You'll only need to sign in when you're ready to reserve a table or save a beacon.",
  },
  {
    q: "Can I book a table on the website?",
    a: "Yes — full booking is available right here on the web. Pick your venue, time, and table, and your QR token is generated instantly. The app adds push alerts and exclusive in-app deals on top.",
  },
  {
    q: "How do menu ratings work?",
    a: "After your visit you can rate individual dishes up or down. Venues see which items are loved and which to drop, so the menu keeps improving — your taste shapes what stays on it.",
  },
  {
    q: "What cities is Kohedha available in?",
    a: "We're live across Greater Colombo — including Colombo 1 through 7, Galle Face, and Battaramulla — and expanding to Kandy, Galle, and Negombo next. Set your radius and the map shows what's reachable from you.",
  },
  {
    q: "Can I cancel or modify a reservation?",
    a: "Absolutely. Head to Manage Your Bookings, open the reservation, and change the time, table size, or cancel — free of charge up to two hours before your slot.",
  },
];

export default function AboutPage() {
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
            About
          </div>
          <h1
            className="om-hero-h1"
            style={{ margin: "28px 0 0", maxWidth: "16ch", fontSize: "72px" }}
          >
            Every venue, perfectly matched to your mood.
          </h1>
          <p
            style={{
              margin: "28px 0 0",
              maxWidth: "52ch",
              fontSize: "17px",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "rgba(246,246,244,0.6)",
            }}
          >
            Kohedha was built for Sri Lanka&apos;s dining culture — where the
            vibe matters as much as the menu. We connect you to places that fit
            how you&apos;re feeling right now.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "150px",
            paddingBottom: "150px",
          }}
        >
          <div className="om-2col">
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Our story
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "14ch" }}>
                Born from Sri Lanka&apos;s dining culture.
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                fontSize: "16px",
                lineHeight: 1.75,
                fontWeight: 300,
                color: "rgba(13,13,13,0.62)",
              }}
            >
              <p>
                Born from a passion for Sri Lanka&apos;s incredible culinary
                landscape and vibrant cultural scene, Kohedha emerged as more
                than just another discovery platform. We recognised that finding
                authentic experiences shouldn&apos;t be left to chance.
              </p>
              <p>
                From hidden street food gems in Pettah to exclusive rooftop
                dining in Colombo 3, from traditional cultural performances to
                modern fusion experiences — the island offers endless
                possibilities. We built Kohedha to be your compass in this
                adventure.
              </p>
              <p>
                Today, Kohedha connects food lovers and culture enthusiasts with
                Sri Lanka&apos;s most exciting venues and events — matched to
                your mood, not just your appetite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "150px",
            paddingBottom: "150px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(13,13,13,0.5)",
            }}
          >
            What drives us
          </div>
          <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "18ch" }}>
            Three principles behind everything we do.
          </h2>
          <div
            className="om-3col"
            style={{
              gap: "1px",
              marginTop: "80px",
              background: "rgba(13,13,13,0.08)",
            }}
          >
            {[
              {
                n: "01",
                title: "Authentic experiences",
                body: "We celebrate genuine Sri Lankan culture, from traditional recipes passed down through generations to innovative interpretations that honour our heritage.",
              },
              {
                n: "02",
                title: "Community first",
                body: "We support local businesses, connect like-minded food enthusiasts, and build bridges between communities through shared culinary experiences.",
              },
              {
                n: "03",
                title: "Curated quality",
                body: "Every venue and event on Kohedha is personally vetted. We don't just list places — we recommend experiences that we believe in.",
              },
            ].map((v, i) => (
              <div
                key={v.n}
                style={{
                  background: "#F6F6F4",
                  padding:
                    i === 0
                      ? "40px 36px 44px 0"
                      : i === 2
                        ? "40px 0 44px 36px"
                        : "40px 36px 44px 36px",
                }}
                className="om-feature-cell"
              >
                <div style={{ fontSize: "13px", color: "rgba(13,13,13,0.4)" }}>
                  {v.n}
                </div>
                <h3
                  style={{
                    margin: "22px 0 0",
                    fontSize: "26px",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    margin: "16px 0 0",
                    fontSize: "16px",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "rgba(13,13,13,0.6)",
                  }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "150px",
            paddingBottom: "150px",
          }}
        >
          <div className="om-2col" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                FAQ
              </div>
              <h2
                className="om-h2"
                style={{ margin: "28px 0 0", fontSize: "44px", lineHeight: 1.08 }}
              >
                Frequently asked questions
              </h2>
              <p
                style={{
                  margin: "24px 0 0",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.6)",
                }}
              >
                Everything you need to know before your first booking.
              </p>
            </div>
            <div style={{ borderTop: "1px solid rgba(13,13,13,0.1)" }}>
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  style={{ borderBottom: "1px solid rgba(13,13,13,0.1)" }}
                >
                  <summary
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "24px",
                      padding: "26px 4px",
                      fontSize: "19px",
                    }}
                  >
                    {faq.q}
                    <span
                      className="om-plus"
                      style={{
                        fontSize: "20px",
                        fontWeight: 300,
                        color: "rgba(13,13,13,0.45)",
                        transition: "transform 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    style={{
                      margin: 0,
                      padding: "0 40px 28px 4px",
                      fontSize: "16px",
                      lineHeight: 1.75,
                      fontWeight: 300,
                      color: "rgba(13,13,13,0.62)",
                    }}
                  >
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
        >
          <div className="om-2col" style={{ alignItems: "center" }}>
            <h2 className="om-h2" style={{ margin: 0, maxWidth: "14ch" }}>
              Ready to find your night?
            </h2>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(13,13,13,0.62)",
                  maxWidth: "40ch",
                }}
              >
                Start exploring venues near you — or list your own and join Sri
                Lanka&apos;s dining network.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "28px",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "48px",
                    padding: "0 24px",
                    borderRadius: "999px",
                    background: "#F5E642",
                    color: "#0D0D0D",
                    fontSize: "15px",
                    textDecoration: "none",
                  }}
                >
                  Start exploring →
                </Link>
                <Link
                  href="/vendors/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "48px",
                    padding: "0 24px",
                    borderRadius: "999px",
                    border: "1px solid rgba(13,13,13,0.22)",
                    color: "#0D0D0D",
                    fontSize: "15px",
                    textDecoration: "none",
                  }}
                >
                  List your venue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
