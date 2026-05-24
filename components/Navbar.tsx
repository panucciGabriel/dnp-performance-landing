"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Serviços",      href: "#servicos" },
  { label: "Segmentos",     href: "#segmentos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Orçamento",     href: "#orcamento" },
  { label: "Rastrear",      href: "#rastreamento" },
];

const WA_URL = `https://wa.me/5518991636818?text=${encodeURIComponent(
  "Olá! Gostaria de solicitar um orçamento pela DNP Performance."
)}`;

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1f1f1f]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <span
              className="font-['var(--font-bebas)'] text-2xl lg:text-3xl tracking-widest"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              <span className="text-[#c41212]">DN</span>
              <span className="text-[#b8b8b8]">P</span>
              <span className="text-white text-lg ml-1">PERFORMANCE</span>
            </span>
          </a>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#b8b8b8] hover:text-white transition-colors duration-200 tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#c41212] hover:bg-[#e01414] text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors duration-200 uppercase tracking-wide"
            >
              <MessageCircle size={16} />
              Pedir Orçamento
            </a>
          </div>

          {/* Hamburguer mobile */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="lg:hidden bg-[#111111] border-t border-[#1f1f1f]">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[#b8b8b8] hover:text-white font-medium uppercase tracking-wide border-b border-[#1f1f1f] last:border-0"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-[#c41212] text-white font-semibold py-3 rounded uppercase tracking-wide"
            >
              <MessageCircle size={16} />
              Pedir Orçamento
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
