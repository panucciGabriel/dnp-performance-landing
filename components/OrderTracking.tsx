"use client";

import { useState } from "react";
import { Search, Loader2, Clock, Wrench, CheckCircle, Package } from "lucide-react";
import { trackOrder, type OrderTrack } from "@/lib/api";

const STATUS_CONFIG = {
  ABERTO: {
    label: "Aguardando",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    icon: Clock,
  },
  EM_ANDAMENTO: {
    label: "Em Andamento",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
    icon: Wrench,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/30",
    icon: CheckCircle,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrderTracking() {
  const [whatsapp, setWhatsapp] = useState("");
  const [orders, setOrders] = useState<OrderTrack[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10) return;

    setLoading(true);
    setSearched(true);
    const result = await trackOrder(digits);
    setOrders(result);
    setLoading(false);
  };

  return (
    <section id="rastreamento" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <span className="text-[#c41212] text-xl">✦</span>
          <h2
            className="text-5xl sm:text-6xl text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            RASTREAR <span className="text-[#c41212]">PEDIDO</span>
          </h2>
          <p className="text-[#666] text-sm">
            Digite o número de WhatsApp cadastrado para ver o status do seu
            serviço.
          </p>
        </div>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="tel"
            placeholder="Seu WhatsApp com DDD (ex: 18991636818)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 11))}
            className="flex-1 bg-[#111] border border-[#1f1f1f] focus:border-[#c41212] text-white placeholder-[#444] rounded px-4 py-3 text-sm outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || whatsapp.replace(/\D/g, "").length < 10}
            className="flex items-center gap-2 bg-[#c41212] hover:bg-[#e01414] disabled:bg-[#333] disabled:text-[#666] text-white px-5 py-3 rounded font-semibold text-sm uppercase tracking-wide transition-all duration-200"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </button>
        </form>

        {/* Resultados */}
        {searched && !loading && (
          <div>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-12 border border-[#1f1f1f] rounded">
                <Package size={36} className="text-[#333] mx-auto mb-4" />
                <p className="text-[#666] text-sm">
                  Nenhum pedido encontrado para este número.
                </p>
                <p className="text-xs text-[#444] mt-2">
                  Verifique o número ou entre em contato pelo WhatsApp.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={order.id}
                      className="bg-[#111] border border-[#1f1f1f] rounded p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#444] font-mono">
                          #{String(order.id).padStart(4, "0")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}
                        >
                          <Icon size={12} />
                          {cfg.label}
                        </span>
                      </div>

                      <div>
                        <p className="text-white font-medium text-sm">
                          {order.descricao || "Serviço"}
                        </p>
                        <p className="text-[#666] text-xs mt-0.5">
                          {order.veiculo}
                        </p>
                      </div>

                      <p className="text-xs text-[#444]">
                        Aberto em {formatDate(order.criadoEm)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
