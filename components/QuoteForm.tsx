"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { submitQuote } from "@/lib/api";
import { WA_URL } from "@/lib/constants";

type FormState = "idle" | "loading" | "success" | "error";

const VEHICLE_TYPES = [
  "Carro",
  "Pickup",
  "Caminhão",
  "Trator",
  "Colheitadeira",
  "Outro",
];

const highlights = [
  {
    title: "Atendimento a domicílio",
    desc: "Vamos até sua garagem, fazenda ou empresa.",
  },
  {
    title: "Retorno no mesmo dia",
    desc: "Resposta rápida pelo WhatsApp.",
  },
  {
    title: "100% reversível",
    desc: "O mapa original é sempre preservado.",
  },
];

export default function QuoteForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    clienteNome: "",
    whatsapp: "",
    veiculoDescricao: "",
    servicoSolicitado: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsApp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setForm((prev) => ({ ...prev, whatsapp: digits }));
  };

  const isValid =
    form.clienteNome.trim().length >= 2 &&
    form.whatsapp.length >= 10 &&
    form.veiculoDescricao.trim().length >= 2 &&
    form.servicoSolicitado.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setState("loading");
    const ok = await submitQuote(form);

    if (ok) {
      setState("success");
      setForm({ clienteNome: "", whatsapp: "", veiculoDescricao: "", servicoSolicitado: "" });
    } else {
      setState("error");
    }
  };

  return (
    <section id="orcamento" className="py-24 bg-[#0a0a0a] border-t border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Coluna esquerda — texto */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#c41212]" />
              <span
                className="text-[#c41212] text-[11px] tracking-[2.4px] uppercase"
                style={{ fontFamily: "var(--font-ibm-mono)" }}
              >
                Solicite seu orçamento
              </span>
            </div>

            <h2
              className="text-5xl sm:text-6xl lg:text-[60px] text-white leading-none tracking-[1.5px] uppercase mb-6"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Vamos tirar o{" "}
              <span className="text-[#c41212]">máximo</span>{" "}
              do seu motor
            </h2>

            <p className="text-[#666] text-sm leading-relaxed mb-10 max-w-md">
              Preencha o formulário e retornamos pelo WhatsApp com o orçamento
              — na maioria dos casos, no mesmo dia.
            </p>

            <ul className="flex flex-col gap-6">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border border-[#c41212] flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c41212]" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{item.title}</p>
                    <p className="text-sm text-[#666] mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna direita — formulário */}
          <div>
            {state === "success" ? (
              <div className="bg-[#111] border border-[#c41212]/30 rounded p-10 text-center">
                <CheckCircle size={48} className="text-[#c41212] mx-auto mb-4" />
                <h3
                  className="text-3xl text-white mb-2"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  ORÇAMENTO RECEBIDO!
                </h3>
                <p className="text-[#888] text-sm mb-6">
                  Recebemos sua solicitação. Vamos entrar em contato pelo WhatsApp em breve.
                </p>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#c41212] text-white px-6 py-3 rounded font-semibold text-sm uppercase tracking-wide"
                >
                  <MessageCircle size={16} />
                  Falar agora pelo WhatsApp
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#111] border border-[#1f1f1f] rounded p-8 flex flex-col gap-5"
              >
                {state === "error" && (
                  <div className="flex items-center gap-3 bg-[#c41212]/10 border border-[#c41212]/30 rounded p-4 text-sm text-[#c41212]">
                    <AlertCircle size={18} />
                    Erro ao enviar. Tente novamente ou fale pelo WhatsApp.
                  </div>
                )}

                {/* Nome */}
                <div>
                  <label className="block text-xs text-[#666] uppercase tracking-widest mb-2">
                    Seu Nome *
                  </label>
                  <input
                    name="clienteNome"
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={form.clienteNome}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] focus:border-[#c41212] text-white placeholder-[#444] rounded px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs text-[#666] uppercase tracking-widest mb-2">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    name="whatsapp"
                    type="tel"
                    required
                    placeholder="Ex: 18991636818"
                    value={form.whatsapp}
                    onChange={handleWhatsApp}
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] focus:border-[#c41212] text-white placeholder-[#444] rounded px-4 py-3 text-sm outline-none transition-colors"
                  />
                  <p className="text-xs text-[#444] mt-1">
                    Somente números — usaremos para retornar o contato.
                  </p>
                </div>

                {/* Veículo */}
                <div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <label className="text-xs text-[#666] uppercase tracking-widest">
                      Tipo de Veículo *
                    </label>
                    <label className="text-xs text-[#666] uppercase tracking-widest">
                      Marca / Modelo{" "}
                      <span className="text-[#444] normal-case tracking-normal">opcional</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="veiculoDescricao"
                      required
                      value={form.veiculoDescricao.split(" — ")[0] ?? ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          veiculoDescricao: e.target.value,
                        }))
                      }
                      className="bg-[#0a0a0a] border border-[#1f1f1f] focus:border-[#c41212] text-white rounded px-4 py-3 text-sm outline-none transition-colors"
                    >
                      <option value="">Selecione</option>
                      {VEHICLE_TYPES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Ex: Fiat Toro 2.0"
                      className="bg-[#0a0a0a] border border-[#1f1f1f] focus:border-[#c41212] text-white placeholder-[#444] rounded px-4 py-3 text-sm outline-none transition-colors"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          veiculoDescricao:
                            (prev.veiculoDescricao.split(" — ")[0] || "Veículo") +
                            " — " +
                            e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Serviço */}
                <div>
                  <label className="block text-xs text-[#666] uppercase tracking-widest mb-2">
                    Serviço Desejado *
                  </label>
                  <textarea
                    name="servicoSolicitado"
                    required
                    rows={3}
                    placeholder="Ex: Remap de motor + DPF Off"
                    value={form.servicoSolicitado}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] focus:border-[#c41212] text-white placeholder-[#444] rounded px-4 py-3 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || state === "loading"}
                  className="flex items-center justify-center gap-3 bg-[#c41212] hover:bg-[#e01414] disabled:bg-[#333] disabled:text-[#666] text-white font-bold py-4 rounded uppercase tracking-widest text-sm transition-all duration-200 mt-2"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar Orçamento
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#444]">
                  ou fale direto:{" "}
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c41212] hover:underline"
                  >
                    WhatsApp (18) 99163-6818
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
