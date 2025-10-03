"use client";

import { useState } from "react";
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
  ArrowLeft
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
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedText += chunk;
        setGeneratedRecipe(accumulatedText);
      }

    } catch (error) {
      console.error('Recipe generation error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Home Button */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-3 bg-white/90 backdrop-blur-md hover:bg-white border-gray-200 hover:border-orange-400 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl text-gray-700 hover:text-orange-600 font-medium hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <Home className="w-5 h-5" />
            </div>
            <span className="text-base">Back to Home</span>
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

        {/* Recipe Display */}
        {(generatedRecipe || isGenerating) && (
          <Card className="max-w-4xl mx-auto mt-8 bg-white/90 backdrop-blur-md border-0 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <ChefHat className={`w-6 h-6 text-orange-600 ${isGenerating ? 'animate-pulse' : ''}`} />
                <h2 className="text-2xl font-bold text-gray-800">
                  {isGenerating ? 'Cooking up something amazing...' : 'Your Perfect Recipe'}
                </h2>
              </div>
              
              {isGenerating && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600 text-sm">AI is analyzing your preferences and searching for the best techniques...</span>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-6 border border-orange-100">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {generatedRecipe || 'Your recipe will appear here...'}
                  </pre>
                </div>
              </div>

              {generatedRecipe && !isGenerating && (
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={() => navigator.clipboard.writeText(generatedRecipe)}
                    variant="outline"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    Copy Recipe
                  </Button>
                  <Button 
                    onClick={() => {
                      setGeneratedRecipe('');
                      setError('');
                    }}
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Generate Another
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}