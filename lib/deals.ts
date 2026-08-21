// Deals API utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

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

export type DealType = "ambient" | "voucher" | "limited-quantity" | "loyalty";

export interface ActiveWindow {
  daysOfWeek: number[]; // 0=Sun … 6=Sat
  startTime?: string;   // "HH:mm"
  endTime?: string;     // "HH:mm"
}

export interface VoucherConfig {
  claimExpiryMinutes?: number;
  rewardLabel?: string;
}

export interface LimitedQuantityConfig {
  totalQuantity?: number;
  remainingQuantity?: number;
  claimExpiryMinutes?: number;
  rewardLabel?: string;
}

export interface LoyaltyConfig {
  stampsRequired?: number;
  claimExpiryMinutes?: number;
  rewardLabel?: string;
}

export type ClaimStatus = "claimed" | "redeemed" | "expired" | "cancelled";

export interface DealClaim {
  _id: string;
  dealId: string | { _id: string; dealName: string; description: string };
  vendorId: string;
  userId: string;
  code: string;
  status: ClaimStatus;
  claimedAt: string;
  expiresAt: string;
  redeemedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RedeemVoucherResponse {
  success: boolean;
  message?: string;
  data?: DealClaim;
}

export interface DealClaimsListResponse {
  success: boolean;
  data: DealClaim[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DealLoyaltyCard {
  _id: string;
  dealId: string | { _id: string; dealName: string; description?: string };
  vendorId: string;
  userId: string;
  code: string;
  stampCount: number;
  totalStampsEarned: number;
  rewardsIssuedCount: number;
  lastStampAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecordLoyaltyStampResponse {
  success: boolean;
  message?: string;
  data?: {
    card: DealLoyaltyCard;
    stampsRequired: number;
    rewardClaim: DealClaim | null;
  };
}

export interface DealLoyaltyCardsListResponse {
  success: boolean;
  data: DealLoyaltyCard[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

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
  activeWindow?: ActiveWindow;
  voucherConfig?: VoucherConfig;
  limitedQuantityConfig?: LimitedQuantityConfig;
  loyaltyConfig?: LoyaltyConfig;
  isActiveNow?: boolean | null;
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
  activeWindow?: ActiveWindow;
  voucherConfig?: VoucherConfig;
  limitedQuantityConfig?: LimitedQuantityConfig;
  loyaltyConfig?: LoyaltyConfig;
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
  activeWindow?: ActiveWindow;
  voucherConfig?: VoucherConfig;
  limitedQuantityConfig?: LimitedQuantityConfig;
  loyaltyConfig?: LoyaltyConfig;
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

  if ((data as any).tags) {
    fd.append("tags", JSON.stringify((data as any).tags));
  }

  if ((data as any).activeWindow) {
    fd.append("activeWindow", JSON.stringify((data as any).activeWindow));
  }

  if ((data as any).voucherConfig) {
    fd.append("voucherConfig", JSON.stringify((data as any).voucherConfig));
  }

  if ((data as any).limitedQuantityConfig) {
    fd.append(
      "limitedQuantityConfig",
      JSON.stringify((data as any).limitedQuantityConfig),
    );
  }

  if ((data as any).loyaltyConfig) {
    fd.append("loyaltyConfig", JSON.stringify((data as any).loyaltyConfig));
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

// Redeem a voucher code (staff-side). Server flips the claim to "redeemed".
export async function redeemVoucherCode(
  code: string,
): Promise<RedeemVoucherResponse> {
  const res = await fetch(`${API_URL}/vendor/deals/redeem`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });

  const result = await res.json();

  if (!res.ok) {
    const error = new Error(result.message || "Failed to redeem voucher") as Error & {
      data?: DealClaim;
    };
    error.data = result.data;
    throw error;
  }

  return result;
}

// Adds a stamp to a customer's loyalty card by its code (staff-side). If this
// stamp crosses the deal's stampsRequired threshold, the server mints a
// single-use reward token (returned as rewardClaim) that behaves exactly
// like a voucher — redeem it via redeemVoucherCode.
export async function recordLoyaltyStamp(
  code: string,
): Promise<RecordLoyaltyStampResponse> {
  const res = await fetch(`${API_URL}/vendor/deals/loyalty/stamp`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to record loyalty stamp");
  }

  return result;
}

// Get loyalty cards for a deal (vendor-owned) — auditing/analytics
export async function getDealLoyaltyCards(
  dealId: string,
  filters?: { page?: number; limit?: number },
): Promise<DealLoyaltyCardsListResponse> {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.append("page", String(filters.page));
  if (filters?.limit) queryParams.append("limit", String(filters.limit));

  const queryString = queryParams.toString();
  const url = queryString
    ? `${API_URL}/vendor/deals/${dealId}/loyalty-cards?${queryString}`
    : `${API_URL}/vendor/deals/${dealId}/loyalty-cards`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch loyalty cards");
  }

  return result;
}

// Get voucher claims for a deal (vendor-owned)
export async function getDealClaims(
  dealId: string,
  filters?: { status?: ClaimStatus; page?: number; limit?: number },
): Promise<DealClaimsListResponse> {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append("status", filters.status);
  if (filters?.page) queryParams.append("page", String(filters.page));
  if (filters?.limit) queryParams.append("limit", String(filters.limit));

  const queryString = queryParams.toString();
  const url = queryString
    ? `${API_URL}/vendor/deals/${dealId}/claims?${queryString}`
    : `${API_URL}/vendor/deals/${dealId}/claims`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch deal claims");
  }

  return result;
}
