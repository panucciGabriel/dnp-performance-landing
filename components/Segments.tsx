import { ArrowRight } from "lucide-react";

const WA_URL = `https://wa.me/5518991636818?text=${encodeURIComponent(
  "Olá! Gostaria de solicitar um orçamento pela DNP Performance."
)}`;

const segments = [
  {
    id: "automotivo",
    label: "Automotivo",
    headline: "POTÊNCIA\nSEM LIMITES",
    description:
      "Reprogramação completa para carros, pickups e caminhões. Extraia o máximo do motor com segurança e eficiência.",
    services: ["Remap ECU", "DPF · EGR · ARLA Off", "Chips de Potência", "Downpipes", "Escapamentos em Inox"],
    image: "/images/automotivo.jpg",
    // Fallback: fundo escuro estilo estúdio, como o post do RAM
    bg: "bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a0a0a]",
    accent: "text-[#c41212]",
  },
  {
    id: "agricola",
    label: "Agrícola",
    headline: "MAIS ECONOMIA\nNA LAVOURA",
    description:
      "Reprogramação especializada para tratores e colheitadeiras. Aumente a eficiência e reduza o consumo de combustível.",
    services: ["Reprogramação de Trator", "Reprogramação de Colheitadeira", "DPF · EGR · ARLA Off", "Aumento de Torque", "Redução de Consumo"],
    image: "/images/agricola.jpg",
    // Fallback: gradiente dourado para simular o campo de trigo
    bg: "bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1200]",
    accent: "text-[#c41212]",
  },
];

export default function Segments() {
  return (
    <section id="segmentos" className="py-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-[#c41212] text-xl">✦</span>
        <h2
          className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-3"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          NOSSOS <span className="text-[#c41212]">SEGMENTOS</span>
        </h2>
        <p className="text-[#666] text-sm uppercase tracking-widest">
          Atendemos tanto o agronegócio quanto o mercado automotivo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#1f1f1f]">
        {segments.map((seg) => (
          <div key={seg.id} className={`relative overflow-hidden group ${seg.bg} min-h-[500px] flex flex-col justify-end`}>
            {/* Imagem de fundo (quando disponível) */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${seg.image})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

            {/* Conteúdo */}
            <div className="relative z-10 p-8 lg:p-12">
              <span className="inline-block text-xs uppercase tracking-widest text-[#c41212] font-semibold mb-3 border border-[#c41212]/30 px-3 py-1 rounded-full">
                {seg.label}
              </span>
              <h3
                className="text-4xl sm:text-5xl text-white mb-4 leading-tight whitespace-pre-line"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {seg.headline}
              </h3>
              <p className="text-[#b8b8b8] text-sm leading-relaxed mb-6 max-w-md">
                {seg.description}
              </p>

              {/* Tags de serviço */}
              <div className="flex flex-wrap gap-2 mb-6">
                {seg.services.map((s) => (
                  <span
                    key={s}
                    className="text-xs text-[#888] border border-[#333] px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#c41212] transition-colors uppercase tracking-wide group/link"
              >
                Solicitar orçamento
                <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
