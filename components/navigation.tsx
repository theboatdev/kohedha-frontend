"use client";

import { useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        padding: "0 clamp(20px, 5vw, 64px)",
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(13,13,13,0.09)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-poppins"
        style={{
          fontWeight: 800,
          fontSize: "21px",
          letterSpacing: "-0.02em",
          color: "#0D0D0D",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        kohedha<span style={{ color: "#C8281A" }}>.</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex" style={{ gap: "30px", alignItems: "center" }}>
        {[
          { label: "Discover", href: "/" },
          { label: "Deals", href: "/deals" },
          { label: "About", href: "/about" },
          { label: "Events", href: "/events" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-poppins"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "rgba(13,13,13,0.48)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#0D0D0D")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(13,13,13,0.48)")
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side: CTA + mobile toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <Link
          href="/vendors/register"
          className="hidden md:inline-block font-poppins"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0D0D0D",
            background: "#F5E642",
            padding: "10px 18px",
            borderRadius: "10px",
            textDecoration: "none",
            transition: "opacity 0.12s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Get the app
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            gap: "4px",
          }}
        >
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "#0D0D0D",
              borderRadius: "2px",
              transition: "transform 0.2s, opacity 0.2s",
              transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "#0D0D0D",
              borderRadius: "2px",
              opacity: isOpen ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "#0D0D0D",
              borderRadius: "2px",
              transition: "transform 0.2s",
              transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(13,13,13,0.09)",
            padding: "16px clamp(20px,5vw,64px)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {[
            { label: "Discover", href: "/" },
            { label: "Deals", href: "/deals" },
            { label: "About", href: "/about" },
            { label: "Events", href: "/events" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-poppins"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#0D0D0D",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/vendors/register"
            onClick={() => setIsOpen(false)}
            className="font-poppins"
            style={{
              display: "inline-block",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0D0D0D",
              background: "#F5E642",
              padding: "10px 18px",
              borderRadius: "10px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Get the app
          </Link>
        </div>
      )}
    </nav>
  );
}
