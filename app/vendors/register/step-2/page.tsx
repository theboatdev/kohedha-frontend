"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegistrationProgress } from "@/components/vendors/registration-progress";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import { completeRegistrationStep } from "@/lib/auth";
import { validateSriLankanMobile, SL_MOBILE_ERROR } from "@/lib/validators";
import {
  Building2,
  Phone,
  FileText,
  Tag,
  ArrowRight,
  Store,
} from "lucide-react";

export default function RegistrationStep2Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    businessRegistrationNo: "",
    vendorMobile: "",
    businessCategory: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("registration_step2");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (
      formData.companyName ||
      formData.vendorMobile ||
      formData.businessCategory
    ) {
      localStorage.setItem("registration_step2", JSON.stringify(formData));
    }
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.vendorMobile.trim()) {
      newErrors.vendorMobile = "Mobile number is required";
    } else if (!validateSriLankanMobile(formData.vendorMobile)) {
      newErrors.vendorMobile = SL_MOBILE_ERROR;
    }

    if (!formData.businessCategory.trim()) {
      newErrors.businessCategory = "Business category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await completeRegistrationStep({
        currentStep: 2,
        companyName: formData.companyName.trim(),
        businessRegistrationNo:
          formData.businessRegistrationNo.trim() || undefined,
        vendorMobile: formData.vendorMobile.trim(),
        businessCategory: formData.businessCategory.trim(),
      });

      if (result.success) {
        // Clear step 2 data and move to step 3
        localStorage.removeItem("registration_step2");
        router.push("/vendors/register/step-3");
      } else {
        setGeneralError(result.error || "Failed to save business details");
      }
    } catch (error) {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 mb-4">
            <Store className="h-5 w-5 text-gray-900" />
            <span className="font-bebas text-xl tracking-wide text-gray-900">
              Kohedha Vendor Portal
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <RegistrationProgress currentStep={2} />
          </div>

          <h1 className="font-bebas text-5xl tracking-tight text-gray-900 mb-2">
            Business Details
          </h1>
          <p className="font-poppins text-gray-600">
            Tell us about your business so customers can discover you
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* General Error */}
              {generalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-poppins">
                    {generalError}
                  </p>
                </div>
              )}

              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-poppins text-gray-900">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., Colombo Rooftop Dining"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    className="pl-11 font-poppins h-12 border-gray-200 focus:border-gray-900 transition-colors"
                    maxLength={100}
                    required
                  />
                </div>
                {errors.companyName && (
                  <p className="text-xs text-red-500 font-poppins">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Business Registration Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-poppins text-gray-900">
                  Business Registration Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., BR123456789 (optional)"
                    value={formData.businessRegistrationNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        businessRegistrationNo: e.target.value,
                      }))
                    }
                    className="pl-11 font-poppins h-12 border-gray-200 focus:border-gray-900 transition-colors"
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-poppins text-gray-900">
                  Business Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="e.g., +94 77 123 4567 or 077 123 4567"
                    value={formData.vendorMobile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vendorMobile: e.target.value,
                      }))
                    }
                    className="pl-11 font-poppins h-12 border-gray-200 focus:border-gray-900 transition-colors"
                    required
                  />
                </div>
                {errors.vendorMobile ? (
                  <p className="text-xs text-red-500 font-poppins">
                    {errors.vendorMobile}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 font-poppins">
                    Sri Lankan format: +94XXXXXXXXX or 0XXXXXXXXX
                  </p>
                )}
              </div>

              {/* Business Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-poppins text-gray-900">
                  Business Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                  <Select
                    value={formData.businessCategory || undefined}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        businessCategory: value,
                      }))
                    }
                    required
                  >
                    <SelectTrigger className="pl-11 font-poppins h-12 border-gray-200 focus:border-gray-900 transition-colors w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                          className="font-poppins"
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.businessCategory && (
                  <p className="text-xs text-red-500 font-poppins">
                    {errors.businessCategory}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Link href="/vendors/login">
                  <Button
                    variant="ghost"
                    type="button"
                    className="font-poppins"
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black hover:bg-gray-900 text-white font-poppins font-medium h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 font-poppins mt-6">
          Step 2 of 3 · Your information is secure and private
        </p>
      </div>
    </div>
  );
}
