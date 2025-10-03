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
              text: `Analyze this image to identify the ingredients, then create a personalized recipe with the following requirements:

COOKING CONTEXT:
- Maximum cooking time: ${maxCookingTime} minutes
- Cooking experience: ${cookingExperience}
- Number of servings: ${servings}
- Meal type: ${mealType}
- Weather/mood: ${weather}

HEALTH & DIETARY:
- Health conditions: ${healthConditions || 'None specified'}
- Dietary restrictions: ${dietaryRestrictions || 'None specified'}

AVAILABLE EQUIPMENT:
- ${equipment || 'Standard kitchen equipment'}

Please provide:
1. A creative recipe title
2. Brief description
3. Complete ingredient list with exact quantities
4. Step-by-step cooking instructions
5. Cooking tips and techniques
6. Nutritional highlights
7. Serving suggestions

Use Google Search to find the latest cooking techniques and ensure the recipe is optimized for the specified health conditions and dietary restrictions. Make it engaging and personalized!`
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
              text: `Create a personalized recipe using these ingredients: ${ingredients}

COOKING CONTEXT:
- Maximum cooking time: ${maxCookingTime} minutes
- Cooking experience: ${cookingExperience}
- Number of servings: ${servings}
- Meal type: ${mealType}
- Weather/mood: ${weather}

HEALTH & DIETARY:
- Health conditions: ${healthConditions || 'None specified'}
- Dietary restrictions: ${dietaryRestrictions || 'None specified'}

AVAILABLE EQUIPMENT:
- ${equipment || 'Standard kitchen equipment'}

Please provide:
1. A creative recipe title
2. Brief description (2-3 sentences)
3. Complete ingredient list with exact quantities
4. Step-by-step cooking instructions (numbered)
5. Cooking tips and techniques
6. Estimated prep and cook time
7. Nutritional highlights
8. Serving suggestions

Use Google Search to find the latest cooking techniques, seasonal variations, and ensure the recipe is optimized for the specified health conditions and dietary restrictions. Make it engaging, practical, and personalized for the user's experience level!`
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