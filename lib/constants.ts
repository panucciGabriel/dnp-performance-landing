export const WA_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5518991636818";

export const WA_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  "Olá! Gostaria de solicitar um orçamento pela DNP Performance.";

export const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

export const INSTAGRAM_URL = "https://instagram.com/dnpperformance";
export const INSTAGRAM_HANDLE = "@dnpperformance";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dnp-performance-landing.vercel.app";
