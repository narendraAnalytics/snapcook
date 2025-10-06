import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserPlan(clerkId: string): Promise<string> {
  try {
    const result = await db
      .select({ plan: usersTable.plan })
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .limit(1);
    
    return result[0]?.plan || 'free';
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return 'free'; // Default fallback
  }
}