// Venue API utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type LocationData = {
  /** Legacy string fields that the backend derives from coordinates */
  latitude?: string;
  longitude?: string;
  /** Full address fields stored alongside coordinates */
  businessName?: string;
  streetAddress?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
};

export type VenueImage = {
  _id: string;
  url: string;
  caption?: string;
  uploadedAt?: string;
};

export type VenueDetailsData = {
  companyName: string;
  email: string;
  businessRegistrationNo?: string;
  vendorMobile: string;
  businessCategory: string;
  website?: string;
  description?: string;
  location: LocationData;
  mainImage?: { url: string };
  images?: VenueImage[];
};

export type VenueDetailsResponse = {
  success: boolean;
  data?: VenueDetailsData;
  message?: string;
};

// Returns auth headers WITHOUT Content-Type (for multipart/form-data requests,
// so the browser can set the multipart boundary itself).
function getAuthHeadersMultipart(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Get venue details
export async function getVenueDetails(): Promise<VenueDetailsResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/vendor/venue-details`, {
      method: "GET",
      credentials: "include",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to load venue details",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Get venue details error:", error);
    return {
      success: false,
      message: "Unable to load venue details. Please check your connection.",
    };
  }
}

// Update venue details
export async function updateVenueDetails(
  data: Partial<VenueDetailsData>,
): Promise<VenueDetailsResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/vendor/venue-details`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update venue details",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Venue details updated successfully!",
    };
  } catch (error) {
    console.error("Update venue details error:", error);
    return {
      success: false,
      message: "Unable to update venue details. Please try again.",
    };
  }
}

export type VenueMainImageResponse = {
  success: boolean;
  data?: { mainImage: { url: string } };
  message?: string;
};

// Replace the venue's main image
export async function updateVenueMainImage(
  file: File,
): Promise<VenueMainImageResponse> {
  try {
    const formData = new FormData();
    formData.append("mainImage", file);

    const response = await fetch(`${API_URL}/vendor/venue-images/main`, {
      method: "PUT",
      credentials: "include",
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update main image",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Main image updated successfully!",
    };
  } catch (error) {
    console.error("Update venue main image error:", error);
    return {
      success: false,
      message: "Unable to update main image. Please try again.",
    };
  }
}

export type VenueImagesResponse = {
  success: boolean;
  data?: { images: VenueImage[] };
  message?: string;
};

// Add one or more gallery images (max 10 files per call)
export async function addVenueImages(
  files: File[],
): Promise<VenueImagesResponse> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await fetch(`${API_URL}/vendor/venue-images`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to add venue images",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Photos added successfully!",
    };
  } catch (error) {
    console.error("Add venue images error:", error);
    return {
      success: false,
      message: "Unable to add venue images. Please try again.",
    };
  }
}

// Delete a single gallery image by id
export async function deleteVenueImage(
  imageId: string,
): Promise<VenueImagesResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/vendor/venue-images/${imageId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete venue image",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Photo removed successfully!",
    };
  } catch (error) {
    console.error("Delete venue image error:", error);
    return {
      success: false,
      message: "Unable to delete venue image. Please try again.",
    };
  }
}
