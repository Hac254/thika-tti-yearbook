import { Navbar } from '@/components/navbar'
import { ProfileCard } from '@/components/profile-card'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  
  let profiles: any[] = []
  if (supabase) {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, quote, photo_url')
      .eq('published', true)
      .order('created_at', { ascending: true })
    profiles = data || []
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4">
            Class Yearbook
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrate our class with memories, quotes, and moments we&apos;ll cherish forever.
          </p>
        </div>

        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                name={profile.name}
                quote={profile.quote}
                imageUrl={profile.photo_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {!supabase ? 'Please set up Supabase to view profiles.' : 'No profiles published yet.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
