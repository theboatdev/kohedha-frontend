"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Discover", href: "/" },
  { label: "Deals", href: "/deals" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(246,246,244,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(13,13,13,0.08)",
      }}
    >
      <div
        className="om-nav-inner"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 48px",
          height: "76px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "21px",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: "#0D0D0D",
            textDecoration: "none",
          }}
        >
          kohedha<span style={{ color: "#C8281A" }}>.</span>
        </Link>

        <nav className="om-nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(link.href) ? "#0D0D0D" : "rgba(13,13,13,0.62)",
                textDecoration: "none",
                fontSize: "15px",
                transition: "color 0.15s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="om-live-badge">
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: "#C8281A",
                flexShrink: 0,
              }}
            />
            <span style={{ whiteSpace: "nowrap" }}>142 live now</span>
          </div>

          <Link href="/#app" className="om-nav-cta">
            Get the app
          </Link>

          <button
            className="om-nav-burger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              gap: "4px",
              flexDirection: "column",
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
      </div>

      {isOpen && (
        <div
          className="om-nav-mobile"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(246,246,244,0.97)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(13,13,13,0.08)",
            padding: "16px 28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: "15px",
                fontWeight: 400,
                color: isActive(link.href) ? "#0D0D0D" : "rgba(13,13,13,0.62)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#app"
            onClick={() => setIsOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              padding: "0 20px",
              borderRadius: "999px",
              border: "1px solid rgba(13,13,13,0.22)",
              fontSize: "14px",
              color: "#0D0D0D",
              textDecoration: "none",
              marginTop: "4px",
            }}
          >
            Get the app
          </Link>
        </div>
      )}
    </header>
  );
}
