import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { plan } = await request.json();
    
    // Validate plan type
    if (!['free', 'pro', 'max'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }
    
    // Update user plan in database
    const result = await db
      .update(usersTable)
      .set({ 
        plan: plan,
        updatedAt: new Date()
      })
      .where(eq(usersTable.clerkId, userId))
      .returning({ id: usersTable.id, plan: usersTable.plan });
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      plan: result[0].plan,
      message: `Plan updated to ${plan}` 
    });
    
  } catch (error) {
    console.error('Error updating user plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}