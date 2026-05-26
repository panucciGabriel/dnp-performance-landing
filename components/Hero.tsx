"use client";

import { ChevronDown, MessageCircle, Wrench } from "lucide-react";
import { WA_URL } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vídeo de fundo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/logo.png"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/70 to-[#0a0a0a]" />

      {/* Linha vermelha decorativa */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#c41212]" />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-[#c41212] text-2xl mb-4 animate-pulse-slow">
          ✦
        </span>

        <h1
          className="text-6xl sm:text-8xl lg:text-[10rem] leading-none tracking-wide text-white mb-2"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          <span className="text-[#c41212]">MAIS</span> POTÊNCIA.
        </h1>
        <h1
          className="text-6xl sm:text-8xl lg:text-[10rem] leading-none tracking-wide text-white mb-6"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          <span className="text-[#c41212]">MAIS</span> EFICIÊNCIA.
        </h1>

        <p className="text-lg sm:text-xl text-[#b8b8b8] max-w-2xl mx-auto mb-2 font-light leading-relaxed">
          Especialistas em reprogramação de ECU para veículos automotivos e
          máquinas agrícolas.
        </p>

        {/* Diferencial principal */}
        <p className="inline-flex items-center gap-2 text-sm text-[#c41212] font-semibold mb-3 uppercase tracking-widest">
          <span className="w-4 h-px bg-[#c41212]" />
          Atendemos no seu local — sem deslocamento
          <span className="w-4 h-px bg-[#c41212]" />
        </p>

        <p className="text-base text-[#555] mb-10 uppercase tracking-widest text-sm">
          DPF · EGR · ARLA OFF · Downpipes · Escapamentos em Inox
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#c41212] hover:bg-[#e01414] text-white font-bold px-8 py-4 rounded transition-all duration-200 uppercase tracking-widest text-sm shadow-lg shadow-[#c41212]/20 w-full sm:w-auto justify-center"
          >
            <MessageCircle size={18} />
            Solicitar Orçamento
          </a>
          <a
            href="#servicos"
            className="flex items-center gap-3 border border-[#333] hover:border-[#c41212] text-[#b8b8b8] hover:text-white px-8 py-4 rounded transition-all duration-200 uppercase tracking-widest text-sm w-full sm:w-auto justify-center"
          >
            <Wrench size={18} />
            Ver Serviços
          </a>
        </div>
      </div>

      {/* Seta de scroll */}
      <a
        href="#segmentos"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#666] hover:text-[#c41212] transition-colors animate-bounce"
        aria-label="Rolar para baixo"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
