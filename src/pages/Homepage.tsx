import CTASection from "@/components/modules/HomePage/CTASection";
import FeaturesSection from "@/components/modules/HomePage/FeaturesSection";
import HeroSection from "@/components/modules/HomePage/HeroSection";
import StatsSection from "@/components/modules/HomePage/StatsSection";

export default function Homepage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection/>
      <StatsSection/>
      <CTASection/>
    </div>
  );
}
