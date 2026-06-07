import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { WA_URL } from "@/lib/constants";
import AnimateIn from "./AnimateIn";

const products = [
  {
    name: 'Downpipe Inox 3"',
    category: "Escapamento",
    price: "R$ 890",
    image: "/images/parts/downpipe-inox.jpg",
  },
  {
    name: "Catback Esportivo",
    category: "Escapamento",
    price: "R$ 2.200",
    image: "/images/parts/catback-esportivo.jpg",
  },
  {
    name: "Módulo Piggyback",
    category: "Eletrônica",
    price: "R$ 1.450",
    image: "/images/parts/modulo-piggyback.jpg",
  },
  {
    name: "Filtro de Ar Esportivo",
    category: "Admissão",
    price: "R$ 320",
    image: "/images/parts/filtro-ar-esportivo.jpg",
  },
  {
    name: "Intercooler Frontal",
    category: "Pressurização",
    price: "R$ 1.980",
    image: "/images/parts/intercooler-frontal.jpg",
  },
  {
    name: "Kit Velas Iridium",
    category: "Ignição",
    price: "R$ 280",
    image: "/images/parts/kit-velas-iridium.jpg",
  },
];

export default function PartsShop() {
  return (
    <section id="pecas" className="py-24 bg-[#0d0d0d] border-t border-b border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#c41212]" />
              <span
                className="text-[#c41212] text-[11px] tracking-[2.4px] uppercase"
                style={{ fontFamily: "var(--font-ibm-mono)" }}
              >
                Loja de peças
              </span>
            </div>
            <h2
              className="text-5xl sm:text-6xl lg:text-[60px] text-white leading-none tracking-[1.5px] uppercase"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Peças de <span className="text-[#c41212]">performance</span>
            </h2>
            <p className="mt-4 text-[#666] text-sm leading-relaxed max-w-sm">
              Componentes selecionados para complementar a reprogramação.
              Fabricação própria em inox e marcas homologadas.
            </p>
          </div>

          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start lg:self-center flex items-center gap-2 border border-[#262626] hover:border-[#c41212] text-[#b8b8b8] hover:text-white text-[12px] tracking-[2.16px] uppercase px-5 py-3 rounded transition-colors duration-200"
            style={{ fontFamily: "var(--font-ibm-mono)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Ver catálogo completo
          </a>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1f1f1f] border border-[#1f1f1f]">
          {products.map((product, i) => (
            <AnimateIn key={product.name} delay={i * 80}>
              <div className="bg-[#111] flex flex-col h-full">
                {/* Imagem */}
                <div className="relative overflow-hidden bg-[#161616]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={760}
                    height={560}
                    className="w-full h-[280px] object-cover pointer-events-none"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-3 border border-white/5 pointer-events-none" />
                  {/* Badge categoria */}
                  <div className="absolute top-3 left-3 bg-[rgba(10,10,10,0.8)] border border-[#262626] rounded px-2 py-1">
                    <span
                      className="text-[9px] text-[#b8b8b8] tracking-[1.62px] uppercase"
                      style={{ fontFamily: "var(--font-ibm-mono)" }}
                    >
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3
                    className="text-2xl text-white tracking-[0.6px] uppercase"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-end justify-between mt-auto pt-2">
                    <div>
                      <span
                        className="block text-[10px] text-[#666] tracking-[1.6px] uppercase mb-1"
                        style={{ fontFamily: "var(--font-ibm-mono)" }}
                      >
                        a partir de
                      </span>
                      <span
                        className="text-lg text-[#c41212]"
                        style={{ fontFamily: "var(--font-ibm-mono)" }}
                      >
                        {product.price}
                      </span>
                    </div>
                    <a
                      href={WA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#262626] hover:border-[#c41212] w-10 h-10 rounded flex items-center justify-center text-[#666] hover:text-[#c41212] transition-colors duration-200"
                      aria-label={`Pedir ${product.name}`}
                    >
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Rodapé da seção */}
        <p
          className="text-center text-[11px] text-[#666] tracking-[1.76px] uppercase mt-8"
          style={{ fontFamily: "var(--font-ibm-mono)" }}
        >
          Frete para todo o Brasil · Instalação inclusa na região atendida
        </p>
      </div>
    </section>
  );
}
