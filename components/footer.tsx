import Link from "next/link"

export function Footer() {
  return (
    <footer style={{ background: "black", color: "var(--lp-cream)", padding: "60px 48px" }}>
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
          style={{ fontSize: "24px", color: "var(--lp-cream)", textDecoration: "none" }}
        >
          kohedha.
        </Link>

        <div className="font-dm-sans" style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { label: "About", href: "/about" },
            { label: "Events", href: "/events" },
            { label: "Deals", href: "/deals" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                color: "rgba(232,228,218,0.4)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(232,228,218,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,228,218,0.4)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/vendors"
          className="font-dm-sans"
          style={{
            fontSize: "13px",
            color: "var(--lp-accent)",
            textDecoration: "none",
            border: "1px solid rgba(196,114,74,0.4)",
            padding: "8px 18px",
            borderRadius: "20px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--lp-accent)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--lp-accent)";
          }}
        >
          List your venue →
        </Link>
      </div>
    </footer>
  )
}
