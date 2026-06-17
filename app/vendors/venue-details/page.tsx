"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/vendors/form-section";
import { AlertMessage } from "@/components/vendors/alert-message";
import { VenueFormField } from "@/components/vendors/venue-form-field";
import { LocationMapSelector } from "@/components/vendors/location-map-selector";
import { MapPin, Edit2, Save, X } from "lucide-react";
import { signOutVendor } from "@/lib/auth";
import { validateSriLankanMobile, SL_MOBILE_ERROR } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";
import {
  getVenueDetails,
  updateVenueDetails,
  type VenueDetailsData,
} from "@/lib/venue";
import type { SelectedLocation } from "@/types/location";

/** Convert the backend LocationData into the SelectedLocation shape the map expects. */
function locationDataToSelected(loc: VenueDetailsData["location"]): SelectedLocation | null {
  const lat = loc?.coordinates?.lat ?? (loc?.latitude ? parseFloat(loc.latitude) : undefined);
  const lng = loc?.coordinates?.lng ?? (loc?.longitude ? parseFloat(loc.longitude) : undefined);
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;
  return {
    streetAddress: loc?.streetAddress,
    city: loc?.city,
    district: loc?.district,
    postalCode: loc?.postalCode,
    country: loc?.country,
    coordinates: { lat, lng },
  };
}

export default function VenueDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [venueData, setVenueData] = useState<VenueDetailsData>({
    companyName: "",
    email: "",
    businessRegistrationNo: "",
    vendorMobile: "",
    businessCategory: "",
    website: "",
    description: "",
    location: { country: "Sri Lanka" },
  });

  // Derived SelectedLocation state — kept in sync with venueData.location
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  // Load venue data on mount
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const result = await getVenueDetails();
        if (result.success && result.data) {
          setVenueData({
            companyName: result.data.companyName || "",
            email: result.data.email || "",
            businessRegistrationNo: result.data.businessRegistrationNo || "",
            vendorMobile: result.data.vendorMobile || "",
            businessCategory: result.data.businessCategory || "",
            website: result.data.website || "",
            description: result.data.description || "",
            location: result.data.location || { country: "Sri Lanka" },
          });
          setSelectedLocation(locationDataToSelected(result.data.location));
        } else {
          setError(result.message || "Failed to load venue details");
          if (result.message?.includes("not authorized")) {
            router.push("/vendors/login");
          }
        }
      } catch {
        setError("Unable to load venue details. Please check your connection.");
        toast({
          title: "Error",
          description: "Unable to load venue details. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueData();
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field: string, value: string) => {
    setVenueData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleLocationChange = (loc: SelectedLocation | null) => {
    setSelectedLocation(loc);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (venueData.vendorMobile && !validateSriLankanMobile(venueData.vendorMobile)) {
      setError(SL_MOBILE_ERROR);
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateVenueDetails({
        companyName: venueData.companyName,
        businessRegistrationNo: venueData.businessRegistrationNo,
        vendorMobile: venueData.vendorMobile,
        businessCategory: venueData.businessCategory,
        website: venueData.website,
        description: venueData.description,
        location: selectedLocation
          ? {
              streetAddress: selectedLocation.streetAddress,
              city: selectedLocation.city,
              district: selectedLocation.district,
              postalCode: selectedLocation.postalCode,
              country: selectedLocation.country || "Sri Lanka",
              coordinates: {
                lat: selectedLocation.coordinates.lat,
                lng: selectedLocation.coordinates.lng,
              },
            }
          : venueData.location,
      });

      if (result.success) {
        setSuccess(result.message || "Venue details updated successfully!");
        setIsEditing(false);
        toast({
          title: "Saved",
          description: result.message || "Venue details updated successfully!",
        });
        if (result.data) {
          setVenueData((prev) => ({ ...prev, ...result.data }));
          setSelectedLocation(locationDataToSelected(result.data?.location));
        }
      } else {
        setError(result.message || "Failed to update venue details");
        toast({
          title: "Error",
          description: result.message || "Failed to update venue details.",
          variant: "destructive",
        });
        if (result.message?.includes("not authorized")) {
          router.push("/vendors/login");
        }
      }
    } catch {
      setError("Unable to update venue details. Please try again.");
      toast({
        title: "Error",
        description: "Unable to update venue details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Revert unsaved map changes
    setSelectedLocation(locationDataToSelected(venueData.location));
  };

  const handleSignOut = async () => {
    await signOutVendor();
    router.push("/vendors/login");
  };

  if (isLoading) {
    return (
      <VendorLayout onSignOut={handleSignOut} pageTitle="Venue Details">
        <div
          style={{
            minHeight: "100vh",
            background: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 16px",
          }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: "#C4724A" }}
            />
            <p className="font-poppins text-sm" style={{ color: "#7A7368" }}>
              Loading venue details...
            </p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout onSignOut={handleSignOut} pageTitle="Venue Details">
      <div
        style={{
          minHeight: "100vh",
          background: "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div className="max-w-4xl w-full">
          <div
            className="rounded-xl shadow-lg overflow-hidden"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(42,38,32,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="p-8 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(42,38,32,0.1)" }}
            >
              <div>
                <p className="font-poppins text-sm" style={{ color: "#7A7368" }}>
                  Manage your business and location information
                </p>
                <p
                  className="text-xs font-poppins text-center pt-2"
                  style={{ color: "#7A7368" }}
                >
                  Accurate details help guests find your venue and improve your
                  visibility on Kohedha.
                </p>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="h-10 font-poppins font-medium"
                  style={{ background: "#C4724A", color: "#F2EEE6" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#B85E38")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#C4724A")
                  }
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              ) : (
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="h-10 font-poppins"
                  style={{
                    borderColor: "rgba(42,38,32,0.2)",
                    color: "#2A2620",
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information Section */}
                <FormSection title="Business Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VenueFormField
                      label="Company Name"
                      value={venueData.companyName}
                      onChange={(value) => handleChange("companyName", value)}
                      disabled={!isEditing}
                    />

                    <VenueFormField
                      label="Email"
                      type="email"
                      value={venueData.email}
                      disabled={true}
                      helperText="Email cannot be changed"
                    />

                    <VenueFormField
                      label="Business Registration No"
                      value={venueData.businessRegistrationNo || ""}
                      onChange={(value) =>
                        handleChange("businessRegistrationNo", value)
                      }
                      placeholder="e.g. PV12345"
                      disabled={!isEditing}
                    />

                    <div className="space-y-2">
                      <VenueFormField
                        label="Contact Mobile"
                        type="tel"
                        value={venueData.vendorMobile}
                        onChange={(value) => handleChange("vendorMobile", value)}
                        placeholder="e.g. +94 71 234 5678 or 071 234 5678"
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <p className="text-xs text-gray-400 font-poppins">
                          Sri Lankan format: +94XXXXXXXXX or 0XXXXXXXXX
                        </p>
                      )}
                    </div>

                    <VenueFormField
                      label="Business Category"
                      type="select"
                      value={venueData.businessCategory}
                      onChange={(value) =>
                        handleChange("businessCategory", value)
                      }
                      placeholder="Select category"
                      disabled={!isEditing}
                      selectOptions={[
                        { value: "cafe", label: "Cafe" },
                        { value: "restaurant", label: "Restaurant" },
                        { value: "hotel", label: "Hotel" },
                        { value: "pub", label: "Pub" },
                      ]}
                    />

                    <VenueFormField
                      label="Website"
                      type="url"
                      value={venueData.website || ""}
                      onChange={(value) => handleChange("website", value)}
                      placeholder="e.g. https://example.com"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="mt-6">
                    <VenueFormField
                      label="Description"
                      type="textarea"
                      value={venueData.description || ""}
                      onChange={(value) => handleChange("description", value)}
                      placeholder="Tell us about your business..."
                      disabled={!isEditing}
                    />
                  </div>
                </FormSection>

                {/* Location Section */}
                <FormSection title="Business Location" icon={MapPin}>
                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <p className="text-sm font-poppins text-gray-500">
                          Search for your business location, click on the map,
                          or use the location button to pinpoint your venue.
                        </p>
                        <LocationMapSelector
                          value={selectedLocation}
                          onChange={handleLocationChange}
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-poppins text-gray-500 mb-2">
                          {selectedLocation
                            ? "Your current venue location."
                            : "No location set yet. Click Edit Details to add one."}
                        </p>
                        <LocationMapSelector
                          value={selectedLocation}
                          onChange={() => {}}
                          disabled
                        />
                      </>
                    )}
                  </div>
                </FormSection>

                {/* Error and Success Messages */}
                {error && <AlertMessage message={error} type="error" />}
                {success && <AlertMessage message={success} type="success" />}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto h-12 font-poppins font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ background: "#C4724A", color: "#F2EEE6" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#B85E38")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#C4724A")
                      }
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Button>

                    <Link href="/vendors/dashboard" className="w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 font-poppins"
                        style={{
                          borderColor: "rgba(42,38,32,0.2)",
                          color: "#2A2620",
                          background: "transparent",
                        }}
                      >
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
