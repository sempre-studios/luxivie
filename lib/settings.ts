import { supabaseAdmin } from './supabase'
import { SOCIAL_NETWORKS, type SocialNetwork } from './social'

export { SOCIAL_NETWORKS, type SocialNetwork }

export interface BusinessSettings {
  socialLinks: Partial<Record<SocialNetwork, string>>
}

export interface StorageSummary {
  totalBytes: number
  imageCount: number
}

const BUSINESS_ID = process.env.SUPABASE_BUSINESS_ID || '7fca71ec-1a2f-406b-906f-5154356620af'

export async function getBusinessSettings(): Promise<BusinessSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from('business_settings')
      .select('social_links')
      .eq('business_id', BUSINESS_ID)
      .single()

    if (error || !data) {
      return { socialLinks: {} }
    }

    return { socialLinks: data.social_links || {} }
  } catch {
    return { socialLinks: {} }
  }
}

export async function updateBusinessSettings(settings: BusinessSettings): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('business_settings')
      .upsert({
        business_id: BUSINESS_ID,
        social_links: settings.socialLinks,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'business_id',
      })

    if (error) {
      console.error('[settings] Update error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[settings] Error:', error)
    return false
  }
}

export async function getStorageSummary(): Promise<StorageSummary> {
  try {
    let totalBytes = 0
    let imageCount = 0

    const { data, error } = await supabaseAdmin.storage
      .from('blog-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error || !data) {
      return { totalBytes: 0, imageCount: 0 }
    }

    for (const item of data) {
      if (item.id !== null) {
        imageCount++
        totalBytes += item.metadata?.size || 0
      }
    }

    return { totalBytes, imageCount }
  } catch {
    return { totalBytes: 0, imageCount: 0 }
  }
}
