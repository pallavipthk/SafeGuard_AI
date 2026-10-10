import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import LiveDemo from '@/components/landing/LiveDemo';
import Testimonials from '@/components/landing/Testimonials';
import Benefits from '@/components/landing/Benefits';
import Insights from '@/components/landing/Insights';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-theme">
      <Navbar />
      <Hero />
      <Stats />
      <LiveDemo />
      <Testimonials />
      <Benefits />
      <Insights />
      <FAQ />
      <Footer />
    </div>
  );
}
