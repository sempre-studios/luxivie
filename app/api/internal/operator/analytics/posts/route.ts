import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { getPostAnalyticsForOperator } from '@/lib/operator-blogs'

export async function GET(request: NextRequest) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.analytics')
    const analytics = await getPostAnalyticsForOperator()
    return NextResponse.json({ analytics })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
