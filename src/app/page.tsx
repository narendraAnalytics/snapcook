import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChefHat, Camera, Mic, Sparkles, Clock, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen gradient-snapcook-light">
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <ChefHat className="w-12 h-12 text-orange-600" />
              <h1 className="text-5xl lg:text-7xl font-bold gradient-text">
                SnapCook
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-gray-700 font-medium">
              AI-powered recipe generator
            </p>
          </div>

          {/* Value Proposition */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-800">
              Transform ingredients into amazing recipes
              <span className="block text-orange-600">instantly with AI</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload photos, type ingredients, or speak your way to delicious meals. 
              Get personalized recipes with nutritional insights in seconds.
            </p>
          </div>

          {/* Input Preview */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 max-w-2xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                What ingredients do you have?
              </h3>
              
              <div className="relative">
                <Input 
                  placeholder="e.g., chicken, tomatoes, basil, garlic..."
                  className="text-lg py-6 pr-16 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button size="sm" variant="ghost" className="p-2 hover:bg-orange-100">
                    <Camera className="w-4 h-4 text-orange-600" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2 hover:bg-orange-100">
                    <Mic className="w-4 h-4 text-orange-600" />
                  </Button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Generate Recipe
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 text-center space-y-3">
              <Clock className="w-8 h-8 text-orange-600 mx-auto" />
              <h4 className="font-semibold text-gray-800">Instant Results</h4>
              <p className="text-gray-600 text-sm">Get recipes in seconds with AI-powered generation</p>
            </Card>
            
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 text-center space-y-3">
              <Camera className="w-8 h-8 text-orange-600 mx-auto" />
              <h4 className="font-semibold text-gray-800">Multimodal Input</h4>
              <p className="text-gray-600 text-sm">Text, photos, or voice - cook your way</p>
            </Card>
            
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 text-center space-y-3">
              <Heart className="w-8 h-8 text-orange-600 mx-auto" />
              <h4 className="font-semibold text-gray-800">Health-Conscious</h4>
              <p className="text-gray-600 text-sm">Nutritional insights and dietary preferences</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
