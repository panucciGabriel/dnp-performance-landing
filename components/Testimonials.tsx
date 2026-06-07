import AnimateIn from "@/components/AnimateIn";

// ============================================================
//  Ícone de estrela (inline para evitar import de lib extra)
// ============================================================
function StarIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
    </svg>
  );
}

// ============================================================
//  DADOS
// ============================================================
const testimonials = [
  {
    name: "Rafael M.",
    vehicle: "Fiat Toro 2.0 Diesel",
    text: "Ganho de torque absurdo e o consumo até melhorou na estrada. Vieram fazer na minha garagem, sem dor de cabeça. Recomendo demais.",
    stars: 5,
  },
  {
    name: "Cleber A.",
    vehicle: "Trator John Deere 6110",
    text: "A reprogramação reduziu meu consumo de diesel durante a safra inteira. Pagou o serviço em poucas semanas de lavoura. Resultado impressionante.",
    stars: 5,
  },
  {
    name: "Douglas P.",
    vehicle: "Ram 2500 Diesel",
    text: "Tirei o ARLA e o DPF que viviam dando problema. A resposta de pedal mudou completamente. Atendimento direto, sem enrolação.",
    stars: 5,
  },
];

// ============================================================
//  TESTIMONIALS
// ============================================================
export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-[#111] border-y border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <AnimateIn>
          <div className="text-center mb-16">
            <span className="inline-flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[#c41212] mb-4">
              <span className="w-5 h-px bg-[#c41212]" />
              Quem já sentiu
            </span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-4"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              O QUE NOSSOS{" "}
              <span className="text-[#c41212]">CLIENTES</span>{" "}
              DIZEM
            </h2>
            <p className="text-[#555] text-sm max-w-md mx-auto leading-relaxed">
              Resultados reais de quem já passou pela DNP.
            </p>
          </div>
        </AnimateIn>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-px bg-[#1f1f1f] border border-[#1f1f1f]">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 100}>
              <figure className="bg-[#111] h-full p-8 flex flex-col">
                {/* Estrelas */}
                <div className="flex gap-1 text-[#c41212] mb-5" aria-label={`${t.stars} de 5 estrelas`}>
                  {Array.from({ length: t.stars }).map((_, k) => (
                    <StarIcon key={k} />
                  ))}
                </div>

                {/* Depoimento */}
                <blockquote className="text-[#b8b8b8] text-[15px] leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Autor */}
                <figcaption className="mt-6 pt-5 border-t border-[#1f1f1f]">
                  <div
                    className="text-xl text-white leading-tight"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {t.name}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#555] mt-1">
                    {t.vehicle}
                  </div>
                </figcaption>
              </figure>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
