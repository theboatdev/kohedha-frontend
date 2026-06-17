// Types for guest list functionality
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type Reservation = {
  _id: string;
  customerName: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  tableId: {
    _id: string;
    tableNumber: string;
    seatingCapacity: number;
  };
  sectionId: {
    _id: string;
    sectionName: string;
  };
  cancellationReason?: string;
  cancelledAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type GetReservationsResponse = {
  success: boolean;
  count: number;
  data: Reservation[];
};

export type GetTodayReservationsResponse = {
  success: boolean;
  count: number;
  date: string;
  data: Reservation[];
};

export type UpdateReservationResponse = {
  success: boolean;
  message: string;
  data: Reservation;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// Get today's reservations (across all slots) for the vendor
export async function getTodayReservations(
  status?: ReservationStatus,
): Promise<GetTodayReservationsResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let url = `${API_URL}/vendor/booking-slot/reservations/today`;
  if (status) {
    url += `?status=${status}`;
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch today's reservations");
  }

  return res.json();
}

// Get all reservations for a booking slot with optional status filter
export async function getSlotReservations(
  slotId: string,
  status?: ReservationStatus,
): Promise<GetReservationsResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let url = `${API_URL}/vendor/booking-slot/${slotId}/reservation`;
  if (status) {
    url += `?status=${status}`;
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch reservations");
  }

  return res.json();
}

// Confirm a reservation
export async function confirmReservation(
  slotId: string,
  reservationId: string,
): Promise<UpdateReservationResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${API_URL}/vendor/booking-slot/${slotId}/reservation/confirm/${reservationId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers,
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to confirm reservation");
  }

  return result;
}

// Cancel a reservation
export async function cancelReservation(
  slotId: string,
  reservationId: string,
  cancellationReason?: string,
): Promise<UpdateReservationResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${API_URL}/vendor/booking-slot/${slotId}/reservation/cancel/${reservationId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify({
        cancellationReason: cancellationReason || "",
      }),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to cancel reservation");
  }

  return result;
}
