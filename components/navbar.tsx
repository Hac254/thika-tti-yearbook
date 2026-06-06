'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const client = createClient()
        const { data: { session } } = await client.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        console.log('[v0] Supabase not configured - navbar will show login/signup')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const client = createClient()
      await client.auth.signOut()
    } catch (err) {
      console.log('[v0] Error signing out')
    } finally {
      setUser(null)
      window.location.href = '/'
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-serif font-bold text-primary">
            Yearbook
          </Link>
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
                      My Profile
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium hover:text-primary transition">
                      Login
                    </Link>
                    <Button asChild size="sm">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
