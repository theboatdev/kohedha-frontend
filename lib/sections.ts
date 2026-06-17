export type SectionType = "indoor" | "outdoor" | "vip" | "rooftop" | "other";

export type Section = {
  _id: string;
  vendorId: string;
  sectionName: string;
  sectionType: SectionType;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateSectionData = {
  sectionName: string;
  sectionType?: SectionType;
  description?: string;
};

export type UpdateSectionData = {
  sectionName?: string;
  sectionType?: SectionType;
  description?: string;
  isActive?: boolean;
};

export type SectionsResponse = {
  success: boolean;
  count: number;
  data: Section[];
};

export type SingleSectionResponse = {
  success: boolean;
  data: Section;
};

export type SectionActionResponse = {
  success: boolean;
  message: string;
  data?: Section;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// Get all sections for the vendor
export async function getSections(
  isActive?: boolean,
): Promise<SectionsResponse> {
  const queryParams = isActive !== undefined ? `?isActive=${isActive}` : "";
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/sections${queryParams}`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sections");
  }

  return res.json();
}

// Get a single section by ID
export async function getSectionById(
  id: string,
): Promise<SingleSectionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/sections/${id}`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch section");
  }

  return res.json();
}

// Create a new section
export async function createSection(
  data: CreateSectionData,
): Promise<SectionActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/sections/new-section`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create section");
  }

  return result;
}

// Update an existing section
export async function updateSection(
  id: string,
  data: UpdateSectionData,
): Promise<SectionActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/sections/update-section/${id}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update section");
  }

  return result;
}

// Delete a section
export async function deleteSection(
  id: string,
): Promise<SectionActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/sections/delete-section/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete section");
  }

  return result;
}
