import { fetchCatalog } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Segments from "@/components/Segments";
import Diferenciais from "@/components/Diferenciais";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import QuoteForm from "@/components/QuoteForm";
import FAQ from "@/components/FAQ";
import OrderTracking from "@/components/OrderTracking";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function Home() {
  const catalog = await fetchCatalog();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <Segments />
        <Diferenciais />
        <Services items={catalog} />
        <HowItWorks />
        <Gallery />
        <QuoteForm />
        <FAQ />
        <OrderTracking />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
