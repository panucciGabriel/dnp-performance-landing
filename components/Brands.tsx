// Seção de marcas atendidas — faixa com marquee infinito
// Server component: sem interatividade, apenas visual

const brands = [
  "Volkswagen", "Fiat", "Ford", "Chevrolet", "Toyota",
  "RAM", "Jeep", "Mitsubishi", "John Deere", "Case IH",
  "New Holland", "Massey Ferguson", "Valtra", "Jacto",
];

// Duplica a lista para criar o loop visual contínuo
const marqueeItems = [...brands, ...brands];

export default function Brands() {
  return (
    <section className="py-20 bg-[#0a0a0a] overflow-hidden">
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="inline-flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[#c41212] mb-4">
          <span className="w-5 h-px bg-[#c41212]" />
          Marcas atendidas
          <span className="w-5 h-px bg-[#c41212]" />
        </span>
        <h2
          className="text-4xl sm:text-5xl text-white mt-2 mb-3"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Automotivo <span className="text-[#c41212]">&amp;</span> Agrícola
        </h2>
        <p className="text-[#555] text-sm max-w-lg mx-auto leading-relaxed">
          Reprogramamos as principais marcas dos dois segmentos.
          Não vê a sua?{" "}
          <span className="text-[#b8b8b8]">Consulte — provavelmente atendemos.</span>
        </p>
      </div>

      {/* Faixa de marcas com scroll infinito */}
      <div className="relative">
        {/* Fade esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        {/* Fade direita */}
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* Track animado */}
        <div
          className="flex w-max marquee-track"
          aria-hidden="true" // lista decorativa, leitores de tela ignoram
        >
          {marqueeItems.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-2 h-16 w-40 border border-[#1f1f1f] rounded bg-[#111] shrink-0 hover:border-[#c41212]/40 transition-colors duration-300"
            >
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#b8b8b8]">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista acessível (visualmente oculta) */}
      <ul className="sr-only">
        {brands.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </section>
  );
}
