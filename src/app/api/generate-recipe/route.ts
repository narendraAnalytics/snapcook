import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserPlan } from '@/lib/get-user-plan';
import { db } from '@/db';
import { recipesTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user's plan and recipe limit
    const userPlan = await getUserPlan();
    
    // Count user's existing recipes
    const result = await db
      .select({ count: count() })
      .from(recipesTable)
      .where(eq(recipesTable.clerkId, userId));
    
    const recipeCount = result[0]?.count || 0;
    
    // Define limits based on plan
    const planLimits = {
      free: 2,
      pro: 8,
      max: -1 // Unlimited
    };
    
    const limit = planLimits[userPlan as keyof typeof planLimits] || planLimits.free;
    
    // Check if user has reached their limit
    if (limit !== -1 && recipeCount >= limit) {
      return NextResponse.json({
        error: 'Recipe limit reached',
        message: `You've reached your ${userPlan} plan limit of ${limit} recipes. Please upgrade your plan to create more recipes.`,
        recipeCount,
        limit,
        plan: userPlan
      }, { status: 403 });
    }

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
              text: `CHEF PERSONA: You are Chef Marco Alessandro, a renowned master chef with 16+ years of professional culinary experience. Your expertise spans Michelin-starred kitchens in France, Italy, and Japan. You're a Le Cordon Bleu graduate with advanced certifications in nutritional science, therapeutic cooking, and dietary management for medical conditions. You've authored cookbooks on healthy gourmet cuisine and consult for leading hospitals on therapeutic nutrition.

TASK: Analyze this image to identify the ingredients, then create a masterful, health-optimized recipe with professional expertise.

USER REQUIREMENTS:
- Maximum cooking time: ${maxCookingTime} minutes
- Cooking experience level: ${cookingExperience}
- Number of servings: ${servings}
- Meal type: ${mealType}
- Current weather/mood: ${weather}
- Health conditions: ${healthConditions || 'None specified'}
- Dietary restrictions: ${dietaryRestrictions || 'None specified'}
- Available equipment: ${equipment || 'Standard kitchen equipment'}

IMPORTANT: Start your response directly with the recipe title. Do not include greetings or introductions.

REQUIRED PROFESSIONAL RECIPE FORMAT:

**RECIPE TITLE** (Create an appetizing, creative name based on the ingredients - examples: "Creamy Garlic Parmesan Pasta", "Mediterranean Herb-Crusted Salmon", "Spicy Thai Basil Chicken Stir-Fry")

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

IMPORTANT: Start your response directly with the recipe title. Do not include greetings or introductions.

REQUIRED PROFESSIONAL RECIPE FORMAT:

**RECIPE TITLE** (Create an appetizing, creative name based on the ingredients - examples: "Creamy Garlic Parmesan Pasta", "Mediterranean Herb-Crusted Salmon", "Spicy Thai Basil Chicken Stir-Fry")

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