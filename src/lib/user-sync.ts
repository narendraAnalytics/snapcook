'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function syncUserToDatabase() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    // Check if user already exists in database
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, userId))
      .limit(1)

    if (existingUser.length > 0) {
      // User exists, update their information but preserve plan
      const updatedUser = await db
        .update(usersTable)
        .set({
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress || '',
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          profileImage: clerkUser.imageUrl || null,
          updatedAt: new Date(),
          // Keep existing plan - don't overwrite it
          plan: existingUser[0].plan,
        })
        .where(eq(usersTable.clerkId, userId))
        .returning()

      console.log('User updated in database:', updatedUser[0])
      return updatedUser[0]
    } else {
      // User doesn't exist, create new user
      const newUser = await db
        .insert(usersTable)
        .values({
          clerkId: userId,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress || '',
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          profileImage: clerkUser.imageUrl || null,
          bio: null,
          plan: 'free',
        })
        .returning()

      console.log('New user created in database:', newUser[0])
      return newUser[0]
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
    return null
  }
}