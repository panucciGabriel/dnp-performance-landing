"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, MessageCircle, Wrench } from "lucide-react";
import { WA_URL } from "@/lib/constants";
import { useCountUp } from "@/lib/useCountUp";

// ============================================================
//  DYNO CHART — gráfico SVG animado de potência × RPM
// ============================================================
function DynoChart() {
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    // Fallback para tab em background ou captura de tela
    const t = setTimeout(() => setDrawn(true), 2600);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  // Curvas Bézier: stock (sem reprog.) e DNP (com reprog.)
  const stockPath = "M10,150 C70,140 120,110 180,86 C230,66 290,58 330,56";
  const dnpPath   = "M10,150 C70,132 120,86  180,52 C230,26 290,16 330,14";

  return (
    <div ref={ref} className={`relative w-full select-none ${drawn ? "dyno-draw" : ""}`}>
      <svg
        viewBox="0 0 350 180"
        className="w-full h-auto"
        role="img"
        aria-label="Gráfico de potência: curva stock vs curva DNP"
      >
        {/* Grade horizontal */}
        {[14, 50, 86, 122, 158].map((y) => (
          <line key={y} x1="10" y1={y} x2="340" y2={y} stroke="#1a1a1a" strokeWidth="1" />
        ))}
        {/* Grade vertical */}
        {[10, 92, 174, 256, 330].map((x) => (
          <line key={x} x1={x} y1="14" x2={x} y2="158" stroke="#161616" strokeWidth="1" />
        ))}

        {/* Área de ganho (preenchida sob a curva DNP) */}
        <defs>
          <linearGradient id="dyno-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c41212" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c41212" stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path
          className="dyno-area"
          d={`${dnpPath} L330,158 L10,158 Z`}
          fill="url(#dyno-fill)"
        />

        {/* Curva stock */}
        <path
          className="dyno-stock"
          d={stockPath}
          fill="none"
          stroke="#444"
          strokeWidth="2"
          strokeDasharray="600"
          strokeDashoffset="600"
        />
        {/* Curva DNP */}
        <path
          className="dyno-dnp"
          d={dnpPath}
          fill="none"
          stroke="#c41212"
          strokeWidth="2.5"
          strokeDasharray="600"
          strokeDashoffset="600"
        />
        {/* Ponto final da curva DNP */}
        <circle className="dyno-dot" cx="330" cy="14" r="3.5" fill="#c41212" />
      </svg>

      {/* Legenda */}
      <div className="mt-3 flex items-center gap-5 font-mono text-[10px] tracking-[0.18em] uppercase">
        <span className="flex items-center gap-2 text-[#555]">
          <span className="w-5 inline-block border-t-2 border-dashed border-[#444]" />
          Stock
        </span>
        <span className="flex items-center gap-2 text-[#b8b8b8]">
          <span className="w-5 h-[2.5px] bg-[#c41212] inline-block rounded-full" />
          DNP Map
        </span>
        <span className="ml-auto text-[#555]">Potência × RPM</span>
      </div>
    </div>
  );
}

// ============================================================
//  HERO
// ============================================================
export default function Hero() {
  const kpi = useCountUp(38, 1200); // "+38 CV" no card

  return (
    <section
      id="topo"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* ── Vídeo de fundo ───────────────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/automotivo.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Overlays de gradiente ─────────────────────────────── */}
      {/* Escurece de cima pra baixo para fundir com o fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/65 via-[#0a0a0a]/75 to-[#0a0a0a]" />
      {/* Escurece da esquerda pra direita para deixar o texto legível */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/35 to-transparent" />

      {/* ── Linha vermelha no topo ───────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-px bg-[#c41212]" />

      {/* ── Conteúdo ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">

          {/* Esquerda: copy principal */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[#c41212] mb-6">
              <span className="w-5 h-px bg-[#c41212]" />
              Reprogramação · Diagnóstico · Peças
            </span>

            {/* Heading principal */}
            <h1
              className="leading-[0.86] tracking-wide text-white uppercase"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3.5rem, 10vw, 8.5rem)",
              }}
            >
              <span className="text-[#c41212]">Mais</span> potência.<br />
              <span className="text-[#c41212]">Mais</span> eficiência.
            </h1>

            {/* Subtítulo */}
            <p className="mt-7 text-[#b8b8b8] text-lg leading-relaxed max-w-xl font-light">
              Especialistas em reprogramação de ECU para veículos automotivos e
              máquinas agrícolas.{" "}
              <span className="text-white font-normal">
                Atendemos no seu local — sem deslocamento.
              </span>
            </p>

            {/* Tags técnicas */}
            <p className="mt-4 font-mono text-[11px] tracking-[0.2em] uppercase text-[#555]">
              DPF · EGR · ARLA Off · Downpipes · Escapamentos em Inox
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <a
                href="#orcamento"
                className="inline-flex items-center justify-center gap-2.5 bg-[#c41212] hover:bg-[#e01414] text-white font-mono text-[12px] tracking-[0.18em] uppercase px-7 h-12 rounded transition-all duration-200 shadow-lg shadow-[#c41212]/20"
              >
                <MessageCircle size={16} />
                Solicitar Orçamento
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2.5 border border-[#262626] hover:border-[#c41212] text-[#b8b8b8] hover:text-white font-mono text-[12px] tracking-[0.18em] uppercase px-7 h-12 rounded transition-all duration-200"
              >
                <Wrench size={16} />
                Ver Serviços
              </a>
            </div>
          </div>

          {/* Direita: card Dyno */}
          <div className="lg:col-span-5">
            <div className="bg-[#111111]/80 backdrop-blur-sm border border-[#1f1f1f] rounded-lg p-6 sm:p-7">

              {/* Topo do card */}
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#555]">
                  Dyno · ganho real
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[#c41212]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c41212] pulse-ring" />
                  Live
                </span>
              </div>

              {/* KPI: +38 CV animado */}
              <div className="flex items-baseline gap-2 mb-4 border-b border-[#1f1f1f] pb-4">
                <span
                  ref={kpi.ref}
                  className="text-[#c41212] leading-none"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "3.2rem" }}
                  aria-label={`Mais ${kpi.val} cavalos de potência`}
                >
                  +{kpi.val}
                </span>
                <span className="font-mono text-xl text-[#c41212] leading-none font-bold">
                  CV
                </span>
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#555] ml-2">
                  ganho de pico
                </span>
              </div>

              {/* Gráfico animado */}
              <DynoChart />
            </div>
          </div>

        </div>
      </div>

      {/* ── Seta de scroll ───────────────────────────────────── */}
      <a
        href="#diferenciais"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[#555] hover:text-[#c41212] transition-colors animate-bounce"
        aria-label="Rolar para a próxima seção"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
}
