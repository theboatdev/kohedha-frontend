// API client for public booking functionality

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export interface BookingSlotDetails {
  slotId: string;
  slotName: string;
  slotType: string;
  description?: string;
  // Single-date slots
  date?: string | null;
  // Recurring slots
  isRecurring: boolean;
  dateRange?: {
    start: string;
    end: string | null;
  } | null;
  recurrenceRule?: {
    type: "weekly" | "monthly_date" | "monthly_day";
    days?: number[];
    monthDay?: number;
    weekOfMonth?: number;
    dayOfWeek?: number;
  } | null;
  excludedDates?: string[];
  timeWindow: {
    start: string;
    end: string;
  };
  section: {
    id: string;
    name: string;
    type: string;
  };
  vendor: {
    name: string;
    city: string;
    address: string;
    phone: string;
  };
  totalTables: number;
  totalBookings: number;
  maxBookings: number | null;
  spotsAvailable: boolean;
}

export interface Table {
  _id: string;
  tableNumber: string;
  seatingCapacity: number;
  shape: string;
}

export interface CreateReservationData {
  tableId: string;
  customerName: string;
  customerPhone: string;
  numberOfGuests: number;
  startTime: string;
  endTime: string;
  reservationDate?: string; // Required for recurring slots (YYYY-MM-DD)
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  data?: {
    reservation: any;
    confirmationLink: string;
    confirmationToken: string;
  };
}

export interface ReservationDetails {
  _id: string;
  customerName: string;
  customerPhone: string;
  numberOfGuests: number;
  tableId: {
    _id: string;
    tableNumber: string;
    seatingCapacity: number;
  };
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: string;
  vendorId: {
    _id: string;
    companyName?: string;
    location?: {
      businessName?: string;
      city?: string;
      streetAddress?: string;
    };
    vendorMobile?: string;
  };
  sectionId: {
    _id: string;
    sectionName: string;
    sectionType?: string;
  };
  canCancel?: boolean;
}

// Get booking slot details
export async function getBookingSlotDetails(
  token: string,
): Promise<BookingSlotDetails> {
  const response = await fetch(`${API_URL}/public/booking/slot/${token}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch booking slot");
  }

  const result = await response.json();
  return result.data;
}

// Get available tables for a specific time slot
export async function getAvailableTables(
  token: string,
  startTime: string,
  endTime: string,
  numberOfGuests?: number,
  date?: string, // Required for recurring slots (YYYY-MM-DD)
): Promise<Table[]> {
  const params = new URLSearchParams({
    startTime,
    endTime,
    ...(numberOfGuests && { numberOfGuests: numberOfGuests.toString() }),
    ...(date && { date }),
  });

  const response = await fetch(
    `${API_URL}/public/booking/slot/${token}/available-tables?${params}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch available tables");
  }

  const result = await response.json();
  return result.data;
}

// Get available dates for a recurring slot
export async function getAvailableDates(
  token: string,
  lookAhead?: number, // days, default 90
): Promise<string[]> {
  const params = new URLSearchParams({
    ...(lookAhead && { lookAhead: lookAhead.toString() }),
  });

  const response = await fetch(
    `${API_URL}/vendor/booking-slot/public/${token}/available-dates?${params}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch available dates");
  }

  const result = await response.json();
  return result.availableDates as string[];
}

// Create a reservation
export async function createReservation(
  token: string,
  data: CreateReservationData,
): Promise<ReservationResponse> {
  const response = await fetch(`${API_URL}/public/booking/slot/${token}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create reservation");
  }

  return result;
}

// Get reservation details
export async function getReservationDetails(
  confirmationToken: string,
): Promise<ReservationDetails> {
  const response = await fetch(
    `${API_URL}/public/booking/reservation/${confirmationToken}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch reservation");
  }

  const result = await response.json();
  return result.data;
}

// Cancel reservation
export async function cancelReservation(
  confirmationToken: string,
  reason: string,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_URL}/public/booking/reservation/${confirmationToken}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to cancel reservation");
  }

  return result;
}

// Helper function to generate time slots
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30,
): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    );
    currentMinutes += intervalMinutes;
  }

  return slots;
}

// Format time to 12-hour format
export function formatTime12Hour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
