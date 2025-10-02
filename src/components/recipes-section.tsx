"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, Star, ChefHat } from "lucide-react";
import Image from "next/image";

const featuredRecipes = [
  {
    id: 1,
    title: "Creamy Garlic Pasta",
    description: "Rich and creamy pasta with fresh garlic, herbs, and parmesan cheese",
    image: "/images/recipe-pasta.jpg",
    cookTime: "25 min",
    servings: 4,
    rating: 4.8,
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken, avocado, and honey mustard",
    image: "/images/recipe-salad.jpg",
    cookTime: "15 min",
    servings: 2,
    rating: 4.6,
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "Beef Stir Fry",
    description: "Tender beef with colorful vegetables in a savory Asian-inspired sauce",
    image: "/images/recipe-stirfry.jpg",
    cookTime: "20 min",
    servings: 3,
    rating: 4.7,
    difficulty: "Medium"
  },
  {
    id: 4,
    title: "Chocolate Chip Cookies",
    description: "Classic homemade cookies with perfect crispy edges and soft centers",
    image: "/images/recipe-cookies.jpg",
    cookTime: "30 min",
    servings: 24,
    rating: 4.9,
    difficulty: "Easy"
  },
  {
    id: 5,
    title: "Salmon with Herbs",
    description: "Pan-seared salmon with fresh dill, lemon, and seasonal vegetables",
    image: "/images/recipe-salmon.jpg",
    cookTime: "35 min",
    servings: 2,
    rating: 4.8,
    difficulty: "Medium"
  },
  {
    id: 6,
    title: "Vegetable Curry",
    description: "Aromatic curry with mixed vegetables, coconut milk, and fragrant spices",
    image: "/images/recipe-curry.jpg",
    cookTime: "40 min",
    servings: 4,
    rating: 4.5,
    difficulty: "Medium"
  }
];

export default function RecipesSection() {
  return (
    <section className="pt-0 pb-16 lg:pt-0 lg:pb-24 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 pt-16 lg:pt-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full border border-orange-200 mb-6">
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 text-sm font-medium">Featured Recipes</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Discover Amazing 
              <span className="block bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Recipes
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From quick weeknight dinners to impressive weekend treats, find the perfect recipe for every occasion.
            </p>
          </div>

          {/* Recipe Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="group overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
                    <ChefHat className="w-16 h-16 text-orange-400" />
                  </div>
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-gray-700">{recipe.rating}</span>
                  </div>
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-gray-700">{recipe.difficulty}</span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-300">
                    View Recipe
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:from-orange-700 hover:via-pink-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              View All Recipes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}