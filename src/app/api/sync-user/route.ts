import { syncUserToDatabase } from '@/lib/user-sync'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const result = await syncUserToDatabase()
    
    if (result) {
      return NextResponse.json({ success: true, user: result })
    } else {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error in sync-user API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}