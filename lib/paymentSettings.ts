const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export interface PaymentSettings {
  preferredGateway: string;
  isConfigured: boolean;
  payhere?: {
    merchantId: string;
    merchantSecret?: string;
  };
  stripe?: {
    accountId: string;
    secretKey?: string;
    webhookSecret?: string;
  };
}

export interface PaymentSettingsResponse {
  success: boolean;
  data: PaymentSettings;
  message?: string;
}

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
};

export async function getPaymentSettings(): Promise<PaymentSettingsResponse> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_URL}/vendor/payment-settings`, { headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch payment settings");
  }

  return response.json();
}

export async function updatePaymentSettings(data: {
  preferredGateway: string;
  payhere?: {
    merchantId: string;
    merchantSecret: string;
  };
  stripe?: {
    accountId: string;
    secretKey: string;
    webhookSecret: string;
  };
}): Promise<PaymentSettingsResponse> {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_URL}/vendor/payment-settings`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update payment settings");
  }

  return response.json();
}
