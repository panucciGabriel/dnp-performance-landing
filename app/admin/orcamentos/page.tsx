"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw, Plus, Search, Eye, Upload, X,
  FileText, Check, AlertCircle, Paperclip, Phone,
} from "lucide-react";
import {
  fetchAdminOrders, updateOrderStatus, uploadEcuFile,
  createOrder, clearToken,
  type AdminOrder, type CreateOrderPayload,
} from "@/lib/admin-api";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusKey = "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDO";
type FilterKey = "ALL" | StatusKey;

// ─── Shared helpers ───────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, {
  label: string; dotBg: string; bg: string; border: string; text: string;
}> = {
  EM_ANDAMENTO: { label: "Em Andamento", dotBg: "bg-[#c41212]", bg: "bg-[rgba(196,18,18,0.08)]",    border: "border-[rgba(196,18,18,0.20)]",    text: "text-[#c41212]" },
  ABERTO:       { label: "Pendente",     dotBg: "bg-[#666]",    bg: "bg-[rgba(102,102,102,0.1)]",   border: "border-[#1f1f1f]",                 text: "text-[#666]"    },
  CONCLUIDO:    { label: "Concluído",    dotBg: "bg-[#b8b8b8]", bg: "bg-[rgba(184,184,184,0.07)]",  border: "border-[rgba(184,184,184,0.12)]",  text: "text-[#b8b8b8]" },
  CONCLUÍDO:    { label: "Concluído",    dotBg: "bg-[#b8b8b8]", bg: "bg-[rgba(184,184,184,0.07)]",  border: "border-[rgba(184,184,184,0.12)]",  text: "text-[#b8b8b8]" },
  CANCELADO:    { label: "Cancelado",    dotBg: "bg-[#444]",    bg: "bg-[rgba(255,255,255,0.02)]",  border: "border-[#1f1f1f]",                 text: "text-[#444]"    },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.ABERTO;
  return (
    <span className={`inline-flex items-center gap-[5px] font-mono text-[9px] uppercase tracking-[0.9px] px-[9px] py-[4px] border rounded-[2px] ${c.bg} ${c.border} ${c.text}`}>
      <span className={`w-[5px] h-[5px] rounded-[2.5px] shrink-0 ${c.dotBg} ${status === "EM_ANDAMENTO" ? "animate-pulse-slow" : ""}`} />
      {c.label}
    </span>
  );
}

function getClientName(o: AdminOrder): string {
  if (o.vehicle?.client?.name) return o.vehicle.client.name;
  const match = o.description?.match(/LEAD:\s*([^|]+)/);
  return match ? match[1].trim() : "Cliente não informado";
}

function getClientWhatsApp(o: AdminOrder): string {
  return o.vehicle?.client?.contatoWhatsapp ?? "";
}

function getVehicle(o: AdminOrder): string {
  if (o.vehicle) {
    const parts = [o.vehicle.brand, o.vehicle.model].filter(Boolean);
    if (parts.length) return parts.join(" ");
  }
  const match = o.description?.match(/Máquina:\s*([^|]+)/);
  return match ? match[1].trim() : "—";
}

function getService(o: AdminOrder): string {
  if (o.description?.includes(" | ")) {
    const match = o.description.match(/Serviço:\s*([^|]+)/);
    return match ? match[1].trim() : o.description.split(" | ")[0];
  }
  return o.description || "—";
}

function getFileName(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.split(/[\\/]/).pop() ?? null;
}

function formatOrderId(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: StatusKey[] = ["ABERTO", "EM_ANDAMENTO", "CONCLUIDO"];

function DetailModal({
  order,
  onClose,
  onStatusChange,
  onFileUpload,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (id: number, status: StatusKey) => Promise<void>;
  onFileUpload: (id: number, file: File) => Promise<void>;
}) {
  const [changingStatus, setChangingStatus] = useState(false);
  const [uploading, setUploading]           = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const client   = getClientName(order);
  const whatsapp = getClientWhatsApp(order);
  const vehicle  = getVehicle(order);
  const service  = getService(order);
  const origFile = getFileName(order.originalFileUrl);
  const modFile  = getFileName(order.modifiedFileUrl);

  async function handleStatus(s: StatusKey) {
    setChangingStatus(true);
    await onStatusChange(order.id, s);
    setChangingStatus(false);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onFileUpload(order.id, file);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-[#1f1f1f] rounded w-full max-w-[520px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[9px] text-[#666] uppercase tracking-[1.8px]">Orçamento</span>
              <span className="font-mono text-[9px] text-dnp-red">{formatOrderId(order.id)}</span>
              <span className="font-mono text-[9px] text-[#333]">·</span>
              <span className="font-mono text-[9px] text-[#666]">
                {new Date(order.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <h2 className="font-heading text-[22px] text-white tracking-[1.2px]">{client.toUpperCase()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors cursor-pointer p-1 mt-1 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info grid */}
        <div className="px-6 pt-5 pb-4 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.6px] mb-1">Serviço</p>
            <p className="font-body text-[13px] text-white leading-snug">{service}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.6px] mb-1">Veículo / Máquina</p>
            <p className="font-body text-[13px] text-white">{vehicle}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.6px] mb-1">WhatsApp</p>
            {whatsapp ? (
              <a
                href={`https://wa.me/55${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[12px] text-dnp-green hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3" />
                {whatsapp}
              </a>
            ) : (
              <p className="font-mono text-[12px] text-[#444]">—</p>
            )}
          </div>
          <div>
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.6px] mb-1">Status atual</p>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Status change */}
        <div className="px-6 py-4 border-t border-[#1f1f1f]">
          <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.6px] mb-2.5">Alterar Status</p>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => {
              const cfg    = STATUS_CFG[s];
              const active = order.status === s || (s === "CONCLUIDO" && (order.status as string) === "CONCLUÍDO");
              return (
                <button
                  key={s}
                  disabled={active || changingStatus}
                  onClick={() => handleStatus(s)}
                  className={`flex items-center gap-[5px] font-mono text-[9px] uppercase tracking-[0.9px] px-3 py-[5px] border rounded-[2px] transition-colors cursor-pointer disabled:cursor-default ${
                    active
                      ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                      : "bg-transparent border-[#1f1f1f] text-[#444] hover:text-[#999] hover:border-[#333]"
                  }`}
                >
                  {active && <span className={`w-[5px] h-[5px] rounded-[2.5px] shrink-0 ${cfg.dotBg}`} />}
                  {cfg.label}
                  {active && <Check className="w-2.5 h-2.5 ml-px" />}
                </button>
              );
            })}
            {changingStatus && <RefreshCw className="w-3 h-3 text-[#666] animate-spin" />}
          </div>
        </div>

        {/* File upload */}
        <div className="px-6 py-4 border-t border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-[1.6px]">Arquivo ECU</p>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".bin,.ori,.mod,.hex,.kess,.ecu"
                className="hidden"
                onChange={handleFile}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 h-7 border border-[#1f1f1f] text-[#666] hover:text-white font-mono text-[9px] uppercase tracking-[1.2px] px-3 rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading
                  ? <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  : <Upload className="w-2.5 h-2.5" />
                }
                {uploading ? "Enviando..." : "Upload"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#444] uppercase tracking-[1.2px] w-20 shrink-0">Original</span>
              {origFile
                ? <span className="font-mono text-[10px] text-dnp-silver truncate">{origFile}</span>
                : <span className="font-mono text-[10px] text-[#333]">Nenhum arquivo enviado</span>
              }
            </div>
            {modFile && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#444] uppercase tracking-[1.2px] w-20 shrink-0">Modificado</span>
                <span className="font-mono text-[10px] text-dnp-green truncate">{modFile}</span>
              </div>
            )}
          </div>
          <p className="font-mono text-[8px] text-[#333] mt-2 uppercase tracking-[0.8px]">
            Formatos: .bin · .ori · .mod · .hex · .kess · .ecu
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── New Order Modal ──────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
  { value: "CARRO",    label: "Carro / Moto" },
  { value: "CAMINHAO", label: "Caminhão" },
  { value: "TRATOR",   label: "Trator / Agrícola" },
] as const;

const MEASUREMENT_UNITS = [
  { value: "KM",     label: "Quilômetros" },
  { value: "MILHAS", label: "Milhas" },
  { value: "HORAS",  label: "Horas" },
] as const;

function NewOrderModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const [form, setForm] = useState({
    clienteName:     "",
    whatsapp:        "",
    email:           "",
    brand:           "",
    model:           "",
    year:            "",
    vehicleType:     "CARRO" as "CARRO" | "TRATOR" | "CAMINHAO",
    measurementUnit: "KM"   as "KM"    | "MILHAS"  | "HORAS",
    usageReading:    "",
    vin:             "",
    description:     "",
  });

  function set(field: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.clienteName.trim() || !form.whatsapp.trim() || !form.description.trim()) {
      setErr("Nome do cliente, WhatsApp e serviço são obrigatórios.");
      return;
    }
    setSaving(true);
    try {
      const payload: CreateOrderPayload = {
        description: form.description.trim(),
        status: "ABERTO",
        vehicle: {
          brand:           form.brand.trim() || undefined,
          model:           form.model.trim() || "Não informado",
          year:            form.year ? parseInt(form.year) : undefined,
          vin:             form.vin.trim() || undefined,
          vehicleType:     form.vehicleType,
          measurementUnit: form.measurementUnit,
          usageReading:    form.usageReading ? parseFloat(form.usageReading) : undefined,
          client: {
            name:             form.clienteName.trim(),
            contatoWhatsapp:  form.whatsapp.replace(/\D/g, ""),
            email:            form.email.trim() || undefined,
          },
        },
      };
      await createOrder(payload);
      onCreated();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao criar orçamento.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full bg-dnp-black border border-[#1f1f1f] rounded-[3px] px-3 py-[7px] text-white text-[13px] font-body placeholder:text-[#333] focus:outline-none focus:border-[#333] transition-colors";
  const labelCls =
    "font-mono text-[9px] text-[#666] uppercase tracking-[1.6px] mb-1.5 block";
  const sectionCls =
    "font-mono text-[9px] text-[#444] uppercase tracking-[1.8px] mb-3 flex items-center gap-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-[#1f1f1f] rounded w-full max-w-[580px] max-h-[92vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-[18px] h-px bg-dnp-red" />
              <span className="font-mono text-[10px] text-dnp-red uppercase tracking-[2px]">Admin</span>
            </div>
            <h2 className="font-heading text-[22px] text-white tracking-[1.2px]">NOVO ORÇAMENTO</h2>
          </div>
          <button onClick={onClose} className="text-[#666] hover:text-white transition-colors cursor-pointer p-1 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

          {/* Cliente */}
          <div>
            <p className={sectionCls}><span className="w-3 h-px bg-[#2a2a2a]" /> Cliente</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Nome *</label>
                <input className={inputCls} placeholder="Nome completo" value={form.clienteName} onChange={(e) => set("clienteName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>WhatsApp *</label>
                <input className={inputCls} placeholder="11987654321" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>E-mail</label>
                <input className={inputCls} placeholder="email@exemplo.com" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Veículo */}
          <div>
            <p className={sectionCls}><span className="w-3 h-px bg-[#2a2a2a]" /> Veículo / Máquina</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Marca</label>
                <input className={inputCls} placeholder="Volkswagen, John Deere..." value={form.brand} onChange={(e) => set("brand", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Modelo *</label>
                <input className={inputCls} placeholder="Amarok, T7, Hilux..." value={form.model} onChange={(e) => set("model", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Tipo</label>
                <select className={`${inputCls} cursor-pointer`} value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}>
                  {VEHICLE_TYPES.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-[#111]">{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Ano</label>
                <input className={inputCls} placeholder="2022" type="number" min="1950" max="2030" value={form.year} onChange={(e) => set("year", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Leitura atual</label>
                <input className={inputCls} placeholder="45000" type="number" min="0" value={form.usageReading} onChange={(e) => set("usageReading", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Unidade</label>
                <select className={`${inputCls} cursor-pointer`} value={form.measurementUnit} onChange={(e) => set("measurementUnit", e.target.value)}>
                  {MEASUREMENT_UNITS.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-[#111]">{label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>VIN / Nº de série <span className="text-[#444] normal-case">(opcional — usado para deduplicação)</span></label>
                <input className={inputCls} placeholder="9BWZZZ..." value={form.vin} onChange={(e) => set("vin", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Serviço */}
          <div>
            <p className={sectionCls}><span className="w-3 h-px bg-[#2a2a2a]" /> Serviço</p>
            <label className={labelCls}>Descrição *</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Ex: Remap ECU Stage 2 + DPF Off + EGR Off"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {err && (
            <div className="flex items-center gap-2 text-dnp-red font-body text-[12px] -mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {err}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1f1f1f]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 border border-[#1f1f1f] text-[#666] hover:text-white font-mono text-[10px] uppercase tracking-[1.6px] px-4 rounded transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 h-9 bg-dnp-red hover:bg-dnp-red-light disabled:opacity-50 text-white font-mono text-[10px] uppercase tracking-[1.6px] px-5 rounded transition-colors cursor-pointer"
            >
              {saving
                ? <RefreshCw className="w-3 h-3 animate-spin" />
                : <Plus className="w-3 h-3" />
              }
              {saving ? "Criando..." : "Criar Orçamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "ALL",          label: "Todos"        },
  { key: "ABERTO",       label: "Pendente"     },
  { key: "EM_ANDAMENTO", label: "Em Andamento" },
  { key: "CONCLUIDO",    label: "Concluído"    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrcamentosPage() {
  const router = useRouter();
  const [orders,   setOrders]   = useState<AdminOrder[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [filter,   setFilter]   = useState<FilterKey>("ALL");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [showNew,  setShowNew]  = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminOrders();
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(id: number, status: StatusKey) {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        clearToken();
        router.replace("/admin/login");
      }
    }
  }

  async function handleFileUpload(id: number, file: File) {
    try {
      const updated = await uploadEcuFile(id, file);
      setOrders((prev) => prev.map((o) => o.id === id ? updated : o));
      setSelected((prev) => prev?.id === id ? updated : prev);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        clearToken();
        router.replace("/admin/login");
      }
    }
  }

  // Filtered + searched orders
  const q = search.toLowerCase();
  const filtered = orders.filter((o) => {
    const statusMatch =
      filter === "ALL" ||
      o.status === filter ||
      (filter === "CONCLUIDO" && (o.status as string) === "CONCLUÍDO");
    if (!statusMatch) return false;
    if (!q) return true;
    return (
      getClientName(o).toLowerCase().includes(q) ||
      getService(o).toLowerCase().includes(q)     ||
      getVehicle(o).toLowerCase().includes(q)     ||
      String(o.id).includes(q)
    );
  });

  const counts = {
    ALL:          orders.length,
    ABERTO:       orders.filter((o) => o.status === "ABERTO").length,
    EM_ANDAMENTO: orders.filter((o) => o.status === "EM_ANDAMENTO").length,
    CONCLUIDO:    orders.filter((o) => o.status === "CONCLUIDO" || (o.status as string) === "CONCLUÍDO").length,
  } as Record<FilterKey, number>;

  return (
    <div className="flex flex-col gap-5 px-7 pt-6 pb-8 min-h-full">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-[18px] h-px bg-dnp-red shrink-0" />
            <span className="font-mono text-[10px] text-dnp-red uppercase tracking-[2.2px]">
              Gestão · Orçamentos
            </span>
          </div>
          <h1 className="font-heading text-[41.6px] text-white" style={{ lineHeight: "41.6px", letterSpacing: "1.25px" }}>
            ORÇAMENTOS
          </h1>
          <p className="font-body text-[13px] text-[#666]">
            {error ? (
              <span className="text-dnp-red font-mono text-[9px] uppercase tracking-wider">
                Sem conexão com o backend
              </span>
            ) : (
              `${counts.ALL} orçamentos · ${counts.ABERTO} pendentes · ${counts.EM_ANDAMENTO} em andamento`
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={load}
            title="Atualizar"
            className="w-9 h-9 border border-[#1f1f1f] text-[#666] hover:text-white flex items-center justify-center rounded transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-[7px] h-9 bg-dnp-red text-white font-mono text-[10px] uppercase tracking-[1.6px] px-[18px] rounded transition-colors hover:bg-dnp-red-light cursor-pointer"
          >
            <Plus className="w-3 h-3 shrink-0" />
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        {/* Status tabs */}
        <div className="flex items-center border border-[#1f1f1f] rounded overflow-hidden shrink-0">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-4 py-[7px] font-mono text-[9px] uppercase tracking-[1.4px] transition-colors cursor-pointer border-r border-[#1f1f1f] last:border-r-0 ${
                filter === key
                  ? "bg-[#161616] text-white"
                  : "bg-transparent text-[#666] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {label}
              <span className={`font-mono text-[8px] px-[5px] py-px rounded-[2px] ${
                filter === key
                  ? "bg-dnp-red text-white"
                  : "bg-[#1a1a1a] text-[#444]"
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-[#111] border border-[#1f1f1f] rounded px-3 h-9">
          <Search className="w-3 h-3 text-[#666] shrink-0" />
          <input
            type="text"
            placeholder="Buscar por cliente, serviço, veículo ou #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[12px] font-body text-white placeholder:text-[#444] focus:outline-none w-full"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[#666] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="border border-[#1f1f1f] rounded overflow-hidden shrink-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-[#111]">
            <RefreshCw className="w-5 h-5 text-[#666] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111] gap-3">
            <FileText className="w-8 h-8 text-[#222]" />
            <p className="font-body text-[13px] text-[#666]">
              {search
                ? "Nenhum resultado para essa busca."
                : "Nenhum orçamento nesta categoria."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0e0e0e]">
                <tr className="border-b border-[#1f1f1f]">
                  {["#", "Cliente", "Serviço", "Veículo", "Data", "Status", "Arquivo", ""].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left font-mono font-medium text-[9px] text-[#666] uppercase tracking-[1.62px] whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#111]">
                {filtered.map((order, i) => {
                  const client  = getClientName(order);
                  const vehicle = getVehicle(order);
                  const service = getService(order);
                  const hasFile = !!order.originalFileUrl;

                  return (
                    <tr
                      key={order.id}
                      className={`opacity-0 animate-fade-up hover:bg-white/[0.015] transition-colors ${
                        i < filtered.length - 1 ? "border-b border-[#1f1f1f]" : ""
                      }`}
                      style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                    >
                      <td className="px-5 py-[14px] font-mono text-[11px] text-[#666] whitespace-nowrap">
                        {formatOrderId(order.id)}
                      </td>
                      <td className="px-5 py-[14px] font-body font-medium text-[13px] text-white whitespace-nowrap">
                        {client}
                      </td>
                      <td className="px-5 py-[14px] font-body text-[12px] text-dnp-silver max-w-[220px]">
                        <span className="block truncate">{service}</span>
                      </td>
                      <td className="px-5 py-[14px] font-mono text-[11px] text-[#666] whitespace-nowrap">
                        {vehicle}
                      </td>
                      <td className="px-5 py-[14px] font-mono text-[11px] text-[#666] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-[11px]">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-[14px]">
                        {hasFile ? (
                          <div className="flex items-center gap-1 text-dnp-green">
                            <Paperclip className="w-3 h-3" />
                            <span className="font-mono text-[9px] uppercase tracking-[0.8px]">Arquivo</span>
                          </div>
                        ) : (
                          <span className="font-mono text-[9px] text-[#333] uppercase tracking-[0.8px]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-[11px]">
                        <button
                          onClick={() => setSelected(order)}
                          className="flex items-center gap-1.5 h-7 border border-[#1f1f1f] text-[#666] hover:text-white font-mono text-[9px] uppercase tracking-[1.2px] px-3 rounded-[2px] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Eye className="w-2.5 h-2.5" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {selected && (
        <DetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onFileUpload={handleFileUpload}
        />
      )}
      {showNew && (
        <NewOrderModal
          onClose={() => setShowNew(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
