import { MessageCircle, Search, Cpu, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "CONTATO",
    description:
      "Nos envie uma mensagem pelo WhatsApp ou preencha o formulário de orçamento com os dados do seu veículo.",
  },
  {
    number: "02",
    icon: Search,
    title: "DIAGNÓSTICO",
    description:
      "Realizamos a leitura completa da ECU e diagnóstico do veículo para identificar o melhor mapeamento.",
  },
  {
    number: "03",
    icon: Cpu,
    title: "REPROGRAMAÇÃO",
    description:
      "Aplicamos o novo mapa na ECU com equipamento profissional, garantindo ganho real de potência e eficiência.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "ENTREGA",
    description:
      "Você recebe notificação no WhatsApp quando seu veículo estiver pronto. Satisfação garantida.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-[#111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="text-[#c41212] text-xl">✦</span>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            COMO <span className="text-[#c41212]">FUNCIONA</span>
          </h2>
          <p className="text-[#666] text-sm">
            Do primeiro contato até a entrega — simples e transparente.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.number} className="relative flex flex-col items-start p-8">
                {/* Linha conectora (desktop) */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-[4.5rem] right-0 w-px h-8 bg-[#1f1f1f] translate-x-1/2" />
                )}

                {/* Número */}
                <span
                  className="text-6xl text-[#1f1f1f] leading-none mb-4 select-none"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {step.number}
                </span>

                {/* Ícone */}
                <div className="w-12 h-12 rounded border border-[#c41212]/40 flex items-center justify-center mb-5 bg-[#c41212]/5">
                  <Icon size={22} className="text-[#c41212]" />
                </div>

                {/* Título */}
                <h3
                  className="text-2xl text-white mb-3"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {step.title}
                </h3>

                {/* Descrição */}
                <p className="text-sm text-[#666] leading-relaxed">
                  {step.description}
                </p>

                {/* Seta mobile */}
                {!isLast && (
                  <div className="lg:hidden w-px h-8 bg-[#1f1f1f] mx-auto mt-6" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
