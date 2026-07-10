"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Users, CheckCircle, DollarSign,
  Eye, MapPin, Package,
  BarChart2, ArrowUpRight, Plus, Download,
  RefreshCw, Check, Lock,
  Minus,
} from "lucide-react";
import { fetchAdminOrders, clearToken, type AdminOrder } from "@/lib/admin-api";
import { useCountUp } from "@/lib/useCountUp";

// ─── prefers-reduced-motion ───────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// ─── KPI number com contador animado (respeita reduced-motion) ────────────────

function KpiNumber({ value, className }: { value: number; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, val } = useCountUp(value);
  if (reduced) return <span className={className}>{value}</span>;
  return <span ref={ref} className={className}>{val}</span>;
}

// ─── Skeleton placeholder ──────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded bg-dnp-border motion-reduce:animate-none ${className}`}
    />
  );
}

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

// ─── Status badge — tints semânticos sobre a paleta DNP ───────────────────────

const STATUS_CFG: Record<string, {
  label: string; dotBg: string; bg: string; border: string; text: string; pulse?: boolean;
}> = {
  EM_ANDAMENTO: {
    label:  "Em Andamento",
    dotBg:  "bg-dnp-red",
    bg:     "bg-[rgba(196,18,18,0.08)]",
    border: "border-[rgba(196,18,18,0.20)]",
    text:   "text-dnp-red",
    pulse:  true,
  },
  ABERTO: {
    label:  "Pendente",
    dotBg:  "bg-dnp-silver",
    bg:     "bg-[rgba(184,184,184,0.06)]",
    border: "border-[rgba(184,184,184,0.14)]",
    text:   "text-dnp-silver",
  },
  CONCLUIDO: {
    label:  "Concluído",
    dotBg:  "bg-dnp-green",
    bg:     "bg-[rgba(61,154,108,0.08)]",
    border: "border-[rgba(61,154,108,0.20)]",
    text:   "text-dnp-green",
  },
  CONCLUÍDO: {
    label:  "Concluído",
    dotBg:  "bg-dnp-green",
    bg:     "bg-[rgba(61,154,108,0.08)]",
    border: "border-[rgba(61,154,108,0.20)]",
    text:   "text-dnp-green",
  },
  CANCELADO: {
    label:  "Cancelado",
    dotBg:  "bg-dnp-gray",
    bg:     "bg-white/[0.02]",
    border: "border-dnp-border",
    text:   "text-dnp-gray",
  },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.ABERTO;
  return (
    <span className={`inline-flex items-center gap-[5px] font-mono text-[10px] uppercase tracking-[0.9px] px-[9px] py-[4px] border rounded-[2px] ${c.bg} ${c.border} ${c.text}`}>
      <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${c.dotBg} ${c.pulse ? "animate-pulse-slow motion-reduce:animate-none" : ""}`} />
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

// ─── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label, Icon, children, footer, loading,
}: {
  label: string;
  Icon: React.ElementType;
  children: React.ReactNode;
  footer: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="group bg-dnp-dark flex flex-col justify-between gap-4 p-5 min-h-[150px] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(196,18,18,0.35),0_8px_20px_-8px_rgba(196,18,18,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-dnp-gray uppercase tracking-[1.8px]">{label}</p>
        <div className="w-7 h-7 border border-[rgba(196,18,18,0.22)] flex items-center justify-center rounded-[3px] shrink-0">
          <Icon className="w-[14px] h-[14px] text-dnp-red" aria-hidden />
        </div>
      </div>
      <div className="min-h-[44px] flex items-end">
        {loading ? <Skeleton className="h-9 w-24" /> : children}
      </div>
      <p className="font-body text-[11px] text-dnp-silver">{footer}</p>
    </div>
  );
}

// ─── Quick-access cards (em desenvolvimento) ──────────────────────────────────

const QUICK = [
  {
    Icon: MapPin,
    title: "RASTREAMENTO",
    desc:  "Acompanhe status e localização de cada pedido ativo em tempo real.",
  },
  {
    Icon: Package,
    title: "LOJA DE PEÇAS",
    desc:  "Gerencie o catálogo de peças, preços e estoque disponível na loja.",
  },
  {
    Icon: BarChart2,
    title: "RELATÓRIOS",
    desc:  "Visualize métricas de performance, conversão e receita por período.",
  },
];

function QuickCard({ Icon, title, desc }: { Icon: React.ElementType; title: string; desc: string }) {
  return (
    <div
      aria-disabled
      className="bg-dnp-dark px-5 py-[18px] flex flex-col gap-2.5 opacity-60 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="w-[34px] h-[34px] border border-dnp-border flex items-center justify-center rounded">
          <Icon className="w-[17px] h-[17px] text-dnp-gray" aria-hidden />
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-dnp-gray uppercase tracking-[1.26px]">
          <Lock className="w-2.5 h-2.5" aria-hidden />
          Em breve
        </span>
      </div>
      <h3 className="font-heading text-[17.6px] text-white tracking-[1.06px]">{title}</h3>
      <p className="font-body text-[12px] text-dnp-silver leading-[18px]">{desc}</p>
    </div>
  );
}

const btnFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dnp-red focus-visible:ring-offset-2 focus-visible:ring-offset-dnp-dark";

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

  const total   = orders.length;
  const pending = orders.filter((o) => o.status === "ABERTO").length;
  const done    = orders.filter((o) => o.status === "CONCLUIDO" || (o.status as string) === "CONCLUÍDO").length;

  const clientesAtivos = new Set(
    orders
      .map((o) => o.vehicle?.client?.contatoWhatsapp || o.vehicle?.client?.name)
      .filter((id): id is string => Boolean(id))
  ).size;

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map(toRow);

  const activity = buildActivity(orders);

  const month = new Date()
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(" de ", " ")
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col gap-5 px-4 sm:px-7 pt-6 pb-8 min-h-full">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-[18px] h-px bg-dnp-red shrink-0" />
            <span className="font-mono text-[10px] text-dnp-red uppercase tracking-[2.2px]">
              Visão Geral · {month}
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-[41.6px] text-white leading-none tracking-[1.25px] pt-px">
            PAINEL DE CONTROLE
          </h1>
          <p className="font-body text-[13px] text-dnp-silver">
            Gerencie orçamentos, clientes e serviços em tempo real.
          </p>
          {error && (
            <p className="font-mono text-[9px] text-dnp-red uppercase tracking-wider mt-0.5" role="status">
              Sem conexão com o backend
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            className={`flex items-center gap-[7px] h-9 border border-dnp-border text-dnp-silver font-mono text-[10px] uppercase tracking-[1.6px] px-4 rounded transition-colors hover:text-white hover:border-dnp-gray cursor-pointer ${btnFocus}`}
          >
            <Download className="w-3 h-3 shrink-0" aria-hidden />
            Exportar
          </button>
          <button
            type="button"
            className={`flex items-center gap-[7px] h-9 bg-dnp-red text-white font-mono text-[10px] uppercase tracking-[1.6px] px-[18px] rounded transition-colors hover:bg-dnp-red-light cursor-pointer ${btnFocus}`}
          >
            <Plus className="w-3 h-3 shrink-0" aria-hidden />
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-dnp-border border border-dnp-border rounded overflow-hidden">

        <KpiCard label="Orçamentos" Icon={FileText} loading={loading}
          footer={<>Este mês · {pending} pendentes</>}>
          <p className="font-heading text-[40px] leading-none tracking-[0.86px] text-dnp-red">
            <KpiNumber key={total} value={total} />
          </p>
        </KpiCard>

        <KpiCard label="Clientes Ativos" Icon={Users} loading={loading}
          footer="Com pelo menos 1 orçamento">
          <p className="font-heading text-[40px] leading-none tracking-[0.86px] text-white">
            <KpiNumber key={clientesAtivos} value={clientesAtivos} />
          </p>
        </KpiCard>

        <KpiCard label="Serviços Concluídos" Icon={CheckCircle} loading={loading}
          footer={<>Concluídos em {month}</>}>
          <p className="font-heading text-[40px] leading-none tracking-[0.86px] text-white">
            <KpiNumber key={done} value={done} />
          </p>
        </KpiCard>

        <KpiCard label="Receita Est." Icon={DollarSign}
          footer="Métrica ainda não disponível">
          <div className="flex flex-col gap-1.5">
            <p className="font-heading text-[28px] leading-none tracking-[0.61px] text-dnp-gray">—</p>
            <span className="flex items-center gap-[5px] font-mono text-[10px] text-dnp-gray tracking-[0.8px]">
              <Minus className="w-[11px] h-[11px] shrink-0" aria-hidden />
              Em breve
            </span>
          </div>
        </KpiCard>
      </div>

      {/* ── Middle: Table + Activity ── */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-px bg-dnp-border border border-dnp-border rounded overflow-hidden shrink-0">

        {/* Orders table */}
        <section className="bg-dnp-dark flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dnp-border">
            <div className="flex flex-col gap-px">
              <h2 className="font-heading text-[19.2px] text-white tracking-[1.34px]">ORÇAMENTOS RECENTES</h2>
              <p className="font-mono text-[9px] text-dnp-gray uppercase tracking-[1.08px]">Últimas solicitações recebidas</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/orcamentos")}
              className={`flex items-center gap-[7px] h-[30px] border border-dnp-border text-dnp-silver font-mono text-[9px] uppercase tracking-[1.44px] px-3 rounded cursor-pointer hover:text-white hover:border-dnp-gray transition-colors ${btnFocus}`}
            >
              Ver todos
              <ArrowUpRight className="w-2.5 h-2.5" aria-hidden />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col divide-y divide-dnp-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-[18px]">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24 hidden sm:block" />
                  <div className="flex-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 px-6 text-center">
              <FileText className="w-6 h-6 text-dnp-gray" aria-hidden />
              <p className="font-body text-[13px] text-dnp-silver">Nenhum orçamento ainda</p>
              <p className="font-mono text-[10px] text-dnp-gray uppercase tracking-wide">
                As novas solicitações aparecem aqui automaticamente
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Orçamentos recentes</caption>
                <thead>
                  <tr className="border-b border-dnp-border">
                    {["#", "Cliente", "Serviço", "Veículo", "Data", "Status", ""].map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-5 py-[11px] text-left font-mono font-medium text-[9px] text-dnp-gray uppercase tracking-[1.62px] whitespace-nowrap"
                      >
                        {col || <span className="sr-only">Ações</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`opacity-0 animate-fade-up motion-reduce:opacity-100 motion-reduce:animate-none hover:bg-white/[0.02] transition-colors ${i < recent.length - 1 ? "border-b border-dnp-border" : ""}`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <td className="px-5 py-[18px] font-mono text-[11px] text-dnp-gray whitespace-nowrap">
                        {row.orderId}
                      </td>
                      <td className="px-5 py-[18px] font-body font-medium text-[13px] text-white whitespace-nowrap">
                        {row.client}
                      </td>
                      <td className="px-5 py-[18px] font-body text-[12px] text-dnp-silver max-w-[200px]">
                        <span className="block truncate">{row.service}</span>
                      </td>
                      <td className="px-5 py-[18px] font-mono text-[11px] text-dnp-silver whitespace-nowrap">
                        {row.vehicle}
                      </td>
                      <td className="px-5 py-[18px] font-mono text-[11px] text-dnp-silver whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-5 py-[16px]">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          aria-label={`Ver detalhes do orçamento ${row.orderId}`}
                          className={`w-[26px] h-[26px] border border-dnp-border flex items-center justify-center text-dnp-gray hover:text-white hover:border-dnp-gray transition-colors cursor-pointer rounded-[3px] ${btnFocus}`}
                        >
                          <Eye className="w-[11px] h-[11px]" aria-hidden />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Activity feed */}
        <section className="bg-dnp-dark flex flex-col">
          <div className="px-5 py-4 border-b border-dnp-border">
            <h2 className="font-heading text-[19.2px] text-white tracking-[1.34px]">ATIVIDADE</h2>
            <p className="font-mono text-[9px] text-dnp-gray uppercase tracking-[1.08px] mt-px">Atualizações recentes</p>
          </div>

          {loading ? (
            <div className="flex flex-col divide-y divide-dnp-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-[11px] px-[18px] py-3">
                  <Skeleton className="w-[26px] h-[26px] rounded-full shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
                    <Skeleton className="h-3 w-full max-w-[180px]" />
                    <Skeleton className="h-2 w-14" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 py-12 px-6 text-center">
              <p className="font-body text-[12px] text-dnp-silver">Sem atividade recente</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-dnp-border">
              {activity.map(({ Icon, red, parts, time }: ActivityItem, i: number) => (
                <div
                  key={i}
                  className="opacity-0 animate-fade-up motion-reduce:opacity-100 motion-reduce:animate-none flex items-start gap-[11px] px-[18px] py-3"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 border ${
                    red
                      ? "bg-[rgba(196,18,18,0.05)] border-[rgba(196,18,18,0.28)]"
                      : "bg-transparent border-dnp-border"
                  }`}>
                    <Icon className={`w-3 h-3 ${red ? "text-dnp-red" : "text-dnp-gray"}`} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[12px] leading-[17.4px]">
                      {parts.map((p, j) => (
                        <span key={j} className={p.bold ? "text-white font-medium" : "text-dnp-silver font-normal"}>
                          {p.text}
                        </span>
                      ))}
                    </p>
                    <p className="font-mono text-[9px] text-dnp-gray tracking-[0.9px] mt-[3px]">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Quick-access cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-dnp-border border border-dnp-border rounded overflow-hidden shrink-0">
        {QUICK.map((q) => (
          <QuickCard key={q.title} {...q} />
        ))}
      </div>

    </div>
  );
}
