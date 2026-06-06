import { createClient } from './client'

export interface UploadOptions {
  maxSizeBytes?: number
  allowedFormats?: string[]
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const DEFAULT_FORMATS = ['image/jpeg', 'image/png']

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: UploadOptions = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE
  const allowedFormats = options.allowedFormats || DEFAULT_FORMATS

  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024)
    return { valid: false, error: `File size must be less than ${sizeMB}MB` }
  }

  if (!allowedFormats.includes(file.type)) {
    return { valid: false, error: 'Only JPG and PNG files are allowed' }
  }

  return { valid: true }
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  userId: string,
  file: File,
  options: UploadOptions = {}
): Promise<{ url: string; path: string } | null> {
  try {
    // Validate file
    const validation = validateFile(file, options)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const supabase = createClient()
    
    // Create unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `profile-${timestamp}.${extension}`
    const path = `${userId}/${filename}`

    // Upload to storage
    const { data, error } = await supabase.storage
      .from('yearbook-photos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(error.message)
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('yearbook-photos').getPublicUrl(path)

    console.log('[v0] File uploaded successfully:', publicUrl)

    return { url: publicUrl, path }
  } catch (error: any) {
    console.error('[v0] File upload error:', error.message)
    throw error
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage
      .from('yearbook-photos')
      .remove([filePath])

    if (error) {
      throw new Error(error.message)
    }

    console.log('[v0] File deleted successfully:', filePath)
    return true
  } catch (error: any) {
    console.error('[v0] File delete error:', error.message)
    throw error
  }
}

/**
 * Get public URL for a file path
 */
export function getPublicUrl(filePath: string): string {
  const supabase = createClient()
  const {
    data: { publicUrl },
  } = supabase.storage.from('yearbook-photos').getPublicUrl(filePath)
  return publicUrl
}

/**
 * Extract path from public URL
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/object/public/yearbook-photos/')
    if (parts.length > 1) {
      return parts[1]
    }
    return null
  } catch {
    return null
  }
}
