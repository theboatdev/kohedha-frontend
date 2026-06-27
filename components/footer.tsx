import Link from "next/link"

export function Footer() {
  return (
    <footer
      style={{
        background: "#0D0D0D",
        color: "#FFFFFF",
        padding: "clamp(56px,7vw,84px) clamp(20px,5vw,64px) 36px",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        {/* Top grid */}
        <div
          className="foot-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: "40px",
            paddingBottom: "48px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="font-poppins"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 800,
                fontSize: "26px",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                textDecoration: "none",
                marginBottom: "16px",
              }}
            >
              kohedha<span style={{ color: "#C8281A" }}>.</span>
            </Link>
            <p
              className="font-poppins"
              style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: "14px",
                maxWidth: "30ch",
                lineHeight: 1.65,
                marginBottom: "22px",
              }}
            >
              Sri Lanka&apos;s restaurant &amp; event discovery app — every venue, perfectly matched to your mood.
            </p>
            <Link
              href="/vendors"
              className="font-poppins"
              style={{
                fontWeight: 700,
                fontSize: "14px",
                color: "#F5E642",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              List your venue <span>→</span>
            </Link>
          </div>

          {/* Discover column */}
          <div>
            <h5
              className="font-poppins"
              style={{
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#F5E642",
                marginBottom: "16px",
              }}
            >
              Discover
            </h5>
            {[
              { label: "Places", href: "/" },
              { label: "Events", href: "/events" },
              { label: "Deals", href: "/deals" },
              { label: "Radius explorer", href: "/#explore" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-poppins"
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.42)",
                  textDecoration: "none",
                  marginBottom: "11px",
                  transition: "color 0.14s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company column */}
          <div>
            <h5
              className="font-poppins"
              style={{
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#F5E642",
                marginBottom: "16px",
              }}
            >
              Company
            </h5>
            {[
              { label: "About", href: "/about" },
              { label: "Get the app", href: "/vendors/register" },
              { label: "For vendors", href: "/vendors" },
              { label: "Careers", href: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-poppins"
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.42)",
                  textDecoration: "none",
                  marginBottom: "11px",
                  transition: "color 0.14s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal column */}
          <div>
            <h5
              className="font-poppins"
              style={{
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#F5E642",
                marginBottom: "16px",
              }}
            >
              Legal
            </h5>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "#" },
              { label: "Contact", href: "#" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-poppins"
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.42)",
                  textDecoration: "none",
                  marginBottom: "11px",
                  transition: "color 0.14s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            paddingTop: "28px",
            flexWrap: "wrap",
          }}
        >
          <span
            className="font-poppins"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.20)",
              letterSpacing: "0.04em",
            }}
          >
            © 2025 Kohedha · Made for Sri Lanka&apos;s nights out
          </span>
          <span
            className="font-poppins"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.20)",
              letterSpacing: "0.04em",
            }}
          >
            Colombo · Kandy · Galle
          </span>
        </div>
      </div>

    </footer>
  )
}
