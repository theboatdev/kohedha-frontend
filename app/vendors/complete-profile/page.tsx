"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useVendorProfile } from "@/hooks/use-vendor-profile";
import { signOutVendor } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

type VendorProfileForm = {
  email: string;
  companyName: string;
  businessRegistrationNo: string;
  vendorMobile: string;
  locationBusinessName: string;
  streetAddress: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  businessCategory: string;
  website: string;
  description: string;
};

export default function VendorCompleteProfilePage() {
  const router = useRouter();
  const {
    profile,
    formData,
    isLoading,
    error,
    updateProfile,
    setFormData,
    clearError,
    setError,
  } = useVendorProfile();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutVendor();
      router.push("/vendors/login");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/vendors/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleChange = (field: keyof VendorProfileForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(null);

    // Basic validation
    if (
      !formData.companyName ||
      !formData.vendorMobile ||
      !formData.city ||
      !formData.businessCategory
    ) {
      setError("Please fill in all required fields marked with *.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        const msg =
          result.message ||
          "Profile details saved successfully. Your profile will appear more prominently to Kohedha users.";
        setSuccess(msg);
        toast({ title: "Profile Saved", description: msg });
        // Optionally redirect to dashboard after success
        setTimeout(() => {
          window.location.href = "/vendors/dashboard";
        }, 2000);
      }
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-10 flex items-center justify-center" style={{ background: "#F0F0EE" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="font-poppins text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F0F0EE" }}>
      <div className="max-w-4xl mx-auto">
        {/* Sign Out Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="font-poppins font-bold text-2xl" style={{ color: "#0D0D0D", letterSpacing: "-0.02em" }}>
              Complete Your Vendor Profile
            </CardTitle>
            <CardDescription className="font-poppins text-sm">
              Add your business details so guests can easily discover and trust
              your venue on Kohedha.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Account section */}
              <section className="space-y-3">
                <h2 className="font-poppins font-semibold text-base" style={{ color: "#0D0D0D" }}>
                  Account
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="font-poppins"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground font-poppins">
                      Email is managed from your login details.
                    </p>
                  </div>
                </div>
              </section>

              {/* Business details section */}
              <section className="space-y-3">
                <h2 className="font-poppins font-semibold text-base" style={{ color: "#0D0D0D" }}>
                  Business Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Sunset Rooftop Lounge"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                      className="font-poppins"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Business Registration No.
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. BR-123456"
                      value={formData.businessRegistrationNo}
                      onChange={(e) =>
                        handleChange("businessRegistrationNo", e.target.value)
                      }
                      className="font-poppins"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="e.g. +94 77 123 4567"
                      value={formData.vendorMobile}
                      onChange={(e) =>
                        handleChange("vendorMobile", e.target.value)
                      }
                      className="font-poppins"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Business Category <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Restaurant, Bar, Café, Event Venue"
                      value={formData.businessCategory}
                      onChange={(e) =>
                        handleChange("businessCategory", e.target.value)
                      }
                      className="font-poppins"
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Website
                    </label>
                    <Input
                      type="url"
                      placeholder="https://yourvenue.lk"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="font-poppins"
                    />
                  </div>
                </div>
              </section>

              {/* Location section */}
              <section className="space-y-3">
                <h2 className="font-poppins font-semibold text-base" style={{ color: "#0D0D0D" }}>
                  Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Business Name at Location
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Kohedha Rooftop – Galle Face"
                      value={formData.locationBusinessName}
                      onChange={(e) =>
                        handleChange("locationBusinessName", e.target.value)
                      }
                      className="font-poppins"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Street Address
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 123 Galle Road"
                      value={formData.streetAddress}
                      onChange={(e) =>
                        handleChange("streetAddress", e.target.value)
                      }
                      className="font-poppins"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Colombo"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="font-poppins"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      District
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Colombo District"
                      value={formData.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                      className="font-poppins"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 00300"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value)
                      }
                      className="font-poppins"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium font-poppins text-black">
                      Country
                    </label>
                    <Input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="font-poppins"
                    />
                  </div>
                </div>
              </section>

              {/* Description section */}
              <section className="space-y-3">
                <h2 className="font-poppins font-semibold text-base" style={{ color: "#0D0D0D" }}>
                  Story & Description
                </h2>
                <div className="space-y-1">
                  <label className="block text-sm font-medium font-poppins text-black">
                    Description
                  </label>
                  <Textarea
                    placeholder="Tell guests what makes your venue special – atmosphere, cuisine, signature experiences, and more."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="font-poppins min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground font-poppins">
                    This description appears on your public profile and helps
                    guests decide to visit.
                  </p>
                </div>
              </section>

              {error && (
                <p className="text-sm text-red-600 font-poppins">{error}</p>
              )}

              {success && (
                <p className="text-sm text-emerald-600 font-poppins">
                  {success}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <Button
                  type="submit"
                  className="font-poppins font-semibold rounded-full px-8"
                  style={{ background: "#F5E642", color: "#0D0D0D", border: "none" }}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>

                <Link
                  href="/vendors/dashboard"
                  className="text-sm font-poppins text-muted-foreground hover:text-black"
                >
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-0">
            <p className="text-xs text-muted-foreground font-poppins">
              Once your profile is complete, we&apos;ll highlight your venue
              more prominently across Kohedha to help you reach the right
              guests.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
