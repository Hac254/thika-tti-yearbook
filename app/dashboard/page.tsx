'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Navbar = lazy(() => import('@/components/navbar').then(mod => ({ default: mod.Navbar })))
const ProtectedRoute = lazy(() => import('@/components/protected-route').then(mod => ({ default: mod.ProtectedRoute })))

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </Suspense>
  )
}

function DashboardContent() {
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [quote, setQuote] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        setUser(user)

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          setProfile(profile)
          setName(profile.name)
          setQuote(profile.quote)
          setPhotoUrl(profile.photo_url || '')
          setPhotoPreview(profile.photo_url || '')
          setPublished(profile.published)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('[v0] Dashboard load error:', err)
        if (err.message.includes('Missing Supabase')) {
          setError(err.message)
        } else {
          setError('Failed to load profile. Please ensure Supabase is configured correctly.')
        }
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      setMessage(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!file) {
      return { valid: false, error: 'No file selected' }
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' }
    }

    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPG and PNG files are allowed' }
    }

    return { valid: true }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      handleFileSelect({ target: { files } } as any)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      let finalPhotoUrl = photoUrl

      // Upload file if selected
      if (selectedFile && user) {
        setUploading(true)
        const { uploadFile } = await import('@/lib/supabase/storage')
        const uploadResult = await uploadFile(user.id, selectedFile)
        finalPhotoUrl = uploadResult.url
        setPhotoUrl(finalPhotoUrl)
        setUploading(false)
      }

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name,
            quote,
            photo_url: finalPhotoUrl,
            published,
            updated_at: new Date(),
          })
          .eq('id', profile.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              name,
              quote,
              photo_url: finalPhotoUrl,
              published,
            },
          ])

        if (error) throw error
      }

      setSelectedFile(null)
      setMessage('Profile saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('[v0] Dashboard save error:', err)
      setMessage('Error saving profile: ' + (err.message || 'Unknown error'))
      setUploading(false)
    } finally {
      setSaving(false)
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
              <h2 className="font-bold mb-2">Error Loading Profile</h2>
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

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-6">
            My Profile
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-md text-sm ${
              message.includes('saved') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Your yearbook quote..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              {photoPreview && (
                <div className="mb-4 relative">
                  <img
                    src={photoPreview}
                    alt="Photo preview"
                    className="w-full max-w-xs h-64 object-cover rounded-lg border-2 border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      setPhotoPreview('')
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative px-4 py-8 border-2 border-dashed rounded-lg transition ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 5MB</p>
                  </div>
                </label>
              </div>
              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publish my profile to the yearbook
              </label>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
