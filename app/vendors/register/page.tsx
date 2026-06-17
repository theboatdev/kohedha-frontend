"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/vendors/google-signin-button";
import { registerVendor } from "@/lib/auth";
import { isPasswordValid } from "@/lib/password-validation";
import { PasswordStrengthHelper } from "@/components/vendors/password-strength-helper";
import { Mail, Lock, CheckCircle2 } from "lucide-react";

const C = {
  bg: "#FFFFFF",
  text: "#2A2620",
  muted: "#7A7368",
  accent: "#C4724A",
  cream: "#FFFFFF",
  dark: "#1E1B17",
};

const benefits = [
  {
    title: "Reach More Customers",
    body: "Showcase your venue to engaged users actively searching for experiences.",
    color: "rgba(196,114,74,0.12)",
    iconColor: "#C4724A",
  },
  {
    title: "Manage Deals & Events",
    body: "Create promotional offers and event listings with an intuitive dashboard.",
    color: "rgba(42,38,32,0.08)",
    iconColor: "#2A2620",
  },
  {
    title: "Track Performance",
    body: "Get insights on views, engagement, and customer interactions.",
    color: "rgba(196,114,74,0.08)",
    iconColor: "#B85E38",
  },
];

export default function VendorRegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      setError(
        "Registration service is not configured. Please try again later.",
      );
      return;
    }

    if (!isPasswordValid(password)) {
      setError("Please ensure your password meets all requirements below.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await registerVendor(
        trimmedEmail,
        password,
        confirmPassword,
      );
      if (result.success) {
        router.push("/vendors/register/step-2");
        return;
      }
      setError(result.error || "Registration failed. Please try again.");
    } catch (err) {
      setError(
        "Unable to reach registration service. Please check your connection and try again.",
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
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "center",
        }}
      >
        {/* Left - Branding */}
        <div className="hidden lg:block">
          <div
            className="font-dm-serif"
            style={{ fontSize: "26px", color: C.dark, marginBottom: "20px" }}
          >
            kohedha<span style={{ color: C.accent }}>.</span>
          </div>
          <h1
            className="font-dm-serif"
            style={{
              fontSize: "clamp(36px,4vw,52px)",
              color: C.text,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Grow Your
            <br />
            Business
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: C.muted,
              lineHeight: 1.75,
              marginBottom: "36px",
              maxWidth: "380px",
            }}
          >
            Join Sri Lanka's premier platform for venues, dining, and
            experiences. Connect with thousands of potential customers.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {benefits.map(({ title, body, color, iconColor }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <CheckCircle2
                    style={{ width: 16, height: 16, color: iconColor }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: "3px",
                      fontSize: "14px",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: C.muted,
                      lineHeight: 1.65,
                    }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div>
          <div style={{ marginBottom: "24px" }}>
            <h2
              className="font-dm-serif"
              style={{
                fontSize: "28px",
                color: C.text,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              Create Your Account
            </h2>
            <p style={{ fontSize: "14px", color: C.muted }}>
              Start showcasing your venue on Kohedha today
            </p>
          </div>

          <div
            style={{
              background: C.cream,
              borderRadius: "20px",
              border: "1px solid rgba(42,38,32,0.1)",
              padding: "32px",
            }}
          >
            <div style={{ marginBottom: "22px" }}>
              <GoogleSignInButton text="Sign up with Google" />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(42,38,32,0.12)",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: C.muted,
                  whiteSpace: "nowrap",
                }}
              >
                or continue with email
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(42,38,32,0.12)",
                }}
              />
            </div>

            <form
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
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
                      width: 15,
                      height: 15,
                      color: C.muted,
                    }}
                  />
                  <Input
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      paddingLeft: "36px",
                      background: C.bg,
                      border: "1px solid rgba(42,38,32,0.15)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      height: "42px",
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
                      width: 15,
                      height: 15,
                      color: C.muted,
                    }}
                  />
                  <Input
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      paddingLeft: "36px",
                      background: C.bg,
                      border: "1px solid rgba(42,38,32,0.15)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      height: "42px",
                    }}
                    required
                  />
                </div>
                <PasswordStrengthHelper
                  password={password}
                  colors={{ text: C.text, muted: C.muted, accent: C.accent }}
                />
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
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 15,
                      height: 15,
                      color: C.muted,
                    }}
                  />
                  <Input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      paddingLeft: "36px",
                      background: C.bg,
                      border: "1px solid rgba(42,38,32,0.15)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      height: "42px",
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
                  background: isSubmitting ? C.muted : C.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "#b85e38";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = C.accent;
                  }
                }}
              >
                {isSubmitting ? "Creating account…" : "Create Vendor Account"}
              </button>
            </form>

            <div style={{ marginTop: "18px" }}>
              <p
                style={{
                  fontSize: "11px",
                  textAlign: "center",
                  color: C.muted,
                  marginBottom: "10px",
                }}
              >
                By creating an account you agree to our{" "}
                <Link
                  href="/terms"
                  style={{ color: C.text, textDecoration: "underline" }}
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  style={{ color: C.text, textDecoration: "underline" }}
                >
                  Privacy Policy
                </Link>
              </p>
              <p
                style={{
                  fontSize: "13px",
                  textAlign: "center",
                  color: C.muted,
                }}
              >
                Already have an account?{" "}
                <Link
                  href="/vendors/login"
                  style={{
                    color: C.accent,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
