"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/vendors/google-signin-button";
import { loginVendor } from "@/lib/auth";
import { Mail, Lock } from "lucide-react";

const C = {
  bg: "#0D0D0D",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.48)",
  accent: "#F5E642",
  accentHover: "#E8D800",
  card: "#1A1A1A",
  inputBg: "#262626",
  rule: "rgba(255,255,255,0.09)",
};

export default function VendorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      setError("Login service is not configured. Please try again later.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await loginVendor(trimmedEmail, password);

      if (result.success) {
        const registrationStep = result.data?.registrationStep || 3;

        if (registrationStep === 1) {
          router.push("/vendors/register/step-2");
        } else if (registrationStep === 2) {
          router.push("/vendors/register/step-3");
        } else {
          router.push("/vendors/dashboard");
        }
        return;
      }

      setError(result.error || "Login failed. Please try again.");
    } catch (err) {
      setError(
        "Unable to reach login service. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="font-dm-sans"
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
          className="font-poppins"
          style={{ fontSize: "28px", fontWeight: 700, color: C.text, marginBottom: "6px", letterSpacing: "-0.02em" }}
        >
          kohedha<span style={{ color: "#C8281A" }}>.</span>
        </div>
        <h1
          className="font-poppins"
            style={{
              fontSize: "36px",
              color: C.text,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: "15px", color: C.muted }}>
            Sign in to manage your venue
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: C.card,
            borderRadius: "20px",
            border: `1px solid ${C.rule}`,
            padding: "36px",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <GoogleSignInButton text="Continue with Google" dark />
          </div>

          <div
            style={{
              position: "relative",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: C.rule,
              }}
            />
            <span
              style={{ fontSize: "12px", color: C.muted, whiteSpace: "nowrap" }}
            >
              or sign in with email
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: C.rule,
              }}
            />
          </div>

          <form
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            onSubmit={handleSubmit}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: C.text,
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: C.muted,
                  }}
                />
                <Input
                  type="email"
                  placeholder="vendor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  style={{
                    paddingLeft: "36px",
                    background: C.inputBg,
                    border: `1px solid ${C.rule}`,
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: C.text,
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: C.text,
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: C.muted,
                  }}
                />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  style={{
                    paddingLeft: "36px",
                    background: C.inputBg,
                    border: `1px solid ${C.rule}`,
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: C.text,
                  }}
                  required
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(229,57,53,0.08)",
                  border: "1px solid rgba(229,57,53,0.2)",
                  borderRadius: "10px",
                }}
              >
                <p style={{ fontSize: "13px", color: "#C62828" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                height: "44px",
                background: isSubmitting ? "rgba(255,255,255,0.12)" : C.accent,
                color: isSubmitting ? C.muted : "#0D0D0D",
                border: "none",
                borderRadius: "40px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = C.accentHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = C.accent;
                }
              }}
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p
            style={{
              marginTop: "20px",
              fontSize: "13px",
              textAlign: "center",
              color: C.muted,
            }}
          >
            New vendor?{" "}
            <Link
              href="/vendors/register"
              style={{
                color: C.accent,
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
