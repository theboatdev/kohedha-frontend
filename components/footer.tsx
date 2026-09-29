import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#0D0D0D", color: "#F6F6F4" }}>
      <div
        className="om-pad"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "110px 48px 48px",
        }}
      >
        <div className="om-footer-grid">
          <div>
            <div
              style={{
                fontSize: "21px",
                fontWeight: 500,
                letterSpacing: "-0.03em",
              }}
            >
              kohedha<span style={{ color: "#C8281A" }}>.</span>
            </div>
            <p
              style={{
                margin: "20px 0 0",
                maxWidth: "34ch",
                fontSize: "16px",
                lineHeight: 1.7,
                fontWeight: 300,
                color: "rgba(246,246,244,0.55)",
              }}
            >
              Sri Lanka&apos;s restaurant &amp; event discovery app — every
              venue, perfectly matched to your mood.
            </p>
            <Link
              href="/vendors/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "44px",
                padding: "0 22px",
                marginTop: "32px",
                borderRadius: "999px",
                border: "1px solid rgba(246,246,244,0.24)",
                color: "#F6F6F4",
                fontSize: "14px",
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              List your venue →
            </Link>
          </div>

          <div>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(246,246,244,0.4)",
              }}
            >
              Discover
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "22px",
                fontSize: "15px",
              }}
            >
              {[
                { label: "Places", href: "/places" },
                { label: "Events", href: "/events" },
                { label: "Deals", href: "/deals" },
                { label: "Radius explorer", href: "/#explore" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: "rgba(246,246,244,0.75)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(246,246,244,0.4)",
              }}
            >
              Company
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "22px",
                fontSize: "15px",
              }}
            >
              {[
                { label: "About", href: "/about" },
                { label: "Get the app", href: "/#app" },
                { label: "For vendors", href: "/vendors" },
                { label: "Careers", href: "#" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: "rgba(246,246,244,0.75)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(246,246,244,0.4)",
              }}
            >
              Legal
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "22px",
                fontSize: "15px",
              }}
            >
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Cookies", href: "#" },
                { label: "Contact", href: "#" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: "rgba(246,246,244,0.75)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            marginTop: "88px",
            paddingTop: "28px",
            borderTop: "1px solid rgba(246,246,244,0.12)",
            fontSize: "13px",
            color: "rgba(246,246,244,0.45)",
            flexWrap: "wrap",
          }}
        >
          <span>© 2025 Kohedha · Made for Sri Lanka&apos;s nights out</span>
          <span>Colombo · Kandy · Galle</span>
        </div>
      </div>
    </footer>
  );
}
