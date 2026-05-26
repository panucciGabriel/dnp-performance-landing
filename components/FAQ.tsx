"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { WA_URL } from "@/lib/constants";
import AnimateIn from "@/components/AnimateIn";

const faqs = [
  {
    question: "O remap cancela a garantia do meu veículo?",
    answer:
      "Tecnicamente, qualquer modificação pode afetar a garantia de fábrica. No entanto, a reprogramação é feita de forma reversível — o mapa original pode ser restaurado a qualquer momento. Recomendamos verificar as condições da garantia do seu veículo antes do serviço.",
  },
  {
    question: "Quanto tempo leva o serviço?",
    answer:
      "A maioria dos serviços de reprogramação é concluída no mesmo dia, entre 2 e 4 horas. Serviços mais complexos — como DPF Off ou instalação de downpipe — podem levar mais tempo. O prazo exato é sempre informado no orçamento.",
  },
  {
    question: "É seguro para o meu motor?",
    answer:
      "Sim. Utilizamos equipamento profissional e mapeamentos específicos para cada modelo de motor. A reprogramação trabalha dentro dos limites seguros do motor, sem comprometer sua durabilidade ou confiabilidade.",
  },
  {
    question: "Vocês atendem na minha cidade ou região?",
    answer:
      "Atendemos a domicílio. Basta informar sua cidade pelo WhatsApp e confirmamos a disponibilidade. Nosso atendimento é totalmente móvel — levamos o equipamento até você.",
  },
  {
    question: "Qual o prazo para retorno do orçamento?",
    answer:
      "Respondemos todos os orçamentos pelo WhatsApp. Na maioria dos casos, retornamos no mesmo dia. Para garantir agilidade, tenha em mãos o modelo do veículo e o serviço desejado.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#111]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <span className="text-[#c41212] text-xl">✦</span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl text-white mt-2 mb-4"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              PERGUNTAS{" "}
              <span className="text-[#c41212]">FREQUENTES</span>
            </h2>
            <p className="text-[#666] text-sm leading-relaxed">
              Tire suas principais dúvidas antes de entrar em contato.
            </p>
          </div>
        </AnimateIn>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <AnimateIn key={faq.question} delay={i * 70}>
              <div className="border border-[#1f1f1f] rounded overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left bg-[#0a0a0a] hover:bg-[#111] transition-colors duration-200 group"
                  aria-expanded={open === i}
                >
                  <span className="text-sm font-medium text-white group-hover:text-[#e0e0e0] transition-colors leading-snug">
                    {faq.question}
                  </span>
                  {open === i ? (
                    <Minus size={16} className="text-[#c41212] shrink-0" />
                  ) : (
                    <Plus size={16} className="text-[#555] shrink-0 group-hover:text-[#888] transition-colors" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open === i ? "max-h-64" : "max-h-0"
                  }`}
                >
                  <div className="px-5 sm:px-6 py-5 bg-[#0a0a0a] border-t border-[#1f1f1f]">
                    <p className="text-sm text-[#888] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={420}>
          <div className="text-center mt-12">
            <p className="text-[#555] text-sm mb-4">
              Ainda tem dúvidas? Fale diretamente conosco.
            </p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c41212] hover:bg-[#e01414] text-white font-bold px-6 py-3 rounded uppercase tracking-widest text-sm transition-colors duration-200"
            >
              <MessageCircle size={16} />
              Perguntar pelo WhatsApp
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
