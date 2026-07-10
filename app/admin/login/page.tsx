"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdmin, setToken } from "@/lib/admin-api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const token = await loginAdmin(email, password);
      setToken(token);
      router.replace("/admin");
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-dnp-ink font-body text-dnp-mist">
      {/* ===== TOPO / NAV ===== */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-[22px] sm:px-8 lg:px-14">
        <div className="flex items-center gap-3.5">
          <div className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/images/dnp-logo.jpg"
              alt="DNP Performance"
              fill
              sizes="46px"
              className="object-cover"
            />
          </div>
          <span className="border-l border-dnp-line pl-3.5 text-[9px] uppercase leading-[1.3] tracking-[3px] text-dnp-slate">
            Auto &amp;<br />Agrícola
          </span>
        </div>
      </header>

      {/* ===== HERO: VISUAL + CARTÃO ===== */}
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
        {/* --- Lado visual --- */}
        <section className="relative flex min-h-[340px] flex-col justify-end overflow-hidden bg-dnp-visual p-7 sm:p-10 lg:min-h-screen lg:p-16">
          {/* fotos de fundo (crossfade automotivo → agrícola) */}
          <Image
            src="/images/automotivo.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <Image
            src="/images/agricola.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="lr-crossfade object-cover"
          />

          {/* escurecimento base p/ legibilidade */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(1,1,1,0.55) 0%, rgba(1,1,1,0.4) 45%, rgba(1,1,1,0.82) 100%)",
            }}
          />
          {/* textura diagonal */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 12px)",
            }}
          />
          {/* grade técnica */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#2A2C30 1px, transparent 1px), linear-gradient(90deg, #2A2C30 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* linha de scan */}
          <div
            className="lr-scan pointer-events-none absolute inset-x-0 top-0 h-px opacity-55"
            style={{
              background: "linear-gradient(90deg, transparent, #e80409, transparent)",
              boxShadow: "0 0 14px 1px #e80409",
            }}
          />
          {/* vinheta */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 15% 100%, transparent 30%, rgba(1,1,1,0.55) 100%)",
            }}
          />

          {/* headline de marca */}
          <div className="relative z-[2] max-w-[560px]">
            <div className="mb-[22px] inline-flex items-center gap-2">
              <span className="h-0.5 w-[26px] bg-dnp-accent" />
              <span className="text-[11px] uppercase tracking-[3px] text-dnp-slate">
                Engenharia de performance
              </span>
            </div>
            <h1 className="m-0 font-display text-[clamp(2.375rem,5.4vw,4.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.5px] text-dnp-mist">
              Potência
              <br />
              calibrada com <span className="text-dnp-accent">precisão</span>
            </h1>
            <p className="mt-[22px] max-w-[400px] text-[15px] leading-relaxed text-dnp-slate">
              Remap e otimização de ECU para veículos e implementos agrícolas. Ganho real de
              torque, resposta e consumo — sem improviso.
            </p>
          </div>
        </section>

        {/* --- Lado do cartão --- */}
        <section className="flex items-center justify-center bg-dnp-ink px-5 pb-14 pt-24 sm:px-10 lg:px-14">
          <div className="lr-card-in w-full max-w-[420px] rounded-2xl border border-dnp-line bg-dnp-panel p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-10">
            <h2 className="m-0 font-display text-[28px] font-semibold leading-[1.1] tracking-[0.2px] text-dnp-mist">
              Acesse sua central de remap
            </h2>
            <p className="mb-[30px] mt-2.5 text-[13.5px] leading-normal text-dnp-slate">
              Entre com suas credenciais para gerenciar projetos e liberações.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-dnp-slate">
                  E-mail ou usuário
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="voce@oficina.com.br"
                  className="h-[54px] rounded-[9px] border border-dnp-line bg-dnp-field px-4 text-[15px] text-dnp-mist outline-none transition-[border-color,box-shadow] placeholder:text-dnp-faint focus:border-dnp-accent focus:ring-[3px] focus:ring-dnp-accent/15"
                />
              </label>

              {/* Senha */}
              <label className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-dnp-slate">
                    Senha
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="cursor-pointer font-mono text-[10.5px] uppercase tracking-[1px] text-dnp-slate transition-colors hover:text-dnp-accent"
                  >
                    {showPass ? "ocultar" : "mostrar"}
                  </button>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-[54px] rounded-[9px] border border-dnp-line bg-dnp-field px-4 text-[15px] text-dnp-mist outline-none transition-[border-color,box-shadow] placeholder:text-dnp-faint focus:border-dnp-accent focus:ring-[3px] focus:ring-dnp-accent/15"
                />
              </label>

              <div className="-mt-1.5 flex justify-end">
                <a
                  href="#"
                  className="text-[12.5px] text-dnp-slate transition-colors hover:text-dnp-mist"
                >
                  Esqueci minha senha
                </a>
              </div>

              {error && <p className="text-[12.5px] text-dnp-accent">{error}</p>}

              {/* Botão ENTRAR */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-[56px] items-center justify-center gap-2.5 rounded-[9px] bg-dnp-accent font-display text-[17px] font-bold uppercase tracking-[2.5px] text-white transition-[transform,box-shadow,filter] hover:-translate-y-px hover:shadow-[0_12px_30px_-10px_rgba(232,4,9,0.6)] hover:brightness-105 active:translate-y-0 disabled:cursor-default disabled:opacity-90"
              >
                {loading && (
                  <span className="lr-spin inline-block h-4 w-4 rounded-full border-2 border-white/35 border-t-white" />
                )}
                {loading ? "Entrando" : "Entrar"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
