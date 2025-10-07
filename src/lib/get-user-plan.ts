import { auth } from '@clerk/nextjs/server';

export async function getUserPlan(): Promise<string> {
  try {
    const { has } = await auth();
    
    // Check Clerk billing plans in order of priority
    if (has({ plan: 'max' })) {
      return 'max';
    } else if (has({ plan: 'pro' })) {
      return 'pro';
    } else {
      return 'free';
    }
  } catch (error) {
    console.error('Error fetching user plan from Clerk:', error);
    return 'free'; // Default fallback
  }
}