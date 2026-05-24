"use client";

import { MessageCircle } from "lucide-react";

const WA_URL = `https://wa.me/5518991636818?text=${encodeURIComponent(
  "Olá! Gostaria de solicitar um orçamento pela DNP Performance."
)}`;

export default function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Anel pulsante */}
      <span className="absolute inset-0 rounded-full bg-[#c41212] animate-ping opacity-30" />

      {/* Botão principal */}
      <span className="relative flex items-center gap-2 bg-[#c41212] hover:bg-[#e01414] text-white rounded-full px-5 py-3 shadow-lg shadow-[#c41212]/30 transition-all duration-200 group-hover:shadow-[#c41212]/50 group-hover:scale-105">
        <MessageCircle size={22} fill="white" />
        <span className="text-sm font-bold uppercase tracking-wide hidden sm:inline">
          WhatsApp
        </span>
      </span>
    </a>
  );
}
