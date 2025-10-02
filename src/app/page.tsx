import HeroSection from "@/components/hero-section";
import { Card } from "@/components/ui/card";
import { Clock, Camera, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="gradient-snapcook-light py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Why Choose SnapCook?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of cooking with our AI-powered platform designed for modern kitchens.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 text-center space-y-4 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Clock className="w-12 h-12 text-orange-600 mx-auto" />
                <h4 className="text-xl font-semibold text-gray-800">Instant Results</h4>
                <p className="text-gray-600">Get personalized recipes in seconds with our advanced AI technology</p>
              </Card>
              
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 text-center space-y-4 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Camera className="w-12 h-12 text-orange-600 mx-auto" />
                <h4 className="text-xl font-semibold text-gray-800">Multimodal Input</h4>
                <p className="text-gray-600">Text, photos, or voice - interact with your kitchen your way</p>
              </Card>
              
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 text-center space-y-4 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Heart className="w-12 h-12 text-orange-600 mx-auto" />
                <h4 className="text-xl font-semibold text-gray-800">Health-Conscious</h4>
                <p className="text-gray-600">Smart nutritional insights and personalized dietary recommendations</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
