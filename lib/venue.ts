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

export type VenueDetailsData = {
  companyName: string;
  email: string;
  businessRegistrationNo?: string;
  vendorMobile: string;
  businessCategory: string;
  website?: string;
  description?: string;
  location: LocationData;
};

export type VenueDetailsResponse = {
  success: boolean;
  data?: VenueDetailsData;
  message?: string;
};

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
