"use client";

import { useState } from "react";
import { Search, Loader2, Clock, Wrench, CheckCircle, Package } from "lucide-react";
import { trackOrder, type OrderTrack } from "@/lib/api";

// ============================================================
//  CONFIG DE STATUS
// ============================================================
const STATUS_CONFIG = {
  ABERTO: {
    label:   "Aguardando",
    color:   "text-amber-400",
    border:  "border-amber-400/30",
    bg:      "bg-amber-400/10",
    step:    1,
    icon:    Clock,
  },
  EM_ANDAMENTO: {
    label:   "Em Andamento",
    color:   "text-sky-400",
    border:  "border-sky-400/30",
    bg:      "bg-sky-400/10",
    step:    2,
    icon:    Wrench,
  },
  CONCLUIDO: {
    label:   "Concluído",
    color:   "text-emerald-400",
    border:  "border-emerald-400/30",
    bg:      "bg-emerald-400/10",
    step:    3,
    icon:    CheckCircle,
  },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

// ============================================================
//  CARD DE PEDIDO (com barra de progresso)
// ============================================================
function OrderCard({ order }: { order: OrderTrack }) {
  const cfg  = STATUS_CONFIG[order.status as StatusKey] ?? STATUS_CONFIG.ABERTO;
  const Icon = cfg.icon;

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-5 flex flex-col gap-3">

      {/* Topo: ID + badge de status */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-[#444]">
          #{String(order.id).padStart(4, "0")}
        </span>
        <span
          className={[
            "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase",
            "px-3 py-1 rounded-full border",
            cfg.bg, cfg.border, cfg.color,
          ].join(" ")}
        >
          <Icon size={12} />
          {cfg.label}
        </span>
      </div>

      {/* Descrição + veículo */}
      <div>
        <p className="text-white font-medium text-sm">
          {order.descricao || "Serviço"}
        </p>
        <p className="text-[#666] text-xs mt-0.5">{order.veiculo}</p>
      </div>

      {/* Barra de progresso */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={[
              "h-1 flex-1 rounded-full transition-colors duration-300",
              s <= cfg.step ? "bg-[#c41212]" : "bg-[#1f1f1f]",
            ].join(" ")}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[9px] tracking-[0.14em] uppercase text-[#444]">
        <span>Recebido</span>
        <span>Execução</span>
        <span>Concluído</span>
      </div>

      {/* Data */}
      <p className="font-mono text-[11px] text-[#444]">
        Aberto em {formatDate(order.criadoEm)}
      </p>
    </div>
  );
}

// ============================================================
//  ORDER TRACKING
// ============================================================
export default function OrderTracking() {
  const [whatsapp, setWhatsapp]   = useState("");
  const [orders,   setOrders]     = useState<OrderTrack[] | null>(null);
  const [loading,  setLoading]    = useState(false);
  const [searched, setSearched]   = useState(false);

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
    <section id="rastreamento" className="py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[#c41212] mb-4">
            <span className="w-5 h-px bg-[#c41212]" />
            Acompanhe seu serviço
          </span>
          <h2
            className="text-5xl sm:text-6xl text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Rastrear <span className="text-[#c41212]">Pedido</span>
          </h2>
          <p className="text-[#555] text-sm leading-relaxed">
            Digite o número de WhatsApp cadastrado para ver o status do seu serviço.
          </p>
        </div>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="flex gap-2.5 mb-8">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Seu WhatsApp com DDD (ex: 18991636818)"
            value={whatsapp}
            onChange={(e) =>
              setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
            className="flex-1 bg-[#111] border border-[#1f1f1f] focus:border-[#c41212] text-white placeholder-[#444] rounded px-4 h-12 text-sm outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || whatsapp.replace(/\D/g, "").length < 10}
            className="flex items-center gap-2 bg-[#c41212] hover:bg-[#e01414] disabled:bg-[#1f1f1f] disabled:text-[#444] text-white px-5 h-12 rounded font-mono text-[12px] tracking-[0.14em] uppercase transition-all duration-200"
            aria-label="Buscar pedido"
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : <><Search size={18} /><span className="hidden sm:inline ml-1">Buscar</span></>
            }
          </button>
        </form>

        {/* Resultados */}
        {searched && !loading && (
          <div>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-12 border border-[#1f1f1f] rounded bg-[#111]">
                <Package size={36} className="text-[#222] mx-auto mb-4" />
                <p className="text-[#555] text-sm">
                  Nenhum pedido encontrado para este número.
                </p>
                <p className="text-xs text-[#333] mt-2">
                  Verifique o número ou entre em contato pelo WhatsApp.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
