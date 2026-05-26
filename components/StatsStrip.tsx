import { Car, MapPin, Cpu, Zap } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

const stats = [
  {
    icon: Car,
    title: "Automotivo + Agrícola",
    description: "2 segmentos atendidos com a mesma excelência",
  },
  {
    icon: MapPin,
    title: "Vamos até você",
    description: "Atendemos no seu local, sem deslocamento",
  },
  {
    icon: Cpu,
    title: "Equipamento profissional",
    description: "Hardware e software de última geração",
  },
  {
    icon: Zap,
    title: "Resposta rápida",
    description: "Orçamento via WhatsApp no mesmo dia",
  },
];

export default function StatsStrip() {
  return (
    <section className="bg-[#111] border-y border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1f1f1f]">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <AnimateIn key={stat.title} delay={i * 80}>
                <div className="bg-[#111] flex flex-col items-center text-center gap-2 py-8 px-4 sm:px-6 h-full">
                  <div className="w-10 h-10 rounded border border-[#c41212]/30 flex items-center justify-center bg-[#c41212]/5 mb-1 shrink-0">
                    <Icon size={18} className="text-[#c41212]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-snug">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-[#555] leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
