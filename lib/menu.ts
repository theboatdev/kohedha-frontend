// Menu API utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MenuItem {
  _id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  is_available: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuUploadResponse {
  success: boolean;
  message: string;
  data?: any;
  preview?: boolean;
}

// Get all menu items
export async function getMenuItems(
  category?: string,
  isAvailable?: boolean,
): Promise<MenuItem[]> {
  try {
    let url = `${API_URL}/vendor/menu`;
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (isAvailable !== undefined)
      params.append("is_available", String(isAvailable));

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

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
      throw new Error("Failed to fetch menu items");
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Get menu items error:", error);
    throw error;
  }
}

// Upload CSV menu
export async function uploadMenuCSV(
  file: File,
  preview: boolean = true,
): Promise<MenuUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_URL}/vendor/menu/upload-csv?preview=${preview}`;
    const token = localStorage.getItem("auth_token");

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData,
    };

    if (token) {
      fetchOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const res = await fetch(url, fetchOptions);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to upload CSV");
    }

    return data;
  } catch (error: any) {
    console.error("Upload CSV error:", error);
    throw error;
  }
}

// Upload PDF menu
export async function uploadMenuPDF(
  file: File,
  preview: boolean = true,
): Promise<MenuUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_URL}/vendor/menu/upload-pdf?preview=${preview}`;
    const token = localStorage.getItem("auth_token");

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData,
    };

    if (token) {
      fetchOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const res = await fetch(url, fetchOptions);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to upload PDF");
    }

    return data;
  } catch (error: any) {
    console.error("Upload PDF error:", error);
    throw error;
  }
}

// Create a single menu item (with optional image)
export async function createMenuItem(data: {
  name: string;
  category: string;
  price: number;
  description?: string;
  currency?: string;
  is_available?: boolean;
  image?: File;
}): Promise<MenuItem> {
  try {
    const token = localStorage.getItem("auth_token");
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", String(data.price));
    if (data.description) formData.append("description", data.description);
    formData.append("currency", data.currency ?? "LKR");
    formData.append("is_available", String(data.is_available ?? true));
    if (data.image) formData.append("image", data.image);

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData,
    };

    if (token) {
      fetchOptions.headers = { Authorization: `Bearer ${token}` };
    }

    const res = await fetch(`${API_URL}/vendor/menu/create`, fetchOptions);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create menu item");
    }

    return result.data;
  } catch (error) {
    console.error("Create menu item error:", error);
    throw error;
  }
}

// Update menu item
export async function updateMenuItem(
  id: string,
  updates: Partial<Omit<MenuItem, "image">> & { image?: File | null },
): Promise<MenuItem> {
  try {
    const token = localStorage.getItem("auth_token");

    const formData = new FormData();
    if (updates.name !== undefined) formData.append("name", updates.name);
    if (updates.category !== undefined)
      formData.append("category", updates.category);
    if (updates.price !== undefined)
      formData.append("price", String(updates.price));
    if (updates.description !== undefined)
      formData.append("description", updates.description);
    if (updates.currency !== undefined)
      formData.append("currency", updates.currency);
    if (updates.is_available !== undefined)
      formData.append("is_available", String(updates.is_available));
    if (updates.image && typeof updates.image === "object")
      formData.append("image", updates.image as File);

    const fetchOptions: RequestInit = {
      method: "PUT",
      credentials: "include",
      body: formData,
    };
    if (token) {
      fetchOptions.headers = { Authorization: `Bearer ${token}` };
    }

    const res = await fetch(`${API_URL}/vendor/menu/${id}`, fetchOptions);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update menu item");
    }

    return data.data;
  } catch (error) {
    console.error("Update menu item error:", error);
    throw error;
  }
}

// Delete menu item
export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/vendor/menu/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete menu item");
    }
  } catch (error) {
    console.error("Delete menu item error:", error);
    throw error;
  }
}

// Analyze CSV structure
export async function analyzeCSV(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("auth_token");

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData,
    };

    if (token) {
      fetchOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const res = await fetch(`${API_URL}/vendor/menu/analyze-csv`, fetchOptions);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to analyze CSV");
    }

    return data.analysis;
  } catch (error) {
    console.error("Analyze CSV error:", error);
    throw error;
  }
}
