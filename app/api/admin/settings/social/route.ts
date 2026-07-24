import { NextRequest, NextResponse } from 'next/server'
import { isApiAuthenticated } from '@/lib/admin-auth'
import { getBusinessSettings, updateBusinessSettings } from '@/lib/settings'
import { SOCIAL_NETWORKS, type SocialNetwork } from '@/lib/social'

export async function GET(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await getBusinessSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('[admin/settings/social] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function isValidSocialUrl(value: string): boolean {
  if (!value.trim()) return true
  return /^https:\/\//i.test(value) && !/^(javascript|data|vbscript):/i.test(value)
}

async function handleUpdate(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const socialLinks: Partial<Record<SocialNetwork, string>> = {}

    for (const { key } of SOCIAL_NETWORKS) {
      const val = body.socialLinks?.[key]
      if (typeof val === 'string' && val.trim()) {
        const trimmed = val.trim()
        if (!isValidSocialUrl(trimmed)) {
          return NextResponse.json({ error: `Invalid URL for ${key}` }, { status: 400 })
        }
        socialLinks[key] = trimmed
      }
    }

    const ok = await updateBusinessSettings({ socialLinks })

    if (!ok) {
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[admin/settings/social] update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  return handleUpdate(request)
}

export async function PATCH(request: NextRequest) {
  return handleUpdate(request)
}
