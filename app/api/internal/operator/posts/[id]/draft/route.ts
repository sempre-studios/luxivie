import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { editBlogPostForOperator } from '@/lib/operator-blogs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.edit_draft')
    const { id } = await params
    const body = await request.json()

    const result = await editBlogPostForOperator(
      id,
      body,
      body.expected_version || '',
      body.idempotency_key || '',
    )

    if ('conflict' in result) {
      return NextResponse.json({ post: result.post, error: 'Conflict: the post was modified' }, { status: 409 })
    }

    return NextResponse.json({ post: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('Missing') || message.includes('Invalid') || message.includes('expired')
      ? 401
      : 400
    return NextResponse.json({ error: message }, { status })
  }
}
