import { getUserPlan } from '@/lib/get-user-plan';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const plan = await getUserPlan();
    
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}