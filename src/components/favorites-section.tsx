"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Clock, 
  Users, 
  Star, 
  ChefHat, 
  Search, 
  Filter,
  SortAsc,
  Trash2,
  Eye,
  Share2,
  BookHeart,
  Sparkles
} from "lucide-react";

// Sample favorite recipes data
const favoriteRecipes = [
  {
    id: 1,
    title: "Mediterranean Quinoa Bowl",
    description: "Fresh quinoa with roasted vegetables, feta cheese, and lemon-herb dressing",
    image: "/images/recipe-quinoa.jpg",
    cookTime: "25 min",
    servings: 2,
    rating: 4.9,
    difficulty: "Easy",
    mealType: "lunch",
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    dateAdded: "2024-01-15",
    isFavorite: true
  },
  {
    id: 2,
    title: "Spicy Thai Basil Chicken",
    description: "Authentic Thai stir-fry with fresh basil, chilies, and jasmine rice",
    image: "/images/recipe-thai.jpg",
    cookTime: "20 min",
    servings: 3,
    rating: 4.8,
    difficulty: "Medium",
    mealType: "dinner",
    dietaryTags: ["Spicy", "Asian"],
    dateAdded: "2024-01-12",
    isFavorite: true
  },
  {
    id: 3,
    title: "Blueberry Pancakes",
    description: "Fluffy pancakes bursting with fresh blueberries and maple syrup",
    image: "/images/recipe-pancakes.jpg",
    cookTime: "15 min",
    servings: 4,
    rating: 4.7,
    difficulty: "Easy",
    mealType: "breakfast",
    dietaryTags: ["Sweet", "Family-Friendly"],
    dateAdded: "2024-01-10",
    isFavorite: true
  },
  {
    id: 4,
    title: "Salmon Teriyaki",
    description: "Glazed salmon with steamed vegetables and sesame seeds",
    image: "/images/recipe-salmon-teriyaki.jpg",
    cookTime: "30 min",
    servings: 2,
    rating: 4.9,
    difficulty: "Medium",
    mealType: "dinner",
    dietaryTags: ["Healthy", "High-Protein"],
    dateAdded: "2024-01-08",
    isFavorite: true
  },
  {
    id: 5,
    title: "Chocolate Lava Cake",
    description: "Rich chocolate cake with molten center, served with vanilla ice cream",
    image: "/images/recipe-lava-cake.jpg",
    cookTime: "25 min",
    servings: 2,
    rating: 4.8,
    difficulty: "Hard",
    mealType: "dessert",
    dietaryTags: ["Sweet", "Indulgent"],
    dateAdded: "2024-01-05",
    isFavorite: true
  },
  {
    id: 6,
    title: "Greek Salad",
    description: "Traditional Greek salad with olives, feta, and oregano dressing",
    image: "/images/recipe-greek-salad.jpg",
    cookTime: "10 min",
    servings: 4,
    rating: 4.6,
    difficulty: "Easy",
    mealType: "lunch",
    dietaryTags: ["Vegetarian", "Mediterranean"],
    dateAdded: "2024-01-03",
    isFavorite: true
  }
];

export default function FavoritesSection() {
  const [favorites, setFavorites] = useState(favoriteRecipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort favorites
  const filteredAndSortedFavorites = favorites
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === "all" || recipe.mealType === filterBy || recipe.difficulty.toLowerCase() === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateAdded":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case "rating":
          return b.rating - a.rating;
        case "cookTime":
          return parseInt(a.cookTime) - parseInt(b.cookTime);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Toggle favorite status
  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  // Heart animation component
  const HeartButton = ({ recipeId, isFavorite }: { recipeId: number; isFavorite: boolean }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleFavorite(recipeId)}
      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white/95 transition-all duration-300 group"
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-300 ${
          isFavorite 
            ? 'fill-red-500 text-red-500 group-hover:scale-110' 
            : 'text-gray-400 group-hover:text-red-400 group-hover:scale-110'
        }`} 
      />
    </Button>
  );

  return (
    <section id="favorites" className="py-16 lg:py-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-100">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-indigo-200 mb-6">
              <BookHeart className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700 text-sm font-medium">Your Favorites</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Saved 
              <span className="block bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Favorites
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your personal collection of beloved recipes. Quick access to the dishes that make your heart sing.
            </p>
          </div>

          {/* Controls Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search your favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              {/* Filter and Sort */}
              <div className="flex gap-3">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-32 bg-white/70">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-white/70">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAdded">Recently Added</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="cookTime">Cooking Time</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {filteredAndSortedFavorites.length} favorite recipe{filteredAndSortedFavorites.length !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-rose-600">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share List
                </Button>
              </div>
            </div>
          </div>

          {/* Favorites Grid */}
          {filteredAndSortedFavorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedFavorites.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="group overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1"
                >
                  {/* Recipe Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-rose-200 via-pink-200 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <ChefHat className="w-16 h-16 text-rose-400 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    
                    {/* Heart Button */}
                    <HeartButton recipeId={recipe.id} isFavorite={recipe.isFavorite} />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-gray-700">{recipe.rating}</span>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-gray-700">{recipe.difficulty}</span>
                    </div>
                  </div>

                  {/* Recipe Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-2">
                        {recipe.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.dietaryTags.slice(0, 2).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-rose-50 text-rose-700 border-rose-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

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

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-300"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Recipe
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFavorite(recipe.id)}
                        className="text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-6">
                <Heart className="w-12 h-12 text-rose-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {searchTerm || filterBy !== "all" ? "No matching favorites" : "No favorites yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || filterBy !== "all" 
                  ? "Try adjusting your search or filter criteria to find your favorite recipes."
                  : "Start exploring recipes and add them to your favorites for quick access later."
                }
              </p>
              <Button className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-medium px-6 py-3 rounded-xl">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Recipes
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}