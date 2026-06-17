export type BookingSlot = {
  _id: string;
  vendorId: string;
  slotName?: string;
  slotType: string;
  date: string;
  startTime: string;
  endTime: string;
  sectionId: {
    _id: string;
    sectionName: string;
    sectionType: string;
  };
  publicToken?: string;
  publicLink?: string;
  isActive: boolean;
  totalBookings: number;
  maxBookings?: number;
  availableTables?: number;
  isRecurring?: boolean;
  recurrenceGroupId?: string;
  recurrenceRule?: RecurrenceRule;
  dateRange?: { start: string; end: string | null };
  excludedDates?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingSlotData = {
  slotName?: string;
  slotType: string;
  date: string;
  startTime: string;
  endTime: string;
  sectionId: string;
  description?: string;
  maxBookings?: number;
};

export type UpdateBookingSlotData = {
  slotName?: string;
  slotType?: string;
  date?: string;
  dateRange?: { start?: string; end?: string | null };
  recurrenceRule?: RecurrenceRule;
  startTime?: string;
  endTime?: string;
  sectionId?: string;
  description?: string;
  maxBookings?: number;
  isActive?: boolean;
};

export type BookingSlotsResponse = {
  success: boolean;
  count: number;
  data: BookingSlot[];
};

export type SingleBookingSlotResponse = {
  success: boolean;
  data: BookingSlot;
};

export type BookingSlotActionResponse = {
  success: boolean;
  message: string;
  data?: {
    bookingSlot: BookingSlot;
    publicLink?: string;
    publicToken?: string;
  };
};

// Recurrence types
export type RecurrenceType = "weekly" | "monthly_date" | "monthly_day";

export type RecurrenceRule =
  | {
      type: "weekly";
      days: number[]; // 0-6 (Sunday-Saturday)
    }
  | {
      type: "monthly_date";
      monthDay: number; // 1-31
    }
  | {
      type: "monthly_day";
      week: number; // e.g., 1 for first, 2 for second, etc.
      day: number; // 0-6
    };

export type CreateRecurringBookingSlotData = {
  slotName?: string;
  slotType: string;
  startTime: string;
  endTime: string;
  sectionId: string;
  description?: string;
  maxBookings?: number;
  recurrence: RecurrenceRule;
  rangeStart: string; // YYYY-MM-DD
  rangeEnd: string; // YYYY-MM-DD
};

export type RecurringBookingSlotsResponse = {
  success: boolean;
  message: string;
  data?: {
    recurrenceGroupId: string;
    recurrenceRule: RecurrenceRule;
    range: {
      start: string;
      end: string;
    };
    count: number;
    slots: Array<{
      _id: string;
      date: string;
      publicToken: string;
      publicLink: string;
    }>;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// Get all booking slots for the vendor
export async function getBookingSlots(filters?: {
  isActive?: boolean;
  date?: string;
  sectionId?: string;
}): Promise<BookingSlotsResponse> {
  const queryParams = new URLSearchParams();
  if (filters?.isActive !== undefined) {
    queryParams.append("isActive", filters.isActive.toString());
  }
  if (filters?.date) {
    queryParams.append("date", filters.date);
  }
  if (filters?.sectionId) {
    queryParams.append("sectionId", filters.sectionId);
  }

  const queryString = queryParams.toString();
  const url = `${API_URL}/vendor/booking-slot${queryString ? `?${queryString}` : ""}`;

  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch booking slots");
  }

  return res.json();
}

// Get a single booking slot by ID
export async function getBookingSlotById(
  id: string,
): Promise<SingleBookingSlotResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/booking-slot/${id}`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch booking slot");
  }

  return res.json();
}

// Create a new booking slot
export async function createBookingSlot(
  data: CreateBookingSlotData,
): Promise<BookingSlotActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/booking-slot/create`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create booking slot");
  }

  return result;
}

// Update an existing booking slot
export async function updateBookingSlot(
  id: string,
  data: UpdateBookingSlotData,
): Promise<BookingSlotActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/booking-slot/${id}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update booking slot");
  }

  return result;
}

// Toggle booking slot status
export async function toggleBookingSlotStatus(
  id: string,
): Promise<BookingSlotActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/booking-slot/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to toggle booking slot status");
  }

  return result;
}

// Delete a booking slot
export async function deleteBookingSlot(
  id: string,
): Promise<BookingSlotActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/booking-slot/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete booking slot");
  }

  return result;
}

// Create recurring booking slots
export async function createRecurringBookingSlot(
  data: CreateRecurringBookingSlotData,
): Promise<RecurringBookingSlotsResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/booking-slot/recurring`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to create recurring booking slots",
    );
  }

  return result;
}

// Delete recurring booking slot series
export async function deleteRecurringSeries(
  groupId: string,
  scope: "all" | "from_date" = "all",
  fromDate?: string,
): Promise<BookingSlotActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let url = `${API_URL}/vendor/booking-slot/recurring/${groupId}?scope=${scope}`;
  if (fromDate) {
    url += `&fromDate=${fromDate}`;
  }

  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete recurring series");
  }

  return result;
}
