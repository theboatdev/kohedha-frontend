"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitWaitlist, type UserType } from "@/lib/waitList";
import {
  validateSriLankanMobile,
  SL_MOBILE_ERROR,
  validateGmail,
  GMAIL_ERROR,
} from "@/lib/validators";
import {
  Sparkles,
  MapPin,
  Bell,
  Star,
  CheckCircle2,
  Store,
  User,
} from "lucide-react";
import { C } from "@/lib/brand-theme";

const benefits = [
  {
    icon: Sparkles,
    title: "Early access",
    desc: "Be among the first to explore venues, events, and deals before anyone else.",
  },
  {
    icon: Bell,
    title: "Launch updates",
    desc: "Get notified the moment Kohedha goes live in your city.",
  },
  {
    icon: Star,
    title: "Exclusive perks",
    desc: "Waitlist members receive special offers and priority features at launch.",
  },
];

function Eyebrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className="font-poppins"
      style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: onDark ? C.accent : C.red,
        marginBottom: "20px",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          width: "22px",
          height: "2px",
          background: onDark ? C.accent : C.red,
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      {children}
    </p>
  );
}

function BgWord({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span
      className="font-poppins"
      style={{
        position: "absolute",
        fontSize: "clamp(100px, 18vw, 200px)",
        fontWeight: 600,
        letterSpacing: "-0.04em",
        color: "rgba(245,230,66,0.07)",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </span>
  );
}

export default function WaitListPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    userType: "" as UserType | "",
    businessName: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateGmail(formData.email)) {
      newErrors.email = GMAIL_ERROR;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateSriLankanMobile(formData.mobile)) {
      newErrors.mobile = SL_MOBILE_ERROR;
    }

    if (!formData.userType) {
      newErrors.userType =
        "Please select whether you're a Restaurant or Customer";
    }

    if (formData.userType === "restaurant") {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await submitWaitlist({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        userType: formData.userType as UserType,
        ...(formData.userType === "restaurant" && {
          businessName: formData.businessName.trim(),
          city: formData.city.trim(),
        }),
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setGeneralError(result.message);
      }
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field: string) => ({
    borderColor: errors[field] ? C.red : C.rule,
    background: C.cream,
    color: C.text,
    fontSize: "15px",
    height: "48px",
    borderRadius: "10px",
  });

  const labelStyle = {
    display: "block" as const,
    fontSize: "13px",
    fontWeight: 500,
    color: C.text,
    marginBottom: "6px",
  };

  const errorStyle = {
    fontSize: "12px",
    color: C.red,
    marginTop: "4px",
  };

  if (isSuccess) {
    return (
      <div
        className="font-dm-sans min-h-screen flex flex-col"
        style={{ background: C.bg, color: C.text }}
      >
        <nav
          style={{
            padding: "20px clamp(20px, 5vw, 48px)",
            borderBottom: `1px solid ${C.rule}`,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link
            href="/"
            className="font-poppins"
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: C.text,
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            kohedha<span style={{ color: C.red }}>.</span>
          </Link>
        </nav>

        <div
          className="flex-1 flex items-center justify-center px-4 py-16"
          style={{ background: C.bg2 }}
        >
          <div
            className="text-center max-w-md w-full px-8 py-12"
            style={{
              background: C.bg,
              borderRadius: "20px",
              border: `1px solid ${C.rule}`,
              boxShadow: "0 8px 40px rgba(13,13,13,0.06)",
            }}
          >
            <div
              className="mx-auto mb-6 flex items-center justify-center rounded-full"
              style={{
                width: "72px",
                height: "72px",
                background: C.greenBg,
              }}
            >
              <CheckCircle2 size={36} style={{ color: C.green }} />
            </div>
            <Eyebrow>Confirmed</Eyebrow>
            <h1
              className="font-poppins mb-3"
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 800,
                color: C.text,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              You&apos;re on the list!
            </h1>
            <p
              style={{
                color: C.muted,
                lineHeight: 1.7,
                fontSize: "16px",
                marginBottom: "32px",
              }}
            >
              Thanks for joining the Kohedha waitlist. We&apos;ll reach out with
              early access details as we get closer to launch.
            </p>
            <Link
              href="/"
              className="font-poppins"
              style={{
                display: "inline-block",
                background: C.accent,
                color: C.text,
                fontSize: "14px",
                fontWeight: 700,
                padding: "13px 28px",
                borderRadius: "40px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.accent2)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="font-dm-sans min-h-screen flex flex-col"
      style={{ background: C.bg, color: C.text, overflowX: "hidden" }}
    >
      {/* Nav */}
      <nav
        style={{
          padding: "20px clamp(20px, 5vw, 48px)",
          borderBottom: `1px solid ${C.rule}`,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <Link
          href="/"
          className="font-poppins"
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: C.text,
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          kohedha<span style={{ color: C.red }}>.</span>
        </Link>
        <Link
          href="/"
          className="font-poppins hidden sm:inline-block"
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: C.muted,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          ← Back to home
        </Link>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left — copy & benefits */}
        <div
          className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24 lg:w-[45%] relative overflow-hidden"
          style={{ background: C.dark }}
        >
          <BgWord text="JOIN" style={{ bottom: "-40px", right: "-20px" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <Eyebrow onDark>Early access</Eyebrow>
            <h1
              className="font-poppins mb-5"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                color: C.text2,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Be the first to
              <br />
              experience{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>Kohedha</em>
            </h1>
            <p
              style={{
                color: C.onDarkA(0.65),
                fontSize: "16px",
                lineHeight: 1.75,
                marginBottom: "40px",
                maxWidth: "420px",
              }}
            >
              Sri Lanka&apos;s vibe-first venue platform is almost here. Join the
              waitlist for priority access, launch updates, and exclusive perks.
            </p>

            <div className="flex flex-col gap-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: C.accentA(0.12),
                    }}
                  >
                    <Icon size={18} style={{ color: C.accent }} />
                  </div>
                  <div>
                    <p
                      className="font-poppins"
                      style={{
                        color: C.text2,
                        fontWeight: 600,
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        color: C.onDarkA(0.5),
                        fontSize: "14px",
                        lineHeight: 1.65,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div
          className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24 lg:w-[55%]"
          style={{ background: C.bg }}
        >
          <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%" }}>
            <Eyebrow>Waitlist</Eyebrow>
            <h2
              className="font-poppins mb-2"
              style={{
                fontSize: "clamp(26px, 3vw, 32px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: C.text,
              }}
            >
              Join the waitlist
            </h2>
            <p
              style={{
                color: C.muted,
                fontSize: "15px",
                marginBottom: "32px",
                lineHeight: 1.65,
              }}
            >
              Fill in your details below and we&apos;ll notify you when Kohedha
              is ready for you.
            </p>

            {generalError && (
              <div
                className="mb-5 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(200,40,26,0.08)",
                  color: C.red,
                  border: `1px solid rgba(200,40,26,0.2)`,
                }}
              >
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Full name <span style={{ color: C.red }}>*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={inputStyle("name")}
                  className="focus-visible:ring-[#F5E642] focus-visible:border-[#F5E642]"
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={labelStyle}>
                  Gmail address <span style={{ color: C.red }}>*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={inputStyle("email")}
                  className="focus-visible:ring-[#F5E642] focus-visible:border-[#F5E642]"
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" style={labelStyle}>
                  Mobile number <span style={{ color: C.red }}>*</span>
                </label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+94712345678 or 0712345678"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  style={inputStyle("mobile")}
                  className="focus-visible:ring-[#F5E642] focus-visible:border-[#F5E642]"
                />
                {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
              </div>

              {/* User type */}
              <div>
                <label style={labelStyle}>
                  I am a… <span style={{ color: C.red }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: "customer", label: "Customer", icon: User },
                      { value: "restaurant", label: "Restaurant", icon: Store },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => {
                    const selected = formData.userType === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            userType: value,
                            businessName:
                              value === "customer" ? "" : formData.businessName,
                            city: value === "customer" ? "" : formData.city,
                          })
                        }
                        className="font-poppins flex flex-col items-center gap-2 py-4 transition-all duration-200 cursor-pointer"
                        style={{
                          borderRadius: "40px",
                          border: `1.5px solid ${selected ? C.accent2 : C.rule}`,
                          background: selected ? C.accent : C.cream,
                          color: selected ? C.text : C.muted,
                          fontWeight: selected ? 600 : 500,
                        }}
                      >
                        <Icon size={20} />
                        <span style={{ fontSize: "14px" }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.userType && <p style={errorStyle}>{errors.userType}</p>}
              </div>

              {/* Restaurant fields */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out space-y-5"
                style={{
                  maxHeight: formData.userType === "restaurant" ? "220px" : "0",
                  opacity: formData.userType === "restaurant" ? 1 : 0,
                }}
              >
                <div>
                  <label htmlFor="businessName" style={labelStyle}>
                    Business name <span style={{ color: C.red }}>*</span>
                  </label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your restaurant name"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    style={inputStyle("businessName")}
                    className="focus-visible:ring-[#F5E642] focus-visible:border-[#F5E642]"
                    tabIndex={formData.userType === "restaurant" ? 0 : -1}
                  />
                  {errors.businessName && (
                    <p style={errorStyle}>{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" style={labelStyle}>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      City <span style={{ color: C.red }}>*</span>
                    </span>
                  </label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g. Colombo"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    style={inputStyle("city")}
                    className="focus-visible:ring-[#F5E642] focus-visible:border-[#F5E642]"
                    tabIndex={formData.userType === "restaurant" ? 0 : -1}
                  />
                  {errors.city && <p style={errorStyle}>{errors.city}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-poppins w-full h-12 text-sm font-bold transition-all duration-200 hover:opacity-90"
                style={{
                  background: C.accent,
                  color: C.text,
                  marginTop: "8px",
                  borderRadius: "40px",
                }}
              >
                {isSubmitting ? "Joining…" : "Join the waitlist →"}
              </Button>

              <p
                style={{
                  fontSize: "12px",
                  color: C.muted,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                No spam — just a heads-up when we launch.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: C.dark,
          color: C.text2,
          padding: "24px clamp(20px, 5vw, 48px)",
          borderTop: `1px solid ${C.onDarkA(0.08)}`,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            className="font-dm-sans"
            style={{ fontSize: "13px", color: C.onDarkA(0.4) }}
          >
            © {new Date().getFullYear()} Kohedha
          </span>
          <div className="font-dm-sans" style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "About", href: "/about" },
              { label: "For venues", href: "/vendors" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  color: C.onDarkA(0.4),
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = C.onDarkA(0.8))
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = C.onDarkA(0.4))
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
