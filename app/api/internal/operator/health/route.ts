import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'

export async function GET(request: NextRequest) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.health.read')
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
