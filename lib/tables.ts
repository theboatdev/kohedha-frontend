export type TableShape = "square" | "circle" | "rectangle-h" | "rectangle-v";

export type Table = {
  _id: string;
  vendorId: string;
  tableNumber: string;
  seatingCapacity: number;
  sectionId?: string;
  shape: TableShape;
  positionX?: number | null;
  positionY?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTableData = {
  tableNumber: string;
  seatingCapacity: number;
  sectionId?: string;
  shape?: TableShape;
};

export type UpdateTableData = {
  tableNumber?: string;
  seatingCapacity?: number;
  isActive?: boolean;
  sectionId?: string;
  shape?: TableShape;
};

export type TablesStats = {
  totalTables: number;
  activeTables: number;
  inactiveTables: number;
  totalCapacity: number;
};

export type TablesResponse = {
  success: boolean;
  count: number;
  data: {
    tables: Table[];
    stats: TablesStats;
  };
};

export type SingleTableResponse = {
  success: boolean;
  data: Table;
};

export type TableActionResponse = {
  success: boolean;
  message: string;
  data?: Table;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// Get all tables for the vendor
export async function getTables(sectionId?: string): Promise<TablesResponse> {
  const queryParams = sectionId ? `?sectionId=${sectionId}` : "";
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables${queryParams}`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tables");
  }

  return res.json();
}

// Get a single table by ID
export async function getTableById(id: string): Promise<SingleTableResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables/${id}`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch table");
  }

  return res.json();
}

// Create a new table
export async function createTable(
  data: CreateTableData,
): Promise<TableActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables/new-table`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create table");
  }

  return result;
}

// Update an existing table
export async function updateTable(
  id: string,
  data: UpdateTableData,
): Promise<TableActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables/update-table/${id}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update table");
  }

  return result;
}

// Delete a table
export async function deleteTable(id: string): Promise<TableActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables/delete-table/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete table");
  }

  return result;
}

// Toggle table active status
export async function toggleTableStatus(
  id: string,
): Promise<TableActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
    headers,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to toggle table status");
  }

  return result;
}

// Update table positions in bulk
export async function updateTablePositions(
  positions: Array<{ id: string; positionX: number; positionY: number }>,
): Promise<TableActionResponse> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/vendor/tables/update-positions`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify({ positions }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update table positions");
  }

  return result;
}
