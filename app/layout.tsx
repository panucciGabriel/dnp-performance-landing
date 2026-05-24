import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DNP Performance — Reprogramação Automotiva e Agrícola",
  description:
    "Especialistas em reprogramação de ECU, DPF Off, EGR Off, ARLA Off, downpipes e escapamentos em inox para veículos automotivos e máquinas agrícolas. Fale conosco pelo WhatsApp.",
  keywords: [
    "remap ECU",
    "reprogramação automotiva",
    "DPF off",
    "EGR off",
    "ARLA off",
    "downpipe",
    "reprogramação trator",
    "reprogramação colheitadeira",
    "DNP Performance",
  ],
  openGraph: {
    title: "DNP Performance — Mais Potência. Mais Eficiência.",
    description:
      "Reprogramação automotiva e agrícola. Remap ECU, DPF/EGR/ARLA Off, downpipes e escapamentos em inox.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
