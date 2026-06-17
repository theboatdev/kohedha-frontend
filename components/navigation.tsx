"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        padding: "20px 48px",
        display: "flex",
        alignItems: "center",
        gap: "48px",
        background: "white",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(42,38,32,0.08)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          marginRight: "auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="/1.png"
          alt="kohedha"
          style={{ height: "40px", width: "auto" }}
        />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex" style={{ gap: "32px" }}>
        {[
          { label: "Discover", href: "/" },
          { label: "Deals", href: "/deals" },
          { label: "About", href: "/about" },
          { label: "Events", href: "/events" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-dm-sans"
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "var(--lp-muted)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--lp-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--lp-muted)")
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/vendors/register"
        className="hidden md:inline-block font-dm-sans"
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--lp-cream)",
          background: "var(--lp-accent)",
          padding: "9px 20px",
          borderRadius: "40px",
          textDecoration: "none",
          transition: "background 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--lp-accent2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--lp-accent)")
        }
      >
        Get the app
      </Link>

      {/* Mobile toggle */}
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--lp-text)",
          padding: "4px",
        }}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {isOpen && (
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
              className="font-dm-sans"
              style={{
                fontSize: "14px",
                color: "var(--lp-text)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/vendors/register"
            onClick={() => setIsOpen(false)}
            className="font-dm-sans"
            style={{
              display: "inline-block",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--lp-cream)",
              background: "var(--lp-accent)",
              padding: "10px 20px",
              borderRadius: "40px",
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
