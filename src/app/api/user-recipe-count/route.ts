import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { recipesTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { getUserPlan } from '@/lib/get-user-plan';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current plan
    const userPlan = await getUserPlan();
    
    // Count total recipes for this user
    const result = await db
      .select({ count: count() })
      .from(recipesTable)
      .where(eq(recipesTable.clerkId, userId));
    
    const recipeCount = result[0]?.count || 0;
    
    // Define limits based on plan
    const planLimits = {
      free: 2,
      pro: 8, // Pro plan limit
      max: -1  // Unlimited for max users
    };
    
    const limit = planLimits[userPlan as keyof typeof planLimits] || planLimits.free;
    const hasReachedLimit = limit !== -1 && recipeCount >= limit;
    
    return NextResponse.json({
      recipeCount,
      limit,
      hasReachedLimit,
      plan: userPlan,
      remaining: limit === -1 ? -1 : Math.max(0, limit - recipeCount)
    });
    
  } catch (error) {
    console.error('Error fetching user recipe count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}