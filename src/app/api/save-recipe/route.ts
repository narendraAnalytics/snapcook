import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Simple in-memory storage (in production, use a database)
const recipes = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, ingredients, preferences } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Create recipe object
    const recipe = {
      id: Date.now().toString(),
      title,
      content,
      ingredients,
      preferences,
      createdAt: new Date().toISOString(),
      userId
    };

    // Get user's recipes or initialize empty array
    const userRecipes = recipes.get(userId) || [];
    userRecipes.push(recipe);
    recipes.set(userId, userRecipes);

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

    const userRecipes = recipes.get(userId) || [];
    
    return NextResponse.json({ 
      success: true, 
      recipes: userRecipes.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });

  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const userRecipes = recipes.get(userId) || [];
    const filteredRecipes = userRecipes.filter(recipe => recipe.id !== recipeId);
    recipes.set(userId, filteredRecipes);

    return NextResponse.json({ 
      success: true, 
      message: 'Recipe deleted successfully!' 
    });

  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe. Please try again.' },
      { status: 500 }
    );
  }
}