"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { WA_URL } from "@/lib/constants";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className={[
        "fixed bottom-6 right-6 z-50 group",
        "transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      {/* Anel pulsante de fundo */}
      <span className="absolute inset-0 rounded-full bg-[#c41212] animate-ping opacity-25" />

      {/* Botão */}
      <span className="relative flex items-center gap-2 bg-[#c41212] hover:bg-[#e01414] text-white rounded-full px-5 py-3 shadow-lg shadow-[#c41212]/30 transition-all duration-200 group-hover:shadow-[#c41212]/50 group-hover:scale-105">
        <MessageCircle size={22} fill="white" />
        <span className="text-sm font-bold uppercase tracking-wide hidden sm:inline">
          WhatsApp
        </span>
      </span>
    </a>
  );
}
