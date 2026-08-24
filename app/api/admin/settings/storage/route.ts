import { NextRequest, NextResponse } from 'next/server'
import { isApiAuthenticated } from '@/lib/admin-auth'
import { getStorageSummary } from '@/lib/settings'

export async function GET(request: NextRequest) {
  if (!isApiAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const summary = await getStorageSummary()
    return NextResponse.json(summary)
  } catch (error) {
    console.error('[admin/settings/storage] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
