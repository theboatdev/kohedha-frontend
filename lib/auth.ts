export const VENDOR_PERMISSIONS = [
  "dashboard",
  "venue",
  "menu",
  "events",
  "deals",
  "redeem",
  "reservations",
] as const;

export type VendorPermission = (typeof VENDOR_PERMISSIONS)[number];

export type VendorRole = "owner" | "manager" | "staff" | "floor" | "marketing";

export type VendorSessionType = "owner" | "staff";

export type VendorSession = {
  type: VendorSessionType;
  role: VendorRole;
  permissions: VendorPermission[];
  staffId?: string;
  name: string;
  email: string;
};

export type VendorAuthData = {
  _id?: string;
  email?: string;
  name?: string;
  companyName?: string;
  registrationStep?: number;
  role?: VendorRole | string;
  staffId?: string;
  session?: VendorSession | Record<string, unknown>;
  [key: string]: unknown;
};

const OWNER_PERMISSIONS: VendorPermission[] = [
  "dashboard",
  "venue",
  "menu",
  "events",
  "deals",
  "redeem",
  "reservations",
];

const ROLE_PERMISSIONS: Record<VendorRole, VendorPermission[]> = {
  owner: OWNER_PERMISSIONS,
  manager: [
    "dashboard",
    "venue",
    "menu",
    "events",
    "deals",
    "redeem",
    "reservations",
  ],
  staff: ["dashboard", "menu", "events", "deals", "redeem"],
  floor: ["redeem"],
  marketing: ["events", "deals", "redeem"],
};

const VENDOR_ROLES: VendorRole[] = [
  "owner",
  "manager",
  "staff",
  "floor",
  "marketing",
];

export function isVendorRole(value: unknown): value is VendorRole {
  return (
    typeof value === "string" && VENDOR_ROLES.includes(value as VendorRole)
  );
}

export function permissionsForRole(role: VendorRole): VendorPermission[] {
  return [...ROLE_PERMISSIONS[role]];
}

export function normalizePermissions(raw: unknown): VendorPermission[] {
  if (Array.isArray(raw)) {
    return raw.filter((key): key is VendorPermission =>
      VENDOR_PERMISSIONS.includes(key as VendorPermission),
    );
  }

  if (raw && typeof raw === "object") {
    return VENDOR_PERMISSIONS.filter(
      (key) => Boolean((raw as Record<string, unknown>)[key]),
    );
  }

  return [];
}

export function hasVendorPermission(
  permissions: VendorPermission[] | undefined,
  key: VendorPermission,
): boolean {
  return Boolean(permissions?.includes(key));
}

export function getVendorLandingPath(role?: string | null): string {
  if (role === "marketing" || role === "floor") {
    return "/vendors/deals";
  }
  return "/vendors/dashboard";
}

export function parseVendorSession(
  data?: VendorAuthData | null,
): VendorSession | null {
  if (!data) return null;

  const rawSession =
    data.session && typeof data.session === "object"
      ? (data.session as Record<string, unknown>)
      : null;

  const roleValue = rawSession?.role ?? data.role;
  const role: VendorRole = isVendorRole(roleValue) ? roleValue : "owner";
  const type: VendorSessionType =
    rawSession?.type === "staff" || role !== "owner" ? "staff" : "owner";

  const permissionsFromSession = normalizePermissions(rawSession?.permissions);
  const permissions =
    permissionsFromSession.length > 0
      ? permissionsFromSession
      : permissionsForRole(role);

  const staffId =
    (typeof rawSession?.staffId === "string" && rawSession.staffId) ||
    (typeof data.staffId === "string" && data.staffId) ||
    undefined;

  const name =
    (typeof rawSession?.name === "string" && rawSession.name) ||
    (typeof data.name === "string" && data.name) ||
    (typeof data.companyName === "string" && data.companyName) ||
    "";

  const email =
    (typeof rawSession?.email === "string" && rawSession.email) ||
    (typeof data.email === "string" && data.email) ||
    "";

  if (!rawSession && !data.role && type === "owner") {
    return {
      type: "owner",
      role: "owner",
      permissions: permissionsForRole("owner"),
      name,
      email,
    };
  }

  return {
    type,
    role,
    permissions,
    ...(staffId ? { staffId } : {}),
    name,
    email,
  };
}

export function resolveVendorPostLoginPath(
  data?: VendorAuthData | null,
): string {
  const session = parseVendorSession(data);
  const role = session?.role || (isVendorRole(data?.role) ? data?.role : "owner");

  if (role === "owner") {
    const step = data?.registrationStep ?? 3;
    if (step === 1) return "/vendors/register/step-2";
    if (step === 2) return "/vendors/register/step-3";
  }

  return getVendorLandingPath(role);
}

const PATH_PERMISSIONS: { prefix: string; anyOf?: VendorPermission[]; ownerOnly?: boolean }[] = [
  { prefix: "/vendors/team", ownerOnly: true },
  { prefix: "/vendors/dashboard", anyOf: ["dashboard"] },
  { prefix: "/vendors/venue-details", anyOf: ["venue"] },
  { prefix: "/vendors/menu", anyOf: ["menu"] },
  { prefix: "/vendors/events", anyOf: ["events"] },
  { prefix: "/vendors/deals", anyOf: ["deals", "redeem"] },
  { prefix: "/vendors/reservations", anyOf: ["reservations"] },
  { prefix: "/vendors/tables", anyOf: ["reservations"] },
  { prefix: "/vendors/reservation-portal", anyOf: ["reservations"] },
];

export function isVendorPathAllowed(
  pathname: string | null | undefined,
  session: Pick<VendorSession, "role" | "permissions"> | null,
): boolean {
  if (!pathname || !session) return true;

  const match = PATH_PERMISSIONS.find(
    (entry) =>
      pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`),
  );
  if (!match) return true;

  if (match.ownerOnly) {
    return session.role === "owner";
  }

  if (!match.anyOf || match.anyOf.length === 0) return true;

  return match.anyOf.some((key) =>
    hasVendorPermission(session.permissions, key),
  );
}

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
  data?: VendorAuthData;
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
  data?: VendorAuthData;
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
