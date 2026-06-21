"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Users, CheckCircle, DollarSign,
  Eye, MapPin, Package,
  BarChart2, ArrowUpRight, Plus, Download,
  RefreshCw, Check,
  Minus, TrendingUp,
} from "lucide-react";
import { fetchAdminOrders, clearToken, type AdminOrder } from "@/lib/admin-api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Row {
  id: number;
  orderId: string;
  client: string;
  service: string;
  vehicle: string;
  date: string;
  status: string;
}

function toRow(o: AdminOrder): Row {
  let client  = "Cliente não informado";
  let service = o.description || "—";
  let vehicle = "—";

  if (o.vehicle) {
    const parts = [o.vehicle.brand, o.vehicle.model].filter(Boolean);
    vehicle = parts.join(" ").trim() || "—";
    if (o.vehicle.client) client = o.vehicle.client.name || client;
  }

  if (o.description?.includes(" | ")) {
    o.description.split(" | ").forEach((p) => {
      const t = p.trim();
      if (t.startsWith("LEAD:"))    client  = t.replace("LEAD:", "").trim();
      if (t.startsWith("Máquina:")) vehicle = t.replace("Máquina:", "").trim();
      if (t.startsWith("Serviço:")) service = t.replace("Serviço:", "").trim();
    });
  }

  return {
    id:      o.id,
    orderId: `#${String(o.id).padStart(4, "0")}`,
    client,
    service,
    vehicle,
    date:    new Date(o.createdAt).toLocaleDateString("pt-BR"),
    status:  o.status,
  };
}

// ─── Status badge — cores exatas do Figma ────────────────────────────────────

const STATUS_CFG: Record<string, {
  label: string; dotBg: string; bg: string; border: string; text: string;
}> = {
  EM_ANDAMENTO: {
    label:  "Em Andamento",
    dotBg:  "bg-[#c41212]",
    bg:     "bg-[rgba(196,18,18,0.08)]",
    border: "border-[rgba(196,18,18,0.20)]",
    text:   "text-[#c41212]",
  },
  ABERTO: {
    label:  "Pendente",
    dotBg:  "bg-[#666]",
    bg:     "bg-[rgba(102,102,102,0.1)]",
    border: "border-[#1f1f1f]",
    text:   "text-[#666]",
  },
  CONCLUIDO: {
    label:  "Concluído",
    dotBg:  "bg-[#b8b8b8]",
    bg:     "bg-[rgba(184,184,184,0.07)]",
    border: "border-[rgba(184,184,184,0.12)]",
    text:   "text-[#b8b8b8]",
  },
  CONCLUÍDO: {
    label:  "Concluído",
    dotBg:  "bg-[#b8b8b8]",
    bg:     "bg-[rgba(184,184,184,0.07)]",
    border: "border-[rgba(184,184,184,0.12)]",
    text:   "text-[#b8b8b8]",
  },
  CANCELADO: {
    label:  "Cancelado",
    dotBg:  "bg-[#444]",
    bg:     "bg-[rgba(255,255,255,0.02)]",
    border: "border-[#1f1f1f]",
    text:   "text-[#444]",
  },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.ABERTO;
  return (
    <span className={`inline-flex items-center gap-[5px] font-mono text-[9px] uppercase tracking-[0.9px] px-[9px] py-[4px] border rounded-[2px] ${c.bg} ${c.border} ${c.text}`}>
      <span className={`w-[5px] h-[5px] rounded-[2.5px] shrink-0 ${c.dotBg}`} />
      {c.label}
    </span>
  );
}

// ─── Activity feed — derivado dos orders reais ────────────────────────────────

interface ActivityItem {
  Icon: React.ElementType;
  red: boolean;
  parts: Array<{ text: string; bold: boolean }>;
  time: string;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min  = Math.floor(diff / 60_000);
  const h    = Math.floor(diff / 3_600_000);
  const d    = Math.floor(diff / 86_400_000);
  if (min < 1)  return "Agora mesmo";
  if (min < 60) return `Há ${min} min`;
  if (h   < 24) return `Há ${h}h`;
  if (d   === 1) return "Ontem";
  return `${d} dias atrás`;
}

function buildActivity(orders: AdminOrder[]): ActivityItem[] {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7)
    .map((o): ActivityItem => {
      const id  = `#${String(o.id).padStart(4, "0")}`;
      let client = "Cliente";
      if (o.vehicle?.client?.name) client = o.vehicle.client.name;
      else {
        const m = o.description?.match(/LEAD:\s*([^|]+)/);
        if (m) client = m[1].trim();
      }

      if (o.status === "CONCLUIDO" || (o.status as string) === "CONCLUÍDO") {
        return {
          Icon: Check, red: false,
          parts: [
            { text: "Serviço ", bold: false },
            { text: id, bold: true },
            { text: ` concluído para ${client}.`, bold: false },
          ],
          time: relativeTime(o.createdAt),
        };
      }
      if (o.status === "EM_ANDAMENTO") {
        return {
          Icon: RefreshCw, red: false,
          parts: [
            { text: "Serviço ", bold: false },
            { text: id, bold: true },
            { text: ` em andamento para ${client}.`, bold: false },
          ],
          time: relativeTime(o.createdAt),
        };
      }
      return {
        Icon: FileText, red: true,
        parts: [
          { text: "Novo orçamento", bold: true },
          { text: ` de ${client} recebido.`, bold: false },
        ],
        time: relativeTime(o.createdAt),
      };
    });
}

// ─── Bottom quick-access cards ────────────────────────────────────────────────

const QUICK = [
  {
    Icon: MapPin,
    title: "RASTREAMENTO",
    desc:  "Acompanhe status e localização de cada pedido ativo em tempo real.",
    info:  "3 pedidos em rota",
  },
  {
    Icon: Package,
    title: "LOJA DE PEÇAS",
    desc:  "Gerencie o catálogo de peças, preços e estoque disponível na loja.",
    info:  "42 itens · 6 com estoque baixo",
  },
  {
    Icon: BarChart2,
    title: "RELATÓRIOS",
    desc:  "Visualize métricas de performance, conversão e receita por período.",
    info:  "Último relatório: 01/06/26",
  },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [orders,  setOrders]  = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
      setError(false);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        clearToken();
        router.replace("/admin/login");
        return;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  // Quando API falha (sem backend), usa dados do design como fallback visual
  const useMock = error && orders.length === 0;

  const MOCK_ROWS: Row[] = [
    { id: 41, orderId: "#0041", client: "Carlos Mendonça",  service: "Remap ECU + DPF Off",    vehicle: "Hilux SRX 2022",    date: "11/06/26", status: "EM_ANDAMENTO" },
    { id: 40, orderId: "#0040", client: "Fernanda Rocha",   service: "ARLA 32 Off",             vehicle: "John Deere 6110J",  date: "10/06/26", status: "ABERTO"       },
    { id: 39, orderId: "#0039", client: "Rodrigo Lima",     service: "Escapamento Inox",        vehicle: "Amarok V6 2021",    date: "09/06/26", status: "CONCLUIDO"    },
    { id: 38, orderId: "#0038", client: "Ana Paula Souza",  service: "Chip de Potência",        vehicle: "S10 2.8 2020",      date: "08/06/26", status: "ABERTO"       },
    { id: 37, orderId: "#0037", client: "Jonas Ferreira",   service: "EGR Off + Diagnóstico",   vehicle: "New Holland T7",    date: "07/06/26", status: "CONCLUIDO"    },
    { id: 36, orderId: "#0036", client: "Marcos Teixeira",  service: "Remap ECU",               vehicle: "Ranger 3.2 2019",   date: "06/06/26", status: "CANCELADO"    },
  ];

  const total   = useMock ? 47  : orders.length;
  const pending = useMock ? 7   : orders.filter((o) => o.status === "ABERTO").length;
  const done    = useMock ? 31  : orders.filter((o) => o.status === "CONCLUIDO" || (o.status as string) === "CONCLUÍDO").length;

  const recent = useMock
    ? MOCK_ROWS
    : [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
        .map(toRow);

  const month = new Date()
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(" de ", " ")
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col gap-5 px-7 pt-6 pb-8 min-h-full overflow-auto">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          {/* Eyebrow — w-[18px] h-px conforme Figma */}
          <div className="flex items-center gap-2">
            <div className="w-[18px] h-px bg-dnp-red shrink-0" />
            <span className="font-mono text-[10px] text-dnp-red uppercase tracking-[2.2px]">
              Visão Geral · {month}
            </span>
          </div>
          {/* Title — Bebas Neue, line-height 41.6px conforme Figma */}
          <div className="flex flex-col pt-px">
            <h1 className="font-heading text-[41.6px] text-white" style={{ lineHeight: "41.6px", letterSpacing: "1.25px" }}>
              PAINEL DE CONTROLE
            </h1>
          </div>
          {/* Subtitle */}
          <p className="font-body text-[13px] text-[#666]">
            Gerencie orçamentos, clientes e serviços em tempo real.
          </p>
          {error && (
            <p className="font-mono text-[9px] text-dnp-red uppercase tracking-wider mt-0.5">
              Sem conexão com o backend
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button className="flex items-center gap-[7px] h-9 border border-[#1f1f1f] text-dnp-silver font-mono text-[10px] uppercase tracking-[1.6px] px-4 rounded transition-colors hover:text-white cursor-pointer">
            <Download className="w-3 h-3 shrink-0" />
            Exportar
          </button>
          <button className="flex items-center gap-[7px] h-9 bg-dnp-red text-white font-mono text-[10px] uppercase tracking-[1.6px] px-[18px] rounded transition-colors hover:bg-dnp-red-light cursor-pointer">
            <Plus className="w-3 h-3 shrink-0" />
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* ── KPI Cards — grid com gap 1px (separador) ── */}
      {/* Figma: grid gap-x-px, cada card h-[160.2px], bg-[#111] */}
      <div className="shrink-0 grid grid-cols-2 xl:grid-cols-4 gap-px bg-[#1f1f1f] border border-[#1f1f1f] rounded overflow-hidden">

        {/* KPI 1: Orçamentos — value em VERMELHO conforme Figma */}
        <div className="bg-[#111] h-[160.2px] relative">
          <div className="absolute left-[22px] right-[22px] top-5 flex items-center justify-between">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.8px]">Orçamentos</p>
            <div className="w-6 h-6 border border-[rgba(196,18,18,0.22)] flex items-center justify-center rounded-[3px]">
              <FileText className="w-[13px] h-[13px] text-dnp-red" />
            </div>
          </div>
          <div className="absolute left-[22px] right-[22px] top-[53px]">
            <p className="font-heading text-[43.2px] text-dnp-red" style={{ lineHeight: "43.2px", letterSpacing: "0.86px" }}>
              {loading ? "—" : String(total)}
            </p>
          </div>
          <div className="absolute left-[22px] right-[22px] flex items-center gap-[5px]" style={{ top: "105.21px" }}>
            <TrendingUp className="w-[11px] h-[11px] text-dnp-green shrink-0" />
            <p className="font-mono text-[10px] text-dnp-green tracking-[0.8px]">+12% vs. mês anterior</p>
          </div>
          <div className="absolute left-[22px] right-[22px]" style={{ top: "126.21px" }}>
            <p className="font-body text-[11px] text-[#666]">Este mês · {pending} pendentes</p>
          </div>
        </div>

        {/* KPI 2: Clientes Ativos — value em BRANCO */}
        <div className="bg-[#111] h-[160.2px] relative">
          <div className="absolute left-[22px] right-[22px] top-5 flex items-center justify-between">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.8px]">Clientes Ativos</p>
            <div className="w-6 h-6 border border-[rgba(196,18,18,0.22)] flex items-center justify-center rounded-[3px]">
              <Users className="w-[13px] h-[13px] text-dnp-red" />
            </div>
          </div>
          <div className="absolute left-[22px] right-[22px] top-[53px]">
            <p className="font-heading text-[43.2px] text-[#666]" style={{ lineHeight: "43.2px", letterSpacing: "0.86px" }}>—</p>
          </div>
          <div className="absolute left-[22px] right-[22px] flex items-center gap-[5px]" style={{ top: "105.21px" }}>
            <Minus className="w-[11px] h-[11px] text-[#666] shrink-0" />
            <p className="font-mono text-[10px] text-[#666] tracking-[0.8px]">Em breve</p>
          </div>
          <div className="absolute left-[22px] right-[22px]" style={{ top: "126.21px" }}>
            <p className="font-body text-[11px] text-[#666]">Métrica ainda não disponível</p>
          </div>
        </div>

        {/* KPI 3: Serviços Concluídos — value em BRANCO */}
        <div className="bg-[#111] h-[160.2px] relative">
          <div className="absolute left-[22px] right-[22px] top-5 flex items-center justify-between">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.8px]">Serviços Concluídos</p>
            <div className="w-6 h-6 border border-[rgba(196,18,18,0.22)] flex items-center justify-center rounded-[3px]">
              <CheckCircle className="w-[13px] h-[13px] text-dnp-red" />
            </div>
          </div>
          <div className="absolute left-[22px] right-[22px] top-[53px]">
            <p className="font-heading text-[43.2px] text-white" style={{ lineHeight: "43.2px", letterSpacing: "0.86px" }}>
              {loading ? "—" : String(done)}
            </p>
          </div>
          <div className="absolute left-[22px] right-[22px] flex items-center gap-[5px]" style={{ top: "105.21px" }}>
            <Minus className="w-[11px] h-[11px] text-[#666] shrink-0" />
            <p className="font-mono text-[10px] text-[#666] tracking-[0.8px]">Igual ao mês anterior</p>
          </div>
          <div className="absolute left-[22px] right-[22px]" style={{ top: "126.21px" }}>
            <p className="font-body text-[11px] text-[#666]">Concluídos em junho</p>
          </div>
        </div>

        {/* KPI 4: Receita Est. — usa flex (não absolute) conforme Figma */}
        <div className="bg-[#111] h-[160.2px]">
          <div className="flex flex-col gap-2 px-[22px] pt-[22px] pb-7">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.8px]">Receita Est.</p>
              <div className="w-[26px] h-[26px] border border-[rgba(196,18,18,0.22)] flex items-center justify-center rounded-[3px]">
                <DollarSign className="w-[13px] h-[13px] text-dnp-red" />
              </div>
            </div>
            <div className="pt-1">
              <p className="font-heading text-[30.4px] text-[#666]" style={{ lineHeight: "30.4px", letterSpacing: "0.61px" }}>
                —
              </p>
            </div>
            <div className="flex items-center gap-[5px]">
              <Minus className="w-[11px] h-[11px] text-[#666] shrink-0" />
              <p className="font-mono text-[10px] text-[#666] tracking-[0.8px]">Em breve</p>
            </div>
            <p className="font-body text-[11px] text-[#666]">Métrica ainda não disponível</p>
          </div>
        </div>
      </div>

      {/* ── Middle section: Table + Activity (side by side) ── */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-px bg-[#1f1f1f] border border-[#1f1f1f] rounded overflow-hidden shrink-0">

        {/* Orders table */}
        <div className="bg-[#111] flex flex-col">
          {/* Panel header */}
          <div className="flex items-center justify-between px-[22px] py-4 border-b border-[#1f1f1f]">
            <div className="flex flex-col gap-px">
              <h2 className="font-heading text-[19.2px] text-white tracking-[1.34px]">ORÇAMENTOS RECENTES</h2>
              <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.08px]">Últimas solicitações recebidas</p>
            </div>
            <button className="flex items-center gap-[7px] h-[30px] border border-[#1f1f1f] text-dnp-silver font-mono text-[9px] uppercase tracking-[1.44px] px-3 rounded cursor-pointer hover:text-white transition-colors">
              Ver todos
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-5 h-5 text-[#666] animate-spin" />
            </div>
          ) : recent.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-body text-xs text-[#666]">Nenhum orçamento encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1f1f1f]">
                    {["#", "Cliente", "Serviço", "Veículo", "Data", "Status", ""].map((col) => (
                      <th key={col} className="px-[22px] py-[11px] text-left font-mono font-medium text-[9px] text-[#666] uppercase tracking-[1.62px] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-white/[0.015] transition-colors ${i < recent.length - 1 ? "border-b border-[#1f1f1f]" : ""}`}
                    >
                      <td className="px-[22px] py-[18.5px] font-mono text-[11px] text-[#666] whitespace-nowrap">
                        {row.orderId}
                      </td>
                      <td className="px-[22px] py-[17.5px] font-body font-medium text-[13px] text-white whitespace-nowrap">
                        {row.client}
                      </td>
                      <td className="px-[22px] py-[18px] font-body text-[12px] text-[#b8b8b8] max-w-[200px]">
                        <span className="block truncate">{row.service}</span>
                      </td>
                      <td className="px-[22px] py-[18.5px] font-mono text-[11px] text-[#666] whitespace-nowrap">
                        {row.vehicle}
                      </td>
                      <td className="px-[22px] py-[18.5px] font-mono text-[11px] text-[#666] whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-[22px] py-[16px]">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-[22px] pt-3 pb-[13px]">
                        <button className="w-[26px] h-[26px] border border-[#1f1f1f] flex items-center justify-center text-[#666] hover:text-white transition-colors cursor-pointer rounded-[3px]">
                          <Eye className="w-[11px] h-[11px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-[#111] flex flex-col">
          <div className="px-[22px] py-4 border-b border-[#1f1f1f]">
            <h2 className="font-heading text-[19.2px] text-white tracking-[1.34px]">ATIVIDADE</h2>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.08px] mt-px">Atualizações recentes</p>
          </div>
          <div className="flex flex-col divide-y divide-[#1f1f1f]">
            {buildActivity(orders).map(({ Icon, red, parts, time }: ActivityItem, i: number) => (
              <div key={i} className="flex items-start gap-[11px] px-[18px] py-3">
                <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 border ${
                  red
                    ? "bg-[rgba(196,18,18,0.05)] border-[rgba(196,18,18,0.28)]"
                    : "bg-transparent border-[#1f1f1f]"
                }`}>
                  <Icon className={`w-3 h-3 ${red ? "text-dnp-red" : "text-[#666]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[12px] leading-[17.4px]">
                    {parts.map((p, j) => (
                      <span key={j} className={p.bold ? "text-white font-medium" : "text-dnp-silver font-normal"}>
                        {p.text}
                      </span>
                    ))}
                  </p>
                  <p className="font-mono text-[9px] text-[#666] tracking-[0.9px] mt-[3px]">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom quick-access cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1f1f1f] border border-[#1f1f1f] rounded overflow-hidden shrink-0">
        {QUICK.map(({ Icon, title, desc, info }) => (
          <div key={title} className="bg-[#111] px-[22px] py-[18px] flex flex-col gap-2.5 cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div className="w-[34px] h-[34px] border border-[rgba(196,18,18,0.22)] flex items-center justify-center rounded">
                <Icon className="w-[17px] h-[17px] text-dnp-red" />
              </div>
              <ArrowUpRight className="w-3 h-3 text-[#666]" />
            </div>
            <h3 className="font-heading text-[17.6px] text-white tracking-[1.06px]">{title}</h3>
            <p className="font-body text-[12px] text-[#666] leading-[18px]">{desc}</p>
            <p className="font-mono text-[9px] text-dnp-red uppercase tracking-[1.26px]">{info}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
