"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChefHat, 
  Upload, 
  Type, 
  Clock, 
  Heart, 
  Cloud, 
  Utensils, 
  Users, 
  Camera,
  X,
  Plus,
  Sparkles,
  Home,
  ArrowLeft,
  ArrowRight,
  CookingPot,
  Timer,
  Lightbulb,
  CheckCircle,
  Star,
  Zap,
  BookOpen,
  Save,
  Menu,
  Search,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [inputMethod, setInputMethod] = useState<'text' | 'image'>('text');
  const [ingredients, setIngredients] = useState('');
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const [cookingExperience, setCookingExperience] = useState('');
  const [selectedHealthConditions, setSelectedHealthConditions] = useState<string[]>([]);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<string[]>([]);
  const [weather, setWeather] = useState('');
  const [mealType, setMealType] = useState('');
  const [servings, setServings] = useState(2);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showRecipeView, setShowRecipeView] = useState(false);
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);
  
  // Sidebar and recipe storage states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSavedRecipeView, setShowSavedRecipeView] = useState(false);
  const [savedRecipeContent, setSavedRecipeContent] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  // Carousel navigation states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>(null);

  // Ingredient suggestions data
  const ingredientSuggestions = [
    {
      id: 1,
      title: "Healthy Stir-Fry",
      ingredients: "chicken breast, broccoli, garlic, rice, onions",
      emoji: "🥗",
      category: "Healthy"
    },
    {
      id: 2,
      title: "Mediterranean Style",
      ingredients: "salmon, lemon, asparagus, quinoa, olive oil",
      emoji: "🐟",
      category: "Mediterranean"
    },
    {
      id: 3,
      title: "Italian Comfort",
      ingredients: "ground beef, tomatoes, onions, pasta, basil",
      emoji: "🍝",
      category: "Italian"
    },
    {
      id: 4,
      title: "Asian Fusion",
      ingredients: "tofu, bell peppers, soy sauce, noodles, ginger",
      emoji: "🍜",
      category: "Asian"
    },
    {
      id: 5,
      title: "Breakfast Bowl",
      ingredients: "eggs, spinach, cheese, mushrooms, avocado",
      emoji: "🍳",
      category: "Breakfast"
    },
    {
      id: 6,
      title: "Mexican Fiesta",
      ingredients: "black beans, corn, bell peppers, lime, cilantro",
      emoji: "🌮",
      category: "Mexican"
    }
  ];

  // Function to extract recipe title using existing parseRecipe logic
  const extractRecipeTitle = (text: string): string => {
    const sections = parseRecipe(text);
    const titleSection = sections.find(section => section.type === 'title');
    return titleSection?.content || 'Untitled Recipe';
  };

  // Function to parse recipe into structured sections
  interface RecipeSection {
    type: 'title' | 'description' | 'ingredients' | 'instructions' | 'tips' | 'time' | 'text' | 'nutrition' | 'health' | 'pairing' | 'storage' | 'substitutions' | 'techniques' | 'difficulty';
    content: string;
    items?: string[];
  }

  const parseRecipe = (text: string): RecipeSection[] => {
    const cleanText = text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    const lines = cleanText.split('\n').filter(line => line.trim());
    const sections: RecipeSection[] = [];
    let currentSection: RecipeSection | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect title (first meaningful line)
      if (i === 0 || (i === 1 && lines[0].length < 50)) {
        sections.push({
          type: 'title',
          content: line
        });
        continue;
      }

      // Detect nutrition section
      if ((line.toLowerCase().includes('nutrition') || line.toLowerCase().includes('calorie') || line.toLowerCase().includes('macronutrient') || line.toLowerCase().includes('health benefit')) && line.length < 80) {
        currentSection = {
          type: 'nutrition',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect ingredients section
      if (line.toLowerCase().includes('ingredients') && line.length < 40) {
        currentSection = {
          type: 'ingredients',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect instructions/method section
      if ((line.toLowerCase().includes('instruction') || line.toLowerCase().includes('method') || line.toLowerCase().includes('steps') || line.toLowerCase().includes('preparation')) && line.length < 50) {
        currentSection = {
          type: 'instructions',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect health benefits section
      if ((line.toLowerCase().includes('health') || line.toLowerCase().includes('benefit') || line.toLowerCase().includes('therapeutic')) && line.length < 50) {
        currentSection = {
          type: 'health',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect techniques section
      if ((line.toLowerCase().includes('technique') || line.toLowerCase().includes('chef') || line.toLowerCase().includes('advanced')) && line.length < 50) {
        currentSection = {
          type: 'techniques',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect substitutions section
      if ((line.toLowerCase().includes('substitut') || line.toLowerCase().includes('alternative')) && line.length < 50) {
        currentSection = {
          type: 'substitutions',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect pairing section
      if ((line.toLowerCase().includes('pairing') || line.toLowerCase().includes('wine') || line.toLowerCase().includes('beverage')) && line.length < 50) {
        currentSection = {
          type: 'pairing',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect storage section
      if ((line.toLowerCase().includes('storage') || line.toLowerCase().includes('meal prep') || line.toLowerCase().includes('scaling')) && line.length < 50) {
        currentSection = {
          type: 'storage',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect tips section
      if (line.toLowerCase().includes('tip') && line.length < 40) {
        currentSection = {
          type: 'tips',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect difficulty section
      if ((line.toLowerCase().includes('difficulty') || line.toLowerCase().includes('skill level') || line.toLowerCase().includes('complexity') || line.toLowerCase().includes('skill requirement')) && line.length < 80) {
        currentSection = {
          type: 'difficulty',
          content: line,
          items: []
        };
        sections.push(currentSection);
        continue;
      }

      // Detect time/cooking info
      if (line.toLowerCase().includes('time') || line.toLowerCase().includes('cook') || line.toLowerCase().includes('prep')) {
        sections.push({
          type: 'time',
          content: line
        });
        continue;
      }

      // Handle list items
      if (line.match(/^[•\-\*]\s+/) || line.match(/^\d+\.\s+/)) {
        const cleanItem = line.replace(/^[•\-\*]\s+/, '').replace(/^\d+\.\s+/, '');
        if (currentSection && currentSection.items) {
          currentSection.items.push(cleanItem);
        } else {
          sections.push({
            type: 'text',
            content: cleanItem
          });
        }
        continue;
      }

      // Regular paragraphs
      if (line.length > 50) {
        sections.push({
          type: 'description',
          content: line
        });
      } else if (line.length > 0) {
        sections.push({
          type: 'text',
          content: line
        });
      }
    }

    return sections;
  };

  // Structured Recipe Display Component
  const RecipeDisplay = ({ recipe, isStreamingComplete }: { recipe: string; isStreamingComplete: boolean }) => {
    console.log('RecipeDisplay received recipe of length:', recipe.length);
    console.log('Recipe preview:', recipe.substring(0, 100) + '...');
    console.log('Is streaming complete:', isStreamingComplete);
    const sections = parseRecipe(recipe);
    console.log('Parsed sections count:', sections.length);

    const getSectionIcon = (type: string) => {
      switch (type) {
        case 'title':
          return <Star className="w-6 h-6 text-yellow-500 animate-pulse" />;
        case 'nutrition':
          return <Heart className="w-5 h-5 text-red-500 animate-pulse" />;
        case 'ingredients':
          return <CookingPot className="w-5 h-5 text-orange-500 animate-bounce" />;
        case 'instructions':
          return <ChefHat className="w-5 h-5 text-purple-500 animate-pulse" />;
        case 'health':
          return <Heart className="w-5 h-5 text-green-600 animate-bounce" />;
        case 'techniques':
          return <Star className="w-5 h-5 text-yellow-600 animate-pulse" />;
        case 'substitutions':
          return <Zap className="w-5 h-5 text-blue-500 animate-bounce" />;
        case 'pairing':
          return <Utensils className="w-5 h-5 text-purple-600 animate-pulse" />;
        case 'storage':
          return <Clock className="w-5 h-5 text-gray-600 animate-bounce" />;
        case 'tips':
          return <Lightbulb className="w-5 h-5 text-blue-500 animate-bounce" />;
        case 'difficulty':
          return <Star className="w-5 h-5 text-indigo-600 animate-pulse" />;
        case 'time':
          return <Timer className="w-5 h-5 text-green-500 animate-pulse" />;
        default:
          return <Sparkles className="w-4 h-4 text-pink-500" />;
      }
    };

    return (
      <div className="grid gap-6 md:gap-8">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className={`recipe-card ${isStreamingComplete ? 'opacity-0 transform scale-95 translate-y-4' : 'opacity-100'}`}
            style={isStreamingComplete ? {
              animationDelay: `${index * 0.2}s`,
              animationDuration: '0.7s',
              animationFillMode: 'forwards',
              animation: `cardSlideIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.2}s forwards`
            } : {}}
          >
            {section.type === 'title' && (
              <div className="recipe-title-card bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-8 border-2 border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {getSectionIcon('title')}
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {section.content}
                    </h1>
                    {getSectionIcon('title')}
                  </div>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto"></div>
                </div>
              </div>
            )}

            {section.type === 'description' && (
              <div className="recipe-description-card bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Chef's Inspiration</h3>
                    <p className="text-gray-700 leading-relaxed text-lg italic">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {section.type === 'ingredients' && (
              <div className="recipe-ingredients-card bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {getSectionIcon('ingredients')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {section.content || 'Fresh Ingredients'}
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.items?.map((item, i) => (
                    <div 
                      key={i} 
                      className="ingredient-item flex items-center gap-4 p-4 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/95 group/item border border-orange-100 hover:border-orange-300"
                      style={isStreamingComplete ? {
                        animationDelay: `${(index * 0.2) + (i * 0.1)}s`,
                        animation: `itemSlideIn 0.5s ease-out ${(index * 0.2) + (i * 0.1)}s forwards`
                      } : {}}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'instructions' && (
              <div className="recipe-instructions-card bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {getSectionIcon('instructions')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {section.content || 'Cooking Instructions'}
                  </h2>
                </div>
                <div className="space-y-5">
                  {section.items?.map((step, i) => (
                    <div 
                      key={i} 
                      className="instruction-step flex gap-5 p-5 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/95 group/step border border-purple-100 hover:border-purple-300"
                      style={isStreamingComplete ? {
                        animationDelay: `${(index * 0.2) + (i * 0.15)}s`,
                        animation: `stepSlideIn 0.6s ease-out ${(index * 0.2) + (i * 0.15)}s forwards`
                      } : {}}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover/step:shadow-xl transition-all duration-300 group-hover/step:scale-110">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 leading-relaxed font-medium text-lg">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'nutrition' && (
              <div className="recipe-nutrition-card bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-8 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {getSectionIcon('nutrition')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {section.content || 'Nutritional Powerhouse'}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items?.map((info, i) => (
                    <div 
                      key={i} 
                      className="nutrition-item flex items-center gap-4 p-4 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/95 group/item border border-red-100 hover:border-red-300"
                      style={isStreamingComplete ? {
                        animationDelay: `${(index * 0.2) + (i * 0.1)}s`,
                        animation: `itemSlideIn 0.5s ease-out ${(index * 0.2) + (i * 0.1)}s forwards`
                      } : {}}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium flex-1">{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'health' && (
              <div className="recipe-health-card bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {getSectionIcon('health')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {section.content || 'Health Benefits'}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.items?.map((benefit, i) => (
                    <div 
                      key={i} 
                      className="health-benefit flex items-start gap-4 p-4 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/95 group/item border border-green-100 hover:border-green-300"
                      style={isStreamingComplete ? {
                        animationDelay: `${(index * 0.2) + (i * 0.1)}s`,
                        animation: `itemSlideIn 0.5s ease-out ${(index * 0.2) + (i * 0.1)}s forwards`
                      } : {}}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200 mt-1">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed font-medium flex-1">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'techniques' && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon('techniques')}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.content || 'Master Chef Techniques'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.items?.map((technique, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{technique}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'substitutions' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon('substitutions')}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.content || 'Ingredient Substitutions'}
                  </h2>
                </div>
                <div className="space-y-2">
                  {section.items?.map((sub, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      <Zap className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'pairing' && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon('pairing')}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.content || 'Wine & Beverage Pairing'}
                  </h2>
                </div>
                <div className="space-y-2">
                  {section.items?.map((pairing, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      <Utensils className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{pairing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'storage' && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon('storage')}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.content || 'Storage & Meal Prep'}
                  </h2>
                </div>
                <div className="space-y-2">
                  {section.items?.map((storage, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      <Clock className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{storage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'tips' && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  {getSectionIcon('tips')}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.content || 'Chef\'s Final Notes'}
                  </h2>
                </div>
                <div className="space-y-2">
                  {section.items?.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'difficulty' && (
              <div className="recipe-difficulty-card bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {getSectionIcon('difficulty')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {section.content || 'Recipe Difficulty & Skills'}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items?.map((item, i) => (
                    <div 
                      key={i} 
                      className="difficulty-item flex items-center gap-4 p-4 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/95 group/item border border-indigo-100 hover:border-indigo-300"
                      style={isStreamingComplete ? {
                        animationDelay: `${(index * 0.2) + (i * 0.1)}s`,
                        animation: `itemSlideIn 0.5s ease-out ${(index * 0.2) + (i * 0.1)}s forwards`
                      } : {}}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all duration-200">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'time' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  {getSectionIcon('time')}
                  <span className="text-gray-700 font-medium">{section.content}</span>
                </div>
              </div>
            )}

            {section.type === 'text' && (
              <div className="p-3">
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const healthConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol', 
    'Celiac Disease', 'Food Allergies', 'Kidney Disease', 'None'
  ];

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb', 
    'Paleo', 'Dairy-Free', 'Nut-Free', 'Low-Sodium', 'None'
  ];

  const cookingEquipment = [
    'Oven', 'Stovetop', 'Microwave', 'Air Fryer', 'Grill', 
    'Slow Cooker', 'Pressure Cooker', 'Blender', 'Food Processor'
  ];

  const handleTagToggle = (item: string, selectedItems: string[], setSelectedItems: (items: string[]) => void) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSuggestionClick = (suggestionIngredients: string) => {
    setIngredients(suggestionIngredients);
  };

  // Carousel navigation functions
  const checkScrollButtons = () => {
    if (carouselRef) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (carouselRef) {
      const cardWidth = 220; // Approximate width of each card including gap
      carouselRef.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (carouselRef) {
      const cardWidth = 220; // Approximate width of each card including gap
      carouselRef.scrollBy({ left: cardWidth, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setGeneratedRecipe('');
    setShowRecipeView(true);
    setIsStreamingComplete(false);

    try {
      // Validate required fields
      if (inputMethod === 'text' && !ingredients.trim()) {
        throw new Error('Please enter some ingredients');
      }
      if (inputMethod === 'image' && !imageFile) {
        throw new Error('Please upload an image of your ingredients');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('inputMethod', inputMethod);
      formData.append('ingredients', ingredients);
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }
      formData.append('maxCookingTime', maxCookingTime.toString());
      formData.append('cookingExperience', cookingExperience);
      formData.append('healthConditions', selectedHealthConditions.join(', '));
      formData.append('dietaryRestrictions', selectedDietaryRestrictions.join(', '));
      formData.append('weather', weather);
      formData.append('mealType', mealType);
      formData.append('servings', servings.toString());
      formData.append('equipment', selectedEquipment.join(', '));

      // Call the API
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedText = '';
      console.log('Starting to read streaming response...');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Streaming finished. Final text length:', accumulatedText.length);
          console.log('Final accumulated text preview:', accumulatedText.substring(0, 200) + '...');
          setIsStreamingComplete(true);
          
          // Auto-save the generated recipe
          await autoSaveRecipe(accumulatedText);
          
          // Reset form states for next recipe
          resetFormStates();
          break;
        }
        
        const chunk = new TextDecoder().decode(value);
        console.log('Received chunk of length:', chunk.length);
        accumulatedText += chunk;
        console.log('Total accumulated length:', accumulatedText.length);
        setGeneratedRecipe(accumulatedText);
      }

    } catch (error) {
      console.error('Recipe generation error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setShowRecipeView(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReturnToForm = () => {
    setShowRecipeView(false);
    setGeneratedRecipe('');
    setError('');
    setIsGenerating(false);
    setIsStreamingComplete(false);
    
    // Reset form states for new recipe
    resetFormStates();
  };

  // Recipe storage functions
  const fetchSavedRecipes = async () => {
    setIsLoadingRecipes(true);
    try {
      const response = await fetch('/api/save-recipe');
      const data = await response.json();
      if (data.success) {
        setSavedRecipes(data.recipes);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Auto-save function for generated recipes
  const autoSaveRecipe = async (recipeContent: string) => {
    try {
      // Extract title using consistent method
      const title = extractRecipeTitle(recipeContent);
      
      // Extract difficulty and cooking time if available
      const difficultyMatch = recipeContent.match(/difficulty[:\s]*([^\n]*)/i);
      const difficulty = difficultyMatch ? difficultyMatch[1].trim() : null;
      
      const recipeData = {
        title,
        content: recipeContent,
        ingredients: ingredients,
        preferences: {
          maxCookingTime,
          cookingExperience,
          healthConditions: selectedHealthConditions,
          dietaryRestrictions: selectedDietaryRestrictions,
          weather,
          mealType,
          servings,
          equipment: selectedEquipment
        },
        difficulty,
        cookingTime: maxCookingTime,
        servings: servings
      };
      
      const response = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('Recipe auto-saved successfully!', `Recipe #${data.recipe.recipeNumber}`);
        // Refresh the saved recipes list
        fetchSavedRecipes();
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error to user for auto-save - it's background operation
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Extract title using consistent method
      const title = extractRecipeTitle(generatedRecipe);
      
      const recipeData = {
        title,
        content: generatedRecipe,
        ingredients: ingredients,
        preferences: {
          maxCookingTime,
          cookingExperience,
          healthConditions: selectedHealthConditions,
          dietaryRestrictions: selectedDietaryRestrictions,
          weather,
          mealType,
          servings,
          equipment: selectedEquipment
        }
      };
      
      const response = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaveMessage('Recipe saved successfully!');
        fetchSavedRecipes(); // Refresh the list
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save recipe');
      }
    } catch (error) {
      console.error('Save recipe error:', error);
      setSaveMessage('Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      fetchSavedRecipes();
    }
  };

  const viewRecipeInSidebar = (recipe: any) => {
    setSelectedRecipe(recipe);
  };

  const viewRecipeFullScreen = (recipe: any) => {
    setSavedRecipeContent(recipe.content);
    setShowSavedRecipeView(true);
    setIsSidebarOpen(false); // Close sidebar
  };

  const handleBackToDashboard = () => {
    setShowSavedRecipeView(false);
    setSavedRecipeContent('');
  };

  const filteredRecipes = savedRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to reset all form states to initial values
  const resetFormStates = () => {
    setIngredients('');
    setMaxCookingTime(30);
    setCookingExperience('');
    setSelectedHealthConditions([]);
    setSelectedDietaryRestrictions([]);
    setWeather('');
    setMealType('');
    setServings(2);
    setSelectedEquipment([]);
    setImageFile(null);
    setInputMethod('text');
  };

  // Load saved recipes on component mount
  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {showRecipeView ? (
        // Full-Screen Recipe View
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-viewTransition">
          <div className="w-full h-full overflow-y-auto">
            <div className="min-h-full flex flex-col">
              {/* Header with Return Button */}
              <div className="p-4 sticky top-0 z-10 animate-slideInLeft">
                <div className="container mx-auto flex items-center justify-between">
                  <Button
                    onClick={handleReturnToForm}
                    variant="outline"
                    className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-2 rounded-xl text-blue-700 hover:text-blue-800 font-medium hover:scale-105 text-sm md:text-base md:px-4"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="hidden sm:inline">Back to Form</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="group flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-2 rounded-xl text-green-700 hover:text-green-800 font-medium hover:scale-105 text-sm md:text-base md:px-4"
                  >
                    <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </div>
              </div>

              {/* Centered Recipe Content */}
              <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
                <div className="w-full max-w-4xl">
                  {/* Recipe Display */}
                  <div className="p-4 sm:p-6 md:p-8 animate-scaleIn">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                        <ChefHat className={`w-6 h-6 sm:w-8 sm:h-8 text-orange-600 ${isGenerating ? 'animate-pulse' : ''}`} />
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent text-center">
                          {isGenerating ? 'Cooking up something amazing...' : 'Your Perfect Recipe'}
                        </h1>
                        <Sparkles className={`w-6 h-6 sm:w-8 sm:h-8 text-purple-600 ${isGenerating ? 'animate-spin' : ''}`} />
                      </div>
                      
                      {isGenerating && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-gray-600 text-sm sm:text-base text-center">AI is analyzing your preferences and searching for the best techniques...</span>
                        </div>
                      )}
                    </div>

                    <div className="max-w-none">
                      {(() => {
                        console.log('Rendering recipe section. generatedRecipe length:', generatedRecipe.length);
                        console.log('generatedRecipe truthy:', !!generatedRecipe);
                        console.log('isGenerating:', isGenerating);
                        return generatedRecipe ? (
                          <RecipeDisplay recipe={generatedRecipe} isStreamingComplete={isStreamingComplete} />
                        ) : (
                          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-8 border border-orange-100 text-center">
                            <div className="flex items-center justify-center gap-3 text-gray-500">
                              <ChefHat className="w-8 h-8 animate-pulse" />
                              <span className="text-xl font-medium">Your recipe will appear here...</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {generatedRecipe && !isGenerating && (
                      <div className="mt-6 sm:mt-8 space-y-4">
                        {saveMessage && (
                          <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              {saveMessage}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                          <Button 
                            onClick={() => {
                              const cleanText = generatedRecipe
                                .replace(/^#{1,6}\s+/gm, '')
                                .replace(/\*\*(.*?)\*\*/g, '$1')
                                .replace(/\*(.*?)\*/g, '$1')
                                .trim();
                              navigator.clipboard.writeText(cleanText);
                            }}
                            variant="outline"
                            className="text-orange-600 border-orange-300 hover:bg-orange-50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Copy Recipe
                          </Button>
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium text-sm">Auto-saved to My Recipes</span>
                          </div>
                          <Button 
                            onClick={handleReturnToForm}
                            className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Generate Another Recipe</span>
                            <span className="sm:hidden">Generate Another</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showSavedRecipeView ? (
        // Full-Screen Saved Recipe View
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-viewTransition">
          <div className="w-full h-full overflow-y-auto">
            <div className="min-h-full flex flex-col">
              {/* Header with Return Button */}
              <div className="p-4 sticky top-0 z-10 animate-slideInLeft">
                <div className="container mx-auto flex items-center justify-between">
                  <Button
                    onClick={handleBackToDashboard}
                    variant="outline"
                    className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-2 rounded-xl text-blue-700 hover:text-blue-800 font-medium hover:scale-105 text-sm md:text-base md:px-4"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="group flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 border-green-200 hover:border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-2 rounded-xl text-green-700 hover:text-green-800 font-medium hover:scale-105 text-sm md:text-base md:px-4"
                  >
                    <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </div>
              </div>

              {/* Centered Recipe Content */}
              <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
                <div className="w-full max-w-4xl">
                  {/* Recipe Display */}
                  <div className="p-4 sm:p-6 md:p-8 animate-scaleIn">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                        <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent text-center">
                          Saved Recipe
                        </h1>
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                      </div>
                    </div>

                    <div className="max-w-none">
                      <RecipeDisplay recipe={savedRecipeContent} isStreamingComplete={true} />
                    </div>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                      <Button 
                        onClick={() => {
                          const cleanText = savedRecipeContent
                            .replace(/^#{1,6}\\s+/gm, '')
                            .replace(/\\*\\*(.*?)\\*\\*/g, '$1')
                            .replace(/\\*(.*?)\\*/g, '$1')
                            .trim();
                          navigator.clipboard.writeText(cleanText);
                        }}
                        variant="outline"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Copy Recipe
                      </Button>
                      <Button 
                        onClick={handleBackToDashboard}
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Back</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Original Form View
        <div className="container mx-auto px-6 py-8 relative">
          {/* Header with Home and My Recipes buttons */}
          <div className="mb-8 flex justify-between items-center">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="group flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200 border-orange-200 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl text-orange-700 hover:text-orange-800 font-medium hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-base">Back to Home</span>
            </Button>
            
            {/* My Recipes Toggle Button */}
            <Button
              onClick={toggleSidebar}
              variant="outline"
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-100 hover:from-purple-100 hover:to-indigo-200 border-purple-200 hover:border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl text-purple-700 hover:text-purple-800 font-medium hover:scale-105"
            >
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-base">My Recipes</span>
              <div className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                {savedRecipes.length}
              </div>
            </Button>
          </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full border border-orange-200 mb-4">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-orange-700 text-sm font-medium">AI Recipe Generator</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || 'Chef'}!
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's create the perfect recipe tailored just for you. Tell us about your ingredients, preferences, and we'll work our magic!
          </p>
        </div>

        {/* Recipe Generation Form */}
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Ingredients Input Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Your Ingredients</h2>
              </div>

              {/* Input Method Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                <Button
                  type="button"
                  variant={inputMethod === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMethod('text')}
                  className={inputMethod === 'text' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-700 hover:text-orange-600'}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Type Ingredients
                </Button>
                <Button
                  type="button"
                  variant={inputMethod === 'image' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMethod('image')}
                  className={inputMethod === 'image' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-700 hover:text-orange-600'}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              {/* Unified Input Area */}
              <div className="relative">
                {inputMethod === 'text' ? (
                  <div>
                    <Label htmlFor="ingredients" className="text-sm font-semibold text-gray-800 mb-2 block">
                      What ingredients do you have?
                    </Label>
                    <Textarea
                      id="ingredients"
                      placeholder="e.g., chicken breast, broccoli, garlic, rice, onions..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="min-h-[120px] resize-none border-gray-200 focus:border-orange-400 focus:ring-orange-400 placeholder:text-gray-600"
                    />
                    
                    {/* Ingredient Suggestions */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">Need inspiration? Try these popular combinations:</span>
                      </div>
                      <div className="relative group">
                        {/* Left Arrow */}
                        <button
                          onClick={scrollLeft}
                          className={`carousel-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-orange-200 hover:border-orange-300 rounded-full p-2 transition-all duration-300 hover:scale-110 ${
                            canScrollLeft ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
                          }`}
                          disabled={!canScrollLeft}
                          type="button"
                        >
                          <ChevronLeft className="w-5 h-5 text-orange-600" />
                        </button>

                        {/* Right Arrow */}
                        <button
                          onClick={scrollRight}
                          className={`carousel-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-orange-200 hover:border-orange-300 rounded-full p-2 transition-all duration-300 hover:scale-110 ${
                            canScrollRight ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
                          }`}
                          disabled={!canScrollRight}
                          type="button"
                        >
                          <ChevronRight className="w-5 h-5 text-orange-600" />
                        </button>

                        {/* Scrollable Container */}
                        <div 
                          ref={(ref) => {
                            setCarouselRef(ref);
                            if (ref) {
                              ref.addEventListener('scroll', checkScrollButtons);
                              // Initial check
                              setTimeout(checkScrollButtons, 100);
                            }
                          }}
                          className="carousel-container flex gap-3 overflow-x-auto pb-2 px-10"
                        >
                          {ingredientSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion.ingredients)}
                              className="flex-shrink-0 group relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 hover:from-orange-100 hover:via-pink-100 hover:to-purple-100 border border-orange-200 hover:border-orange-300 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg min-w-[200px] text-left"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{suggestion.emoji}</span>
                                <div>
                                  <h4 className="font-semibold text-gray-800 text-sm group-hover:text-orange-700 transition-colors">
                                    {suggestion.title}
                                  </h4>
                                  <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full">
                                    {suggestion.category}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                {suggestion.ingredients}
                              </p>
                              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                      Upload a photo of your ingredients
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                      {imageFile ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <Camera className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{imageFile.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setImageFile(null)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Button type="button" variant="outline" className="mb-2 text-orange-600 hover:text-orange-700 border-orange-300 hover:border-orange-400 bg-white hover:bg-orange-50" asChild>
                                <span>
                                  <Camera className="w-4 h-4 mr-2" />
                                  Choose Photo
                                </span>
                              </Button>
                            </label>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            Drag and drop or click to upload a photo of your ingredients
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Cooking Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Cooking Preferences</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Maximum Cooking Time */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Maximum Cooking Time: {maxCookingTime} minutes
                  </Label>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="10"
                    value={maxCookingTime}
                    onChange={(e) => setMaxCookingTime(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10 min</span>
                    <span>3 hours</span>
                  </div>
                </div>

                {/* Cooking Experience */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Your Cooking Experience
                  </Label>
                  <Select value={cookingExperience} onValueChange={setCookingExperience}>
                    <SelectTrigger className="text-gray-800">
                      <SelectValue placeholder="Select your level" className="text-gray-600" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - Simple recipes</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                      <SelectItem value="advanced">Advanced - Complex techniques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Servings */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Number of Servings
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="text-orange-600 hover:text-orange-700 border-orange-300 hover:border-orange-400"
                    >
                      -
                    </Button>
                    <span className="flex items-center gap-1 min-w-[60px] justify-center">
                      <Users className="w-4 h-4 text-gray-700" />
                      <span className="text-gray-800 font-medium">{servings}</span>
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setServings(servings + 1)}
                      className="text-orange-600 hover:text-orange-700 border-orange-300 hover:border-orange-400"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Meal Type */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                    Meal Type
                  </Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className="text-gray-800">
                      <SelectValue placeholder="What meal is this for?" className="text-gray-600" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Health & Dietary */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-800">Health & Dietary Needs</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Health Conditions */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-3 block">
                    Health Conditions (Select all that apply)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {healthConditions.map((condition) => (
                      <Badge
                        key={condition}
                        variant={selectedHealthConditions.includes(condition) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedHealthConditions.includes(condition)
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'hover:bg-red-50'
                        }`}
                        onClick={() => handleTagToggle(condition, selectedHealthConditions, setSelectedHealthConditions)}
                      >
                        {condition}
                        {selectedHealthConditions.includes(condition) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-3 block">
                    Dietary Restrictions (Select all that apply)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryRestrictions.map((restriction) => (
                      <Badge
                        key={restriction}
                        variant={selectedDietaryRestrictions.includes(restriction) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedDietaryRestrictions.includes(restriction)
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'hover:bg-green-50'
                        }`}
                        onClick={() => handleTagToggle(restriction, selectedDietaryRestrictions, setSelectedDietaryRestrictions)}
                      >
                        {restriction}
                        {selectedDietaryRestrictions.includes(restriction) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Context & Equipment */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Context & Equipment</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Weather/Mood */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-2 block">
                    What's the mood/weather like?
                  </Label>
                  <Select value={weather} onValueChange={setWeather}>
                    <SelectTrigger className="text-gray-800">
                      <SelectValue placeholder="Select mood or weather" className="text-gray-600" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">Hot & Sunny - Light meals</SelectItem>
                      <SelectItem value="cold">Cold & Cozy - Warm comfort food</SelectItem>
                      <SelectItem value="rainy">Rainy - Comfort food</SelectItem>
                      <SelectItem value="energetic">Feeling Energetic - Something exciting</SelectItem>
                      <SelectItem value="tired">Feeling Tired - Easy & quick</SelectItem>
                      <SelectItem value="healthy">Health Focus - Nutritious meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Equipment */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 mb-3 block">
                    Available Cooking Equipment
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {cookingEquipment.map((equipment) => (
                      <Badge
                        key={equipment}
                        variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedEquipment.includes(equipment)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'hover:bg-blue-50'
                        }`}
                        onClick={() => handleTagToggle(equipment, selectedEquipment, setSelectedEquipment)}
                      >
                        <Utensils className="w-3 h-3 mr-1" />
                        {equipment}
                        {selectedEquipment.includes(equipment) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Sparkles className={`w-5 h-5 mr-2 transition-all duration-300 ${
                  isGenerating 
                    ? 'animate-spin' 
                    : 'group-hover:rotate-12 group-hover:scale-110'
                }`} />
                {isGenerating ? 'Generating Your Perfect Recipe...' : 'Generate My Perfect Recipe'}
                {!isGenerating && (
                  <ChefHat className="w-5 h-5 ml-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                )}
              </Button>
            </div>
          </form>
        </Card>

          {/* Error Display */}
          {error && (
            <Card className="max-w-4xl mx-auto mt-8 bg-red-50 border-red-200">
              <div className="p-6">
                <div className="flex items-center gap-2 text-red-700">
                  <X className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
              </div>
            </Card>
          )}
        </div>
      )}
      
      {/* Animated Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={toggleSidebar}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-md shadow-2xl h-full overflow-y-auto animate-slideInRight">
            {/* Sidebar Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="text-xl font-bold">My Saved Recipes</h2>
                </div>
                <Button
                  onClick={toggleSidebar}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50"
                />
              </div>
            </div>
            
            {/* Sidebar Content */}
            <div className="p-6">
              {isLoadingRecipes ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-gray-500">
                    <ChefHat className="w-6 h-6 animate-spin" />
                    <span>Loading recipes...</span>
                  </div>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <CookingPot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {searchTerm ? 'No recipes found' : 'No saved recipes yet'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try a different search term' : 'Create your first recipe to get started!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecipes.map((recipe, index) => (
                    <div 
                      key={recipe.id} 
                      className="recipe-card bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: `itemSlideIn 0.5s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1 mr-2 group-hover:text-purple-600 transition-colors">
                          <span className="text-purple-500 font-bold">#{recipe.recipeNumber}</span> {recipe.title}
                        </h3>
                        <div className="flex gap-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewRecipeFullScreen(recipe);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full"
                            title="View Recipe"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                        <span className="text-gray-300">•</span>
                        <span className="capitalize">{recipe.preferences?.mealType || 'Recipe'}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {(recipe.content?.split('\n').find((line: string) => line.length > 50)?.slice(0, 100) || 'No preview available') + '...'}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        {(Array.isArray(recipe.preferences?.dietaryRestrictions) 
                          ? recipe.preferences.dietaryRestrictions 
                          : recipe.preferences?.dietaryRestrictions?.split(', ') || []
                        ).slice(0, 2).map((restriction: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {restriction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Carousel arrow enhancements */
        .carousel-arrow {
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .carousel-arrow:hover {
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .carousel-arrow:disabled {
          opacity: 0.3;
          pointer-events: none;
        }

        /* Smooth scrolling for webkit browsers */
        .carousel-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Hide scrollbar but keep functionality */
        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        .carousel-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .recipe-card {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .recipe-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes itemSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #ec4899, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes viewTransition {
          from {
            opacity: 0;
            transform: scale(0.95);
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            transform: scale(1);
            backdrop-filter: blur(8px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-viewTransition {
          animation: viewTransition 0.4s ease-out forwards;
        }

        /* Enhanced hover effects */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        /* Backdrop blur effect */
        .recipe-backdrop {
          backdrop-filter: blur(12px);
          background: rgba(0, 0, 0, 0.1);
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-slideInUp {
            animation-duration: 0.6s;
          }
          
          .card-hover:hover {
            transform: translateY(-2px) scale(1.01);
          }
          
          .recipe-section {
            margin-bottom: 1rem;
          }
          
          .gradient-text-mobile {
            background-size: 200% 200%;
            animation: gradientShift 3s ease infinite;
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(30px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
          }
        }

        @keyframes itemSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes stepSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Enhanced card styles */
        .recipe-card {
          perspective: 1000px;
        }

        .recipe-title-card {
          background: linear-gradient(135deg, #fef7cd 0%, #fed7aa 50%, #fce7f3 100%);
          border: 2px solid transparent;
          background-clip: padding-box;
          position: relative;
        }

        .recipe-title-card::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #f59e0b, #ec4899);
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}