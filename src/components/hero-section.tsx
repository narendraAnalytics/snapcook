"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Mic, Sparkles, ChefHat, Utensils, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
  const [ingredients, setIngredients] = useState("");

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden -mt-20 pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">AI-Powered Cooking</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Your Kitchen,
                <span className="block bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Optimized.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/80 max-w-lg leading-relaxed">
                Pantry perfection at your fingertips.
                <span className="block mt-2 text-lg text-white/70">
                  Transform your kitchen management with our intelligent recipe system.
                </span>
              </p>
            </div>

            {/* Quick Recipe Input */}
            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-orange-400" />
                  What's in your kitchen?
                </h3>
                
                <div className="relative">
                  <Input 
                    placeholder="e.g., chicken, tomatoes, basil..."
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg py-6 pr-20 focus:bg-white/30 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <Button size="sm" variant="ghost" className="p-2 hover:bg-white/20 text-white/80 hover:text-white">
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-2 hover:bg-white/20 text-white/80 hover:text-white">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Discover Recipes
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Food Visual */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Plate Background */}
                <div className="absolute inset-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-2xl border-8 border-white/20"></div>
                
                {/* Food Items */}
                <div className="absolute top-16 left-16 w-16 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg transform rotate-12"></div>
                <div className="absolute top-24 right-20 w-20 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg transform -rotate-6"></div>
                <div className="absolute bottom-20 left-20 w-12 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-lg transform rotate-45"></div>
                
                {/* Cooking Utensils */}
                <div className="absolute -top-4 -right-8 transform rotate-45">
                  <div className="w-4 h-32 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-lg"></div>
                  <div className="absolute top-0 -left-1 w-6 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg"></div>
                </div>
                
                <div className="absolute -bottom-8 -left-8 transform -rotate-12">
                  <div className="w-4 h-28 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-lg"></div>
                  <div className="absolute top-0 -left-2 w-8 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 left-8 animate-bounce">
                  <ChefHat className="w-8 h-8 text-white/60" />
                </div>
                <div className="absolute -bottom-4 right-8 animate-pulse">
                  <Utensils className="w-6 h-6 text-white/60" />
                </div>
                <div className="absolute top-8 -left-8 animate-ping">
                  <Sparkles className="w-6 h-6 text-yellow-400/80" />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-3xl scale-110"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24 fill-current text-orange-50">
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}