import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import DemoSection from '@/components/DemoSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
