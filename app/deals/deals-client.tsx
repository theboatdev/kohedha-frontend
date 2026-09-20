"use client";

import { useState } from "react";
import Link from "next/link";
import type { SanityDeal } from "./page";
import { C } from "@/lib/brand-theme";

interface ModalData {
  discount: string;
  title: string;
  venue: string;
  detail: string;
}

const statusFilters = ["All deals", "Active now", "Coming soon"];

function parseDiscount(coupon?: {
  discount: string;
  code?: string;
}): { big: string; suffix: string } {
  if (!coupon?.discount) return { big: "—", suffix: "" };
  const d = coupon.discount;
  const pct = d.match(/^(\d+)\s*(%\s*off)/i);
  if (pct) return { big: pct[1], suffix: pct[2] };
  const twoFor = d.match(/^(\d+\s*for\s*\d+)/i);
  if (twoFor) return { big: twoFor[1].replace(/\s/g, ""), suffix: "" };
  const free = d.match(/^(Free)\s*(.*)/i);
  if (free) return { big: "Free", suffix: free[2] ? ` ${free[2]}` : "" };
  return { big: d, suffix: "" };
}

function DealCard({
  deal,
  onClick,
}: {
  deal: SanityDeal;
  onClick: () => void;
}) {
  const { big, suffix } = parseDiscount(deal.validCoupons?.[0]);
  const isActive = deal.status === "active";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(13,13,13,0.08)",
        borderRadius: "18px",
        padding: "28px",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(13,13,13,0.45)",
            }}
          >
            {deal.formattedAddress || deal.category || "Venue"}
          </div>
          <div
            style={{
              marginTop: "12px",
              fontSize: "24px",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            {deal.name}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(13,13,13,0.4)",
            }}
          >
            {isActive ? "Offer" : "Soon"}
          </div>
          <div
            style={{
              marginTop: "6px",
              fontSize: "20px",
              letterSpacing: "-0.01em",
            }}
          >
            {big}
            {suffix}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "14px",
          fontSize: "15px",
          fontWeight: 300,
          color: "rgba(13,13,13,0.6)",
          lineHeight: 1.6,
        }}
      >
        {deal.description}
      </div>
      <div
        style={{
          marginTop: "28px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
          color: "rgba(13,13,13,0.55)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "999px",
              background: isActive ? "#C8281A" : "rgba(13,13,13,0.3)",
            }}
          />
          {isActive ? "Active now" : "Coming soon"}
        </span>
        {deal.category && <span>{deal.category}</span>}
      </div>
      <div
        style={{
          marginTop: "10px",
          height: "3px",
          background: "rgba(13,13,13,0.08)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: isActive ? "72%" : "20%",
            height: "100%",
            background: isActive ? "#0D0D0D" : "rgba(13,13,13,0.2)",
          }}
        />
      </div>
    </div>
  );
}

export default function DealsPageClient({
  allDeals,
  featuredDeals,
}: {
  allDeals: SanityDeal[];
  featuredDeals: SanityDeal[];
  regularDeals: SanityDeal[];
}) {
  const [activeFilter, setActiveFilter] = useState("All deals");
  const [modal, setModal] = useState<ModalData | null>(null);

  const filteredDeals = allDeals.filter((d) => {
    if (activeFilter === "Active now") return d.status === "active";
    if (activeFilter === "Coming soon") return d.status !== "active";
    return true;
  });

  const topFeatured = featuredDeals[0];

  const openDealModal = (deal: SanityDeal) => {
    const { big, suffix } = parseDiscount(deal.validCoupons?.[0]);
    setModal({
      discount: `${big}${suffix}`,
      title: deal.name,
      venue: deal.formattedAddress,
      detail: deal.description,
    });
  };

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
              display: "flex",
              alignItems: "center",
              gap: "9px",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(246,246,244,0.5)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: "#C8281A",
              }}
            />
            Deals · live
          </div>
          <h1
            className="om-hero-h1"
            style={{ margin: "28px 0 0", maxWidth: "14ch", fontSize: "72px" }}
          >
            Live offers, ending soon.
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
            Real-time deals from venues matched to your vibe — happy hours, set
            menus, and exclusive discounts active right now.
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
        {statusFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "11px 20px",
              borderRadius: "999px",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
              border:
                activeFilter === f
                  ? "1px solid #0D0D0D"
                  : "1px solid rgba(13,13,13,0.16)",
              background: activeFilter === f ? "#0D0D0D" : "transparent",
              color:
                activeFilter === f ? "#F6F6F4" : "rgba(13,13,13,0.75)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="om-pad"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          paddingTop: "48px",
          paddingBottom: "120px",
        }}
      >
        {/* Featured */}
        {topFeatured && (
          <div
            style={{
              background: "#0D0D0D",
              color: "#F6F6F4",
              borderRadius: "20px",
              padding: "48px",
              marginBottom: "56px",
              display: "grid",
              gridTemplateColumns: "1.4fr auto",
              gap: "40px",
              alignItems: "center",
            }}
            className="om-2col"
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(246,246,244,0.45)",
                }}
              >
                Deal of the week
              </div>
              <h2
                className="om-h2"
                style={{
                  margin: "20px 0 0",
                  fontSize: "40px",
                  color: "#F6F6F4",
                }}
              >
                {topFeatured.name}
              </h2>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(246,246,244,0.55)",
                  maxWidth: "48ch",
                }}
              >
                {topFeatured.description}
              </p>
              <button
                type="button"
                onClick={() => openDealModal(topFeatured)}
                style={{
                  marginTop: "28px",
                  display: "inline-flex",
                  alignItems: "center",
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "999px",
                  background: "#F5E642",
                  color: "#0D0D0D",
                  fontSize: "15px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                View deal →
              </button>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: 300,
                  letterSpacing: "-0.04em",
                  color: "#F5E642",
                }}
              >
                {parseDiscount(topFeatured.validCoupons?.[0]).big}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(246,246,244,0.45)",
                }}
              >
                off regular price
              </div>
            </div>
          </div>
        )}

        {filteredDeals.length > 0 ? (
          <div className="om-3col" style={{ gap: "28px" }}>
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onClick={() => openDealModal(deal)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              style={{
                fontSize: "28px",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              No deals right now
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "rgba(13,13,13,0.55)",
                marginBottom: "32px",
              }}
            >
              Check back soon — venues drop new offers daily.
            </p>
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
              Explore venues
            </Link>
          </div>
        )}
      </div>

      {/* App CTA */}
      <section
        style={{
          borderTop: "1px solid rgba(13,13,13,0.08)",
          background: "#0D0D0D",
          color: "#F6F6F4",
        }}
      >
        <div
          className="om-pad"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "100px",
            paddingBottom: "100px",
            textAlign: "center",
          }}
        >
          <h2 className="om-h2" style={{ margin: 0, color: "#F6F6F4" }}>
            Never miss a deal near you.
          </h2>
          <p
            style={{
              margin: "20px auto 0",
              maxWidth: "42ch",
              fontSize: "16px",
              fontWeight: 300,
              color: "rgba(246,246,244,0.55)",
              lineHeight: 1.7,
            }}
          >
            Get push alerts the moment a venue near you drops a deal.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "36px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://apps.apple.com/lk/app/kohedha/id6748849700"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                flexDirection: "column",
                padding: "12px 22px",
                borderRadius: "12px",
                background: "#F6F6F4",
                color: "#0D0D0D",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "11px", opacity: 0.6 }}>
                Download on the
              </span>
              <span style={{ fontSize: "16px" }}>App Store</span>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.theboat.kohedaapp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                flexDirection: "column",
                padding: "12px 22px",
                borderRadius: "12px",
                border: "1px solid rgba(246,246,244,0.24)",
                color: "#F6F6F4",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "11px", opacity: 0.55 }}>Get it on</span>
              <span style={{ fontSize: "16px" }}>Google Play</span>
            </a>
          </div>
        </div>
      </section>

      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(13,13,13,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div
            style={{
              background: "#F6F6F4",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "480px",
              width: "100%",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: "rgba(13,13,13,0.45)",
              }}
            >
              ✕
            </button>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 300,
                letterSpacing: "-0.03em",
              }}
            >
              {modal.discount}
            </div>
            <h2
              style={{
                margin: "12px 0 0",
                fontSize: "26px",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {modal.title}
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "14px",
                color: "rgba(13,13,13,0.5)",
              }}
            >
              {modal.venue}
            </p>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "rgba(13,13,13,0.62)",
              }}
            >
              {modal.detail}
            </p>
            <button
              type="button"
              onClick={() => setModal(null)}
              style={{
                marginTop: "28px",
                width: "100%",
                height: "48px",
                borderRadius: "999px",
                background: "#F5E642",
                color: "#0D0D0D",
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Redeem deal →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
