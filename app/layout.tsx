import type { Metadata } from "next";
import { Bebas_Neue, Inter, IBM_Plex_Mono, Rajdhani } from "next/font/google";
import "./globals.css";
import { SITE_URL, INSTAGRAM_URL } from "@/lib/constants";

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

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DNP Performance — Reprogramação Automotiva e Agrícola",
  description:
    "Especialistas em reprogramação de ECU, DPF Off, EGR Off, ARLA Off, downpipes e escapamentos em inox para veículos automotivos e máquinas agrícolas. Atendemos a domicílio. Fale conosco pelo WhatsApp.",
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
    "reprogramação a domicílio",
    "chip de potência",
  ],
  openGraph: {
    title: "DNP Performance — Mais Potência. Mais Eficiência.",
    description:
      "Reprogramação automotiva e agrícola a domicílio. Remap ECU, DPF/EGR/ARLA Off, downpipes e escapamentos em inox.",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "DNP Performance",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "DNP Performance — Mais Potência. Mais Eficiência.",
    description: "Reprogramação automotiva e agrícola a domicílio.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "DNP Performance",
  description:
    "Especialistas em reprogramação de ECU para veículos automotivos e máquinas agrícolas. Atendimento a domicílio.",
  telephone: "+55-18-99163-6818",
  url: SITE_URL,
  sameAs: [INSTAGRAM_URL],
  areaServed: {
    "@type": "Country",
    name: "Brazil",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços DNP Performance",
    itemListElement: [
      "Remap ECU",
      "DPF Off",
      "EGR Off",
      "ARLA 32 Off",
      "Downpipes em Inox",
      "Escapamentos em Inox",
      "Chip de Potência",
      "Diagnóstico Automotivo",
    ].map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${inter.variable} ${ibmPlexMono.variable} ${rajdhani.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
