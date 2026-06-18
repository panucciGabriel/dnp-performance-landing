"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, setToken } from "@/lib/admin-api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <div className="min-h-screen bg-dnp-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-5xl text-white tracking-widest">DNP</h1>
          <p className="text-dnp-gray text-sm mt-1 font-body">Painel Administrativo</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dnp-dark border border-dnp-border rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-dnp-silver text-sm font-body mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dnp-black border border-dnp-border rounded px-3 py-2.5 text-white text-sm font-body placeholder:text-dnp-gray focus:outline-none focus:border-dnp-red transition-colors"
              placeholder="admin@dnpperformance.com.br"
            />
          </div>

          <div>
            <label className="block text-dnp-silver text-sm font-body mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dnp-black border border-dnp-border rounded px-3 py-2.5 text-white text-sm font-body placeholder:text-dnp-gray focus:outline-none focus:border-dnp-red transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-dnp-red text-sm font-body">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dnp-red hover:bg-dnp-red-light disabled:opacity-50 text-white font-heading text-xl tracking-widest rounded py-2.5 transition-colors cursor-pointer"
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
