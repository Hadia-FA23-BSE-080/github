import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturedCars } from "@/components/featured-cars";
import { BrowseByBrand } from "@/components/browse-brands";
import { WhyChooseUs } from "@/components/why-choose-us";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCars />
        <BrowseByBrand />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
