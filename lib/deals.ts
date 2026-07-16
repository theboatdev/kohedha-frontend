// Deals API utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export type DealType = "regular" | "mmr-rally-special";

export type DealCategory =
  | "food-beverage"
  | "entertainment"
  | "accommodation"
  | "wellness-spa"
  | "shopping"
  | "travel-adventure"
  | "dining-experience"
  | "events"
  | "other";

export type DealStatus =
  | "active"
  | "expired"
  | "coming-soon"
  | "paused"
  | "sold-out";

export interface DealImage {
  url: string;
  alt?: string;
  caption?: string;
  uploadedAt: string;
}

export interface MainImage {
  url: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
}

export interface Deal {
  _id: string;
  vendorId: string;
  dealName: string;
  description: string;
  category: DealCategory;
  notes?: string;
  mainImage: MainImage;
  images?: DealImage[];
  socialLinks?: SocialLinks;
  contactInfo?: ContactInfo;
  status: DealStatus;
  priority: number;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  startDate?: string;
  endDate?: string;
  dealType: DealType;
  question?: string;
  rallyLocation?: 1 | 2 | 3;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealData {
  dealName: string;
  description: string;
  category: DealCategory;
  notes?: string;
  imageFile?: File;
  images?: DealImage[];
  socialLinks?: SocialLinks;
  contactInfo?: ContactInfo;
  status?: DealStatus;
  priority?: number;
  tags?: string[];
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  dealType?: DealType;
  question?: string;
  rallyLocation?: 1 | 2 | 3;
}

export interface UpdateDealData {
  dealName?: string;
  description?: string;
  category?: DealCategory;
  notes?: string;
  imageFile?: File;
  removeImage?: boolean;
  images?: DealImage[];
  socialLinks?: SocialLinks;
  contactInfo?: ContactInfo;
  status?: DealStatus;
  priority?: number;
  tags?: string[];
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  dealType?: DealType;
  question?: string;
  rallyLocation?: 1 | 2 | 3;
}

export interface DealActionResponse {
  success: boolean;
  message?: string;
  data?: Deal;
}

export interface DealsListResponse {
  success: boolean;
  data: Deal[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DealDetailResponse {
  success: boolean;
  data: Deal;
}

// Helper function to get auth headers
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

// Returns auth headers WITHOUT Content-Type (for multipart/form-data)
function getAuthHeadersMultipart(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Build FormData for deal create/update payloads
function buildDealFormData(data: CreateDealData | UpdateDealData): FormData {
  const fd = new FormData();
  const appendIfDefined = (key: string, val: unknown) => {
    if (val !== undefined && val !== null) {
      fd.append(key, String(val));
    }
  };

  appendIfDefined("dealName", (data as any).dealName);
  appendIfDefined("description", (data as any).description);
  appendIfDefined("category", (data as any).category);
  appendIfDefined("notes", (data as any).notes);
  appendIfDefined("status", (data as any).status);
  appendIfDefined("priority", (data as any).priority);
  appendIfDefined("isPublished", (data as any).isPublished);
  appendIfDefined("removeImage", (data as UpdateDealData).removeImage);
  appendIfDefined("startDate", (data as any).startDate);
  appendIfDefined("endDate", (data as any).endDate);
  appendIfDefined("dealType", (data as any).dealType);
  appendIfDefined("question", (data as any).question);
  // Always send as a plain string — multer/multipart can drop non-string values
  if (
    (data as any).rallyLocation !== undefined &&
    (data as any).rallyLocation !== null &&
    (data as any).rallyLocation !== ""
  ) {
    fd.append("rallyLocation", String(Number((data as any).rallyLocation)));
  }

  if ((data as any).tags) {
    fd.append("tags", JSON.stringify((data as any).tags));
  }

  // Append image file if provided
  if ((data as any).imageFile) {
    fd.append("image", (data as any).imageFile as File);
  }

  return fd;
}

// Create a new deal
export async function createDeal(
  data: CreateDealData,
): Promise<DealActionResponse> {
  try {
    const fd = buildDealFormData(data);
    const res = await fetch(`${API_URL}/vendor/deals/new`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeadersMultipart(),
      body: fd,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create deal");
    }

    return result;
  } catch (error) {
    console.error("Create deal error:", error);
    throw error;
  }
}

// Get all deals for the vendor with filters
export async function getVendorDeals(filters?: {
  status?: DealStatus;
  category?: DealCategory;
  isPublished?: boolean;
  sortBy?: "newest" | "oldest" | "rating" | "priority" | "popular";
  page?: number;
  limit?: number;
}): Promise<DealsListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.isPublished !== undefined)
      queryParams.append("isPublished", String(filters.isPublished));
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_URL}/vendor/deals?${queryString}`
      : `${API_URL}/vendor/deals`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch deals");
    }

    return result;
  } catch (error) {
    console.error("Get vendor deals error:", error);
    throw error;
  }
}

// Get single deal by ID
export async function getDealById(id: string): Promise<DealDetailResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/deals/${id}`, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch deal");
    }

    return result;
  } catch (error) {
    console.error("Get deal by ID error:", error);
    throw error;
  }
}

// Update a deal
export async function updateDeal(
  id: string,
  data: UpdateDealData,
): Promise<DealActionResponse> {
  try {
    const fd = buildDealFormData(data);
    const res = await fetch(`${API_URL}/vendor/deals/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: getAuthHeadersMultipart(),
      body: fd,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update deal");
    }

    return result;
  } catch (error) {
    console.error("Update deal error:", error);
    throw error;
  }
}

// Delete a deal
export async function deleteDeal(id: string): Promise<DealActionResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/deals/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete deal");
    }

    return result;
  } catch (error) {
    console.error("Delete deal error:", error);
    throw error;
  }
}

// Get deals by category
export async function getDealsByCategory(
  category: DealCategory,
  filters?: {
    sortBy?: "newest" | "rating" | "priority";
    page?: number;
    limit?: number;
  },
): Promise<DealsListResponse> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("category", category);

    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));

    const queryString = queryParams.toString();
    const url = `${API_URL}/vendor/deals/category/${category}?${queryString}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch deals by category");
    }

    return result;
  } catch (error) {
    console.error("Get deals by category error:", error);
    throw error;
  }
}
