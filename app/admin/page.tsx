'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Navbar = lazy(() => import('@/components/navbar').then(mod => ({ default: mod.Navbar })))
const ProtectedRoute = lazy(() => import('@/components/protected-route').then(mod => ({ default: mod.ProtectedRoute })))

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>
    </Suspense>
  )
}

function AdminContent() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.email !== ADMIN_EMAIL) {
          router.push('/')
          return
        }

        setUser(user)

        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: true })

        setProfiles(profiles || [])
        setLoading(false)
      } catch (err: any) {
        console.error('[v0] Admin load error:', err)
        if (err.message.includes('Missing Supabase')) {
          setError(err.message)
        } else {
          setError('Failed to load profiles. Please ensure Supabase is configured correctly.')
        }
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const togglePublished = async (profileId: string, currentPublished: boolean) => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ published: !currentPublished })
        .eq('id', profileId)

      if (error) throw error

      setProfiles(profiles.map(p => 
        p.id === profileId ? { ...p, published: !currentPublished } : p
      ))
      setMessage('Profile updated!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err: any) {
      console.error('[v0] Admin toggle error:', err)
      setMessage('Error updating profile: ' + (err.message || 'Unknown error'))
      setTimeout(() => setMessage(''), 2000)
    }
  }

  const deleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId)

      if (deleteError) throw deleteError

      setProfiles(profiles.filter(p => p.id !== profileId))
      setMessage('Profile deleted!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err: any) {
      console.error('[v0] Admin delete error:', err)
      setMessage('Error deleting profile: ' + (err.message || 'Unknown error'))
      setTimeout(() => setMessage(''), 2000)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <h2 className="font-bold mb-2">Error Loading Admin Dashboard</h2>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-6">Manage yearbook profiles</p>

          {message && (
            <div className={`mb-6 p-4 rounded-md text-sm ${
              message.includes('deleted') || message.includes('deleted')
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {profiles.length === 0 ? (
            <p className="text-gray-600 text-center py-12">No profiles yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quote</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Published</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{profile.name}</td>
                      <td className="py-3 px-4 text-gray-600">{profile.user_email}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{profile.quote}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          profile.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => togglePublished(profile.id, profile.published)}
                          className="text-sm text-primary hover:underline font-medium"
                        >
                          {profile.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.id)}
                          className="text-sm text-red-600 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
