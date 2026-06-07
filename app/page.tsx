import { fetchCatalog } from "@/lib/api";
import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import StatsStrip    from "@/components/StatsStrip";
import Segments      from "@/components/Segments";
import Diferenciais  from "@/components/Diferenciais";
import Services      from "@/components/Services";
import HowItWorks    from "@/components/HowItWorks";
import Brands        from "@/components/Brands";
import PartsShop     from "@/components/PartsShop";
import QuoteForm     from "@/components/QuoteForm";
import FAQ           from "@/components/FAQ";
import OrderTracking from "@/components/OrderTracking";
import Footer        from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function Home() {
  // Busca o catálogo de serviços no backend (revalida a cada 5 min)
  // Retorna [] em caso de erro — Services usa fallback com dados padrão
  const catalog = await fetchCatalog();

  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero com vídeo de fundo e card Dyno */}
        <Hero />

        {/* 2. Números animados: +850 mapas, +35% torque, 2 segmentos, 100% reversível */}
        <StatsStrip />

        {/* 3. Segmentos: Automotivo e Agrícola com imagens reais */}
        <Segments />

        {/* 4. Por que a DNP? — 4 diferenciais */}
        <Diferenciais />

        {/* 5. Serviços — grid com dados do catálogo (ou fallback) */}
        <Services items={catalog} />

        {/* 6. Como funciona — 4 passos */}
        <HowItWorks />

        {/* 7. Marcas atendidas — marquee animado */}
        <Brands />

        {/* 8. Loja de peças de performance */}
        <PartsShop />

        {/* 9. Formulário de orçamento — integrado com POST /api/quotes */}
        <QuoteForm />

        {/* 11. FAQ — accordion */}
        <FAQ />

        {/* 12. Rastreamento de pedido — GET /api/orders/track com barra de progresso */}
        <OrderTracking />
      </main>

      <Footer />

      {/* FAB do WhatsApp — aparece após 500px de scroll */}
      <WhatsAppButton />
    </>
  );
}
