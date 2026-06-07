"use client";

import { useCountUp } from "@/lib/useCountUp";

// ============================================================
//  STAT ITEM — um número animado com label e descrição
// ============================================================
interface StatProps {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
  desc: string;
  delay?: number;
}

function StatItem({ to, prefix = "", suffix = "", label, desc }: StatProps) {
  const { ref, val } = useCountUp(to, 1400);

  return (
    <div className="bg-[#111] h-full py-10 px-6 flex flex-col items-center text-center">
      {/* Número animado */}
      <div
        className="text-white leading-none"
        style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.5rem,5vw,3.5rem)" }}
        aria-live="polite"
      >
        {prefix}
        <span ref={ref}>{val.toLocaleString("pt-BR")}</span>
        {suffix}
      </div>

      {/* Label em vermelho */}
      <div className="mt-3 font-mono text-[11px] tracking-[0.18em] uppercase text-[#c41212]">
        {label}
      </div>

      {/* Descrição */}
      <p className="mt-2 text-[13px] text-[#555] leading-relaxed max-w-[200px]">
        {desc}
      </p>
    </div>
  );
}

// ============================================================
//  STATS STRIP
// ============================================================
const stats: StatProps[] = [
  {
    to: 850, prefix: "+", suffix: "",
    label: "Mapas aplicados",
    desc:  "ECUs reprogramadas com segurança e precisão",
  },
  {
    to: 35, prefix: "+", suffix: "%",
    label: "Ganho de torque",
    desc:  "Média real em motores diesel turbo",
  },
  {
    to: 2, prefix: "", suffix: "",
    label: "Segmentos",
    desc:  "Automotivo e agrícola com a mesma excelência",
  },
  {
    to: 100, prefix: "", suffix: "%",
    label: "Reversível",
    desc:  "Mapa original sempre preservado",
  },
];

export default function StatsStrip() {
  return (
    <section id="diferenciais" className="bg-[#111] border-y border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1f1f1f]">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
