import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import {
  FeaturedCars,
  RecentlyAddedCars,
} from "@/components/featured-cars";
import { mapDbCarToHomeCard } from "@/lib/home-cars";
import { BrowseByBrand } from "@/components/browse-brands";
import { WhyChooseUs } from "@/components/why-choose-us";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerClient();

  const [{ data: featuredCars }, { data: recentCars }] = await Promise.all([
    supabase
      .from("cars")
      .select("*")
      .eq("status", "approved")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("cars")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const featured = (featuredCars ?? []).map(mapDbCarToHomeCard);
  const recent = (recentCars ?? []).map(mapDbCarToHomeCard);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCars cars={featured} />
        <RecentlyAddedCars cars={recent} />
        <BrowseByBrand />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
