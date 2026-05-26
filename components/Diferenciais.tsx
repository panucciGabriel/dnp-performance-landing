import { Truck, Layers, Cpu, MessageCircle } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

const items = [
  {
    icon: Truck,
    title: "VAMOS ATÉ VOCÊ",
    description:
      "Sem precisar ir até uma oficina. O especialista chega no seu local — garagem, fazenda ou empresa. Sem deslocamento, sem filas, sem complicação.",
  },
  {
    icon: Layers,
    title: "DOIS SEGMENTOS, UM ESPECIALISTA",
    description:
      "Seu carro, sua pickup, seu caminhão ou o trator da fazenda. Mesma competência, equipamento e atenção nos mercados automotivo e agrícola.",
  },
  {
    icon: Cpu,
    title: "EQUIPAMENTO PROFISSIONAL",
    description:
      "Hardware e software de última geração para leitura e escrita de ECU com precisão e segurança. Resultado real, sem improvisos.",
  },
  {
    icon: MessageCircle,
    title: "SUPORTE DIRETO, SEM INTERMEDIÁRIOS",
    description:
      "Você fala diretamente com quem executa o serviço. Diagnóstico, execução e acompanhamento tudo na mesma conversa.",
  },
];

export default function Diferenciais() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <span className="text-[#c41212] text-xl">✦</span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-4"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              POR QUE ESCOLHER A{" "}
              <span className="text-[#c41212]">DNP?</span>
            </h2>
            <p className="text-[#666] text-sm max-w-md mx-auto leading-relaxed">
              Mais do que um serviço — uma experiência diferente de atendimento.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1f1f1f] border border-[#1f1f1f]">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateIn key={item.title} delay={i * 100}>
                <div className="bg-[#111] hover:bg-[#161616] p-8 lg:p-10 flex flex-col gap-4 group transition-colors duration-200 h-full">
                  <div className="w-12 h-12 rounded border border-[#c41212]/30 flex items-center justify-center bg-[#c41212]/5 group-hover:bg-[#c41212]/10 transition-colors shrink-0">
                    <Icon size={22} className="text-[#c41212]" />
                  </div>
                  <h3
                    className="text-2xl text-white leading-tight"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <div className="h-px bg-[#1f1f1f] group-hover:bg-[#c41212]/40 transition-colors mt-2" />
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
