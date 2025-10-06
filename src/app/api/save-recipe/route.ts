import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { recipesTable, usersTable } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, ingredients, preferences, difficulty, cookingTime, servings } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // First, get the user's database ID from usersTable
    const user = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;

    // Count user's existing recipes to calculate next recipe number
    const result = await db
      .select({ count: count() })
      .from(recipesTable)
      .where(eq(recipesTable.clerkId, clerkId));
    
    const userRecipeCount = result[0]?.count || 0;
    const nextRecipeNumber = userRecipeCount + 1;

    // Insert recipe into database with correct fields
    const [recipe] = await db.insert(recipesTable).values({
      userId: userId,
      clerkId: clerkId,
      title,
      content,
      ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients),
      preferences: typeof preferences === 'string' ? preferences : JSON.stringify(preferences),
      difficulty,
      cookingTime,
      servings,
      recipeNumber: nextRecipeNumber
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
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's recipes from database
    const userRecipes = await db.select().from(recipesTable)
      .where(eq(recipesTable.clerkId, clerkId))
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

