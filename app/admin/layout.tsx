"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getToken, clearToken, fetchAdminOrders } from "@/lib/admin-api";
import {
  LayoutDashboard, FileText, Users, Wrench,
  MapPin, Package, BarChart2, Settings,
  LogOut, Bell, Search, HelpCircle,
} from "lucide-react";

const NAV = [
  {
    section: "Principal",
    items: [
      { label: "Dashboard",            href: "/admin",              icon: LayoutDashboard, enabled: true,  badge: false },
      { label: "Orçamentos",           href: "/admin/orcamentos",   icon: FileText,        enabled: true,  badge: true  },
      { label: "Clientes",             href: "/admin/clientes",     icon: Users,           enabled: false, badge: false },
    ],
  },
  {
    section: "Operacional",
    items: [
      { label: "Catálogo de Serviços", href: "/admin/catalogo",     icon: Wrench,    enabled: false, badge: false },
      { label: "Rastreamento",         href: "/admin/rastreamento", icon: MapPin,    enabled: false, badge: false },
      { label: "Loja de Peças",        href: "/admin/loja",         icon: Package,   enabled: false, badge: false },
    ],
  },
  {
    section: "Sistema",
    items: [
      { label: "Relatórios",    href: "/admin/relatorios",    icon: BarChart2, enabled: false, badge: false },
      { label: "Configurações", href: "/admin/configuracoes", icon: Settings,  enabled: false, badge: false },
    ],
  },
];

const BREADCRUMBS: Record<string, string> = {
  "/admin":               "Dashboard",
  "/admin/orcamentos":    "Orçamentos",
  "/admin/clientes":      "Clientes",
  "/admin/catalogo":      "Catálogo de Serviços",
  "/admin/rastreamento":  "Rastreamento",
  "/admin/loja":          "Loja de Peças",
  "/admin/relatorios":    "Relatórios",
  "/admin/configuracoes": "Configurações",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (pathname !== "/admin/login" && !token) {
      router.replace("/admin/login");
      return;
    }
    if (pathname !== "/admin/login" && token) {
      fetchAdminOrders()
        .then((o) => setPending(o.filter((x) => x.status === "ABERTO").length))
        .catch(() => {});
    }
  }, [router, pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  const page = BREADCRUMBS[pathname] ?? "Admin";

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-screen bg-dnp-black text-white overflow-hidden">

      {/* 2px red accent line — full width, topo absoluto */}
      <div className="h-0.5 bg-dnp-red w-full shrink-0" />

      {/* ── Body: sidebar + main lado a lado ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar — full height, w-[236px] conforme Figma ── */}
        <aside className="hidden md:flex flex-col w-[236px] shrink-0 bg-dnp-dark border-r border-dnp-border">

          {/* Logo */}
          <div className="shrink-0 h-[62px] flex items-center gap-2.5 px-5 border-b border-dnp-border">
            <div className="relative w-8 h-8 rounded-[3px] shrink-0 overflow-hidden">
              <Image src="/images/dnp-logo.jpg" alt="DNP Performance" fill sizes="32px" className="object-cover" />
            </div>
            <span className="font-heading text-[14px] leading-none whitespace-nowrap">
              <span className="text-dnp-red">DNP </span>
              <span className="text-white">PERFORMANCE</span>
            </span>
            <div className="flex-1 flex justify-end">
              <span className="border border-dnp-border text-[#666] font-mono text-[9px] uppercase tracking-[1.26px] px-[7px] py-[3px] rounded-[2px] leading-none">
                Admin
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto pt-1.5 pb-2.5 flex flex-col">
            {NAV.map(({ section, items }) => (
              <div key={section}>
                <p className="px-5 pt-[18px] pb-[7px] font-mono text-[9px] text-[#666] uppercase tracking-[1.98px]">
                  {section}
                </p>
                {items.map(({ label, href, icon: Icon, enabled, badge }) =>
                  enabled ? (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 px-5 py-[9px] text-[13px] font-body font-medium transition-colors border-l-2 ${
                        isActive(href)
                          ? "text-white bg-[rgba(196,18,18,0.06)] border-dnp-red"
                          : "text-[#666] hover:text-white hover:bg-white/[0.03] border-transparent"
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        <Icon className={`w-[15px] h-[15px] ${isActive(href) ? "text-dnp-red" : ""}`} />
                      </span>
                      <span className="flex-1 truncate">{label}</span>
                      {badge && pending > 0 && (
                        <span className="bg-dnp-red text-white font-mono text-[9px] font-medium min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 shrink-0">
                          {pending > 99 ? "99+" : pending}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div
                      key={href}
                      className="flex items-center gap-2.5 px-5 py-[9px] text-[13px] font-body font-medium text-[#666]/30 cursor-not-allowed select-none border-l-2 border-transparent"
                    >
                      <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        <Icon className="w-[15px] h-[15px]" />
                      </span>
                      <span className="truncate">{label}</span>
                    </div>
                  )
                )}
              </div>
            ))}
          </nav>

          {/* Footer user */}
          <div className="border-t border-dnp-border px-5 py-3.5 flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full bg-dnp-red shrink-0 overflow-hidden flex items-center justify-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                <Image src="/images/dnp-avatar.jpg" alt="DNP Admin" fill sizes="32px" className="object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-body font-semibold truncate leading-tight">DNP Admin</p>
              <p className="text-[#666] font-mono text-[9px] uppercase tracking-[1.08px] truncate leading-tight">Administrador</p>
            </div>
            <button
              onClick={() => { clearToken(); router.replace("/admin/login"); }}
              className="text-[#666] hover:text-white transition-colors cursor-pointer shrink-0 p-1"
              title="Sair"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* ── Main: topbar + conteúdo empilhados ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Topbar — h-[62px] conforme Figma, cobre apenas a área main */}
          <header className="shrink-0 h-[62px] bg-dnp-dark border-b border-dnp-border flex items-center px-7 z-10">

            {/* Breadcrumb + título da página */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[1.35px] text-[#666]">
                <span>DNP Performance</span>
                <span className="text-dnp-red">·</span>
                <span>{page}</span>
              </div>
              <p className="font-heading text-[24.8px] tracking-[1.49px] text-white leading-[24.8px] mt-0.5">
                {page.toUpperCase()}
              </p>
            </div>

            <div className="flex-1" />

            {/* Busca + Bell + Help */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-dnp-card border border-dnp-border rounded px-3 h-9 w-[230px]">
                <Search className="w-3 h-3 text-[#666] shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar cliente, ordem..."
                  className="bg-transparent text-xs font-body text-[#666] placeholder:text-[#666] focus:outline-none w-full"
                />
              </div>
              <button className="relative w-9 h-9 flex items-center justify-center bg-[#161616] border border-dnp-border text-[#666] hover:text-white transition-colors cursor-pointer rounded">
                <Bell className="w-4 h-4" />
                {pending > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-dnp-red rounded-full border border-dnp-dark" />
                )}
              </button>
              <button className="w-9 h-9 flex items-center justify-center bg-[#161616] border border-dnp-border text-[#666] hover:text-white transition-colors cursor-pointer rounded">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
