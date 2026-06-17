const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export type UserType = "restaurant" | "customer";

export interface WaitlistFormData {
  name: string;
  email: string;
  mobile: string;
  userType: UserType;
  businessName?: string;
  city?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data?: { id: string };
}

export async function submitWaitlist(
  data: WaitlistFormData,
): Promise<WaitlistResponse> {
  const response = await fetch(`${API_URL}/public/wait-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: WaitlistResponse = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: result.message || "Failed to join the waitlist",
    };
  }

  return result;
}
