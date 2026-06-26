"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RegistrationProgress } from "@/components/vendors/registration-progress";
import { LocationMapSelector } from "@/components/vendors/location-map-selector";
import { completeRegistrationStep } from "@/lib/auth";
import type { SelectedLocation } from "@/types/location";
import {
  MapPin,
  Globe,
  FileText,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

type Step3Draft = {
  location: SelectedLocation | null;
  website: string;
  description: string;
};

export default function RegistrationStep3Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      router.replace("/vendors/register/step-3");
    }
  }, [searchParams, router]);

  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("registration_step3");
    if (saved) {
      try {
        const draft: Step3Draft = JSON.parse(saved);
        if (draft.location) setLocation(draft.location);
        if (draft.website) setWebsite(draft.website);
        if (draft.description) setDescription(draft.description);
      } catch {
        // ignore malformed draft
      }
    }
  }, []);

  // Persist draft whenever fields change
  useEffect(() => {
    if (location || website.trim() || description.trim()) {
      const draft: Step3Draft = { location, website, description };
      localStorage.setItem("registration_step3", JSON.stringify(draft));
    }
  }, [location, website, description]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!location?.coordinates?.lat || !location?.coordinates?.lng) {
      newErrors.location = "Please select your business location on the map.";
    } else {
      const { lat, lng } = location.coordinates;
      if (lat < -90 || lat > 90) {
        newErrors.location = "Selected latitude is out of valid range.";
      } else if (lng < -180 || lng > 180) {
        newErrors.location = "Selected longitude is out of valid range.";
      }
    }

    if (website.trim()) {
      try {
        new URL(website);
      } catch {
        newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
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
      const result = await completeRegistrationStep({
        currentStep: 3,
        location: location
          ? {
              streetAddress: location.streetAddress,
              city: location.city,
              district: location.district,
              postalCode: location.postalCode,
              country: location.country || "Sri Lanka",
              coordinates: {
                lat: location.coordinates.lat,
                lng: location.coordinates.lng,
              },
            }
          : undefined,
        website: website.trim() || undefined,
        description: description.trim() || undefined,
      });

      if (result.success) {
        localStorage.removeItem("registration_step2");
        localStorage.removeItem("registration_step3");
        router.push("/vendors/dashboard");
      } else {
        setGeneralError(result.error || "Failed to complete registration");
      }
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#F0F0EE" }}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border mb-4" style={{ borderColor: "rgba(13,13,13,0.09)" }}>
            <span className="font-poppins font-bold text-base" style={{ color: "#0D0D0D", letterSpacing: "-0.02em" }}>
              kohedha<span style={{ color: "#C8281A" }}>.</span>
            </span>
            <span className="text-xs font-dm-sans" style={{ color: "rgba(13,13,13,0.48)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Vendor Portal
            </span>
          </div>

          <div className="mb-6">
            <RegistrationProgress currentStep={3} />
          </div>

          <h1 className="font-poppins font-bold text-4xl mb-2" style={{ color: "#0D0D0D", letterSpacing: "-0.02em" }}>
            Location & Details
          </h1>
          <p className="font-poppins text-gray-600">
            Final step! Help customers find you and learn about your business
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(13,13,13,0.09)" }}>
          <div className="p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error */}
              {generalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-poppins">{generalError}</p>
                </div>
              )}

              {/* Business Location Section */}
              <div className="space-y-5">
                <div className="pb-2 border-b border-gray-200">
                  <h3 className="font-poppins font-semibold text-lg flex items-center gap-2" style={{ color: "#0D0D0D" }}>
                    <MapPin className="h-5 w-5" />
                    Business Location
                  </h3>
                  <p className="font-poppins text-sm text-gray-600 mt-1">
                    Select your company&apos;s location on the map{" "}
                    <span className="text-red-500">*</span>
                  </p>
                </div>

                <LocationMapSelector
                  value={location}
                  onChange={setLocation}
                  error={errors.location}
                />
              </div>

              {/* Additional Information Section */}
              <div className="space-y-5">
                <div className="pb-2 border-b border-gray-200">
                  <h3 className="font-poppins font-semibold text-lg flex items-center gap-2" style={{ color: "#0D0D0D" }}>
                    <FileText className="h-5 w-5" />
                    Additional Information
                  </h3>
                  <p className="font-poppins text-sm text-gray-600 mt-1">
                    Optional details to enhance your profile
                  </p>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium font-poppins text-gray-900">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="url"
                      placeholder="e.g., https://yourwebsite.com (optional)"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-11 font-poppins h-12 border-gray-200 focus:border-gray-900 transition-colors"
                      maxLength={200}
                    />
                  </div>
                  {errors.website && (
                    <p className="text-xs text-red-500 font-poppins">{errors.website}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium font-poppins text-gray-900">
                    Business Description
                  </label>
                  <Textarea
                    placeholder="Tell customers about your unique offerings, ambiance, specialties... (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="font-poppins resize-none min-h-[120px] border-gray-200 focus:border-gray-900 transition-colors"
                    maxLength={500}
                  />
                  {description && (
                    <p className="text-xs text-gray-400 font-poppins text-right">
                      {description.length}/500
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => router.back()}
                  className="font-poppins gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-poppins font-semibold h-12 px-8 transition-all duration-200 gap-2 rounded-full"
                  style={{ background: isSubmitting ? "rgba(13,13,13,0.08)" : "#F5E642", color: isSubmitting ? "rgba(13,13,13,0.48)" : "#0D0D0D", border: "none" }}
                >
                  {isSubmitting ? "Completing..." : "Complete Registration"}
                  {!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 font-poppins mt-6">
          Step 3 of 3 · Almost done! Your profile will be ready after this step
        </p>
      </div>
    </div>
  );
}
