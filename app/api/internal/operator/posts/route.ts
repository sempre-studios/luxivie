import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { listBlogsForOperator } from '@/lib/operator-blogs'

export async function GET(request: NextRequest) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.list')
    const posts = await listBlogsForOperator()
    return NextResponse.json({ posts })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
