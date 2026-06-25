"use client";

import { useState, FormEvent } from "react";
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
      newErrors.userType = "Please select whether you're a Restaurant or Customer";
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
    borderColor: errors[field] ? "#ef4444" : "#E8E8E4",
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
    color: "#ef4444",
    marginTop: "4px",
  };

  if (isSuccess) {
    return (
      <div
        className="font-dm-sans min-h-screen flex items-center justify-center px-4"
        style={{ background: C.cream }}
      >
        <div
          className="text-center max-w-md w-full px-8 py-12 rounded-2xl"
          style={{ background: C.bg, boxShadow: "0 8px 40px rgba(13,13,13,0.08)" }}
        >
          <div
            className="mx-auto mb-6 flex items-center justify-center rounded-full"
            style={{
              width: "72px",
              height: "72px",
              background: `${C.accent}18`,
            }}
          >
            <CheckCircle2 size={36} style={{ color: C.accent }} />
          </div>
          <h1
            className="font-display mb-3"
            style={{ fontSize: "32px", color: C.text, letterSpacing: "-0.02em" }}
          >
            You&apos;re on the list!
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.7, fontSize: "16px" }}>
            Thanks for joining the Kohedha waitlist. We&apos;ll reach out with
            early access details as we get closer to launch.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-dm-sans" style={{ background: C.bg, color: C.text }}>
      <div
        className="flex flex-col lg:flex-row min-h-screen"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Left — copy & benefits */}
        <div
          className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24 lg:w-[45%]"
          style={{ background: C.dark }}
        >
          <img
            src="/3.png"
            alt="Kohedha"
            style={{ height: "38px", width: "160px", marginBottom: "32px" }}
          />

          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: "16px",
            }}
          >
            Early access
          </p>
          <h1
            className="font-display mb-5"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Be the First to Experience Kohedha
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "17px",
              lineHeight: 1.7,
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
                  className="flex-shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `${C.accent}22`,
                  }}
                >
                  <Icon size={18} style={{ color: C.accent }} />
                </div>
                <div>
                  <p
                    style={{
                      color: "#ffffff",
                      fontWeight: 500,
                      fontSize: "15px",
                      marginBottom: "2px",
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24 lg:w-[55%]">
          <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%" }}>
            <h2
              className="font-display mb-2"
              style={{ fontSize: "28px", letterSpacing: "-0.02em", color: C.text }}
            >
              Join the Waitlist
            </h2>
            <p style={{ color: C.muted, fontSize: "15px", marginBottom: "32px", lineHeight: 1.6 }}>
              Fill in your details below and we&apos;ll notify you when Kohedha
              is ready for you.
            </p>

            {generalError && (
              <div
                className="mb-5 px-4 py-3 rounded-lg text-sm"
                style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}
              >
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Full name <span style={{ color: C.accent }}>*</span>
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
                  Gmail address <span style={{ color: C.accent }}>*</span>
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
                  Mobile number <span style={{ color: C.accent }}>*</span>
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
                  I am a… <span style={{ color: C.accent }}>*</span>
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
                            businessName: value === "customer" ? "" : formData.businessName,
                            city: value === "customer" ? "" : formData.city,
                          })
                        }
                        className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer"
                        style={{
                          borderColor: selected ? C.accent : "#E8E8E4",
                          background: selected ? `${C.accent}10` : C.cream,
                          color: selected ? C.accent2 : C.muted,
                        }}
                      >
                        <Icon size={22} />
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>{label}</span>
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
                    Business name <span style={{ color: C.accent }}>*</span>
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
                  {errors.businessName && <p style={errorStyle}>{errors.businessName}</p>}
                </div>

                <div>
                  <label htmlFor="city" style={labelStyle}>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      City <span style={{ color: C.accent }}>*</span>
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
                className="w-full h-12 text-base font-medium rounded-xl transition-all duration-200 hover:opacity-90"
                style={{
                  background: C.accent,
                  color: "#0D0D0D",
                  marginTop: "8px",
                }}
              >
                {isSubmitting ? "Joining…" : "Join the Waitlist"}
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
    </div>
  );
}
