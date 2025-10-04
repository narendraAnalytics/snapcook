import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { recipesTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, ingredients, preferences, difficulty, cookingTime, servings } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Insert recipe into database
    const [recipe] = await db.insert(recipesTable).values({
      clerkId: userId,
      title,
      content,
      ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients),
      preferences: typeof preferences === 'string' ? preferences : JSON.stringify(preferences),
      difficulty,
      cookingTime,
      servings,
      plan: 'free' // Default plan
    }).returning();

    return NextResponse.json({ 
      success: true, 
      recipe,
      message: 'Recipe saved successfully!' 
    });

  } catch (error) {
    console.error('Save recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's recipes from database
    const userRecipes = await db.select().from(recipesTable)
      .where(eq(recipesTable.clerkId, userId))
      .orderBy(desc(recipesTable.createdAt));
    
    return NextResponse.json({ 
      success: true, 
      recipes: userRecipes
    });

  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes. Please try again.' },
      { status: 500 }
    );
  }
}

