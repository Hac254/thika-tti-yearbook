import Image from 'next/image'

interface ProfileCardProps {
  name: string
  quote: string
  imageUrl?: string
  className?: string
}

export function ProfileCard({ name, quote, imageUrl, className = '' }: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            unoptimized={imageUrl?.includes('supabase') ? true : false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            <svg className="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.7 15.01C13.9 15.01 15.08 15.1 16.23 15.28c.841.12 1.672.288 2.491.477V20.993z" />
              <path d="M12 13a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-serif font-bold text-primary mb-2">{name}</h3>
        <p className="text-sm text-gray-600 italic">"{quote}"</p>
      </div>
    </div>
  )
}
