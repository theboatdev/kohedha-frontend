// Events API utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export type EventCategory =
  | "live-music"
  | "special-dinner"
  | "promotion"
  | "theme-night"
  | "workshop"
  | "other";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface EventImage {
  url: string;
  uploadedAt?: string;
}

export interface ContactPerson {
  name?: string;
  phone?: string;
  email?: string;
}

export interface Event {
  _id: string;
  vendorId: string;
  eventName: string;
  description: string;
  category: EventCategory;
  eventDate: string;
  eventEndDate?: string;
  eventTime: string;
  maxCapacity: number;
  location: string;
  ticketPrice: number;
  images: EventImage[];
  isFree: boolean;
  isPublished: boolean;
  status: EventStatus;
  tags: string[];
  contactPerson: ContactPerson;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  eventName: string;
  description: string;
  category?: EventCategory;
  eventDate: string;
  eventEndDate?: string;
  eventTime: string;
  maxCapacity: number;
  location: string;
  ticketPrice?: number;
  imageFile?: File;
  isFree?: boolean;
  isPublished?: boolean;
  tags?: string[];
  contactPerson?: ContactPerson;
}

export interface UpdateEventData {
  eventName?: string;
  description?: string;
  category?: EventCategory;
  eventDate?: string;
  eventEndDate?: string;
  eventTime?: string;
  maxCapacity?: number;
  location?: string;
  ticketPrice?: number;
  imageFile?: File;
  existingImages?: EventImage[];
  isFree?: boolean;
  isPublished?: boolean;
  status?: EventStatus;
  tags?: string[];
  contactPerson?: ContactPerson;
}

export interface EventActionResponse {
  success: boolean;
  message?: string;
  data?: Event;
}

export interface EventsListResponse {
  success: boolean;
  data: Event[];
}

export interface EventDetailResponse {
  success: boolean;
  data: Event;
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

// Build FormData for event create/update payloads
function buildEventFormData(data: CreateEventData | UpdateEventData): FormData {
  const fd = new FormData();
  const appendIfDefined = (key: string, val: unknown) => {
    if (val !== undefined && val !== null) {
      fd.append(key, String(val));
    }
  };

  appendIfDefined("eventName", (data as any).eventName);
  appendIfDefined("description", (data as any).description);
  appendIfDefined("category", (data as any).category);
  appendIfDefined("eventDate", (data as any).eventDate);
  appendIfDefined("eventEndDate", (data as any).eventEndDate);
  appendIfDefined("eventTime", (data as any).eventTime);
  appendIfDefined("maxCapacity", (data as any).maxCapacity);
  appendIfDefined("location", (data as any).location);
  appendIfDefined("ticketPrice", (data as any).ticketPrice);
  appendIfDefined("isFree", (data as any).isFree);
  appendIfDefined("isPublished", (data as any).isPublished);
  appendIfDefined("status", (data as any).status);

  if ((data as any).tags) {
    fd.append("tags", JSON.stringify((data as any).tags));
  }
  if ((data as any).contactPerson) {
    fd.append("contactPerson", JSON.stringify((data as any).contactPerson));
  }
  if ((data as UpdateEventData).existingImages !== undefined) {
    fd.append(
      "existingImages",
      JSON.stringify((data as UpdateEventData).existingImages),
    );
  }

  // Append new image file (single)
  if ((data as any).imageFile) {
    fd.append("images", (data as any).imageFile as File);
  }

  return fd;
}

// Create a new event
export async function createEvent(
  data: CreateEventData,
): Promise<EventActionResponse> {
  try {
    const fd = buildEventFormData(data);
    const res = await fetch(`${API_URL}/vendor/events/new`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeadersMultipart(),
      body: fd,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create event");
    }

    return result;
  } catch (error) {
    console.error("Create event error:", error);
    throw error;
  }
}

// Get all events for the vendor
export async function getVendorEvents(
  status?: EventStatus,
  isPublished?: boolean,
  sortBy?: "newest" | "oldest" | "featured",
): Promise<EventsListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (status) queryParams.append("status", status);
    if (isPublished !== undefined)
      queryParams.append("isPublished", String(isPublished));
    if (sortBy) queryParams.append("sortBy", sortBy);

    const queryString = queryParams.toString();
    const url = `${API_URL}/vendor/events${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Get vendor events error:", error);
    throw error;
  }
}

// Get a single event by ID
export async function getEventById(id: string): Promise<EventDetailResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/events/${id}`, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch event");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Get event by ID error:", error);
    throw error;
  }
}

// Update an existing event
export async function updateEvent(
  id: string,
  data: UpdateEventData,
): Promise<EventActionResponse> {
  try {
    const fd = buildEventFormData(data);
    const res = await fetch(`${API_URL}/vendor/events/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: getAuthHeadersMultipart(),
      body: fd,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update event");
    }

    return result;
  } catch (error) {
    console.error("Update event error:", error);
    throw error;
  }
}

// Delete an event
export async function deleteEvent(id: string): Promise<EventActionResponse> {
  try {
    const res = await fetch(`${API_URL}/vendor/events/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete event");
    }

    return result;
  } catch (error) {
    console.error("Delete event error:", error);
    throw error;
  }
}

// Get events by specific criteria
export async function getEventsByFilters(filters: {
  status?: EventStatus;
  isPublished?: boolean;
  category?: EventCategory;
  sortBy?: "newest" | "oldest" | "featured";
}): Promise<EventsListResponse> {
  return getVendorEvents(filters.status, filters.isPublished, filters.sortBy);
}
