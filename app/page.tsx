import { fetchCatalog } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Segments from "@/components/Segments";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import HowItWorks from "@/components/HowItWorks";
import QuoteForm from "@/components/QuoteForm";
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
        <Segments />
        <Services items={catalog} />
        <HowItWorks />
        <Gallery />
        <QuoteForm />
        <OrderTracking />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
