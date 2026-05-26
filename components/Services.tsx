import { Wrench, DollarSign } from "lucide-react";
import type { CatalogItem } from "@/lib/api";
import { WA_URL } from "@/lib/constants";

// Serviços padrão mostrados quando o catálogo da API ainda está vazio
const DEFAULT_SERVICES: CatalogItem[] = [
  { id: 1, name: "Remap de Motor",           description: "Reprogramação do mapa original da ECU para ganho de potência, torque e eficiência.", basePrice: null },
  { id: 2, name: "DPF Off",                  description: "Remoção virtual do filtro de partículas diesel — sem falhas e sem alertas no painel.", basePrice: null },
  { id: 3, name: "EGR Off",                  description: "Desativação do sistema de recirculação de gases para maior durabilidade do motor.", basePrice: null },
  { id: 4, name: "ARLA 32 Off",              description: "Desativação do sistema de injeção de arla (SCR) em máquinas agrícolas e caminhões.", basePrice: null },
  { id: 5, name: "Downpipes",                description: "Fabricação e instalação de downpipes em inox para melhor escoamento dos gases.", basePrice: null },
  { id: 6, name: "Escapamentos em Inox",     description: "Sistemas de escapamento personalizados em aço inoxidável de alta qualidade.", basePrice: null },
  { id: 7, name: "Chip de Potência",         description: "Módulo de potência piggyback para ganho rápido sem abertura da ECU original.", basePrice: null },
  { id: 8, name: "Diagnóstico Automotivo",   description: "Leitura e diagnóstico completo de falhas via OBD em qualquer veículo.", basePrice: null },
];

interface ServicesProps {
  items: CatalogItem[];
}

export default function Services({ items }: ServicesProps) {
  const services = items.length > 0 ? items : DEFAULT_SERVICES;

  return (
    <section id="servicos" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="text-[#c41212] text-xl">✦</span>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            NOSSOS <span className="text-[#c41212]">SERVIÇOS</span>
          </h2>
          <p className="text-[#666] max-w-xl mx-auto text-sm leading-relaxed">
            Soluções completas em reprogramação e performance para veículos
            automotivos e máquinas agrícolas.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1f1f1f] border border-[#1f1f1f]">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] hover:bg-[#161616] p-6 flex flex-col gap-4 group transition-colors duration-200"
            >
              {/* Ícone */}
              <div className="w-10 h-10 rounded border border-[#c41212]/30 flex items-center justify-center group-hover:bg-[#c41212]/10 transition-colors">
                <Wrench size={18} className="text-[#c41212]" />
              </div>

              {/* Nome */}
              <h3
                className="text-xl text-white leading-tight"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {item.name}
              </h3>

              {/* Descrição */}
              <p className="text-sm text-[#666] leading-relaxed flex-1">
                {item.description}
              </p>

              {/* Preço (se definido) */}
              {item.basePrice !== null && item.basePrice > 0 && (
                <div className="flex items-center gap-1 text-[#c41212] font-semibold text-sm mt-auto">
                  <DollarSign size={14} />
                  <span>
                    {item.basePrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span className="text-[#444] font-normal ml-1">/ a partir de</span>
                </div>
              )}

              {/* Linha vermelha inferior (hover) */}
              <div className="h-px bg-[#1f1f1f] group-hover:bg-[#c41212]/40 transition-colors mt-2" />
            </div>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="text-center mt-12">
          <p className="text-[#666] text-sm mb-4">
            Não encontrou o que precisa? Fale diretamente pelo WhatsApp.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#c41212] text-[#c41212] hover:bg-[#c41212] hover:text-white px-6 py-3 rounded text-sm font-semibold uppercase tracking-wide transition-all duration-200"
          >
            <Wrench size={16} />
            Consultar Serviço Específico
          </a>
        </div>
      </div>
    </section>
  );
}
