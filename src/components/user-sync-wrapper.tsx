'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function UserSyncWrapper() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        try {
          // Call our server action to sync user
          const response = await fetch('/api/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            console.log('User synced successfully')
          }
        } catch (error) {
          console.error('Error syncing user:', error)
        }
      }
    }

    syncUser()
  }, [user, isLoaded])

  return null // This component doesn't render anything
}