// Todas as chamadas admin passam pelo proxy Next.js (/api/backend → backend real)
// Isso elimina problemas de CORS: browser fala com mesmo origin, Next.js proxeia.
const API_URL = "/api/backend";
const TOKEN_KEY = "dnp_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciais inválidas");
  return res.text();
}

export interface AdminOrder {
  id: number;
  description: string;
  createdAt: string;
  status: "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDO";
  vehicle?: {
    brand: string;
    model: string;
    client?: {
      name: string;
      contatoWhatsapp: string;
    };
  } | null;
  originalFileUrl?: string | null;
  modifiedFileUrl?: string | null;
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Erro ao buscar ordens");
  return res.json();
}

export async function updateOrderStatus(id: number, status: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/orders/${id}/status?status=${status}`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Erro ao atualizar status");
}

export interface CreateOrderPayload {
  description: string;
  status: "ABERTO";
  vehicle: {
    brand?: string;
    model: string;
    year?: number;
    vin?: string;
    vehicleType?: "CARRO" | "TRATOR" | "CAMINHAO";
    measurementUnit?: "KM" | "MILHAS" | "HORAS";
    usageReading?: number;
    client: {
      name: string;
      contatoWhatsapp: string;
      email?: string;
    };
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<AdminOrder> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Erro ao criar ordem");
  return res.json();
}

export async function uploadEcuFile(id: number, file: File): Promise<AdminOrder> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/orders/${id}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Erro ao enviar arquivo");
  return res.json();
}

export interface CatalogItemAdmin {
  id: number;
  name: string;
  description: string;
  basePrice: number | null;
}

export async function fetchAdminCatalog(): Promise<CatalogItemAdmin[]> {
  const res = await fetch(`${API_URL}/api/catalog`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function createCatalogItem(
  data: Omit<CatalogItemAdmin, "id">
): Promise<CatalogItemAdmin> {
  const res = await fetch(`${API_URL}/api/catalog`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Erro ao criar serviço");
  return res.json();
}
