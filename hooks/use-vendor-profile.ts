import { useState, useEffect } from "react";

type VendorLocation = {
  businessName?: string;
  streetAddress?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
};

type VendorProfile = {
  _id: string;
  email: string;
  companyName?: string;
  businessRegistrationNo?: string;
  vendorMobile?: string;
  location?: VendorLocation;
  businessCategory?: string;
  website?: string;
  description?: string;
  isProfileComplete?: boolean;
};

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

type UseVendorProfileReturn = {
  profile: VendorProfile | null;
  formData: VendorProfileForm;
  isLoading: boolean;
  error: string | null;
  updateProfile: (
    data: Partial<VendorProfileForm>,
  ) => Promise<{ success: boolean; message?: string }>;
  setFormData: React.Dispatch<React.SetStateAction<VendorProfileForm>>;
  clearError: () => void;
  setError: (error: string) => void;
};

export const useVendorProfile = (): UseVendorProfileReturn => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [formData, setFormData] = useState<VendorProfileForm>({
    email: "",
    companyName: "",
    businessRegistrationNo: "",
    vendorMobile: "",
    locationBusinessName: "",
    streetAddress: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Sri Lanka",
    businessCategory: "",
    website: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Load vendor profile on mount
  useEffect(() => {
    const loadVendorProfile = async () => {
      try {
        const vendorId = localStorage.getItem("vendorId");
        if (!vendorId) {
          setError("No vendor session found. Please login again.");
          setIsLoading(false);
          return;
        }

        if (!process.env.NEXT_PUBLIC_API_URL) {
          setError("API service is not configured. Please try again later.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/profile/${vendorId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(localStorage.getItem("auth_token") && {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              }),
            },
          },
        );

        const result = await response.json();

        if (response.ok && result.success) {
          const vendor = result.data;
          setProfile(vendor);

          // Update form data with existing vendor info
          setFormData({
            email: vendor.email || "",
            companyName: vendor.companyName || "",
            businessRegistrationNo: vendor.businessRegistrationNo || "",
            vendorMobile: vendor.vendorMobile || "",
            locationBusinessName: vendor.location?.businessName || "",
            streetAddress: vendor.location?.streetAddress || "",
            city: vendor.location?.city || "",
            district: vendor.location?.district || "",
            postalCode: vendor.location?.postalCode || "",
            country: vendor.location?.country || "Sri Lanka",
            businessCategory: vendor.businessCategory || "",
            website: vendor.website || "",
            description: vendor.description || "",
          });
        } else {
          setError(result.message || "Failed to load profile data");
        }
      } catch (error) {
        setError("Unable to load profile data. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorProfile();
  }, []);

  // Update profile function
  const updateProfile = async (data: Partial<VendorProfileForm>) => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        throw new Error("Session expired. Please login again.");
      }

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error(
          "API service is not configured. Please try again later.",
        );
      }

      // Merge current form data with updates
      const updatedData = { ...formData, ...data };

      // Prepare data to match backend controller structure
      const requestData = {
        companyName: updatedData.companyName,
        businessRegistrationNo: updatedData.businessRegistrationNo,
        vendorMobile: updatedData.vendorMobile,
        location: {
          businessName: updatedData.locationBusinessName,
          streetAddress: updatedData.streetAddress,
          city: updatedData.city,
          district: updatedData.district,
          postalCode: updatedData.postalCode,
          country: updatedData.country,
        },
        businessCategory: updatedData.businessCategory,
        website: updatedData.website,
        description: updatedData.description,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/profile/${vendorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("auth_token") && {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            }),
          },
          body: JSON.stringify(requestData),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local profile state
        setProfile((prev) => (prev ? { ...prev, ...result.data } : null));
        return { success: true, message: result.message };
      } else {
        // Handle specific error messages from backend
        if (
          result.message ===
          "Company name, vendor mobile, & location are required"
        ) {
          throw new Error(
            "Please fill in all required fields: Company name, mobile, and city.",
          );
        } else if (result.message === "Vendor not found..") {
          throw new Error("Account not found. Please login again.");
        } else {
          throw new Error(
            result.message || "Failed to update profile. Please try again.",
          );
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reach the server. Please check your connection and try again.";
      setError(message);
      return { success: false, message };
    }
  };

  return {
    profile,
    formData,
    isLoading,
    error,
    updateProfile,
    setFormData,
    clearError,
    setError,
  };
};
