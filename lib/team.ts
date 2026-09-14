const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type StaffRole = "manager" | "staff" | "floor" | "marketing";

export const STAFF_ROLES: { value: StaffRole; label: string }[] = [
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
  { value: "floor", label: "Floor" },
  { value: "marketing", label: "Marketing" },
];

export interface VendorStaff {
  _id: string;
  vendorId?: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
}

export interface UpdateTeamMemberData {
  name?: string;
  role?: StaffRole;
  isActive?: boolean;
}

type TeamActionResponse<T = VendorStaff> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function normalizeStaff(raw: Record<string, unknown>): VendorStaff {
  const rawId = raw._id ?? raw.id;
  const id =
    typeof rawId === "string" ? rawId : rawId != null ? String(rawId) : "";

  return {
    _id: id,
    vendorId: typeof raw.vendorId === "string" ? raw.vendorId : undefined,
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    role: (raw.role as StaffRole) || "staff",
    isActive: raw.isActive !== false,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  };
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

export async function getTeam(): Promise<TeamActionResponse<VendorStaff[]>> {
  try {
    const res = await fetch(`${API_URL}/vendor/team`, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const result = await parseJson(res);

    if (!res.ok) {
      return {
        success: false,
        error:
          (typeof result.message === "string" && result.message) ||
          "Failed to load team members",
      };
    }

    const nested =
      result.data && typeof result.data === "object" && !Array.isArray(result.data)
        ? (result.data as Record<string, unknown>)
        : null;
    const list = Array.isArray(result.data)
      ? result.data
      : Array.isArray(nested?.staff)
        ? nested.staff
        : Array.isArray(nested?.members)
          ? nested.members
          : [];

    return {
      success: true,
      data: list.map((item) =>
        normalizeStaff((item || {}) as Record<string, unknown>),
      ),
    };
  } catch (error) {
    console.error("Get team error:", error);
    return {
      success: false,
      error: "Unable to load team members. Please check your connection.",
    };
  }
}

export async function createTeamMember(
  payload: CreateTeamMemberData,
): Promise<TeamActionResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/team`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await parseJson(res);

    if (!res.ok) {
      return {
        success: false,
        error:
          (typeof result.message === "string" && result.message) ||
          "Failed to create team member",
      };
    }

    return {
      success: true,
      message: typeof result.message === "string" ? result.message : undefined,
      data: result.data
        ? normalizeStaff(result.data as Record<string, unknown>)
        : undefined,
    };
  } catch (error) {
    console.error("Create team member error:", error);
    return {
      success: false,
      error: "Unable to create team member. Please check your connection.",
    };
  }
}

export async function updateTeamMember(
  id: string,
  payload: UpdateTeamMemberData,
): Promise<TeamActionResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/team/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await parseJson(res);

    if (!res.ok) {
      return {
        success: false,
        error:
          (typeof result.message === "string" && result.message) ||
          "Failed to update team member",
      };
    }

    return {
      success: true,
      message: typeof result.message === "string" ? result.message : undefined,
      data: result.data
        ? normalizeStaff(result.data as Record<string, unknown>)
        : undefined,
    };
  } catch (error) {
    console.error("Update team member error:", error);
    return {
      success: false,
      error: "Unable to update team member. Please check your connection.",
    };
  }
}

export async function resetTeamMemberPassword(
  id: string,
  password: string,
): Promise<TeamActionResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/team/${id}/password`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    });

    const result = await parseJson(res);

    if (!res.ok) {
      return {
        success: false,
        error:
          (typeof result.message === "string" && result.message) ||
          "Failed to reset password",
      };
    }

    return {
      success: true,
      message: typeof result.message === "string" ? result.message : undefined,
      data: result.data
        ? normalizeStaff(result.data as Record<string, unknown>)
        : undefined,
    };
  } catch (error) {
    console.error("Reset team password error:", error);
    return {
      success: false,
      error: "Unable to reset password. Please check your connection.",
    };
  }
}
