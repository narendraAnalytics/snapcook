import { auth } from '@clerk/nextjs/server';
import { getUserPlan } from '@/lib/get-user-plan';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const plan = await getUserPlan(userId);
    
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}