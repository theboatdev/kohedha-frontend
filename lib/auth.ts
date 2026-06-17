// Register vendor (Step 1)
export async function registerVendor(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Store the token from response
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        data: data.data,
      };
    }

    return {
      success: false,
      error:
        data.message ||
        "Registration failed. Please check your details and try again.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error:
        "Unable to reach registration service. Please check your connection and try again.",
    };
  }
}

// Login vendor
export async function loginVendor(
  email: string,
  password: string,
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Store the token from response
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      return {
        success: true,
        data: data.data,
      };
    }

    return {
      success: false,
      error: data.message || "Login failed. Please try again.",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error:
        "Unable to reach login service. Please check your connection and try again.",
    };
  }
}

export async function signOutVendor(): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/logout`,
      {
        method: "POST",
        credentials: "include",
        headers,
      },
    );

    if (!res.ok) {
      console.error("Logout request failed:", res.status);
    }
  } catch (error) {
    console.error("Sign out error:", error);
  } finally {
    // Always clear the token from localStorage
    localStorage.removeItem("auth_token");
  }
}

export async function checkVendorAuth(): Promise<boolean> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/me`, {
      method: "GET",
      credentials: "include",
      headers,
    });

    return res.ok;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}

// Complete registration step (Step 2 or Step 3)
export async function completeRegistrationStep(stepData: {
  currentStep: number;
  companyName?: string;
  businessRegistrationNo?: string;
  vendorMobile?: string;
  businessCategory?: string;
  location?: {
    businessName?: string;
    streetAddress?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    country?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  website?: string;
  description?: string;
}): Promise<{
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/profile/complete`,
      {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(stepData),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to complete registration step",
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Registration step error:", error);
    return {
      success: false,
      error: "Unable to reach server. Please check your connection.",
    };
  }
}

// Get current vendor profile
export async function getCurrentVendor(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/profile`,
      {
        method: "GET",
        credentials: "include",
        headers,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      success: false,
      error: "Unable to reach server",
    };
  }
}
