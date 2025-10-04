import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const inputMethod = formData.get('inputMethod') as string;
    const ingredients = formData.get('ingredients') as string;
    const imageFile = formData.get('imageFile') as File | null;
    const maxCookingTime = formData.get('maxCookingTime') as string;
    const cookingExperience = formData.get('cookingExperience') as string;
    const healthConditions = formData.get('healthConditions') as string;
    const dietaryRestrictions = formData.get('dietaryRestrictions') as string;
    const weather = formData.get('weather') as string;
    const mealType = formData.get('mealType') as string;
    const servings = formData.get('servings') as string;
    const equipment = formData.get('equipment') as string;

    // Configure Gemini with Google Search
    const tools = [
      {
        googleSearch: {}
      }
    ];
    
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };

    let contents: any[] = [];

    // Handle image input
    if (inputMethod === 'image' && imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      
      contents = [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: imageFile.type,
                data: base64Image,
              },
            },
            {
              text: `CHEF PERSONA: You are Chef Marco Alessandro, a master chef with 16+ years of professional culinary experience. You've worked in Michelin-starred restaurants across France, Italy, and Japan. You're a Le Cordon Bleu graduate with specialized training in nutritional science and therapeutic cooking. You're known for creating health-conscious recipes that don't compromise on flavor.

TASK: Analyze this image to identify the ingredients, then create a personalized, health-optimized recipe with professional expertise.

USER REQUIREMENTS:
- Maximum cooking time: ${maxCookingTime} minutes
- Cooking experience level: ${cookingExperience}
- Number of servings: ${servings}
- Meal type: ${mealType}
- Current weather/mood: ${weather}
- Health conditions: ${healthConditions || 'None specified'}
- Dietary restrictions: ${dietaryRestrictions || 'None specified'}
- Available equipment: ${equipment || 'Standard kitchen equipment'}

REQUIRED RECIPE FORMAT:

**RECIPE TITLE** (Creative, appetizing name)

**CHEF'S DESCRIPTION** (2-3 sentences about the dish's inspiration and health benefits)

**NUTRITIONAL INFORMATION**
- Total calories per serving
- Protein: X grams
- Carbohydrates: X grams  
- Healthy fats: X grams
- Key vitamins and minerals
- Health benefits for specified conditions

**INGREDIENTS** (Exact measurements with professional tips)
[List each ingredient with quantities and quality selection tips]

**CHEF'S PREPARATION METHOD**
[Step-by-step instructions with professional techniques, temperatures, and timing]

**MASTER CHEF TECHNIQUES & TIPS**
[Advanced culinary techniques, temperature control, knife skills, and pro secrets]

**HEALTH ADVISORY** 
[Specific benefits for the user's health conditions, why certain ingredients help, nutritional science]

**INGREDIENT SUBSTITUTIONS**
[Alternatives for dietary restrictions, allergies, or ingredient availability]

**WINE & BEVERAGE PAIRING**
[Professional pairing suggestions]

**RECIPE DIFFICULTY & SKILL REQUIREMENTS**
[Rate difficulty level: Beginner/Intermediate/Advanced, required cooking skills, time investment, confidence-building tips for the user's experience level: ${cookingExperience}]

**STORAGE & MEAL PREP**
[How to store leftovers, make ahead tips, scaling for meal prep]

Use Google Search to find the latest nutritional research and cooking techniques. Apply your 16 years of professional experience to create a restaurant-quality, health-optimized recipe that addresses the user's specific needs with scientific precision and culinary artistry.`
            }
          ]
        }
      ];
    } else {
      // Handle text input
      contents = [
        {
          role: 'user',
          parts: [
            {
              text: `CHEF PERSONA: You are Chef Marco Alessandro, a renowned master chef with 16+ years of professional culinary experience. Your expertise spans Michelin-starred kitchens in France, Italy, and Japan. You're a Le Cordon Bleu graduate with advanced certifications in nutritional science, therapeutic cooking, and dietary management for medical conditions. You've authored cookbooks on healthy gourmet cuisine and consult for leading hospitals on therapeutic nutrition.

TASK: Create a masterful, health-optimized recipe using these ingredients: ${ingredients}

USER REQUIREMENTS:
- Maximum cooking time: ${maxCookingTime} minutes
- Cooking experience level: ${cookingExperience}
- Number of servings: ${servings}
- Meal type: ${mealType}
- Current weather/mood: ${weather}
- Health conditions: ${healthConditions || 'None specified'}
- Dietary restrictions: ${dietaryRestrictions || 'None specified'}
- Available equipment: ${equipment || 'Standard kitchen equipment'}

REQUIRED PROFESSIONAL RECIPE FORMAT:

**RECIPE TITLE** (Creative, restaurant-quality name that reflects the dish's character)

**CHEF'S INSPIRATION** (Your professional insight into the dish's creation and health philosophy)

**COMPLETE NUTRITIONAL ANALYSIS**
- Calories per serving (precise calculation)
- Macronutrients: Protein X grams, Carbohydrates X grams, Healthy fats X grams
- Key micronutrients: Vitamins, minerals, antioxidants
- Glycemic index consideration
- Anti-inflammatory compounds
- Specific health benefits for user's conditions

**PREMIUM INGREDIENTS** (Professional sourcing and preparation)
[Each ingredient with exact measurements, quality selection criteria, and preparation notes]

**MASTER CHEF'S METHOD** 
[Professional step-by-step technique with precise temperatures, timing, and culinary science]

**ADVANCED CULINARY TECHNIQUES**
[Professional secrets: knife cuts, heat control, seasoning layers, plating techniques]

**THERAPEUTIC HEALTH BENEFITS**
[Scientific explanation of how this recipe specifically helps the user's health conditions, ingredient synergies, nutritional science]

**CHEF'S SUBSTITUTION GUIDE**
[Professional alternatives for dietary needs, seasonal variations, allergy accommodations]

**SOMMELIER'S PAIRING RECOMMENDATIONS**
[Wine, tea, or beverage pairings with tasting notes]

**PROFESSIONAL STORAGE & SCALING**
[Restaurant-quality storage techniques, make-ahead tips, portion scaling for 2-12 servings]

**RECIPE DIFFICULTY & SKILL REQUIREMENTS**
[Rate difficulty level: Beginner/Intermediate/Advanced, required cooking skills, time investment, confidence-building tips for the user's experience level: ${cookingExperience}]

**CHEF'S FINAL NOTES**
[Personal tips from your 16 years of experience, what makes this dish special]

Use Google Search to incorporate the latest nutritional research, seasonal ingredient availability, and cutting-edge healthy cooking techniques. Channel your expertise from working in world-class kitchens to create a recipe that's both restaurant-quality and therapeutically beneficial.`
            }
          ]
        }
      ];
    }

    // Generate recipe with streaming response
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      config,
      contents,
    });

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Recipe generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    );
  }
}