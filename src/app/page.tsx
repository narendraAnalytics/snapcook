import HeroSection from "@/components/hero-section";
import RecipesSection from "@/components/recipes-section";
import FavoritesSection from "@/components/favorites-section";
import PricingSection from "@/components/pricing-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Recipes Section */}
      <RecipesSection />
      
      {/* Favorites Section */}
      <FavoritesSection />

      {/* Pricing Section */}
      <PricingSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
