"use client";

import { useState } from "react";
import Image from "next/image";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const photos = [
  { src: "/images/work-1.jpg", alt: "Fiat Toro — reprogramação concluída",  span: "col-span-1 row-span-2" },
  { src: "/images/work-2.jpg", alt: "Downpipe inox — instalação",            span: "col-span-1 row-span-1" },
  { src: "/images/work-3.jpg", alt: "Trabalho automotivo DNP",               span: "col-span-1 row-span-1" },
  { src: "/images/work-4.jpg", alt: "Reprogramação agrícola",                span: "col-span-2 row-span-1" },
  { src: "/images/work-5.jpg", alt: "Escapamento em inox",                   span: "col-span-1 row-span-1" },
  { src: "/images/work-6.jpg", alt: "Diagnóstico ECU",                       span: "col-span-1 row-span-1" },
];

export default function Gallery() {
  const [errored, setErrored] = useState<Set<number>>(new Set());

  const handleError = (i: number) =>
    setErrored((prev) => new Set(prev).add(i));

  return (
    <section id="galeria" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="text-[#c41212] text-xl">✦</span>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            NOSSOS <span className="text-[#c41212]">TRABALHOS</span>
          </h2>
          <p className="text-[#666] text-sm">
            Resultados reais de clientes satisfeitos.
          </p>
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] sm:auto-rows-[220px] gap-1 sm:gap-2">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group bg-[#111] border border-[#1f1f1f] ${photo.span}`}
            >
              {!errored.has(i) ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => handleError(i)}
                />
              ) : (
                <div className="w-full h-full bg-[#161616]" />
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-[#c41212]/0 group-hover:bg-[#c41212]/10 transition-colors duration-300" />

              {/* Caption no hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-[#b8b8b8] line-clamp-1">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-8 sm:mt-12 border border-[#1f1f1f] rounded py-10 px-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#111]">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full border border-[#1f1f1f] flex items-center justify-center shrink-0">
              <InstagramIcon size={26} className="text-[#666]" />
            </div>
            <div>
              <p className="text-xs text-[#555] uppercase tracking-widest mb-1">
                Acompanhe em tempo real
              </p>
              <p
                className="text-2xl text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                NOSSOS TRABALHOS NO INSTAGRAM
              </p>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#c41212] text-[#c41212] hover:bg-[#c41212] hover:text-white px-6 py-3 rounded text-sm font-semibold uppercase tracking-wide transition-all duration-200 shrink-0"
          >
            <InstagramIcon size={16} />
            Seguir {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}
