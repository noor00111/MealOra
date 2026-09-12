import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { CategoryMarquee } from "@/components/home/category-marquee";
import { PromoBanner } from "@/components/home/promo-banner";
import { FeaturedDeals } from "@/components/home/featured-deals";
import { ScrollToTop } from "@/components/home/scroll-to-top";

export default function Home() {
  return (
    <>
      <div>
        <Hero />
        <HowItWorks />
        <CategoryMarquee />
        <PromoBanner />
        <FeaturedDeals />
      </div>
      <ScrollToTop />
    </>
  );
}
