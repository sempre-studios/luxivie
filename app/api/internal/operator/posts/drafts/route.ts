import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { createBlogPostForOperator } from '@/lib/operator-blogs'

export async function POST(request: NextRequest) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.create_draft')
    const body = await request.json()
    const post = await createBlogPostForOperator(body, body.idempotency_key || '')
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Missing') || message.includes('Invalid') || message.includes('expired')
      ? 401
      : 400
    return NextResponse.json({ error: message }, { status })
  }
}
