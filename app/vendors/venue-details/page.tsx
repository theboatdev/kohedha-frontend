"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/vendors/form-section";
import { AlertMessage } from "@/components/vendors/alert-message";
import { VenueFormField } from "@/components/vendors/venue-form-field";
import { LocationMapSelector } from "@/components/vendors/location-map-selector";
import { MapPin, Edit2, Save, X, Image as ImageIcon, ImagePlus, Loader2 } from "lucide-react";
import { signOutVendor } from "@/lib/auth";
import { validateSriLankanMobile, SL_MOBILE_ERROR } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";
import {
  getVenueDetails,
  updateVenueDetails,
  updateVenueMainImage,
  addVenueImages,
  deleteVenueImage,
  type VenueDetailsData,
  type VenueImage,
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
    mainImage: undefined,
    images: [],
  });

  // Derived SelectedLocation state — kept in sync with venueData.location
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  // Venue photo state — these actions apply immediately, independent of the
  // Edit Details/Save Changes flow used for the text fields above.
  const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);
  const [isUploadingGalleryImages, setIsUploadingGalleryImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
            mainImage: result.data.mainImage,
            images: result.data.images || [],
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

  const handleMainImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMainImage(true);
    try {
      const result = await updateVenueMainImage(file);
      if (result.success && result.data) {
        setVenueData((prev) => ({ ...prev, mainImage: result.data!.mainImage }));
        toast({
          title: "Saved",
          description: result.message || "Main image updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update main image.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unable to update main image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingMainImage(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = "";
    }
  };

  const handleAddGalleryImages = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploadingGalleryImages(true);
    try {
      const result = await addVenueImages(files);
      if (result.success && result.data) {
        setVenueData((prev) => ({ ...prev, images: result.data!.images }));
        toast({
          title: "Saved",
          description: result.message || "Photos added successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add photos.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unable to add photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingGalleryImages(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleDeleteGalleryImage = async (image: VenueImage) => {
    setDeletingImageId(image._id);
    try {
      const result = await deleteVenueImage(image._id);
      if (result.success && result.data) {
        setVenueData((prev) => ({ ...prev, images: result.data!.images }));
        toast({
          title: "Removed",
          description: result.message || "Photo removed successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove photo.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unable to remove photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  if (isLoading) {
    return (
      <VendorLayout onSignOut={handleSignOut} pageTitle="Venue Details">
        <div
          style={{
            minHeight: "100vh",
            background: "#F0F0EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 16px",
          }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: "#F0F0EE" }}
            />
            <p className="font-poppins text-sm" style={{ color: "rgba(13,13,13,0.48)" }}>
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
          background: "#F0F0EE",
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
              border: "1px solid rgba(13,13,13,0.09)",
            }}
          >
            {/* Header */}
            <div
              className="p-8 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(13,13,13,0.09)" }}
            >
              <div>
                <p className="font-poppins text-sm" style={{ color: "rgba(13,13,13,0.48)" }}>
                  Manage your business and location information
                </p>
                <p
                  className="text-xs font-poppins text-center pt-2"
                  style={{ color: "rgba(13,13,13,0.48)" }}
                >
                  Accurate details help guests find your venue and improve your
                  visibility on Kohedha.
                </p>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="h-10 font-poppins font-medium"
                  style={{ background: "#F0F0EE", color: "#0D0D0D" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#E8E8E4")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#F0F0EE")
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
                    borderColor: "rgba(13,13,13,0.18)",
                    color: "#0D0D0D",
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

                {/* Venue Photos Section — image add/change/delete controls are
                    only shown while editing, like the rest of the form. */}
                <FormSection title="Venue Photos" icon={ImageIcon}>
                  <div className="space-y-6">
                    {/* Main image */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium font-poppins text-gray-900">
                        Main Photo
                      </p>
                      <div className="flex items-center gap-4">
                        <div
                          className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
                          style={{ width: "160px", height: "120px" }}
                        >
                          {venueData.mainImage?.url ? (
                            <img
                              src={venueData.mainImage.url}
                              alt="Venue main"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-gray-400">
                              <ImageIcon className="w-6 h-6" />
                              <span className="font-poppins text-xs">
                                No photo set
                              </span>
                            </div>
                          )}
                          {isUploadingMainImage && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-1">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => mainImageInputRef.current?.click()}
                              disabled={isUploadingMainImage}
                              className="h-9 font-poppins text-sm"
                              style={{
                                borderColor: "rgba(13,13,13,0.18)",
                                color: "#0D0D0D",
                              }}
                            >
                              {venueData.mainImage?.url
                                ? "Change Photo"
                                : "Add Photo"}
                            </Button>
                            <p className="text-xs text-gray-400 font-poppins">
                              JPG, PNG, WebP · max 5 MB
                            </p>
                          </div>
                        ) : (
                          !venueData.mainImage?.url && (
                            <p className="text-sm font-poppins text-gray-500">
                              No photo set yet. Click Edit Details to add one.
                            </p>
                          )
                        )}
                        <input
                          ref={mainImageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleMainImageFileChange}
                        />
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium font-poppins text-gray-900">
                          Photo Gallery
                        </p>
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={isUploadingGalleryImages}
                            className="h-9 font-poppins text-sm gap-2"
                            style={{
                              borderColor: "rgba(13,13,13,0.18)",
                              color: "#0D0D0D",
                            }}
                          >
                            {isUploadingGalleryImages ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ImagePlus className="w-4 h-4" />
                            )}
                            Add Photos
                          </Button>
                        )}
                        <input
                          ref={galleryInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={handleAddGalleryImages}
                        />
                      </div>

                      {venueData.images && venueData.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {venueData.images.map((image) => (
                            <div
                              key={image._id}
                              className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                              style={{ aspectRatio: "1 / 1" }}
                            >
                              <img
                                src={image.url}
                                alt={image.caption || "Venue photo"}
                                className="w-full h-full object-cover"
                              />
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryImage(image)}
                                  disabled={deletingImageId === image._id}
                                  className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-60"
                                >
                                  {deletingImageId === image._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <X className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-poppins text-gray-500">
                          {isEditing
                            ? "No gallery photos yet. Add some to showcase your venue."
                            : "No gallery photos yet. Click Edit Details to add some."}
                        </p>
                      )}
                    </div>
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
                      style={{ background: "#F0F0EE", color: "#0D0D0D" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#E8E8E4")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#F0F0EE")
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
                          borderColor: "rgba(13,13,13,0.18)",
                          color: "#0D0D0D",
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
