import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { WA_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/constants";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const navLinks = [
  { label: "Serviços",      href: "#servicos" },
  { label: "Segmentos",     href: "#segmentos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Orçamento",     href: "#orcamento" },
  { label: "Rastrear",      href: "#rastreamento" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111] border-t border-[#1f1f1f]">
      {/* CTA faixa vermelha */}
      <div className="bg-[#c41212] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p
            className="text-xl sm:text-2xl lg:text-3xl text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            FALE CONOSCO AGORA PARA UM ORÇAMENTO! ✦
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 bg-white text-[#c41212] font-bold px-6 py-3 rounded text-sm uppercase tracking-wide hover:bg-[#f0f0f0] transition-colors"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Corpo do footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Logo + descrição */}
          <div className="sm:col-span-2 md:col-span-1">
            <Image
              src="/images/logo.png"
              alt="DNP Performance"
              width={200}
              height={52}
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-sm text-[#555] leading-relaxed max-w-xs">
              Especialistas em reprogramação de ECU para veículos automotivos e
              máquinas agrícolas. Potência, eficiência e atendimento a domicílio.
            </p>
            {/* Redes sociais */}
            <div className="flex gap-3 mt-5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#1f1f1f] hover:border-[#c41212] rounded flex items-center justify-center text-[#666] hover:text-[#c41212] transition-colors"
                aria-label="Instagram da DNP Performance"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#1f1f1f] hover:border-[#c41212] rounded flex items-center justify-center text-[#666] hover:text-[#c41212] transition-colors"
                aria-label="WhatsApp da DNP Performance"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4
              className="text-lg text-white mb-4"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              NAVEGAÇÃO
            </h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#555] hover:text-[#c41212] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4
              className="text-lg text-white mb-4"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              CONTATO
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <span className="block text-xs text-[#444] uppercase tracking-widest mb-1">
                  WhatsApp
                </span>
                <a
                  href={WA_URL}
                  className="text-white hover:text-[#c41212] transition-colors"
                >
                  (18) 99163-6818
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#444] uppercase tracking-widest mb-1">
                  Instagram
                </span>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#c41212] transition-colors"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#444] uppercase tracking-widest mb-1">
                  Atendimento
                </span>
                <span className="text-[#888]">A domicílio — vamos até você</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1f1f1f] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#444]">
            © {year} DNP Performance. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[#333]">✦ Potência que você sente.</p>
        </div>
      </div>
    </footer>
  );
}
