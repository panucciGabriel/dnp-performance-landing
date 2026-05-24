"use client";

/**
 * Galeria de trabalhos reais.
 * ➜ Coloque suas fotos em: public/images/
 *    Nomes esperados: work-1.jpg, work-2.jpg, work-3.jpg, work-4.jpg, work-5.jpg, work-6.jpg
 *    Use as fotos do Fiat Toro e do downpipe inox já fornecidas.
 */
const photos = [
  { src: "/images/work-1.jpg", alt: "Fiat Toro — reprogramação concluída", span: "col-span-1 row-span-2" },
  { src: "/images/work-2.jpg", alt: "Downpipe inox instalação",            span: "col-span-1 row-span-1" },
  { src: "/images/work-3.jpg", alt: "Trabalho automotivo DNP",             span: "col-span-1 row-span-1" },
  { src: "/images/work-4.jpg", alt: "Reprogramação agrícola",              span: "col-span-2 row-span-1" },
  { src: "/images/work-5.jpg", alt: "Escapamento em inox",                 span: "col-span-1 row-span-1" },
  { src: "/images/work-6.jpg", alt: "Diagnóstico ECU",                     span: "col-span-1 row-span-1" },
];

export default function Gallery() {
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

        {/* Grid masonry simplificado */}
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] gap-2">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group bg-[#111] border border-[#1f1f1f] ${photo.span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback gracioso se a foto não existir ainda
                  const target = e.currentTarget as HTMLImageElement;
                  target.parentElement!.style.background = "#161616";
                  target.style.display = "none";
                }}
              />
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-[#c41212]/0 group-hover:bg-[#c41212]/10 transition-colors duration-300" />
              {/* Alt text no hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-[#b8b8b8]">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Link Instagram */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com/dnpperformance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#666] hover:text-white text-sm transition-colors"
          >
            <span>Ver mais no Instagram</span>
            <span className="text-[#c41212]">@dnpperformance</span>
            <span className="text-[#c41212]">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
