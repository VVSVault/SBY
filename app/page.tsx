import Hero from '@/components/landing/Hero';
import SavingsCalculator from '@/components/landing/SavingsCalculator';
import ValueProps from '@/components/landing/ValueProps';
import HowItWorks from '@/components/landing/HowItWorks';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#738286]">
      <Hero />
      <SavingsCalculator />
      <ValueProps />
      <FAQ />
      <Footer />
    </main>
  );
}
