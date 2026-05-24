const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface CatalogItem {
  id: number;
  name: string;
  description: string;
  basePrice: number | null;
}

export interface QuoteRequest {
  clienteNome: string;
  whatsapp: string;
  veiculoDescricao: string;
  servicoSolicitado: string;
}

export interface OrderTrack {
  id: number;
  status: "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDO";
  descricao: string;
  criadoEm: string;
  veiculo: string;
}

export async function fetchCatalog(): Promise<CatalogItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/catalog`, {
      next: { revalidate: 300 }, // revalida a cada 5 minutos
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function submitQuote(data: QuoteRequest): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.status === 201;
  } catch {
    return false;
  }
}

export async function trackOrder(whatsapp: string): Promise<OrderTrack[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/orders/track?whatsapp=${encodeURIComponent(whatsapp)}`
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Olá! Quero um orçamento."
)}`;
