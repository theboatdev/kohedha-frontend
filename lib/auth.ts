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
export async function completeRegistrationStep(
  stepData: {
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
  },
  mainImageFile?: File,
): Promise<{
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let body: BodyInit;
    if (mainImageFile) {
      // Multipart request — used when an optional venue photo is attached.
      // Do NOT set Content-Type; the browser sets the multipart boundary.
      const formData = new FormData();
      formData.append("currentStep", String(stepData.currentStep));
      if (stepData.companyName !== undefined) {
        formData.append("companyName", stepData.companyName);
      }
      if (stepData.businessRegistrationNo !== undefined) {
        formData.append(
          "businessRegistrationNo",
          stepData.businessRegistrationNo,
        );
      }
      if (stepData.vendorMobile !== undefined) {
        formData.append("vendorMobile", stepData.vendorMobile);
      }
      if (stepData.businessCategory !== undefined) {
        formData.append("businessCategory", stepData.businessCategory);
      }
      if (stepData.location !== undefined) {
        formData.append("location", JSON.stringify(stepData.location));
      }
      if (stepData.website !== undefined) {
        formData.append("website", stepData.website);
      }
      if (stepData.description !== undefined) {
        formData.append("description", stepData.description);
      }
      formData.append("mainImage", mainImageFile);
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(stepData);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/profile/complete`,
      {
        method: "PUT",
        credentials: "include",
        headers,
        body,
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

// Check whether the current session is an admin impersonating this vendor.
// Used to show the "you're being viewed by an admin" banner. Uses
// `authenticate` (not `protect`) server-side, so it also works mid
// registration.
export async function getImpersonationStatus(): Promise<{
  isImpersonating: boolean;
  adminEmail?: string;
  adminName?: string;
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
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/impersonation-status`,
      {
        method: "GET",
        credentials: "include",
        headers,
      },
    );

    if (!res.ok) return { isImpersonating: false };

    const data = await res.json().catch(() => ({}));

    return {
      isImpersonating: Boolean(data.isImpersonating),
      adminEmail: data.adminEmail,
      adminName: data.adminName,
    };
  } catch (error) {
    console.error("Impersonation status check error:", error);
    return { isImpersonating: false };
  }
}

// Ends the current impersonation session (called from the vendor side,
// e.g. from the impersonation banner's "End Session" button).
export async function endImpersonationSession(): Promise<{
  success: boolean;
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
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/impersonate/end`,
      {
        method: "POST",
        credentials: "include",
        headers,
      },
    );

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: data.message || "Failed to end impersonation session",
    };
  } catch (error) {
    console.error("End impersonation error:", error);
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
